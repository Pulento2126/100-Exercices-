# CLAUDE.md

Guide à destination des assistants IA (Claude Code et autres) travaillant sur ce dépôt.

## Vue d'ensemble du projet

**Seirul-lo SSP Hub** — une application React monopage interactive qui catalogue les 100 *Situations Simulatrices Préférentielles* (SSP) de la méthodologie d'entraînement footballistique de Francisco Seirul-lo. Les utilisateurs peuvent parcourir les exercices par niveau de spécificité, rechercher dans le catalogue, consulter des graphiques de distribution et discuter avec un assistant IA propulsé par Gemini pour la planification de séances.

L'application est **entièrement en français** — textes de l'interface, prompts IA et noms d'exercices. Conserver cette langue lors des modifications de l'interface.

L'application a été initialement générée depuis Google AI Studio (voir `README.md`).

## Stack technique

- **React 19.2** (`react`, `react-dom`) avec `React.StrictMode`
- **TypeScript 5.8** avec la transformation JSX `react-jsx`, `moduleResolution: bundler`, `noEmit: true`
- **Vite 6** comme serveur de développement et bundler (`@vitejs/plugin-react`)
- **Recharts 3** pour les graphiques d'analyse
- **@google/genai 1.34** pour le client de l'API Gemini
- **Tailwind CSS via CDN** (`https://cdn.tailwindcss.com`) — *non* installé via npm. Le thème est configuré inline dans `index.html`.
- **ESM navigateur via une import map `esm.sh`** déclarée dans `index.html` pour `react`, `react-dom`, `@google/genai` et `recharts`. Les mêmes paquets sont *aussi* listés dans `package.json` afin que Vite puisse les résoudre localement.

Il n'y a ni framework de tests, ni configuration de linter, ni configuration de formateur dans ce dépôt.

## Commandes

```bash
npm install        # installer les dépendances
npm run dev        # démarrer le serveur Vite sur http://0.0.0.0:3000
npm run build      # build de production vers dist/
npm run preview    # prévisualiser le build de production
```

`GEMINI_API_KEY` doit être défini dans `.env.local` (voir `README.md`). `vite.config.ts` le lit via `loadEnv` et l'expose au client à la fois sous `process.env.API_KEY` et `process.env.GEMINI_API_KEY`.

## Arborescence du dépôt

```
.
├── index.html              # Coquille HTML, Tailwind CDN + thème, import map
├── index.tsx               # Point d'entrée React — monte <App /> dans #root
├── App.tsx                 # Mise en page racine : Header, Pyramid, recherche, charts, tables, IA
├── constants.tsx           # Métadonnées LEVELS et catalogue ALL_EXERCISES (100 entrées)
├── types.ts                # Exercise, enum LevelID, LevelMetadata
├── components/
│   ├── Header.tsx          # En-tête héros avec titre en dégradé
│   ├── Pyramid.tsx         # Pyramide cliquable à 5 niveaux (scroll vers le niveau)
│   ├── AnalysisCharts.tsx  # BarChart + AreaChart Recharts (distribution & courbe NE)
│   ├── ExerciseTable.tsx   # Table déroulante par niveau
│   └── AssistantAI.tsx     # Widget de chat flottant appelant Gemini
├── services/
│   └── geminiService.ts    # getAIAssistantResponse() — wrapper API Gemini
├── metadata.json           # Métadonnées de l'application AI Studio
├── vite.config.ts          # Config Vite + injection des env + alias @
├── tsconfig.json
└── package.json
```

Il n'y a pas de répertoire `src/` — les fichiers TS/TSX résident à la racine du dépôt et dans `components/` et `services/`.

## Modèle de domaine

Défini dans `types.ts` :

```ts
interface Exercise {
  r: number;   // Rang (1–100, classés par spécificité décroissante)
  n: string;   // Nom (en français)
  ne: number;  // Niveau d'Exigence — score de spécificité 1.0–10.0
  l: number;   // Identifiant du niveau (1–5)
}

enum LevelID {
  COMPETITION = 1,  // NE 8.0–10.0  (rouge / bg-danger)
  SPECIAL     = 2,  // NE 6.0–7.9   (orange)
  DIRIGE      = 3,  // NE 4.5–5.9   (jaune)
  GENERAL     = 4,  // NE 3.0–4.4   (cyan / bg-accent)
  GENERIQUE   = 5,  // NE 1.0–2.9   (gris)
}
```

La source unique de vérité pour le catalogue est `constants.tsx` (`ALL_EXERCISES` et `LEVELS`). Lors de l'ajout ou de la correction d'exercices, garder un tri par `ne` décroissant à l'intérieur de chaque niveau, conserver des `r` contigus (1–100) et maintenir la cohérence des bornes de niveau avec les chaînes `range` de `LEVELS`.

Les noms de champs courts (`r`, `n`, `ne`, `l`) sont intentionnels — ils apparaissent en clair dans `JSON.stringify(ALL_EXERCISES)` à l'intérieur du prompt système Gemini, donc les renommer se propage dans le contexte de l'IA.

## Conventions de style

- **Tout le style passe par les classes utilitaires Tailwind** chargées depuis le CDN. Il n'existe pas de fichier `tailwind.config.js` — la configuration vit dans un bloc `<script>` à l'intérieur de `index.html`. Pour ajouter une couleur ou une police personnalisée, modifier ce bloc.
- **Couleurs personnalisées du thème** (utilisées partout) : `primary` `#0f172a`, `secondary` `#1e293b`, `accent` `#06b6d4`, `highlight` `#8b5cf6`, `danger` `#f43f5e`, `success` `#10b981`, `textMain` `#f8fafc`, `textMuted` `#94a3b8`.
- Chaque `LevelMetadata.color` est une classe de fond Tailwind (par ex. `bg-danger`, `bg-orange-500`). `ExerciseTable.tsx` et `AnalysisCharts.tsx` en dérivent les couleurs de bordure et de texte par remplacement de chaîne sur `bg-` — garder les nouvelles couleurs de niveau dans une forme qui survit à cette transformation, ou bien mettre à jour les consommateurs.
- La police est `Inter`, chargée depuis Google Fonts dans `index.html`.
- La classe utilitaire de clip-path `.pyramid-level` est définie dans le bloc `<style>` de `index.html`, pas dans Tailwind.

## Alias de chemins

`vite.config.ts` définit `@` → racine du dépôt, miroité dans `tsconfig.json` (`paths: { "@/*": ["./*"] }`). En pratique, le code utilise des **imports relatifs** (`./components/Header`, `../constants`) — continuer ainsi par cohérence sauf raison particulière de changer.

## Intégration Gemini

`services/geminiService.ts` :

- Instancie `new GoogleGenAI({ apiKey: process.env.API_KEY || '' })` au chargement du module. À la fois `API_KEY` et `GEMINI_API_KEY` sont injectés par le `define` de Vite.
- `getAIAssistantResponse(userPrompt)` appelle `ai.models.generateContent` avec le modèle `'gemini-3-flash-preview'`, une instruction système en français, `temperature: 0.7`, et retourne `response.text`. Les erreurs sont attrapées et un message de repli en français est renvoyé.
- L'instruction système embarque `JSON.stringify(ALL_EXERCISES.slice(0, 50))` — seuls les 50 premiers exercices sont envoyés. Si vous changez la taille du catalogue ou souhaitez étendre le contexte, mettre à jour cette tranche.
- `components/AssistantAI.tsx` est un bouton de chat flottant (`fixed bottom-6 right-6`) qui ouvre un panneau de 500 px et appelle directement `getAIAssistantResponse` — pas de streaming, aucun historique de conversation n'est envoyé à Gemini (chaque appel est indépendant).

Si vous changez l'identifiant du modèle Gemini, vérifiez-le par rapport au SDK `@google/genai` actuel — la valeur littérale `gemini-3-flash-preview` déjà présente dans le fichier pourrait ne pas être un identifiant de modèle réel et constituer la source d'erreurs API.

## Coquille et mise en page

`App.tsx` détient l'unique morceau d'état : `searchTerm`. Quand `searchTerm` n'est pas vide, les tables par niveau s'effondrent en une seule table de résultats filtrés ; sinon, un `ExerciseTable` est rendu par niveau. `Pyramid` appelle `scrollToLevel('level-${id}')` qui fait défiler vers la `ExerciseTable` correspondante (chaque table fixe `id={level-${level.id}}` et `scroll-mt-24`).

Il n'y a **pas de routeur** — c'est une page unique. Il n'y a **pas de bibliothèque de gestion d'état globale** — `useState` / `useMemo` suffisent.

## Conventions pour les assistants IA

- **Conserver le texte en français** dans l'interface et dans le prompt système Gemini. Ne pas traduire en anglais sauf demande explicite.
- **Ne pas ajouter de pipeline PostCSS Tailwind** sans demande — le projet utilise délibérément le build CDN. Ajouter `tailwindcss` à `package.json` serait un changement architectural significatif qui nécessite l'accord de l'utilisateur.
- **Ne pas déplacer les fichiers dans un répertoire `src/`** sans qu'on le demande ; la mise à plat est intentionnelle et correspond au scaffold AI Studio.
- **Garder `ALL_EXERCISES` comme source unique de vérité** pour le catalogue. Tout ce qui affiche des données d'exercices doit en dériver (filter/map), et non maintenir une liste parallèle.
- **Ne pas introduire de framework de tests, d'ESLint ou de Prettier** sans demande — aucun n'existe aujourd'hui et leur ajout est une décision à l'échelle du projet.
- **Ne pas committer `.env.local`** ni aucun fichier contenant une vraie `GEMINI_API_KEY`.
- **Utiliser les outils dédiés** (Read/Edit/Write/Glob/Grep) plutôt que leurs équivalents shell (`cat`, `sed`, `find`, `grep`).

## Workflow Git pour cette session

- Branche de développement active : **`claude/add-claude-documentation-5E29h`**.
- Développer sur cette branche, committer avec des messages descriptifs et pousser avec `git push -u origin claude/add-claude-documentation-5E29h`.
- Ne pas pousser sur `main` et ne pas ouvrir de PR sauf demande explicite.
