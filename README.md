# OutSystems Data Grid · [![GitHub License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://github.com/OutSystems/outsystems-datagrid/blob/master/LICENSE) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

View, explore, and edit large amounts of data in a familiar spreadsheet interface with the Data Grid component for **OutSystems Reactive Web apps**.

## About the component

The goal for the OutSystems Data Grid component is to help you develop applications that need data visualization and manipulation features that are not currently covered by other components.

Use the OutSystems Data Grid to create enterprise-grade interfaces that are more suitable and time-effective than designing a custom solution every time you need to manipulate dense datasets.

#### Key features

-   Built for Reactive Web apps
-   Data selection and editing in a familiar interface
-   Data sorting by parameter
-   Data grouping
-   Virtual Scrolling

Please check the [tutorial OutSystems Data Grid in less than 4 minutes](https://www.youtube.com/watch?v=OFXOPrkRlrI).

### Where can you find the component?

The OutSystems component, like all components, can be found in [OutSystems forge](https://www.outsystems.com/forge/component-overview/9764/data-grid-reactive).
There you can also find a [sample application](https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive) that show-cases several uses of the component, that is also [the documentation].

### Why use this component?

If you're using OutSystems, this is how you can use this component in your application:
![Developer experience](https://www.outsystems.com/FroalaEditor/Download.aspx?GUID=2021216vzoTkL5piWLCGCv7VXgBkFoNdpCIye5Z9m2zyhV1gL)

## About this repository

This repository contains the code that enable the usage of an external provider ([Wijmo](https://developer.mescius.com/wijmo)), to create grids in OutSystems applications with the least possible effort.
The code is written in TypeScript🖤, and you branch it and PR your changes/proposals!

### What tools should you use?

We highly recommend the usage of the following tools:

-   [Visual Studio Code](https://code.visualstudio.com/)
-   With these extensions:
    -   Document This
    -   ESLint
    -   Prettier - Code formatter

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

### How to add new feature/fix?

-   A new branch from **master** should be created.
-   If possible the branch should be kept updated with the master branch.
-   If possible unnecessary commit messages should be omitted.

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

-   Download latest version in [OutSystems forge](https://www.outsystems.com/forge/component-versions/9764)
-   Test the latest changes in the [sample app](https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive)
-   Component [living documentation](https://outsystemsui.outsystems.com/OutSystemsDataGridSample/)
-   [Tutorial OutSystems Data Grid in less than 4 minutes](https://www.youtube.com/watch?v=OFXOPrkRlrI)

## 📫&nbsp; Have a question? Want to chat? Ran into a problem?

Write us in [the component support page](https://www.outsystems.com/forge/component-discussions/9764/Data+Grid+Reactive)!

## How to sign up for the announcement list

Available internally on Slack channel _#rd-uicomponents-contributors_.

## Keywords

GitHub - OutSystems - Data Grid
