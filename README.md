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
