using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using OutSystems.HubEdition.RuntimePlatform;
using OutSystems.HubEdition.RuntimePlatform.Db;

namespace OutSystems.NssDataGridUtils {
    public class ObtainMetadata {
        private static string cleanRecName(string recName) {

            int idxStr = recName.LastIndexOf(".");
            if (idxStr != -1) {
                recName = recName.Substring(idxStr);
            }

            idxStr = recName.LastIndexOf("EntityRecord");
            if (idxStr != -1) {
                recName = recName.Substring(0, idxStr);

            }

            //idxStr = recName.LastIndexOf("Structure");
            //if (idxStr != -1) {
            //    recName = recName.Substring(0, idxStr);
            //}

            if (recName.StartsWith("ssEN") || recName.StartsWith("ssST"))
            {
                recName = recName.Substring(4);
            }
            else 
            {
                // Scenario with no complex strutures and where the records
                // can be on several depth levels, having the "ss" prefix
                // but without having "ssEN" or "ssST"
                recName = cleanAttrName(recName);
            }

            return recName;
        }

        private static string cleanAttrName(string attrName) {
            if(attrName.StartsWith("ss"))
                attrName = attrName.Substring(2);
            return attrName;
        }

        private static string cleanTypeName(Type type) {
            return type.ToString().Substring(7);
        }

        private static void addSimpleField(JsonWriter json, string name, string type, object value) {
            var _fieldType = type;

            /*
            * When we will have the need to have a time column, this code might come handy.
            * However we can have here a situation where if in the first line the value is not filled up,
            * then the column type will be DateTime, however if the first line is filled up, the column
            * type can be either DateTime or Date or Time...
            */
            /*
            * if (type == "DateTime") {
            *     DateTime dv = (DateTime)value;
            *     if (dv.Year == 1900 && dv.Month == 1 && dv.Day == 1) // is a time?
            *     {
            *         if (dv.Hour == 0 && dv.Minute == 0 && dv.Second == 0) // 1900-01-01 00:00:00 this is likely a null date. So let's just dump the empty string.
            *             _fieldType = "DateTime";
            *         else
            *             _fieldType = "Time";
            *     } else if (dv.Hour == 0 && dv.Minute == 0 && dv.Second == 0) {
            *         _fieldType = "Date";
            *     } else {
            *         _fieldType = "DateTime";
            *     }
            * }
            *
            */

            json.WritePropertyName(name);
            json.WriteValue(_fieldType);

        }


        private static void getDataMetadata(JsonWriter json, object rec) {
            Type objType = rec.GetType();

            json.WriteStartObject();

            var fields = objType.GetFields().Where(f => f.Name.StartsWith("ss"));

            foreach (var field in fields) {
                if (typeof(IRecord).IsAssignableFrom(field.FieldType) || typeof(ISimpleRecord).IsAssignableFrom(field.FieldType)) {
                    json.WritePropertyName(cleanRecName(field.Name));
                    getDataMetadata(json, field.GetValue(rec));
                } else {
                    //RGRIDT-364 - removing columns of the type BinaryData.
                    if (typeof(Byte[]).IsAssignableFrom(field.FieldType) == false) {
                        addSimpleField(json, cleanAttrName(field.Name), cleanTypeName(field.FieldType), field.GetValue(rec));
                    }
                }
            }

            var properties = objType.GetProperties().Where(p => p.Name.StartsWith("ss"));

            foreach (var property in properties) {
                if (typeof(IRecord).IsAssignableFrom(property.PropertyType) || typeof(ISimpleRecord).IsAssignableFrom(property.PropertyType)) {
                    json.WritePropertyName(cleanRecName(property.Name));
                    getDataMetadata(json, property.GetValue(rec));
                } else {
                    //RGRIDT-364 - removing columns of the type BinaryData.
                    if (typeof(Byte[]).IsAssignableFrom(property.PropertyType) == false) {
                        addSimpleField(json, cleanAttrName(property.Name), cleanTypeName(property.PropertyType), property.GetValue(rec));
                    }
                }
            }

            json.WriteEndObject();
        }

        public static void fromObject(object data, out string dataMetadata) {
            StringBuilder strbuilder = new StringBuilder();
            StringWriter sw = new StringWriter(strbuilder);
            object singleItem;

            Type type = data.GetType();


            if (typeof(IOSList).IsAssignableFrom(type)) {
                IOSList list = (IOSList)data;
                singleItem = list.Current;
            } else {
                singleItem = data;
            }
            using (JsonWriter json = new JsonTextWriter(sw)) {
                getDataMetadata(json, singleItem);
            }
            dataMetadata = strbuilder.ToString();
        }
    }
}
