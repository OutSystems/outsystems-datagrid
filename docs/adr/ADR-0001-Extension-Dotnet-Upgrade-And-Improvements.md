# ADR-0001: Extension .NET Upgrade and Improvements

## Status

Accepted

## Context

The DataGridUtils extension (`OutSystems.NssDataGridUtils`) was targeting an older .NET Framework version. The reflection-based JSON serializer (`temp_ardoJSON`) used a non-thread-safe `Dictionary<Type, ...>` for its type cache (`recCache`), which could cause thread deadlocks under concurrent access on the OutSystems platform. Additionally, the extension had no automated tests, making it difficult to validate changes without deploying to the platform.

## Decision Drivers

- The OutSystems platform runtime uses .NET Framework 4.7.2, so updating from the outdated and unsupported 4.6.1 can be done safely.
- The `recCache` static dictionary was susceptible to deadlocks when accessed concurrently by multiple threads handling parallel requests, potentially causing data corruption and high usage of CPU - but the occurence of this is minimal.
- There was no way to test the extension logic in isolation without the OutSystems platform, slowing down development and increasing the risk of regressions.

## Considered Options

- Option 1: Upgrade .NET version only
    - Pros: Minimal change, low risk.
    - Cons: Does not address thread safety or testability.
- Option 2: Upgrade .NET version + fix thread safety + add test project
    - Pros: Addresses all the concerns of the RPM-6484.
    - Cons: Larger changeset, but changes are isolated to the extension layer.
- Option 3: Upgrade .NET version + fix thread safety + add test project
    - Pros: Addresses all three concerns in a single effort; the test project enables validating the thread-safety fix and future changes without the platform.
    - Cons: Larger changeset, but changes are isolated to the extension layer.

## Decision Outcome

Chosen option: "Option 3", because it addresses all identified issues together, and the test project provides confidence that the thread-safety and serialization fixes work correctly.

Positive consequences:

- Extension now targets .NET Framework 4.7.2, aligning with the OutSystems platform runtime.
- Replaced `Dictionary<Type, Dictionary<string, FieldHolder>>` with `ConcurrentDictionary` in `temp_ardoJSON.recCache`, eliminating the thread deadlock risk during concurrent serialization calls.
- A standalone .NET Framework 4.7.2 test project (`extension/tests/DataGridUtils.Tests.csproj`) enables testing `MssConvertData2JSON` in isolation using mock OutSystems types (`ISimpleRecord`, `IRecord`, `IOSList`), without requiring the OutSystems platform.

Negative consequences:

- The test project references compiled DLLs from the extension's `Bin/` directory, so tests must be run after building the extension.

## Links

- `extension/DataGridUtils/Source/NET/DataGridUtils.csproj` — updated target framework.
- `extension/DataGridUtils/Source/NET/temp_ardoJSON.cs` — `ConcurrentDictionary` change.
- `extension/tests/DataGridUtils.Tests.csproj` — new test project.
- `extension/tests/ConvertData2JSONTests.cs` — test implementation with mock types.

## Date

2026-02-24
