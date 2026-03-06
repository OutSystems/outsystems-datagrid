# Contributing to OutSystems Data Grid

Thank you for contributing to this project. This repository contains TypeScript code that wraps Wijmo to create data grids in OutSystems Reactive Web applications.

## Development Setup

### Prerequisites

- Node.js 12 or higher (defined in `package.json` engines field)
- Visual Studio Code (recommended)
- For .NET extension work: Visual Studio with .NET Framework 4.7.2

### Recommended VS Code Extensions

Defined in `.vscode/extensions.json`:

- Prettier - Code formatter (`esbenp.prettier-vscode`)
- Document This (`oouo-diogo-perdigao.docthis`)
- GitBlame (`waderyan.gitblame`)
- ESLint (`bdaeumer.vscode-eslint`)

### Initial Setup

```bash
npm run setup
```

This installs dependencies and compiles the code.

## Development Workflow

### Branch Naming

Create your branch from `dev` using the JIRA ticket identifier:

```bash
git checkout dev
git pull
git checkout -b ROU-12345
```

Branch names follow the pattern `<JIRA-ID>` (e.g., `ROU-12345`, `RGRIDT-1051`).

### Commit Format

Commits should include the JIRA ticket ID and a brief description:

```
ROU-12345: Add new feature for data export
```

### Pull Request Requirements

**PR Title:** Must match the pattern `<JIRA-ID>: <description>` (e.g., `ROU-12345: Add support for CSV export`)

The title is validated using the regex: `^([A-Z][A-Z0-9]*-\d+(:)?\s\w)`. Release and merge branches are exempt.

Validation defined in: `.github/actions/validate-pr-title/action.yml`

**PR Labels:** Must include at least one of:

- `feature` - New functionality
- `bug` / `bugfix` - Bug fixes
- `chore` - Maintenance tasks
- `dependencies` / `dependency` - Dependency updates

Must NOT have the `do not merge` label.

Validation defined in: `.github/actions/validate-pr-labels/action.yml`

**PR Description:** Use the template (`.github/pull_request_template.md`) to provide:

- Link to sample page demonstrating the change
- What was happening (issue description)
- What was done (solution description)
- Test steps
- Screenshots (animated GIFs preferred)
- Checklist confirmation

**Approval:** Requires approval from 2 UI Components team members.

## Building and Testing

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `npm run setup`    | Install dependencies and compile               |
| `npm run build`    | Build production output, run lintfix, and lint |
| `npm run dev`      | Start development mode with gulp               |
| `npm run lint`     | Check code style (TypeScript files)            |
| `npm run lintfix`  | Auto-fix code style issues                     |
| `npm run prettier` | Format all JS/TS/CSS files                     |
| `npm run docs`     | Generate TypeDoc documentation                 |

**Build Requirements:**

- Code must compile without errors
- Code must pass ESLint checks without errors or warnings
- Code must follow Prettier formatting conventions

### .NET Extension

For changes to the DataGridUtils extension (in `extension/DataGridUtils/Source/NET/`):

1. Open `DataGridUtils.sln` in Visual Studio
2. Build the project targeting .NET Framework 4.7.2
3. Test with OutSystems Integration Studio

## Code Standards

### TypeScript

Enforced by `.eslintrc.json` and `.prettierrc.json`:

**Naming Conventions:**

- Exported functions: `StrictPascalCase`
- Classes: `StrictPascalCase`
- Interfaces: `IStrictPascalCase` or `UPPER_CASE` (prefix with `I`)
- Private class properties: `_strictCamelCase` (leading underscore required)
- Public/protected properties: `strictCamelCase` (no underscore)
- Private methods: `_strictCamelCase` (leading underscore required)
- Public/protected methods: `strictCamelCase` (no underscore)

**Member Ordering:**

- Classes: signature, private/protected/public fields, constructor, private/protected/public methods, abstract methods
- Within each category: alphabetically sorted

**Code Style:**

- Use tabs for indentation (width 4)
- Single quotes for strings
- Semicolons required
- Maximum line width: 120 characters
- Trailing commas in ES5 style
- Use strict equality (`===`)

**Documentation:**

- Document all public APIs using JSDoc comments
- Use the "Document This" extension: type `/**` above a function/class
- Explain the "why" of complex logic, not just the "what"

### General Guidelines

- Avoid unnecessary commits; keep git history clean
- Keep branches updated with `dev` when possible
- Document your code thoroughly
- Avoid changes outside the scope of your issue
- Do not expose sensitive information (server URLs, credentials, etc.)

## Pull Request Process

1. Ensure your branch is up to date with `dev`
2. Run `npm run build` and fix all errors/warnings
3. Test your changes locally
4. Create a PR from your branch to `dev`
5. Fill out the pull request template completely
6. Address review feedback from team members
7. Once approved by a team member, the PR will be merged

## Testing

The Data Grid has a separate test automation repository: [outsystems-datagrid-tests](https://github.com/OutSystems/outsystems-datagrid-tests)

This repository contains browser-based integration tests using WebdriverIO and Cucumber. Contributors working on the main repository should be aware this test repository exists for QA validation.

For internal contributors, testing setup information is available via the `#rd-uicomponents-contributors` Slack channel.

## Getting Help

- **Forge Discussions:** [Component support page](https://www.outsystems.com/forge/component-discussions/9764/Data+Grid+Reactive)
- **Internal Slack:** `#rd-uicomponents-contributors` (OutSystems employees)
- **Trusted Committers:** Available on Slack business days 2PM-3PM PT
- **Support Email:** [rd.uicomponents.team@outsystems.com](mailto:rd.uicomponents.team@outsystems.com)

## Useful Resources

- [Forge component - O11:](https://www.outsystems.com/forge/component-overview/9764/outsystems-data-grid-o11)
- [Forge component - ODC:](https://www.outsystems.com/forge/component-overview/15929/outsystems-data-grid-odc)
- [Sample Application](https://www.outsystems.com/forge/component-overview/9765/data-grid-sample-reactive)
- [Living Documentation](https://outsystemsui.outsystems.com/OutSystemsDataGridSample/)
- [Tutorial: Data Grid in less than 4 minutes](https://www.youtube.com/watch?v=OFXOPrkRlrI)

## License

This repository belongs to OutSystems. All rights reserved. See [LICENSE](../LICENSE) for details.
