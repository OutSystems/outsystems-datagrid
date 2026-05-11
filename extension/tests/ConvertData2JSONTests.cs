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

    public class STComplexListStructure : ISimpleRecord
    {
        public DateTime ssTimeField { get; set; }
        public DateTime ssDateField { get; set; }
        public DateTime ssDateTimeField { get; set; }
        public string ssProduct { get; set; }

        public STComplexListStructure()
        {
            ssTimeField = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            ssDateField = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            ssDateTimeField = new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            ssProduct = "";
        }
    }

    public class RCComplexListRecord : IRecord
    {
        public STComplexListStructure ssComplexList;

        public RCComplexListRecord()
        {
            ssComplexList = new STComplexListStructure();
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

    public class RLComplexListRecordList : IOSList
    {
        private readonly List<RCComplexListRecord> _items = new List<RCComplexListRecord>();
        private int _index = -1;
        private bool _iterating;

        public void Add(RCComplexListRecord item) => _items.Add(item);

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
        public void Set(int index, object value) => _items[index] = (RCComplexListRecord)value;
        public void Insert(object value, int index) => _items.Insert(index, (RCComplexListRecord)value);
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

    #region Multi-ss-field mocks (ROU-12689)

    // Structure with a single attribute. Mirrors an OutSystems aggregate Count output
    // (Count.Total : Int32). This is the shape that previously triggered the over-eager
    // flatten heuristic in temp_ardoJSON.writeValue when it appeared alongside another
    // entity in the same aggregate row.
    public class STSingleFieldCount : ISimpleRecord
    {
        public int ssTotal { get; set; }

        public STSingleFieldCount() { ssTotal = 0; }
    }

    // Structure with several attributes. Stand-in for a real entity
    // (e.g. Sample_Employee) — the "wide" side of the aggregate row.
    public class STMultiFieldEmployee : ISimpleRecord
    {
        public int ssId { get; set; }
        public string ssFirstName { get; set; }
        public string ssLastName { get; set; }

        public STMultiFieldEmployee()
        {
            ssId = 0;
            ssFirstName = "";
            ssLastName = "";
        }
    }

    // Aggregate row with Count FIRST, Employee SECOND in field declaration order.
    // Under the old flatten heuristic this shape produced "[{scalar}, {scalar}, ...]"
    // because GetFields() returned ssSTCount first and its inner type has a single field.
    public class RCRow_CountFirst : IRecord
    {
        public STSingleFieldCount ssSTCount;
        public STMultiFieldEmployee ssENEmployee;

        public RCRow_CountFirst()
        {
            ssSTCount = new STSingleFieldCount();
            ssENEmployee = new STMultiFieldEmployee();
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

    // Same logical shape as RCRow_CountFirst but with the fields declared in the
    // opposite order. Used to prove the fix is order-independent.
    public class RCRow_EmployeeFirst : IRecord
    {
        public STMultiFieldEmployee ssENEmployee;
        public STSingleFieldCount ssSTCount;

        public RCRow_EmployeeFirst()
        {
            ssENEmployee = new STMultiFieldEmployee();
            ssSTCount = new STSingleFieldCount();
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

    // Legacy "[{ssENX: X}]" wrapper where X itself has a single attribute.
    // This is the ONE shape that the flatten shortcut is designed for and must
    // keep working after the fix.
    public class RCRow_LegacySingleAttr : IRecord
    {
        public STSingleFieldCount ssSTCount;

        public RCRow_LegacySingleAttr() { ssSTCount = new STSingleFieldCount(); }

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

    // Minimal IOSList implementation parameterised on the element type, so each
    // multi-ss-field mock can be wrapped without duplicating the iterator plumbing.
    public class RL<T> : IOSList where T : class, IRecord
    {
        private readonly List<T> _items = new List<T>();
        private int _index = -1;
        private bool _iterating;

        public void Add(T item) => _items.Add(item);

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
        public void Set(int index, object value) => _items[index] = (T)value;
        public void Insert(object value, int index) => _items.Insert(index, (T)value);
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

    #endregion // End of Mock OutSystems Types

    class Program
    {
        private static int _passed;
        private static int _failed;

        static void Main(string[] args)
        {
            Console.WriteLine("=== DataGridUtils Tests ===");
            Console.WriteLine();

            RunTest(nameof(MssConvertData2JSON_WithComplexListData_ReturnsExpectedJSON),
                    MssConvertData2JSON_WithComplexListData_ReturnsExpectedJSON);

            RunTest(nameof(MssConvertData2JSON_MultiSsFieldRow_CountFirst_EmitsFullRecord),
                    MssConvertData2JSON_MultiSsFieldRow_CountFirst_EmitsFullRecord);

            RunTest(nameof(MssConvertData2JSON_MultiSsFieldRow_EmployeeFirst_EmitsFullRecord),
                    MssConvertData2JSON_MultiSsFieldRow_EmployeeFirst_EmitsFullRecord);

            RunTest(nameof(MssConvertData2JSON_LegacySingleAttrWrapper_StillFlattens),
                    MssConvertData2JSON_LegacySingleAttrWrapper_StillFlattens);

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

        static RCComplexListRecord MakeRecord(string TimeField, string DateField, string DateTimeField, string Product)
        {
            var rec = new RCComplexListRecord();

            if (TimeSpan.TryParse(TimeField, out var ts))
                rec.ssComplexList.ssTimeField = new DateTime(1900, 1, 1, ts.Hours, ts.Minutes, ts.Seconds, DateTimeKind.Utc);
            else
                rec.ssComplexList.ssTimeField = DateTime.Parse(TimeField).ToUniversalTime();

            rec.ssComplexList.ssDateField = new DateTime(
                DateTime.Parse(DateField).Year,
                DateTime.Parse(DateField).Month,
                DateTime.Parse(DateField).Day,
                0, 0, 0, DateTimeKind.Local);
            rec.ssComplexList.ssDateTimeField = new DateTime(
                DateTime.Parse(DateTimeField).Year,
                DateTime.Parse(DateTimeField).Month,
                DateTime.Parse(DateTimeField).Day,
                DateTime.Parse(DateTimeField).Hour,
                DateTime.Parse(DateTimeField).Minute,
                DateTime.Parse(DateTimeField).Second, 
                DateTimeKind.Utc);
            rec.ssComplexList.ssProduct = Product;

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

        // ROU-12794: Date column rendering to ISO DateTime format issue.
        // This test covers a real-world scenario where the server is in a different timezone than UTC.
        // It must not run on UTC machines because that would allow the regression check to pass without
        // exercising the local-time-to-UTC conversion path in temp_ardoJSON.
        static void MssConvertData2JSON_WithComplexListData_ReturnsExpectedJSON()
        {
            if (DateTimeOffset.Now.Offset == TimeSpan.Zero)
                throw new InvalidOperationException(
                    "ROU-12794 regression test requires a non-UTC local timezone to validate the local-time-to-UTC conversion path.");

            var list = new RLComplexListRecordList();

            string[] ProductValues = new[]
            {
                "Black and Grey", "Black and Grey", "Black and Grey Pro",
                "Black and Silver", "Black and Silver", "Black and Silver",
                "Black and White", "Black and White"
            };

            foreach (var Product in ProductValues)
            {
                list.Add(MakeRecord("09:08:30", "2026-02-24 00:00:00", "2026-02-24 09:08:30", Product));
            }

            var sut = new CssDataGridUtils();
            sut.MssConvertData2JSON(list, out string result);

            string expected =
                @"{""data"":[" +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Grey""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Grey""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Grey Pro""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Silver""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Silver""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and Silver""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and White""}}," +
                @"{""ComplexList"":{""TimeField"":""09:08:30"",""DateField"":""2026-02-24"",""DateTimeField"":""2026-02-24T09:08:30Z"",""Product"":""Black and White""}}]," +
                @"""metadata"":{""ComplexList"":{""TimeField"":""DateTime"",""DateField"":""DateTime"",""DateTimeField"":""DateTime"",""Product"":""String""}}}";

            AssertEqual(expected, result);
        }

        // ROU-12689 — Aggregate row with {Count, Employee}, Count declared FIRST.
        // Before the fix, the flatten heuristic picked the first ss-field (Count),
        // saw it had a single inner attribute (Total), and emitted a list of
        // scalars [55, 55, ...] instead of proper records, which Wijmo 2026v1
        // then rejected with "Cannot create proxy with a non-object...".
        static void MssConvertData2JSON_MultiSsFieldRow_CountFirst_EmitsFullRecord()
        {
            var list = new RL<RCRow_CountFirst>();
            var row = new RCRow_CountFirst();
            row.ssSTCount.ssTotal = 55;
            row.ssENEmployee.ssId = 1981;
            row.ssENEmployee.ssFirstName = "Patricia";
            row.ssENEmployee.ssLastName = "Wesley";
            list.Add(row);

            var sut = new CssDataGridUtils();
            sut.MssConvertData2JSON(list, out string result);

            string expected =
                @"{""data"":[" +
                @"{""Count"":{""Total"":55},""Employee"":{""Id"":1981,""FirstName"":""Patricia"",""LastName"":""Wesley""}}" +
                @"]," +
                @"""metadata"":{""Count"":{""Total"":""Int32""},""Employee"":{""Id"":""Int32"",""FirstName"":""String"",""LastName"":""String""}}}";

            AssertEqual(expected, result);
        }

        // ROU-12689 — Same logical row as above but with fields declared in the
        // opposite order. Proves the fix is order-independent: the result must
        // be equivalent regardless of which ss-field Type.GetFields() returns first.
        static void MssConvertData2JSON_MultiSsFieldRow_EmployeeFirst_EmitsFullRecord()
        {
            var list = new RL<RCRow_EmployeeFirst>();
            var row = new RCRow_EmployeeFirst();
            row.ssENEmployee.ssId = 1981;
            row.ssENEmployee.ssFirstName = "Patricia";
            row.ssENEmployee.ssLastName = "Wesley";
            row.ssSTCount.ssTotal = 55;
            list.Add(row);

            var sut = new CssDataGridUtils();
            sut.MssConvertData2JSON(list, out string result);

            string expected =
                @"{""data"":[" +
                @"{""Employee"":{""Id"":1981,""FirstName"":""Patricia"",""LastName"":""Wesley""},""Count"":{""Total"":55}}" +
                @"]," +
                @"""metadata"":{""Employee"":{""Id"":""Int32"",""FirstName"":""String"",""LastName"":""String""},""Count"":{""Total"":""Int32""}}}";

            AssertEqual(expected, result);
        }

        // ROU-12689 — Legacy "[{ssENX: X}]" wrapper where X has a single attribute.
        // This is the only shape the flatten shortcut is designed for and must
        // keep working after the fix.
        static void MssConvertData2JSON_LegacySingleAttrWrapper_StillFlattens()
        {
            var list = new RL<RCRow_LegacySingleAttr>();
            var row1 = new RCRow_LegacySingleAttr();
            row1.ssSTCount.ssTotal = 10;
            var row2 = new RCRow_LegacySingleAttr();
            row2.ssSTCount.ssTotal = 20;
            var row3 = new RCRow_LegacySingleAttr();
            row3.ssSTCount.ssTotal = 30;
            list.Add(row1);
            list.Add(row2);
            list.Add(row3);

            var sut = new CssDataGridUtils();
            sut.MssConvertData2JSON(list, out string result);

            string expected =
                @"{""data"":[10,20,30]," +
                @"""metadata"":{""Count"":{""Total"":""Int32""}}}";

            AssertEqual(expected, result);
        }
    }

}
