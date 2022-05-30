using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Newtonsoft.Json;
using OutSystems.HubEdition.RuntimePlatform;
using OutSystems.HubEdition.RuntimePlatform.Db;

namespace OutSystems.NssDataGridUtils {
    public class temp_ardoJSON {
        private static DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        private static Dictionary<Type, Dictionary<string, FieldHolder>> recCache = new Dictionary<Type, Dictionary<string, FieldHolder>>();

        private abstract class FieldHolder {
            abstract public void set(object rec, object value);
            abstract public object get(object rec);
            abstract public string name();
            abstract public Type type();
        }

        private static long toJavaScriptTicks(DateTime d) {
            return (long)d.Subtract(epoch).TotalMilliseconds;
        }
        private class FieldField : FieldHolder {
            public FieldInfo f;
            public FieldField(FieldInfo _f) {
                f = _f;
            }

            public override void set(object rec, object value) {
                if (value != null)
                    f.SetValue(rec, value);
            }

            public override object get(object rec) {
                return f.GetValue(rec);
            }

            public override string name() {
                return f.Name;
            }

            public override Type type() {
                return f.FieldType;
            }
        }

        private class PropField : FieldHolder {
            PropertyInfo p;
            public PropField(PropertyInfo _p) {
                p = _p;
            }

            override public void set(object rec, object value) {
                if (value != null)
                    p.SetValue(rec, value, null);
            }

            public override object get(object rec) {
                return p.GetValue(rec, null);
            }

            public override string name() {
                return p.Name;
            }

            override public Type type() {
                return p.PropertyType;
            }
        }

        private static Dictionary<string, FieldHolder> getFields(Type leClass) {
            if (recCache.ContainsKey(leClass))
                return recCache[leClass];

            Dictionary<string, FieldHolder> fields = new Dictionary<string, FieldHolder>();
            foreach (var field in leClass.GetFields().Where(f => f.Name.StartsWith("ss"))) {
                fields.Add(field.Name.Substring(2).ToLower(), new FieldField(field));
            }

            foreach (var prop in leClass.GetProperties().Where(p => p.Name.StartsWith("ss"))) {
                fields.Add(prop.Name.Substring(2).ToLower(), new PropField(prop));
            }

            recCache[leClass] = fields;

            return fields;
        }

        private static void writeRecord(JsonWriter json, object rec, int dateFormat) {
            Type leClass = rec.GetType();
            Boolean clearStart = false;

            //rug: removed this code from ardoJSON extention to make it possible to have complex lists
            /*
                // in .NET this might not be needed to do blindly
                if (!typeof(ISimpleRecord).IsAssignableFrom(leClass)) {
                    rec = leClass.GetFields().First(f => f.Name.StartsWith("ss")).GetValue(rec);
                    leClass = rec.GetType();
                }
            */

            json.WriteStartObject();

            // special case for TenantId property which does _not_ have ss before
            try {
                PropertyInfo tenantProp = leClass.GetProperty("Tenant_Id");
                if (tenantProp != null) {
                    json.WritePropertyName("Tenant_Id");
                    writeValue(json, tenantProp.PropertyType, tenantProp.GetValue(rec, null), dateFormat);
                }
            } catch { }

            foreach (var field in leClass.GetFields().Where(f => f.Name.StartsWith("ss"))) {
                clearStart = field.Name.StartsWith("ssEN") || field.Name.StartsWith("ssST");
                //RGRIDT-364 - removing columns of the type BinaryData.
                if (typeof(Byte[]).IsAssignableFrom(field.FieldType) == false) {
                    json.WritePropertyName(field.Name.Substring(clearStart ? 4 : 2));
                    writeValue(json, field.FieldType, field.GetValue(rec), dateFormat);
                }
            }

            foreach (var property in leClass.GetProperties().Where(p => p.Name.StartsWith("ss"))) {
                //RGRIDT-364 - removing columns of the type BinaryData.
                if (typeof(Byte[]).IsAssignableFrom(property.PropertyType) == false) {
                    json.WritePropertyName(property.Name.Substring(2));
                    writeValue(json, property.PropertyType, property.GetValue(rec, null), dateFormat);
                }
            }

            json.WriteEndObject();
        }

        private static void writeValue(JsonWriter json, Type type, object val, int dateFormat)
        {
            if (type == typeof(DateTime))
            {
                // could use JsonWriter's properties for this, but am not sure if I really want that.
                if (dateFormat == 1)
                {
                    json.WriteValue(((DateTime)val));
                }
                else if (dateFormat == 2)
                {
                    json.WriteValue("/Date(" + toJavaScriptTicks((DateTime)val) + ")/");
                }
                else if (dateFormat == 0) // unix ticks
                {
                    json.WriteValue(toJavaScriptTicks((DateTime)val));
                }
                else // if (dateFormat == 3) // smart iso 8061 - also default for all other values
                {
                    DateTime dv = (DateTime)val;

                    if (dv.Year == 1900 && dv.Month == 1 && dv.Day == 1) // is a time?
                    {
                        if (dv.Hour == 0 && dv.Minute == 0 && dv.Second == 0) // 1900-01-01 00:00:00 this is likely a null date. So let's just dump the empty string.
                            json.WriteValue("");
                        else
                            json.WriteValue(dv.ToString("HH:mm:ss"));
                    }
                    else
                    {
                        if (dv.Hour == 0 && dv.Minute == 0 && dv.Second == 0) // extra milisecond check ?
                        {
                            json.WriteValue(dv.ToString("yyyy-MM-dd"));
                        }
                        else
                        {
                            //Add dates from the ArrangeData action should be returned in UTC
                            dv = dv.ToUniversalTime();
                            json.WriteValue(dv.ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
                        }
                    }
                }
            }
            else if (typeof(IRecord).IsAssignableFrom(type) || typeof(ISimpleRecord).IsAssignableFrom(type))
                writeRecord(json, val, dateFormat);
            else if (typeof(IOSList).IsAssignableFrom(type))
            {
                IOSList l = (IOSList)val;

                bool flatten = false;
                FieldHolder f1 = null;
                FieldInfo f = null;
                Type elementType = null;
                bool isRecord = false;
                if (l.Length > 0) // do flatten test only if we're going to print anything
                {
                    elementType = l.Current.GetType();
                    isRecord = typeof(IRecord).IsAssignableFrom(elementType);
                    bool isSimpleRecord = typeof(ISimpleRecord).IsAssignableFrom(elementType);
                    if (isRecord && !isSimpleRecord)
                    {

                        f = elementType.GetFields().First(c => c.Name.StartsWith("ss"));
                        Dictionary<string, FieldHolder> fields = getFields(f.FieldType);
                        if (fields.Count == 1)
                        {
                            f1 = fields.First().Value;
                            // records of a single attribute 
                            // which is a record also get flattened
                            // could check this strange case here
                            flatten = true;
                        }
                    }
                }

                l.StartIteration();
                json.WriteStartArray();
                while (!l.Eof)
                {
                    if (!isRecord)
                    {
                        writeValue(json, elementType, l.Current, dateFormat);
                    }
                    else if (flatten)
                    {
                        writeValue(json, f1.type(), f1.get(f.GetValue(l.Current)), dateFormat);
                    }
                    else
                    {
                        writeRecord(json, l.Current, dateFormat);
                    }
                    l.Advance();
                }
                l.EndIteration();
                json.WriteEndArray();
            }
            else // default does a good job for most of the cases
                json.WriteValue(val);
        }


        public static void OutSystemsObjToJSON(object ssValue, int ssDateFormat, out string ssJSON) {
            ssJSON = string.Empty;
            StringBuilder sb = new StringBuilder();
            StringWriter sw = new StringWriter(sb);

            using (JsonWriter json = new JsonTextWriter(sw)) {
                writeValue(json, ssValue.GetType(), ssValue, ssDateFormat);
            }

            ssJSON = sb.ToString();
        } // MssOutSystems2JSON

    }
}
