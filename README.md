# Expense Tracker

A personal, desktop-first expense tracking application built with **Vue 3**, **TypeScript**, **Vite**, and **Tauri 2**. Record and categorize every purchase, attach documents, visualize spending trends with interactive charts — all data stored privately on your own machine. No cloud, no accounts, no subscriptions.

---

## Table of Contents

- [Overview](#overview)
- [Developer Guide](#developer-guide)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
  - [Building for Production](#building-for-production)
  - [Project Structure](#project-structure)
  - [Architecture](#architecture)
  - [Core Packages](#core-packages)
  - [Frontend–Backend Communication](#frontendbackend-communication)
  - [Database & Persistence](#database--persistence)
  - [Path Aliases](#path-aliases)
  - [Localization](#localization)
  - [Code Style & Linting](#code-style--linting)
- [User Guide](#user-guide)
  - [Header & Navigation](#header--navigation)
  - [Category View](#category-view)
  - [Adding a Purchase](#adding-a-purchase)
  - [Spending Attributes Reference](#spending-attributes-reference)
  - [Editing, Deleting & Copying](#editing-deleting--copying)
  - [Pending Changes & Save Workflow](#pending-changes--save-workflow)
  - [Table Views](#table-views)
  - [Table Grouping (Subtables)](#table-grouping-subtables)
  - [Column Filtering & Sorting](#column-filtering--sorting)
  - [Column Visibility](#column-visibility)
  - [Bulk Edit (Rename / Delete)](#bulk-edit-rename--delete)
  - [Dashboard & Statistics](#dashboard--statistics)
  - [Settings](#settings)
  - [Documents & File Attachments](#documents--file-attachments)
  - [Automatic Backups](#automatic-backups)

---

## Overview

> ![App overview screenshot](docs/screenshots/overview.png)
> *Screenshot placeholder — full app overview with dashboard and spending table*

| Feature | Description |
|---|---|
| Purchase recording | Category, subcategory, type, name, price, qty, payer, store, tags, and more |
| Category view | Filter the entire app to a single category with one click |
| Dashboard | Four analytics cards — Overview & Categories, Stores & Tags, Statistics, Payments |
| Interactive charts | Doughnut, Bar, and Line charts (Chart.js); switchable between chart types |
| Table views | All-in-one, By Categories/Subcategories, By Stores, By Tags |
| Grouping | Visual subtables grouping purchases by their "Group" field |
| Column filters | Per-column text/select filter applied live across any table view |
| Bulk operations | Rename or delete all items sharing a category, subcategory, store, or tag |
| Document attachments | Drag-and-drop file attachments stored alongside the database |
| Localization | English and Czech, switchable at runtime |
| Auto-backup | Timestamped backup created every time the app closes |

---

## Developer Guide

### Prerequisites

| Dependency | Minimum version | Notes |
|---|---|---|
| Node.js | 18 LTS | Required for Vite and pnpm |
| pnpm | 8+ | Package manager (no npm/yarn) |
| Rust (stable toolchain) | 1.77+ | Required by Tauri 2 |
| Visual Studio C++ build tools | 2019+ | **Windows only** |
| WebView2 runtime | latest | **Windows only** — ships with Win 11, downloadable for Win 10 |
| Xcode CLI tools | latest | **macOS only** |

Install Rust via [rustup.rs](https://rustup.rs). The Tauri CLI is bundled as a dev dependency so no global install is needed.

### Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd ExpenseTracker

pnpm install

# Full desktop app (Tauri wraps the Vite dev server)
pnpm tauri dev

# Browser-only dev server (no Tauri; data loaded from src-tauri/expenseTrackerDb.json)
pnpm dev
```

Tauri dev mode starts Vite first (`beforeDevCommand`) and opens a native window at `http://localhost:1420`. In dev mode, data is stored in a `Development/` subfolder of the OS app-data directory, isolated from any production data.

### Development Workflow

| Command | Purpose |
|---|---|
| `pnpm tauri dev` | Launch full desktop app with HMR |
| `pnpm dev` | Vite-only browser dev (no Tauri commands available) |
| `pnpm build` | TypeScript check + Vite production build |
| `pnpm tauri build` | Full production build + native installer/bundle |
| `pnpm lint` | ESLint with auto-fix |
| `pnpm lint-check` | ESLint read-only (CI-safe) |
| `pnpm format` | Prettier write |
| `pnpm format-check` | Prettier read-only (CI-safe) |

Vue/TypeScript changes are picked up by HMR instantly. Rust changes trigger Cargo recompilation and the window reloads when done.

### Building for Production

```bash
pnpm tauri build
```

Output bundles land in `src-tauri/target/release/bundle/`. With `"targets": "all"` in `tauri.conf.json`, this produces MSI + NSIS on Windows, `.dmg` on macOS, and `.deb`/`.AppImage` on Linux.

### Project Structure

```
ExpenseTracker/
├── src/                             # Vue 3 application
│   ├── main.ts                      # Entry point — Vue, Pinia, i18n, Router setup
│   ├── App.vue                      # Root component
│   ├── router/index.ts              # Vue Router routes
│   ├── stores/
│   │   ├── spendingsStore.ts        # Central Pinia store — all spending data & derived state
│   │   └── settingsStore.ts         # Settings Pinia store
│   ├── composables/
│   │   ├── spending/                # Form data, validation, options, dialog actions
│   │   ├── table/                   # Filter, sort, grouping for data tables
│   │   ├── useCategoryStats.ts      # Category-level aggregation + monthly average
│   │   ├── useEntityStats.ts        # Generic entity stats (store, tag, subcategory…)
│   │   ├── useSummaryChart.ts       # Chart.js dataset builder
│   │   ├── useSpecialSpendings.ts   # Free / unpaid spendings logic
│   │   ├── useViewSort.ts           # ABC / price sorting of table view sections
│   │   ├── useItemsLimit.ts         # Show-more / show-less list truncation
│   │   ├── useFileUpload.ts         # Document upload/delete via Tauri FS plugin
│   │   ├── useDocumentsDragDrop.ts  # Drag-and-drop file handling
│   │   └── useOnAppCloseActions.ts  # Auto-backup + unsaved-changes dialog on close
│   ├── components/
│   │   ├── header/                  # Header, category selector, pending-changes indicator
│   │   ├── home/
│   │   │   ├── spendingsDashboard/  # Dashboard, carousel, summary cards, charts
│   │   │   └── spendingsList/       # Table views, data table, row/group components
│   │   ├── spendingForm/            # New/edit spending drawer + field components
│   │   ├── settings/                # Settings drawer
│   │   └── shared/                  # Reusable UI (Button, Tooltip, Selects…)
│   ├── views/                       # Route-level pages (Home, SpendingForm, Settings, BulkEdit)
│   ├── types/                       # TypeScript interfaces (Spending, Settings, …)
│   ├── constants/                   # App-wide constants (currencies, languages, defaults…)
│   ├── utils/                       # Pure helpers (factory, storage, format, table utils)
│   └── locales/                     # i18n JSON files (en.json, cs.json)
│
├── src-tauri/                       # Rust / Tauri backend
│   ├── src/
│   │   ├── main.rs                  # Tauri entry — registers plugins and commands
│   │   ├── app_paths.rs             # Resolves OS app-data dir (dev vs. prod)
│   │   ├── database.rs              # JsonStore — read / write / backup JSON files
│   │   └── commands/mod.rs          # All Tauri IPC commands
│   ├── tauri.conf.json              # Window config, CSP, asset protocol, bundle targets
│   ├── Cargo.toml                   # Rust dependencies
│   └── expenseTrackerDb.json        # Sample data (browser dev fallback only)
│
├── vite.config.ts                   # Vite + Tailwind; path aliases; dev server
├── tsconfig.json
├── eslint.config.cjs
└── package.json
```

### Architecture

```
┌─────────────────────────────────────────┐
│  Vue 3 SPA (src/)                       │
│  ┌──────────────┐  ┌──────────────────┐ │
│  │   Views /    │  │   Composables    │ │
│  │  Components  │◄─┤  (business logic)│ │
│  └──────┬───────┘  └────────┬─────────┘ │
│         └─────────┬─────────┘           │
│  ┌───────────────▼──────────────────┐   │
│  │  Pinia Stores                    │   │
│  │  spendingsStore │ settingsStore  │   │
│  └───────────────┬──────────────────┘   │
│                  │ invoke()             │
├──────────────────┼──────────────────────┤
│  Tauri IPC bridge                       │
├──────────────────┼──────────────────────┤
│  Rust Backend (src-tauri/src/)          │
│  ┌───────────────▼──────────────────┐   │
│  │  Tauri Commands                  │   │
│  │  load_data / save_data           │   │
│  │  load_settings / save_settings   │   │
│  │  save_data_backup                │   │
│  └───────────────┬──────────────────┘   │
│  ┌───────────────▼──────────────────┐   │
│  │  JsonStore (JSON read/write)     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Design principles:**
- **Optimistic in-memory mutation** — changes are applied to Pinia immediately; persisted only on explicit *Save*. Enables clean *Discard*.
- **Computed derivations** — categories, subcategories, stores, tags, and payers are all computed from the raw spendings array; never stored separately.
- **Composable-first** — business logic lives in `use*` composables; components are thin templates.
- **Single source of truth** — `spendingsStore` is authoritative; all views and dashboards derive from it reactively.

### Core Packages

| Package | Role |
|---|---|
| `vue` 3.5 | UI framework |
| `tauri` 2 | Native shell — IPC, window management, OS integration |
| `pinia` 3 | Global reactive state |
| `vue-router` 4 | Client-side routing (history mode) |
| `vue-i18n` 11 | Internationalization |
| `naive-ui` 2 | Component library (forms, drawers, selects, dialogs…) |
| `chart.js` 4 + `vue-chartjs` 5 | Doughnut, Bar, and Line charts |
| `tailwindcss` 4 | Utility-first CSS |
| `@vicons/ionicons5` | Icon set |
| `@tauri-apps/plugin-fs` | File-system access (document attachments) |
| `@tauri-apps/plugin-dialog` | Native OS confirmation dialogs |
| `@tauri-apps/plugin-opener` | Open URLs/files in the OS default app |
| `vite` 7 + `typescript` 5.9 | Build tooling |
| `eslint` 10 + `prettier` 3 | Linting and formatting |

### Frontend–Backend Communication

All data I/O crosses the Tauri IPC bridge via `invoke()` from `@tauri-apps/api/core`:

| Command | Description |
|---|---|
| `load_data` | Read `expenseTrackerDb.json` → raw JSON string |
| `save_data` | Write serialized JSON → `expenseTrackerDb.json` |
| `save_data_backup` | Copy database to `Backups/` with timestamp |
| `load_settings` | Read `settings.json` |
| `save_settings` | Write `settings.json` |
| `get_app_data_dir` | Return the resolved OS app-data path (debug helper) |

**Browser dev fallback:** When running `pnpm dev` without Tauri, `invoke()` fails and `spendingStorage.ts` falls back to `fetch()`-ing `src-tauri/expenseTrackerDb.json` so the UI stays functional for frontend-only work.

### Database & Persistence

All data lives in two flat JSON files in the OS app-data directory:

| File | Content |
|---|---|
| `expenseTrackerDb.json` | Array of all `Spending` objects |
| `settings.json` | Single `Settings` object |

**Data directory:**

| OS | Path |
|---|---|
| Windows | `%APPDATA%\com.expenseTracker\` |
| macOS | `~/Library/Application Support/com.expenseTracker/` |
| Linux | `~/.config/com.expenseTracker/` |

Dev mode appends a `Development/` subfolder to isolate test data. Backups go into a `Backups/` subfolder with names like `expenseTrackerDb_2025_06_15_14_30_00.json`.

The `JsonStore` Rust struct (`database.rs`) auto-creates missing files with `{}`, reads/writes with `anyhow` error context, and exposes `load()`, `save()`, and `backup_data_file()`.

### Path Aliases

| Alias | Resolves to |
|---|---|
| `@` | `src/` |
| `@views` | `src/views/` |
| `@components` | `src/components/` |
| `@composables` | `src/composables/` |
| `@utils` | `src/utils/` |
| `@stores` | `src/stores/` |

### Localization

Translations: `src/locales/en.json` and `src/locales/cs.json`. The active locale is persisted in settings; components use `$t('key')` / `useI18n()`. Default is English.

To add a language: create `src/locales/<code>.json` mirroring all keys from `en.json`, then add a `Language` entry to `src/constants/languages.ts`. The Settings dropdown picks it up automatically.

### Code Style & Linting

ESLint flat config (`eslint.config.cjs`) with `eslint-plugin-vue`, `typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-tailwindcss`, and `eslint-plugin-prettier`. Import order is managed by `@trivago/prettier-plugin-sort-imports`. `vue-tsc` runs as part of `pnpm build` for full type coverage.

**Recommended VS Code extensions:** [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar), [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer), [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode), [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

---

## User Guide

The app starts with an empty state. On first run the data files are created automatically — no setup required.

### Header & Navigation

> ![Header screenshot](docs/screenshots/header.png)
> *Screenshot placeholder — header with category bar, total expenses, and pending-changes indicator*

The sticky header contains:

| Element | Function |
|---|---|
| **Add New Purchase** button | Opens the spending form drawer |
| **Total Expenses** | Live sum of all *paid* purchases in the current category scope |
| **Settings** (gear icon) | Opens the settings drawer |
| **Unsaved Changes** indicator | Pulses when uncommitted changes exist; exposes *Save* and *Discard* buttons |
| **Category bar** | Shows the active category; click to open the category selector panel |

### Category View

> ![Category selector panel](docs/screenshots/category-panel.png)
> *Screenshot placeholder — full-screen category selector with stat cards per category*

The category view is the central navigation concept. Selecting a category **filters the entire app** — the table, all dashboard statistics, and every derived list.

- Click the **category bar** to open the selector panel. Each card shows total spent, purchase count, and monthly average.
- Click a card to activate that category; click **All categories** to clear the filter.
- `Escape` or click outside closes the panel without changing the selection.
- The active category can be persisted as the startup default in Settings.

**Effects of selecting a category:**
- The *By Categories* table view switches to *By Subcategories*.
- Dropdown options for subcategories, stores, tags, and payers in the spending form scope to that category.
- All statistics and chart data reflect only that category's purchases.
- Bulk-edit operations gain a scope toggle: *current category only* vs. *across all categories*.

### Adding a Purchase

> ![Spending form](docs/screenshots/spending-form.png)
> *Screenshot placeholder — new purchase drawer with basic fields (left) and additional fields (right)*

Click **Add New Purchase**. A full-height drawer slides in from the right with two column panels — basic fields on the left, optional/additional fields on the right.

Fill required fields, optionally populate additional ones, then click **Create Purchase**. The record is added to the in-memory store immediately. Use **Save Changes** in the header to persist to disk.

### Spending Attributes Reference

#### Required Fields

| Field | Type | Description |
|---|---|---|
| **Category** | Tag-input | Top-level grouping (e.g. "Housing", "Food", "Car"). Type a new name to create one on the fly. |
| **Subcategory** | Tag-input | Second-level grouping within a category (e.g. "Groceries", "Rent"). |
| **Type** | Text | Short descriptor for the kind of item (e.g. "Electronics", "Service"). Free-form. |
| **Name** | Text | Specific item or service name. If a URL is set, this becomes a hyperlink in tables. |
| **Payer** | Tag-input | Who paid. Supports multiple household members or cost centers. |
| **Quantity** | Number ≥ 0 | Units purchased. Defaults to 1. |
| **Unit Price** | Number ≥ 0 | Price per unit in the configured currency. |

`Total Price = Quantity × Unit Price` — computed live in the form; never stored on disk as a separate field.

#### Optional Fields

| Field | Type | Description |
|---|---|---|
| **Creation Date** | Datetime | When the purchase was made. Defaults to now; can be backdated. |
| **Store** | Tag-input | Where purchased (e.g. "Amazon", "IKEA"). Drives store-based analytics. |
| **Group** | Tag-input | Visual grouping key — purchases sharing a group collapse into a subtable row. If tags are empty when a group is set, the group is auto-added as a tag. |
| **Tags** | Multi-select | Free-form cross-cutting labels (e.g. "renovation", "gift", "reimbursable"). |
| **Product Code** | Text | SKU, EAN, barcode, or internal reference. |
| **Dimensions** | Text | Size or spec string (e.g. "120×60cm", "EU 42", "16GB RAM"). |
| **URL** | URL | Product page or order link. Makes the Name a clickable link in tables. |
| **Technical Document** | URL | Link to a manual, datasheet, or specification PDF. |
| **Description** | Textarea | Free-form notes (warranty info, serial number, return policy…). |
| **Documents** | Files | Attached files stored in the `Documents/` folder. See [Documents](#documents--file-attachments). |

#### Status Flags

| Flag | Meaning | Effect on totals |
|---|---|---|
| **Not Yet Paid** (`isToBePaid`) | Ordered but not yet paid — awaiting invoice or delivery. | Excluded from all paid totals and averages. Listed in the *Payments* card as outstanding debt. |
| **Saved / Free** (`isFree`) | Obtained for free — gift, promotion, warranty replacement. Price is recorded for reference. | Excluded from paid totals. Listed in the *Payments* card as money saved. |

> **Rule:** all price aggregations and averages operate only on records where both `isToBePaid = false` and `isFree = false`.

#### Automatic Fields

| Field | Description |
|---|---|
| `id` | UUID v4, generated once at creation. Immutable. |
| `createdAt` | The date/time set in the form — not the system timestamp of when the record was entered. |
| `editedAt` | Updated to `now` each time the edit form is saved. `null` for never-edited records. |

### Editing, Deleting & Copying

**Edit:** right-click a row (or use the action dropdown) → **Edit**. The form opens pre-filled. Saving sets `editedAt` to now.

**Delete:** right-click → **Delete** → confirm in the native dialog. Deleted records move to an in-memory `deletedSpendings` buffer. A *Deleted items* table appears at the bottom of the page while unsaved deletions exist, allowing individual or bulk restore. Once *Save Changes* is clicked the deletions become permanent.

**Copy:** right-click → **Copy** opens the *New Purchase* form pre-filled from the source record, with a fresh `id`, `createdAt` = now, cleared `editedAt`, and no documents. Ideal for recurring purchases.

### Pending Changes & Save Workflow

> ![Pending changes indicator](docs/screenshots/pending-changes.png)
> *Screenshot placeholder — pulsing "Unsaved Changes" bar with Save and Discard buttons*

The app uses an **explicit save model** — nothing touches disk until you choose to save.

- **Save Changes** — writes the full in-memory state to `expenseTrackerDb.json`.
- **Discard Changes** — rolls the store back to the last saved snapshot (including undone deletions). Requires confirmation.
- **Close with unsaved changes** — Tauri intercepts the window close event and shows a native OS warning dialog.

### Table Views

> ![Table views](docs/screenshots/table-views.png)
> *Screenshot placeholder — "By Categories" view with two category tables and active column filter*

Switch views with the tab navigation above the table:

| View | What you see |
|---|---|
| **All in One** | Every purchase in a single flat table. No inter-section grouping. |
| **By Categories** | One collapsible table per category. When a category is active: switches to **By Subcategories** (one table per subcategory). |
| **By Stores** | One collapsible table per store. |
| **By Tags** | One collapsible table per tag. Multi-tag purchases appear in each relevant table. Purchases with no tag appear under *No Tag*. |

Each collapsed section shows its item count and total price in the header row. Views other than *All in One* auto-hide the grouping column (e.g. "Category" in *By Categories*) to reduce noise — it can be re-shown via the column visibility selector.

Clicking a section header in any grouped view (e.g. a category name) opens the [Bulk Edit](#bulk-edit-rename--delete) form for that entity.

Each table has a **footer** showing the filtered item count and total price, and a **toolbar** with active filter/sort badges and a single *Clear* button.

### Table Grouping (Subtables)

Purchases with the same **Group** value are collapsed into an expandable subtable row within whichever table section they appear in:

- The group header shows: name, item count, and total price for the group.
- Click the header to expand/collapse. Groups with a single item render as a plain row.
- The default expand/collapse state is set by the *Subtables opened by default* setting.
- Grouping stacks on top of the active view — a subtable can appear inside a *By Stores* section just as well as inside an *All in One* table.

### Column Filtering & Sorting

**Per-column filters** appear in a filter row below the column headers:

- *Text columns* (Name, Type, Description…) — substring match, case-insensitive.
- *Select columns* (Category, Subcategory, Store, Payer, Tags) — dropdown populated from all unique values in the current data.
- Filters stack: a row must match **all** active filters to be shown.

**In-table column sort:** click any column header to cycle Ascending → Descending → Off. Only one column sorts at a time.

**View-level section sorting** (for grouped views): controls appear to the right of the view tabs:
- **ABC ↑ / ↓** — sort sections alphabetically (Czech locale collation).
- **Price ↑ / ↓** — sort sections by their aggregate total price.

### Column Visibility

The **Hidden Columns** multi-select dropdown (top-right of the table area) shows/hides individual columns. Hidden columns retain their filter state but the filter is inactive while hidden.

| Column | Default | Notes |
|---|---|---|
| Category | Shown | Auto-hidden in *By Categories* view |
| Subcategory | Shown | Auto-hidden in *By Subcategories* view |
| Type | Shown | — |
| Name | Shown | Rendered as hyperlink when URL is present |
| Store | Shown | Auto-hidden in *By Stores* view |
| Payer | Shown | — |
| Created | Shown | Purchase date |
| Price | Shown | `unitPrice × quantity` |
| Tags | Shown | Auto-hidden in *By Tags* view |
| Paid | Shown | Status badge: paid / unpaid / free |

### Bulk Edit (Rename / Delete)

> ![Bulk edit form](docs/screenshots/bulk-edit.png)
> *Screenshot placeholder — bulk edit drawer for renaming a store across all categories*

Bulk edit lets you rename or delete a label across all purchases that carry it in one operation — the correct way to fix a typo in a category name or merge two stores.

**Open:** click any section header in a grouped view (e.g. a store name in *By Stores*).

| Operation | Effect |
|---|---|
| **Rename** | Updates that field on every matching purchase. Live-updates the active view and the default category setting if affected. |
| **Delete (category)** | Deletes all purchases in that category. |
| **Delete (subcategory / store)** | Deletes all purchases with that value (scoped as selected). |
| **Delete (tag)** | Removes the tag from all matching purchases; the purchases themselves are kept. |

**Scope** (subcategories, stores, tags only):
- *Within current category* — applies only inside the active category view.
- *Across all categories* — global. Only available when a category is selected.

Category bulk edit is always global.

### Dashboard & Statistics

> ![Dashboard overview card](docs/screenshots/dashboard-overview.png)
> *Screenshot placeholder — Overview & Categories card with donut chart and category list*

The dashboard sits above the table. Four tabs; default tab is configurable in Settings. All statistics respect the active **category view filter**.

---

#### Card 1 — Overview and Categories

- **Overall summary**: total paid, purchase count, and total item count for the current scope.
- **By category**: total, count, and % of grand total per category. Sortable by price, count, or alphabetically. Chart (Doughnut / Bar / Pie). Up to 8 shown; *Show all* expands.

---

#### Card 2 — Stores and Tags

> ![Stores and Tags card](docs/screenshots/dashboard-stores-tags.png)
> *Screenshot placeholder — Stores and Tags card with store list and visit counts*

- **By store**: total spent, visit count (number of purchases), and average per visit. Sortable by spending / visits / average.
- **By tag**: total and count per tag.
- **By subcategory**: total and count per subcategory.

---

#### Card 3 — Statistics

> ![Statistics card](docs/screenshots/dashboard-statistics.png)
> *Screenshot placeholder — Statistics card showing averages, trends, and recent purchases*

- **Average expenses**: daily / weekly / monthly averages computed from the date span of all paid purchases. Bar chart.
- **Spending trends**: totals per day / week / month (toggle buttons) with a dual-series Line chart — period total and running cumulative.
- **Recent purchases**: last N purchases by date or by price (N adjustable). Full list toggle.
- **Statistics summary**: median, most/least expensive, highest unit price, highest quantity, unique category and store counts.

---

#### Card 4 — Payments

> ![Payments card](docs/screenshots/dashboard-payments.png)
> *Screenshot placeholder — Payments card showing unpaid items and saved/free items*

- **Unpaid**: total paid vs. total outstanding. Lists all *Not Yet Paid* purchases with name, price, and store. Doughnut chart.
- **Saved (Free)**: total paid vs. total obtained for free. Lists all *Free* purchases. Doughnut chart.

---

All charts support toggling between Doughnut / Bar / Pie where applicable. Lists longer than 8 items show a *Show all (N)* / *Show less* toggle.

### Settings

> ![Settings drawer](docs/screenshots/settings.png)
> *Screenshot placeholder — Settings drawer with language, currency, and default view options*

Open via the gear icon. Changes are applied live on save and written to `settings.json`.

| Setting | Default | Description |
|---|---|---|
| **Language** | English | `en` or `cs`. Applied immediately, no restart needed. |
| **Currency Symbol** | `€` | Shown next to all prices. Presets: `€`, `Kč`, `$`, `£`, `¥`. Custom value accepted. |
| **Subtables opened by default** | Off | Whether group subtables start expanded. Overridable per-session. |
| **Default summary card** | Overview and Categories | Which dashboard tab opens on startup. |
| **Default category view** | All categories | Startup category filter. Resets to *All* if the saved category is later deleted. |

**Reset** restores factory defaults without saving. **Save Settings** persists.

### Documents & File Attachments

> ![Document attachments](docs/screenshots/documents.png)
> *Screenshot placeholder — spending form document section with uploaded file cards*

Files can be attached to any purchase — receipts, invoices, photos, warranty cards, etc.

Files are stored in a `Documents/` folder next to `expenseTrackerDb.json`. Each file is renamed to a UUID on upload to avoid collisions; the original name and extension are preserved in the database record.

**Operations:**
- **Drag and drop** onto the drop zone, or click **Add Document** for a file picker.
- **Rename** the display name via the pencil icon on the file card.
- **Download** to the system Downloads folder.
- **Delete** — removes the record and queues the file for deletion from disk on form save.

Files are uploaded to disk when the form is submitted (*Create Purchase* or *Save Changes* on the form). Until then, pending files are held in memory only.

### Automatic Backups

Every time the app window closes, `expenseTrackerDb.json` is copied to the `Backups/` folder:

```
Backups/
  expenseTrackerDb_2025_06_15_14_30_00.json
  expenseTrackerDb_2025_06_16_08_45_22.json
  ...
```

Backups accumulate indefinitely. To restore: close the app, copy the desired backup over `expenseTrackerDb.json` in the app-data directory, then relaunch.

Backups are created on window close only, not during a session.

