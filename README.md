# Personal Portfolio

A Next.js portfolio and blog with optional Notion CMS integration, i18n (en/fr), and local Markdown articles.

---

## Built with

- **[Next.js](https://nextjs.org/)** 16 – React framework
- **[React](https://react.dev/)** 19
- **[Tailwind CSS](https://tailwindcss.com/)** 4 + **[DaisyUI](https://daisyui.com/)**
- **[next-i18next](https://github.com/i18next/next-i18next)** – i18n (en/fr)
- **[Notion API](https://developers.notion.com/)** – optional CMS (feature-flagged)
- **[Framer Motion](https://www.framer.com/motion/)** – animations
- **[Zod](https://zod.dev/)** – schema validation
- **[Jest](https://jestjs.io/)** + **Cypress** – tests

---

## Prerequisites

- **Node.js** `24.x` (see [.nvmrc](.nvmrc))
- Yarn or npm

---

## Getting started

```bash
# Install dependencies
yarn install
# or: npm install

# Run development server
yarn dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|--------|-------------|
| `yarn dev` | Start dev server |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix lint issues |
| `yarn format` | Format with Prettier |
| `yarn format:check` | Check formatting |
| `yarn test` | Run Jest tests |
| `yarn test:watch` | Jest watch mode |
| `yarn test:coverage` | Jest with coverage |
| `yarn test:ci` | CI test run |
| `yarn cypress` | Open Cypress |
| `yarn cypress:headless` | Cypress headless |
| `yarn e2e` | E2E (dev + Cypress) |
| `yarn analyze` | Build with bundle analyzer |

---

## Git workflow and branches

Production is the **master** branch (prod = master). Everything below assumes that.

### Branch overview

| Branch | Role |
|--------|------|
| **master** | **Prod.** Production-ready releases. Only merged from `release/*` or hotfixes. Default branch. |
| **dev** | Integration branch for features. Merge feature branches here first. |
| **release/1.0.x** | Release preparation. Bump version, fix release-only issues, then merge to **master** (prod). |
| **release/v1.0.0** | Historical release branch. |

### Recommended workflow (pro-style)

1. **Base branch for new work:** `dev`  
   - Create feature branches from `dev`, not from `master`.

2. **Feature work**
   - Branch from `dev`:  
     `git checkout dev && git pull && git checkout -b feature/your-feature`
   - Commit and push to `feature/your-feature`.
   - Open a PR **into `dev`**. Merge after review/tests.

3. **Releases**
   - Branch from `dev`:  
     `git checkout dev && git pull && git checkout -b release/1.0.2`
   - Bump version in `package.json`, update changelog if you have one, fix any release-blocking bugs.
   - Run tests and build:  
     `yarn test:ci && yarn build`
   - Open a PR **into `master`** (or merge when ready).  
   - Tag after merge:  
     `git checkout master && git pull && git tag v1.0.2 && git push origin v1.0.2`  
     (Do not push if you prefer to tag later.)

4. **Hotfixes (production-only fixes)**
   - Branch from `master`:  
     `git checkout master && git pull && git checkout -b hotfix/short-fix`
   - Fix, test, then merge into `master` (and optionally into `dev` so history stays aligned).

5. **Do not**
   - Put platform-specific binaries (e.g. `@next/swc-win32-x64-msvc`) in `dependencies`; Next.js installs the right SWC via optionalDependencies.
   - Merge directly to `master` from feature branches; use `dev` → `release/*` → `master`.
   - Force-push to `master`.

---

## Author

**Brahim Abdelli** – [brahimabdelli](https://github.com/BrahimAbdelli)

---

## Deploy

The project can be deployed on [Vercel](https://vercel.com) or any Node-friendly host. Ensure `NODE_VERSION` or `.nvmrc` is set to `24` if required by the platform.
