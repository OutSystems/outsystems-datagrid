# OutSystems Data Grid · [![GitHub License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://github.com/OutSystems/outsystems-datagrid/blob/master/LICENSE) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

View, explore, and edit large amounts of data in a familiar spreadsheet interface with the Data Grid component for **OutSystems Reactive Web apps**.

## About the component

The goal for the OutSystems Data Grid component is to help you develop applications that need data visualization and manipulation features that are not currently covered by other components.

Use the OutSystems Data Grid to create enterprise-grade interfaces that are more suitable and time-effective than designing a custom solution every time you need to manipulate dense datasets.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, workflow, code standards, and PR requirements.

#### Key features

- Built for Reactive Web apps
- Data selection and editing in a familiar interface
- Data sorting by parameter
- Data grouping
- Virtual Scrolling

Please check the [tutorial OutSystems Data Grid in less than 4 minutes](https://www.youtube.com/watch?v=OFXOPrkRlrI).

### Where can you find the component?

The OutSystems component, like all components, can be found in [OutSystems Forge](https://www.outsystems.com/forge/component-overview/9764/outsystems-data-grid-o11) and [OutSystems Forge Component Page (ODC)](https://www.outsystems.com/forge/component-overview/15929/outsystems-data-grid-odc).
There you can also find a [sample application](https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive) that show-cases several uses of the component, that is also [the documentation].

### Why use this component?

If you're using OutSystems, this is how you can use this component in your application:
![Developer experience](https://www.outsystems.com/FroalaEditor/Download.aspx?GUID=2021216vzoTkL5piWLCGCv7VXgBkFoNdpCIye5Z9m2zyhV1gL)

## About this repository

This repository contains the code that enable the usage of an external provider ([Wijmo](https://developer.mescius.com/wijmo)), to create grids in OutSystems applications with the least possible effort.
The code is written in TypeScript🖤, and you branch it and PR your changes/proposals!

### What tools should you use?

We highly recommend the usage of the following tools:

- [Visual Studio Code](https://code.visualstudio.com/)
- With these extensions:
    - Document This
    - ESLint
    - Prettier - Code formatter
- [Volta](https://volta.sh/) — manages Node.js and npm versions for this project

#### Node.js and npm (Volta)

This project pins Node.js and npm versions in `package.json`. Install [Volta](https://volta.sh/) once and the correct versions are applied automatically when you work in this repository.

**Install Volta:** follow the official [Getting Started guide](https://docs.volta.sh/guide/getting-started) (macOS, Windows, and Linux).

**Verify Volta is active:**

```bash
volta --version          # Volta is installed
volta which node         # pinned Node version for this project
volta which npm          # pinned npm version for this project
node -v
npm -v
```


### How to use change this code?

1. Create a branch based in the branch **master** (lastest & greatest release)
2. Open your Visual Studio Code in your branch
3. Run the following command in Visual Studio Code terminal: `npm run setup` (this will install all the dependencies that you need and compile the code)
4. Do your magic! :)
5. **Document your code** (with the extension "Document This", start typing `/**` and the extension will give you a good starting point
6. Compile and fix errors and warnings (in Visual Studio Code terminal: `npm run build`)
7. Check if the code format is following our conventions (in Visual Studio Code terminal: `npm run lint`)
   7.1 Some of the conventions can be fixed automatically by lint (in Visual Studio Code terminal: `npm run lintfix`)
   7.2 Although the script above execute the prettier conventions, you may want to run it over all project files (in Visual Studio Code terminal: `npm run prettier`)
8. Fix all errors & warnings! :)
9. Create a PR, describing what was the (mis)behavior, what you changed and please provide a sample

### How to run the .NET extension tests?

The `DataGridUtils` extension ships with a standalone test project under [extension/tests/](./extension/tests/) that exercises `MssConvertData2JSON` against mock OutSystems types (`IRecord`, `ISimpleRecord`, `IOSList`). No OutSystems platform or Integration Studio install is required.

The project is a .NET Framework 4.7.2 console app (`OutputType=Exe`): each test runs from `Main`, the runner prints pass/fail, and the process exits with a non-zero code if any test fails — CI-friendly out of the box.

**Prerequisites**

- .NET Framework 4.7.2 developer pack installed.
- Either Visual Studio 2019+ or the Build Tools for Visual Studio (so `msbuild` is on `PATH`, e.g. via the _Developer Command Prompt for VS_).

**Run with Visual Studio**

1. Open `extension/DataGridUtils/Source/NET/DataGridUtils.sln` and build it (`Ctrl+Shift+B`) — this produces `OutSystems.NssDataGridUtils.dll` in `obj/Debug/`, which the test project consumes.
2. Open `extension/tests/DataGridUtils.Tests.csproj` (add it to the solution or open in a second VS instance).
3. If the `OutSystems.NssDataGridUtils` reference shows as unresolved, right-click it → **Properties** and repoint the _Path_ to the `obj/Debug/OutSystems.NssDataGridUtils.dll` produced in step 1. The checked-in `HintPath` may point at a contributor-specific location and is a known maintenance quirk.
4. Set `DataGridUtils.Tests` as the startup project and press `F5` (debug) or `Ctrl+F5` (run without debugging).

**Run from the command line**

```bash
# 1. Build the extension first — produces OutSystems.NssDataGridUtils.dll
cd extension/DataGridUtils/Source/NET
msbuild DataGridUtils.sln /p:Configuration=Debug

# 2. Build and run the test project
cd ../../../tests
msbuild DataGridUtils.Tests.csproj /p:Configuration=Debug
./bin/Debug/net472/DataGridUtils.Tests.exe
```

**Expected output**

```
=== DataGridUtils Tests ===

  PASS: MssConvertData2JSON_WithComplexListData_ReturnsExpectedJSON
  PASS: MssConvertData2JSON_MultiSsFieldRow_CountFirst_EmitsFullRecord
  PASS: MssConvertData2JSON_MultiSsFieldRow_EmployeeFirst_EmitsFullRecord
  PASS: MssConvertData2JSON_LegacySingleAttrWrapper_StillFlattens

Results: 4 passed, 0 failed, 4 total
```

**Adding a new test**

1. Declare the mock types (implementing `IRecord` / `ISimpleRecord` / `IOSList`) alongside the existing ones in `ConvertData2JSONTests.cs` — follow the `RCRow_*` / `RL<T>` patterns already established for ROU-12689.
2. Write a `static void` test method inside `Program` that calls `sut.MssConvertData2JSON(list, out string result)` and compares against an explicit expected string via `AssertEqual`.
3. Register it in `Main` with `RunTest(nameof(YourTest), YourTest)`.

If a test fails, `AssertEqual` prints the first differing character position and a 60-char context window, which is usually enough to diagnose shape drift without a debugger.

### How to add new feature/fix?

- A new branch from **master** should be created.
- If possible the branch should be kept updated with the master branch.
- If possible unnecessary commit messages should be omitted.

### How to do a Pull Request?

After completing your changes, and testing, please proceed with submitting a Pull Request.

To be accepted, a Pull Request needs to:

1. **Fulfill the following requirements**
    - Needs to compile without errors
    - Needs to follow the code style rules (without warnings and errors)
    - Needs to be approved by 2 team members (owners of the repo)
    - The Pull Request template, should be filled up by the Pull Requestor:
        - Provide a short description
        - A link to a sample page showing the fixed behavior or the new feature
        - What was happening?
        - What was done?
        - Tests steps
        - Screenshots
        - Checklist

2. **Follow best practices**
    - The submitted code should be well documented (e.g. comments).
    - Avoid changes outside the scope of the issue in hands.
    - Avoid exposing sensible information of any kind (e.g. internal server link, process, etc).

## Useful Links

- Download latest O11 version in [OutSystems forge](https://www.outsystems.com/forge/component-overview/9764/outsystems-data-grid-o11)
- Download latest ODC version in [OutSystems Forge Component Page (ODC)](https://www.outsystems.com/forge/component-overview/15929/outsystems-data-grid-odc)
- Test the latest changes in the [sample app](https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive)
- Component [living documentation](https://outsystemsui.outsystems.com/OutSystemsDataGridSample/)
- [Tutorial OutSystems Data Grid in less than 4 minutes](https://www.youtube.com/watch?v=OFXOPrkRlrI)

## 📫&nbsp; Have a question? Want to chat? Ran into a problem?

Write us in [the component support page](https://www.outsystems.com/forge/component-discussions/9764/Data+Grid+Reactive)!

## How to sign up for the announcement list

Available internally on Slack channel _#rd-uicomponents-contributors_.

## Keywords

GitHub - OutSystems - Data Grid
