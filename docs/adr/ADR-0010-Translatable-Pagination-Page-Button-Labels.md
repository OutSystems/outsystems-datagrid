# ADR-0010: Translatable Pagination Page-Button Labels

## Status

Accepted

## Context

ROU-12414 asked how the Grid pagination can be translated with the OutSystems translation
mechanism (the module's locales and the translation export/import in Service Studio).

The pagination is built from two kinds of text:

-   **Text rendered by the low-code blocks**: the counter words (`" to "`, `" of "`,
    `" records "`) and the `aria-label` of the first/previous/next/last arrow buttons. These are
    expressions and extended properties of the blocks, so the platform already translates them
    and re-renders them when the locale changes.
-   **Text created by the library**: `Pagination.createPageButtons` builds the numbered page
    buttons in JavaScript and hard-coded their `aria-label` as `"page N"` (current page) and
    `"go to page N"` (other pages). Nothing in the module could translate them.

Constraints found while implementing it:

-   Translatable literals in a JavaScript node's **argument expressions** are exported for
    translation. **Input-parameter default values are not.**
-   The `ButtonList` block's `OnInitialize` runs once. A locale change through
    `SetCurrentLocale` re-renders the blocks but does not re-run `OnInitialize`, so a value
    passed only there keeps the locale the block started with.
-   `GridManager.Events.Subscribe(Initialized, …)` fires immediately when the Grid is ready and
    never removes the handler, so re-calling `CreatePageButtons` on every render would pile up
    handlers.
-   Languages put the page number in different places (`"Seite 3"`, `"3 ページ"`, `"第 3 页"`),
    so a translated prefix is not enough.

## Decision Drivers

-   Use the platform's own translation flow: the texts must appear in the translation export and
    be editable by customers like any other module text.
-   Follow a runtime locale change without a page reload.
-   Let each language place the page number where its grammar needs it.
-   Keep the existing `CreatePageButtons` API and its English behaviour unchanged.

## Considered Options

-   **Option 1: Templates with a `{0}` placeholder, sent by a new `SetPageButtonLabels` API
    from the block's `OnRender`**
    -   Pros: the label templates are literals in a JavaScript-node argument, so they are
        exported for translation; `OnRender` runs after every render, including after a locale
        change; `{0}` supports any word order; `CreatePageButtons` keeps its signature.
    -   Cons: one more API; the block calls it on every render (cheap: the buttons are
        only re-created when the labels change).
-   **Option 2: Extra optional label arguments on `CreatePageButtons`, sent from `OnInitialize`**
    -   Pros: smallest API change.
    -   Cons: implemented first and failed the automated tests. With the block inputs defaulting
        to the English text, the non-translatable default always won over the translated
        fallback; and even without defaults, `OnInitialize` does not re-run on a locale change.
        Calling `CreatePageButtons` from `OnRender` instead would accumulate `Initialized`
        handlers.
-   **Option 3: A translation dictionary inside the library, chosen by `document.documentElement.lang`**
    -   Pros: no low-code change.
    -   Cons: a second translation mechanism next to the platform's; customers could not adjust
        the texts through the translation export; every new language needs a library release.

## Decision Outcome

Chosen option: "Option 1", because it is the only option that both uses the platform's
translation flow and follows a runtime locale change.

Library changes:

-   `OutSystems.GridAPI.Pagination.SetPageButtonLabels(gridID, currentPageLabel, goToPageLabel)`:
    applies the labels when the Grid is ready, otherwise once it is initialized.
-   `IPagination.setPageButtonLabels(labels)` / `Pagination.setPageButtonLabels`: empty labels fall
    back to the English defaults (`"page {0}"`, `"go to page {0}"`); the page buttons are
    re-created only when the labels change.
-   A label without `{0}` falls back to the default, so a broken translation cannot produce a
    label without the page number.
-   The `...` ellipsis spans get `aria-hidden="true"`, since they are decorative.

Low-code changes (`ButtonList` block):

-   New optional inputs `CurrentPageLabel` and `GoToPageLabel`, without default values.
-   `OnRender` calls `SetPageButtonLabels` with `If(CurrentPageLabel <> "", CurrentPageLabel, "page {0}")`
    and `If(GoToPageLabel <> "", GoToPageLabel, "go to page {0}")`; these literals are the
    translatable texts. `OnInitialize` keeps calling `CreatePageButtons` with three arguments.

Positive consequences:

-   The page-button labels are translated like the rest of the pagination and follow locale
    changes at runtime.
-   Customers can still pass their own labels through the block inputs.

Negative consequences:

-   The block inputs must stay without default values: a default would bypass the translated
    fallback. Mitigated since the block is private.

## Links

-   ROU-12414
-   End-to-end tests: `outsystems-datagrid-tests`, `tests/datagrid/tests/pagination-translations.feature`

## Date

2026-11-20
