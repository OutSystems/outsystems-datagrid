using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Runtime.Serialization;
using System.Xml;
using OutSystems.HubEdition.RuntimePlatform;
using OutSystems.HubEdition.RuntimePlatform.Db;
using OutSystems.NssDataGridUtils;
using OutSystems.ObjectKeys;

namespace DataGridUtils.Tests
{
    #region Mock OutSystems Types

    public class STCenasListStructure : ISimpleRecord
    {
        public DateTime ssSTARTDate { get; set; }
        public DateTime ssENDDate { get; set; }
        public string ssJose { get; set; }

        public STCenasListStructure()
        {
            ssSTARTDate = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            ssENDDate = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            ssJose = "";
        }
    }

    public class RCCenasListRecord : IRecord
    {
        public STCenasListStructure ssCenasList;

        public RCCenasListRecord()
        {
            ssCenasList = new STCenasListStructure();
        }

        #region IRecord stubs
        public object AttributeGet(GlobalObjectKey key) => throw new NotImplementedException();
        public void FillFromOther(IRecord other) => throw new NotImplementedException();
        public bool ChangedAttributeGet(GlobalObjectKey key) => throw new NotImplementedException();
        public bool OptimizedAttributeGet(GlobalObjectKey key) => throw new NotImplementedException();
        public void ReadDB(IDataReader reader) => throw new NotImplementedException();
        public BitArray[] AllOptimizedAttributes { get; set; }
        public IRecord Duplicate() => throw new NotImplementedException();
        public void RecursiveReset() { }
        public void InternalRecursiveSave() { }
        #endregion
    }

    public class RLCenasListRecordList : IOSList
    {
        private readonly List<RCCenasListRecord> _items = new List<RCCenasListRecord>();
        private int _index = -1;
        private bool _iterating;

        public void Add(RCCenasListRecord item) => _items.Add(item);

        public object Current => _index >= 0 && _index < _items.Count ? _items[_index] : _items.Count > 0 ? _items[0] : null;
        public int CurrentRowNumber { get => _index; set => _index = value; }
        public bool Empty => _items.Count == 0;
        public int Length => _items.Count;
        public int ReturnedRowCount => _items.Count;
        public int MaxRecords { get; set; }
        public bool Iterating => _iterating;
        public bool Bof => _index <= 0;
        public bool Eof => _index >= _items.Count;
        public bool HasHiddenRow { get; set; }
        public OutSystems.Internal.Db.Transaction Transaction { set { } }
        public IDataReader Reader { set { } }

        public void StartIteration() { _index = 0; _iterating = true; }
        public void EndIteration() { _iterating = false; }
        public bool Advance() { _index++; return !Eof; }
        public bool Advance(int count) { _index += count; return !Eof; }
        public void SetPosition(int pos) { _index = pos; }
        public void Set(int index, object value) => _items[index] = (RCCenasListRecord)value;
        public void Insert(object value, int index) => _items.Insert(index, (RCCenasListRecord)value);
        public void Remove(int index) => _items.RemoveAt(index);
        public void FillFromOther(IOSList other) => throw new NotImplementedException();
        public void RestoreRecordListEmptyState(bool b) { }
        public void RestoreRecordListState(int i, bool b) { }
        public void ToXml(object o, XmlElement el, string s, int i) => throw new NotImplementedException();
        public void EvaluateFields(VarValue v, object o, string s1, string s2) => throw new NotImplementedException();
        public void Sort(IComparer comparer) => _items.Sort((a, b) => comparer.Compare(a, b));
        public void Clear() => _items.Clear();
        public void CloseDataReader() { }
        public void InternalRecursiveSave() { }
        public void RecursiveReset() { }
        public void Read() { }
        public bool MoveNext() { _index++; return !Eof; }
        public void Reset() { _index = -1; }
        public IEnumerator GetEnumerator() => _items.GetEnumerator();
        public void GetObjectData(SerializationInfo info, StreamingContext context) => throw new NotImplementedException();
        public void Dispose() { }
    }

    #endregion

    class Program
    {
        private static int _passed;
        private static int _failed;

        static void Main(string[] args)
        {
            Console.WriteLine("=== DataGridUtils Tests ===");
            Console.WriteLine();

            RunTest(nameof(MssConvertData2JSON_WithCenasListData_ReturnsExpectedJSON),
                    MssConvertData2JSON_WithCenasListData_ReturnsExpectedJSON);

            Console.WriteLine();
            Console.WriteLine($"Results: {_passed} passed, {_failed} failed, {_passed + _failed} total");

            if (_failed > 0)
                Environment.Exit(1);
        }

        static void RunTest(string name, Action test)
        {
            try
            {
                test();
                _passed++;
                Console.WriteLine($"  PASS: {name}");
            }
            catch (Exception ex)
            {
                _failed++;
                Console.WriteLine($"  FAIL: {name}");
                Console.WriteLine($"        {ex.Message}");
            }
        }

        static RCCenasListRecord MakeRecord(string startDate, string endDate, string jose)
        {
            var rec = new RCCenasListRecord();

            if (TimeSpan.TryParse(startDate, out var ts))
                rec.ssCenasList.ssSTARTDate = new DateTime(1900, 1, 1, ts.Hours, ts.Minutes, ts.Seconds, DateTimeKind.Utc);
            else
                rec.ssCenasList.ssSTARTDate = DateTime.Parse(startDate).ToUniversalTime();

            rec.ssCenasList.ssENDDate = new DateTime(
                DateTime.Parse(endDate).Year,
                DateTime.Parse(endDate).Month,
                DateTime.Parse(endDate).Day,
                0, 0, 0, DateTimeKind.Utc);
            rec.ssCenasList.ssJose = jose;

            return rec;
        }

        static void AssertEqual(string expected, string actual)
        {
            if (expected != actual)
            {
                int diffPos = 0;
                int minLen = Math.Min(expected.Length, actual.Length);
                while (diffPos < minLen && expected[diffPos] == actual[diffPos])
                    diffPos++;

                string context = actual.Substring(Math.Max(0, diffPos - 30), Math.Min(60, actual.Length - Math.Max(0, diffPos - 30)));
                throw new Exception(
                    $"Strings differ at position {diffPos}.\n" +
                    $"        Expected length: {expected.Length}, Actual length: {actual.Length}\n" +
                    $"        Near: ...{context}...");
            }
        }

        static void MssConvertData2JSON_WithCenasListData_ReturnsExpectedJSON()
        {
            var list = new RLCenasListRecordList();

            string[] joseValues = new[]
            {
                "Black and Grey", "Black and Grey", "Black and Grey Pro",
                "Black and Silver", "Black and Silver", "Black and Silver",
                "Black and White", "Black and White"
            };

            foreach (var jose in joseValues)
            {
                list.Add(MakeRecord("09:08:30", "2026-02-24", jose));
            }

            var sut = new CssDataGridUtils();
            sut.MssConvertData2JSON(list, out string result);

            string expected =
                @"{""data"":[" +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Grey""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Grey""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Grey Pro""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Silver""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Silver""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and Silver""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and White""}}," +
                @"{""CenasList"":{""STARTDate"":""09:08:30"",""ENDDate"":""2026-02-24"",""Jose"":""Black and White""}}]," +
                @"""metadata"":{""CenasList"":{""STARTDate"":""DateTime"",""ENDDate"":""DateTime"",""Jose"":""String""}}}";

            AssertEqual(expected, result);
        }
    }
}
