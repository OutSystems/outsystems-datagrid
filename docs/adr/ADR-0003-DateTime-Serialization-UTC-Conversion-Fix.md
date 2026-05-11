# ADR-0003: Fix Date Serialization Order-of-Operations in UTC Conversion

## Status

Accepted

## Context

The DataGridUtils extension serializes OutSystems entity/structure data to JSON via `temp_ardoJSON.cs`. OutSystems does not differentiate between `Date` and `DateTime` types at the .NET runtime level — both are represented as `DateTime` values. A plain date (e.g. `2026-02-24`) is passed to the extension as `2026-02-24 00:00:00`, relying on a zeroed time component to signal that no time information is present.

The serializer in `temp_ardoJSON.cs` was intended to distinguish these two cases and emit a shorter `yyyy-MM-dd` format for date-only values and a full ISO 8601 string with a `Z` suffix for true datetimes. However, the UTC conversion (`dv.ToUniversalTime()`) was applied **before** the midnight check, not after. On servers running in a non-UTC timezone (e.g. UTC+1), a date-only value such as `2026-02-24 00:00:00 Local` would first be shifted to `2026-02-23 23:00:00 UTC`, causing the midnight check to fail. The value was then serialized as `2026-02-23T23:00:00Z` — an ISO datetime string — instead of `2026-02-24`, which the Data Grid client then rendered as a full datetime with timezone rather than a plain date.

The defect was latent and invisible on UTC servers (where local time equals UTC), which is why it went undetected during earlier development.

## Decision Drivers

-   OutSystems platform servers can run in any timezone; the serializer must produce identical output regardless of the server's local timezone.
-   The Data Grid client relies on the JSON format of a field value (`yyyy-MM-dd` vs `yyyy-MM-dd'T'HH:mm:ssZ`) to decide how to render it — a datetime string causes Date columns to display timezone-adjusted values.
-   The existing midnight-check logic was conceptually correct but was rendered ineffective by the premature UTC conversion.
-   The regression test suite was previously using `DateTimeKind.Utc` for date-only fields in the mock records, which masked the bug on UTC machines by not exercising the local-time-to-UTC conversion path.

## Decision Outcome

The order of operations in `temp_ardoJSON.cs` was corrected: the midnight check (`Hour == 0 && Minute == 0 && Second == 0 && Millisecond == 0`) is now evaluated against the original value **before** any UTC conversion. Only values that fail the midnight check (true datetimes) are converted to UTC and serialized with the `Z` suffix. Date-only values continue to be emitted as `yyyy-MM-dd` without UTC shifting.

The millisecond component was also added to the midnight check to guard against sub-second precision edge cases.

The test project was updated to construct date-only mock records with `DateTimeKind.Local` rather than `DateTimeKind.Utc`, so that the test exercises the local-to-UTC conversion path. A guard was added to the regression test that throws if executed on a UTC machine, ensuring the test only provides meaningful signal in a non-UTC environment matching real production server conditions.

## Links

-   `extension/DataGridUtils/Source/NET/temp_ardoJSON.cs` — corrected UTC conversion order and extended midnight check.
-   `extension/tests/ConvertData2JSONTests.cs` — updated mock records to use `DateTimeKind.Local` for date-only fields; added timezone guard to the regression test.
-   [PR #504](https://github.com/OutSystems/outsystems-datagrid/pull/504) — ROU-12794 fix.

## Date

2026-05-11
