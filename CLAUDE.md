# CLAUDE.md

Guidance for AI assistants (Claude Code et al.) working in this repository.

## Project Overview

**Seirul-lo SSP Hub** — an interactive single-page React app that catalogues the 100 *Situations Simulatrices Préférentielles* (SSP) of Francisco Seirul-lo's football training methodology. Users can browse exercises by specificity level, search the catalogue, view distribution charts, and chat with a Gemini-powered AI assistant for session-planning advice.

The app is **entirely in French** — UI copy, AI prompts, and exercise names. Preserve that when editing UI strings.

The app was bootstrapped from Google AI Studio (see `README.md`).

## Tech Stack

- **React 19.2** (`react`, `react-dom`) with `React.StrictMode`
- **TypeScript 5.8** with `react-jsx` JSX transform, `moduleResolution: bundler`, `noEmit: true`
- **Vite 6** as the dev server and bundler (`@vitejs/plugin-react`)
- **Recharts 3** for the analytics charts
- **@google/genai 1.34** for the Gemini API client
- **Tailwind CSS via CDN** (`https://cdn.tailwindcss.com`) — *not* installed via npm. Theme is configured inline in `index.html`.
- **Browser ESM via `esm.sh` import map** declared in `index.html` for `react`, `react-dom`, `@google/genai`, and `recharts`. The same packages are *also* listed in `package.json` so Vite can resolve them locally.

There is no test framework, no linter config, and no formatter config in this repo.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server on http://0.0.0.0:3000
npm run build      # production build to dist/
npm run preview    # preview the production build
```

`GEMINI_API_KEY` must be set in `.env.local` (see `README.md`). `vite.config.ts` reads it via `loadEnv` and exposes it to the client as both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.

## Repository Layout

```
.
├── index.html              # HTML shell, Tailwind CDN + theme, import map
├── index.tsx               # React entry — mounts <App /> into #root
├── App.tsx                 # Top-level layout: Header, Pyramid, search, charts, tables, AI
├── constants.tsx           # LEVELS metadata and ALL_EXERCISES catalogue (100 items)
├── types.ts                # Exercise, LevelID enum, LevelMetadata
├── components/
│   ├── Header.tsx          # Hero header with gradient title
│   ├── Pyramid.tsx         # 5-level clickable pyramid (scrolls to level)
│   ├── AnalysisCharts.tsx  # Recharts BarChart + AreaChart of distribution & NE curve
│   ├── ExerciseTable.tsx   # Per-level scrollable table
│   └── AssistantAI.tsx     # Floating chat widget calling Gemini
├── services/
│   └── geminiService.ts    # getAIAssistantResponse() — Gemini API wrapper
├── metadata.json           # AI Studio app metadata
├── vite.config.ts          # Vite config + env injection + @ alias
├── tsconfig.json
└── package.json
```

There is no `src/` directory — TS/TSX files live at the repo root and in `components/` and `services/`.

## Domain Model

Defined in `types.ts`:

```ts
interface Exercise {
  r: number;   // Rank (1–100, ordered by descending specificity)
  n: string;   // Name (French)
  ne: number;  // Niveau d'Exigence — specificity score 1.0–10.0
  l: number;   // Level id (1–5)
}

enum LevelID {
  COMPETITION = 1,  // NE 8.0–10.0  (red / bg-danger)
  SPECIAL     = 2,  // NE 6.0–7.9   (orange)
  DIRIGE      = 3,  // NE 4.5–5.9   (yellow)
  GENERAL     = 4,  // NE 3.0–4.4   (cyan / bg-accent)
  GENERIQUE   = 5,  // NE 1.0–2.9   (gray)
}
```

The single source of truth for the catalogue is `constants.tsx` (`ALL_EXERCISES` and `LEVELS`). When adding/correcting exercises, keep them sorted by descending `ne` within their level, keep `r` contiguous (1–100), and keep level boundaries consistent with the `range` strings in `LEVELS`.

The short field names (`r`, `n`, `ne`, `l`) are intentional — they appear inline in `JSON.stringify(ALL_EXERCISES)` inside the Gemini system prompt, so renaming them propagates into the AI context.

## Styling Conventions

- **All styling is Tailwind utility classes** loaded from the CDN. There is no `tailwind.config.js` file — the config lives in a `<script>` block in `index.html`. To add a custom color or font, edit that block.
- **Custom theme colors** (used throughout): `primary` `#0f172a`, `secondary` `#1e293b`, `accent` `#06b6d4`, `highlight` `#8b5cf6`, `danger` `#f43f5e`, `success` `#10b981`, `textMain` `#f8fafc`, `textMuted` `#94a3b8`.
- Each `LevelMetadata.color` is a Tailwind background class (e.g. `bg-danger`, `bg-orange-500`). `ExerciseTable.tsx` and `AnalysisCharts.tsx` derive border/text colors by string-replacing `bg-` — keep new level colors in a form that survives that transformation, or update the consumers.
- Font is `Inter` loaded from Google Fonts in `index.html`.
- The pyramid clip-path utility class `.pyramid-level` is defined in `index.html`'s `<style>` block, not in Tailwind.

## Path Aliases

`vite.config.ts` defines `@` → repo root, mirrored in `tsconfig.json` (`paths: { "@/*": ["./*"] }`). In practice the codebase uses **relative imports** (`./components/Header`, `../constants`) — keep doing that for consistency unless you have a reason to switch.

## Gemini Integration

`services/geminiService.ts`:

- Instantiates `new GoogleGenAI({ apiKey: process.env.API_KEY || '' })` at module load. Both `API_KEY` and `GEMINI_API_KEY` are injected by Vite's `define`.
- `getAIAssistantResponse(userPrompt)` calls `ai.models.generateContent` with model `'gemini-3-flash-preview'`, a French system instruction, `temperature: 0.7`, and returns `response.text`. Errors are caught and a French fallback message is returned.
- The system instruction embeds `JSON.stringify(ALL_EXERCISES.slice(0, 50))` — only the first 50 exercises are sent. If you change the catalogue size or want to expand the context, update this slice.
- `components/AssistantAI.tsx` is a floating chat button (`fixed bottom-6 right-6`) that opens a 500px panel and calls `getAIAssistantResponse` directly — no streaming, no chat history is sent to Gemini (each call is independent).

If you change the Gemini model id, double-check it against the current `@google/genai` SDK — the literal `gemini-3-flash-preview` already in the file may not be a real model id and could be the source of API errors.

## App Shell & Layout

`App.tsx` owns the only piece of state: `searchTerm`. When `searchTerm` is non-empty, the level tables collapse into a single filtered results table; otherwise it renders one `ExerciseTable` per level. `Pyramid` calls `scrollToLevel('level-${id}')` which scrolls to the corresponding `ExerciseTable` (each table sets `id={level-${level.id}}` and `scroll-mt-24`).

There is **no router** — it's a single page. There is **no global state library** — `useState` / `useMemo` is sufficient.

## Conventions for AI Assistants

- **Preserve French copy** in the UI and in the Gemini system prompt. Don't translate to English unless explicitly asked.
- **Don't add a Tailwind PostCSS pipeline** unless asked — the project deliberately uses the CDN build. Adding `tailwindcss` to `package.json` would be a meaningful architectural change that needs user buy-in.
- **Don't move files into a `src/` directory** without being asked; the flat layout is intentional and matches the AI Studio scaffold.
- **Keep `ALL_EXERCISES` as the single source of truth** for the catalogue. Anything that displays exercise data should derive from it (filter/map), not maintain a parallel list.
- **Don't introduce a test framework, ESLint, or Prettier** unless asked — none exist today and adding them is a project-wide decision.
- **Don't commit `.env.local`** or any file containing a real `GEMINI_API_KEY`.
- **Use the dedicated tools** (Read/Edit/Write/Glob/Grep) rather than shell equivalents (`cat`, `sed`, `find`, `grep`).

## Git Workflow for This Session

- Active development branch: **`claude/add-claude-documentation-5E29h`**.
- Develop on that branch, commit with descriptive messages, and push with `git push -u origin claude/add-claude-documentation-5E29h`.
- Do not push to `main` and do not open a PR unless explicitly asked.
