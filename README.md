# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
# folk-projects

A prototype for a **Projects tab** inside [Folk](https://getfolk.app), built to pitch the Nozomio devs. Live at [ryan-67.github.io/folk-projects](https://ryan-67.github.io/folk-projects/).

## Why it exists

Folk is a personal AI agent that lives in your iMessage and other chat surfaces. It already has errands, scheduled tasks, and notes, but it lacks a persistent, glanceable view of everything you're working on. This prototype explores what a first-class **projects** surface could look like: a dark, calm dashboard where each long-term goal gets its own space with todos, notes, errands, chat history, and links.

The idea came from wanting a single place that feels like the rest of Folk (same dark palette, same glassy aesthetic, same calm density) but dedicated to work-in-progress. Not a separate app. Not a Tauri wrapper. Just a web-native tab that slots into the existing Folk dashboard, reusing the same design language and local-first patterns.

We abandoned the original Tauri/Rust path early because shipping a second desktop codebase would fragment the product. A static web dashboard surface is a much easier adoption path for the core team and keeps the user in the same browser context they already open for errands and settings.

## Scope

- **Project cards** - At-a-glance view of every active project with completion badges and metadata
- **Workspace view** - Deep-dive into a single project with tabs for overview, todos, notes, chat, errands, and links
- **Todo lists** - Checkable tasks with add/remove/toggle
- **Notes editor** - Textarea with a `/` slash-command palette for quick formatting (headings, checkboxes, timestamps)
- **Chat history** - Simulated timeline of Folk interactions tied to the project
- **Errands sidebar** - Related tasks pulled from the Folk errands surface
- **Search modal** - Command-K style fuzzy search across project names, notes content, and todo text
- **Command palette** - Quick switcher between projects and app sections
- **Local-first data** - Everything persists to localStorage with versioned schema migrations

## Architecture

```
folk-projects/
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx      # Project list + count badge
│   │   ├── Workspace.tsx    # Tabbed project workspace
│   │   ├── CommandPalette.tsx    # Ctrl+K quick switcher
│   │   ├── SearchModal.tsx       # Command-K global search
│   │   └── ...
│   ├── hooks/
│   │   └── useProjectStore.ts    # localStorage-backed store with versioning
│   ├── data/
│   │   └── projects.json         # Seed/demo data (5 generic templates)
│   └── types.ts
├── public/
├── dist/                    # Static build output (deployed)
├── vite.config.ts           # Vite + React, base: '/folk-projects/'
└── .github/workflows/
    └── deploy.yml           # GitHub Actions -> GitHub Pages
```

### Tech choices

- **Vite + React** - Fast dev, trivial static export, no backend needed
- **GitHub Pages** - Free, fast, auto-deployed on every push to main
- **localStorage** - Zero-backend persistence; Folk already trusts the browser for errands and settings
- **Pure CSS** - Hand-rolled dark theme using the same design tokens as getfolk.app

### Design tokens

We matched the Folk dashboard palette exactly:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-paper` | `10 10 10` | Page background |
| `--color-ink` | `237 237 235` | Primary text |
| `--color-cream` | `22 22 20` | Card surfaces |
| `--color-sage` | `149 166 132` | Accents, active states |
| `--color-glass-tint` | `32 32 30` | Modal backdrops |

Opacity scale is identical to Folk: `ink-1` at 95% down to `ink-soft-4` at 7%.

## How it was built

1. **Scaffold** - Started as a Vite + React SPA with a dark theme reset
2. **Data model** - Designed a `Project` type with tabs for todos, notes, links, chat, and errands. Seeded 5 generic demo projects to show the UI without needing real Folk backend data
3. **Versioned store** - `useProjectStore` writes to localStorage and bumps a `folk_projects_version` key to invalidate stale caches. Early versions hit a bug where the master project list (`folk_projects_list`) wasn't cleared on migration - fixed by explicitly removing it before reseeding
4. **Slash menu** - Added a `/` command palette inside the notes textarea with arrow-key navigation, enter/tab execution, and escape dismissal
5. **Search** - Wired the command+K modal to search across project titles, notes body, and todo text
6. **Count badge** - Small UX touches like a `(5)` badge next to the projects heading so the sidebar doesn't feel static
7. **CI/CD** - Added a GitHub Actions workflow that builds and deploys to GitHub Pages on every push. The only gotcha was Vite's default `base: '/'` breaking asset paths under `/<repo-name>/`, so we hardcoded `base: '/folk-projects/'`

## Local dev

```bash
npm install
npm run dev
```

To build:

```bash
npm run build
```

## Deployment

Pushes to `main` automatically trigger the deploy workflow. The site is served from `https://ryan-67.github.io/folk-projects/`.

## Next steps / open questions

- Integration with real Folk backend (projects API, errands API, chat history stream)
- Real-time sync between Folk surfaces (iMessage, Telegram, web) and the projects tab
- Drag-and-drop project reordering
- Due dates / calendar integration on todos and errands
- Shareable project links for collaboration

---

Built as a pitch. If you're on the Nozomio team and reading this, the TL;DR is: Folk already has the pieces (errands, chat, notes, dark glassy UI). A projects dashboard is the connective tissue that turns those pieces into a system. This is what it could look like.
# folk-projects

A prototype for a **Projects tab** inside [Folk](https://getfolk.app), built to pitch the Nozomio devs. Live at [ryan-67.github.io/folk-projects](https://ryan-67.github.io/folk-projects/).

This repo started from a Vite + React + TypeScript scaffold. We briefly considered Tauri for a desktop wrapper but abandoned it immediately. A static web dashboard is a much easier adoption path for the Folk team and keeps the user in the same browser context they already open for errands and settings. No Rust. No Tauri. No desktop shell.

## Why it exists

Folk is a personal AI agent that lives in your iMessage and other chat surfaces. It already has errands, scheduled tasks, and notes, but it lacks a persistent, glanceable view of everything you're working on. This prototype explores what a first-class **projects** surface could look like: a dark, calm dashboard where each long-term goal gets its own space with todos, notes, errands, chat history, and links.

The idea came from wanting a single place that feels like the rest of Folk (same dark palette, same glassy aesthetic, same calm density) but dedicated to work-in-progress. Not a separate app. Just a web-native tab that slots into the existing Folk dashboard, reusing the same design language and local-first patterns.

## Scope

- **Project cards** - At-a-glance view of every active project with completion badges and metadata
- **Workspace view** - Deep-dive into a single project with tabs for overview, todos, notes, chat, errands, and links
- **Todo lists** - Checkable tasks with add/remove/toggle
- **Notes editor** - Textarea with a `/` slash-command palette for quick formatting (headings, checkboxes, timestamps)
- **Chat history** - Simulated timeline of Folk interactions tied to the project
- **Errands sidebar** - Related tasks pulled from the Folk errands surface
- **Search modal** - Command-K style fuzzy search across project names, notes content, and todo text
- **Command palette** - Quick switcher between projects and app sections
- **Local-first data** - Everything persists to localStorage with versioned schema migrations

## Architecture

```
folk-projects/
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx      # Project list + count badge
│   │   ├── Workspace.tsx    # Tabbed project workspace
│   │   ├── CommandPalette.tsx    # Ctrl+K quick switcher
│   │   ├── SearchModal.tsx       # Command-K global search
│   │   └── ...
│   ├── hooks/
│   │   └── useProjectStore.ts    # localStorage-backed store with versioning
│   ├── data/
│   │   └── projects.json         # Seed/demo data (5 generic templates)
│   └── types.ts
├── public/
├── dist/                    # Static build output (deployed)
├── vite.config.ts           # Vite + React, base: '/folk-projects/'
└── .github/workflows/
    └── deploy.yml           # GitHub Actions -> GitHub Pages
```

### Tech choices

- **Vite + React + TypeScript** - Fast dev, trivial static export, no backend needed
- **GitHub Pages** - Free, fast, auto-deployed on every push to main
- **localStorage** - Zero-backend persistence; Folk already trusts the browser for errands and settings
- **Pure CSS** - Hand-rolled dark theme using the same design tokens as getfolk.app

### Design tokens

We matched the Folk dashboard palette exactly:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-paper` | `10 10 10` | Page background |
| `--color-ink` | `237 237 235` | Primary text |
| `--color-cream` | `22 22 20` | Card surfaces |
| `--color-sage` | `149 166 132` | Accents, active states |
| `--color-glass-tint` | `32 32 30` | Modal backdrops |

Opacity scale is identical to Folk: `ink-1` at 95% down to `ink-soft-4` at 7%.

## How it was built

1. **Scaffold** - Started as a Vite + React SPA with a dark theme reset
2. **Data model** - Designed a `Project` type with tabs for todos, notes, links, chat, and errands. Seeded 5 generic demo projects to show the UI without needing real Folk backend data
3. **Versioned store** - `useProjectStore` writes to localStorage and bumps a `folk_projects_version` key to invalidate stale caches. Early versions hit a bug where the master project list (`folk_projects_list`) wasn't cleared on migration - fixed by explicitly removing it before reseeding
4. **Slash menu** - Added a `/` command palette inside the notes textarea with arrow-key navigation, enter/tab execution, and escape dismissal
5. **Search** - Wired the command+K modal to search across project titles, notes body, and todo text
6. **Count badge** - Small UX touches like a `(5)` badge next to the projects heading so the sidebar doesn't feel static
7. **CI/CD** - Added a GitHub Actions workflow that builds and deploys to GitHub Pages on every push. The only gotcha was Vite's default `base: '/'` breaking asset paths under `/<repo-name>/`, so we hardcoded `base: '/folk-projects/'`

## Local dev

```bash
npm install
npm run dev
```

To build:

```bash
npm run build
```

## Deployment

Pushes to `main` automatically trigger the deploy workflow. The site is served from `https://ryan-67.github.io/folk-projects/`.

## Next steps / open questions

- Integration with real Folk backend (projects API, errands API, chat history stream)
- Real-time sync between Folk surfaces (iMessage, Telegram, web) and the projects tab
- Drag-and-drop project reordering
- Due dates / calendar integration on todos and errands
- Shareable project links for collaboration

---

Built as a pitch. If you're on the Nozomio team and reading this, the TL;DR is: Folk already has the pieces (errands, chat, notes, dark glassy UI). A projects dashboard is the connective tissue that turns those pieces into a system. This is what it could look like.
# folk-projects

Live at [ryan-67.github.io/folk-projects](https://ryan-67.github.io/folk-projects/).

## Why this exists

Folk is a personal AI agent that lives in your iMessage, Telegram, and other chat surfaces. It already handles errands, scheduling, search, and persistent memory, but one piece is missing: a dedicated surface for long-running work.

When you are working on a marketing campaign, a product launch, or a research paper, your related tasks, notes, links, and chat history are scattered across different Folk tabs and contexts. There is no single place to see the state of everything you are actively pushing forward.

This prototype proposes a **Projects** tab for the Folk dashboard: a persistent, glanceable workspace where every long-term goal gets its own home. Each project collects its todos, notes, errands, relevant links, and even a chat history timeline into one calm, dark surface that feels native to the rest of Folk.

## Scope

- **Project cards** - At-a-glance grid showing every active project with completion badges and metadata
- **Workspace view** - Deep-dive into a single project with tabs for overview, todos, notes, chat history, errands, and links
- **Todo lists** - Checkable tasks with add, remove, and toggle states
- **Notes editor** - Freeform textarea with a `/` slash-command palette for inserting headings, checkboxes, dates, and timestamps
- **Chat history** - Simulated timeline of Folk agent interactions tied to the project context
- **Errands sidebar** - Related errands surfaced from the Folk errands system
- **Search modal** - Command-K style fuzzy search across project names, notes content, and todo text
- **Command palette** - Quick switcher for jumping between projects and app sections
- **Local-first data** - Seed data and UI state persisted to localStorage with versioned schema migrations

## Architecture

```
folk-projects/
├── src/
│   ├── components/          # React components
│   │   ├── Sidebar.tsx      # Project list + count badge
│   │   ├── Workspace.tsx    # Tabbed project workspace
│   │   ├── CommandPalette.tsx    # Ctrl+K quick switcher
│   │   ├── SearchModal.tsx       # Command-K global search
│   │   └── ...
│   ├── hooks/
│   │   └── useProjectStore.ts    # localStorage-backed store with versioning
│   ├── data/
│   │   └── projects.json         # Seed/demo data (5 generic templates)
│   └── types.ts
├── public/
├── dist/                    # Static build output (deployed)
├── vite.config.ts           # Vite + React, base: '/folk-projects/'
└── .github/workflows/
    └── deploy.yml           # GitHub Actions -> GitHub Pages
```

### Tech choices

- **Vite + React + TypeScript** - Fast development, trivial static export, no backend needed for a demo
- **GitHub Pages** - Free hosting, auto-deployed on every push to main
- **localStorage** - Demonstrates zero-backend persistence; a real implementation would replace this with a proper storage layer
- **Pure CSS** - Hand-rolled dark theme matching the design tokens of the existing Folk dashboard

### Design tokens

We matched the Folk dashboard palette exactly:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-paper` | `10 10 10` | Page background |
| `--color-ink` | `237 237 235` | Primary text |
| `--color-cream` | `22 22 20` | Card surfaces |
| `--color-sage` | `149 166 132` | Accents, active states |
| `--color-glass-tint` | `32 32 30` | Modal backdrops |

Opacity scale follows the same convention as Folk: `ink-1` at 95% opacity down to `ink-soft-4` at 7%.

## How it was built

1. **Scaffold** - Started as a Vite + React SPA with a dark theme reset
2. **Data model** - Designed a `Project` type with tabs for todos, notes, links, chat, and errands. Seeded 5 generic demo projects to show the UI without needing a real backend
3. **Versioned store** - `useProjectStore` writes to localStorage and bumps a `folk_projects_version` key to invalidate stale caches. Early versions hit a bug where the master project list was not cleared on migration; this was fixed by explicitly removing the cached list before reseeding
4. **Slash menu** - Added a `/` command palette inside the notes textarea with arrow-key navigation, enter/tab execution, and escape dismissal
5. **Search** - Wired the command+K modal to search across project titles, notes body, and todo text
6. **Count badge** - Added a project count badge next to the heading so the sidebar does not feel static
7. **CI/CD** - Configured a GitHub Actions workflow that builds and deploys to GitHub Pages on every push

## A note to the Folk / Nozomio team

Folk already has the primitives: errands, chat, notes, a gorgeous dark UI, and a calm density that feels productive without being noisy. This prototype shows how those primitives can be composed into a Projects surface that turns disjointed tasks into coherent, trackable work.

The pitch is simple. Folk users are already trusting the agent with their daily coordination. Giving them a persistent project view means the agent can operate with richer context. Errands become milestones. Chat history becomes project context. Notes become living documents. Everything connects back to a single source of truth instead of floating in isolated tabs.

This is not a feature request from nowhere. It is the connective tissue that makes the rest of Folk feel like a system rather than a collection of tools.

## Prototype disclaimer

This is a functional UI prototype built for demonstration and pitching purposes. It is not production software.

A full implementation maintained by the Folk / Nozomio team would be architected differently. It would likely include:

- **Proper storage layer** - IndexedDB, SQLite, or a backend sync service instead of localStorage
- **Real-time sync** - Multithreading and WebSocket / server-sent event streams to keep project state in sync across iMessage, Telegram, and web surfaces
- **Backend integration** - Native integration with the existing Folk errands API, chat history stream, and memory graph rather than simulated seed data
- **Authentication and permissions** - User identity, project sharing, and role-based access for collaborative workspaces
- **Offline support** - Service workers and conflict resolution for changes made while disconnected
- **Accessibility and internationalization** - Full a11y audit, keyboard navigation refinement, and i18n support
- **Testing and observability** - Unit tests, integration tests, error boundaries, and instrumentation

In other words, this repo shows the interaction model and visual language. The engineering underneath would be rebuilt to match the standards and infrastructure of the Folk platform.

## Local dev

```bash
npm install
npm run dev
```

To build for deployment:

```bash
npm run build
```

## Deployment

Pushes to `main` automatically trigger the GitHub Actions deploy workflow. The site is served from `https://ryan-67.github.io/folk-projects/`.
