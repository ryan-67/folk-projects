# folk-projects

Live at [ryan-67.github.io/folk-projects](https://ryan-67.github.io/folk-projects/).

## Why this exists

Folk ([getfolk.app](https://www.getfolk.app/)) by Nozomio Labs ([nozomio.com](https://www.nozomio.com/)) is a personal AI agent that lives in iMessage, Telegram, and other chat surfaces. It already handles errands, scheduling, search, and persistent memory. A glance at the Folk dashboard reveals multiple active conversations running in parallel, and the dashboard even surfaces an Automations view under the "on a schedule" tab where every scheduled task is listed and editable.

That automation view is useful for visibility, but editing still collapses back into the same bottleneck. Clicking into any automation and hitting edit pre-fills a message in iMessage (or Telegram) that says "folk, edit this automation." The management surface exists, yet the actual interaction, reasoning, and context all happen inside one or two chat threads.

When you are simultaneously managing a product launch, a creative campaign, a coding project, and a job search automation system, every context switch forces you to reload state into the same conversation. Notes, links, and task history from one initiative interleave with messages from another. The agent retains fragments in memory, but the chat surface offers no persistent, glanceable workspace per initiative. Everything competes for attention in the same stream.

This prototype proposes a **Projects** tab for the Folk dashboard: a persistent, glanceable workspace where every long-term goal gets its own home. Each project collects its todos, notes, links, errands, and even a chat history timeline into one calm, dark surface native to Folk. Automations stay great for recurring, atomic tasks. Projects handle the complex, multi-step initiatives that need dedicated context and state.

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

Folk already has the primitives: errands, chat, notes, a gorgeous dark UI, automations, and multi-conversation context. Those pieces are real and useful. What they lack is a persistent surface that separates concurrent initiatives from one another so they stop competing for the same chat bandwidth.

The Automations page proves users want visibility into what Folk is doing. But clicking edit and being dropped back into iMessage proves the interaction model has not evolved past one or two chat threads. Every project still gets flattened into the same stream. Context switches are expensive because the user (and the agent) must reload state every time the topic changes.

This prototype shows how Folk's primitives can be composed into a dedicated Projects workspace. Each project becomes a durable home where context survives beyond the transient chat thread. Errands become milestones. Chat history becomes project context. Notes become living documents. Links stop getting lost. Automations keep doing what they do best: recurring, atomic tasks. Projects handle the long-running, complex, context-heavy initiatives.

The pitch is simple: Folk users already trust the agent with daily coordination. Giving them persistent project homes means the agent can operate with richer, longer-lived context without forcing every interaction through the same iMessage thread. Chat stays lightweight and conversational. Projects carry the heavy, trackable state.

## Prototype disclaimer

This is a functional UI prototype built for demonstration and pitching purposes. It is not production software.

A full implementation maintained by the Folk / Nozomio team would be architected differently. It would likely include:

- **Proper storage layer** - IndexedDB, SQLite, or a backend sync service instead of localStorage
- **Real-time sync** - WebSocket / server-sent event streams to keep project state in sync across iMessage, Telegram, and web surfaces
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
