# Expense Tracker (Tauri + Vue 3)

Desktop-first expense tracker built with Vue 3, TypeScript, Vite, and Tauri 2. It tracks spendings with categories, tags, payers, and stores, offers a dashboard with summaries, and persists data locally via the Tauri backend.

## Features
- Spendings dashboard with charts and totals (paid vs. unpaid)
- Spendings list with add/edit/delete, tags, categories, subcategories, payer, store, and attachments
- Pending-changes detection with undo/restore helpers before saving
- Settings screen with locale switch (cs/en) and configurable defaults
- Local persistence via Tauri JSON store; browser fallback uses bundled sample data
- UI built on Naive UI, Vue Router, Pinia, and vue-i18n

## Prerequisites
- Node.js (v18+) and pnpm
- Rust toolchain (stable) for Tauri 2
- On Windows: Visual Studio C++ build tools (for Tauri)

## Quickstart
```bash
pnpm install
# Desktop app (Tauri + Vite)
pnpm tauri dev
# Web-only dev server
pnpm dev
```

## Build
- Web build: `pnpm build`
- Desktop bundle: `pnpm tauri build`

## Project Structure
- src/ — Vue app (views, components, composables, stores, utils)
- src-tauri/ — Rust backend (Tauri commands, JSON store, config)
- public/ — static assets

## Localization
- Translations live in src/locales/cs.json and src/locales/en.json; default is configurable in settings.

## Coding Notes
- Data access goes through Tauri commands: `load_data`, `save_data`, `load_settings`, `save_settings`.
- Dev browser fallback loads sample data from src-tauri/expenseTrackerDb.json when Tauri invoke is unavailable.

## Recommended Tooling
- VS Code with Volar, Tauri, rust-analyzer extensions
