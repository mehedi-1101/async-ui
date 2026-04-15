# Pokémon Explorer

Browse the original 151 Pokémon. Built to practice async UI patterns in React — not just make something that works, but handle every state properly and understand *why* each decision was made.

Live demo: https://async-pokemon.vercel.app

---

## What this project is actually about

The Pokémon part is just the vehicle. The real point is learning how async data works in a UI:

- What do you show while data is loading?
- What do you show if it fails?
- What do you show if it succeeds but returns nothing?
- How do you prevent old requests from overwriting new ones?
- How does caching change the experience?

The toggle on the list page lets you switch between two implementations — **Raw Fetch** and **React Query** — and see the difference live.

---

## The two fetch modes

### Raw Fetch
Implemented manually in `src/hooks/usePokemonList.ts`. Tracks `loading`, `error`, and `data` in local state. Uses an `AbortController` inside `useEffect` — when the component unmounts or re-fetches, the old request gets cancelled. You can see this in DevTools → Network as requests with a strikethrough.

One non-obvious thing: the hook uses a `retryCount` number as the `useEffect` dependency instead of a callback function. This is because ESLint's react-hooks plugin (v7) traces through function calls and flags `setState` even inside `useCallback` wrappers. Incrementing a number re-triggers the effect cleanly with no lint violations.

### React Query
Same hook interface, different implementation in `src/hooks/useQueryPokemonList.ts`. React Query handles loading/error state internally and caches results by key. The practical difference: navigate to a detail page, hit back, open a different Pokémon, hit back again — only the first load fetches from the network. Everything after is instant.

Both hooks return the same shape (`list`, `loading`, `error`, `refetch`) so `ListPage` can swap between them without changing anything else.

---

## Other patterns in the code

**Search without spamming the API** — The search input filters the already-fetched list using `useMemo`. No request per keystroke. This works because we fetch all 151 Pokémon once on load, then filter client-side.

**Mode survives navigation** — The Raw/React Query toggle uses `useSearchParams` (URL param `?mode=query`) instead of `useState`. If it were `useState`, switching to React Query mode, clicking a card, and pressing back would reset it to Raw Fetch — React unmounts and remounts the page component on navigation.

**Cards fetch their own detail** — PokéAPI's list endpoint doesn't include sprites. Each `PokemonCard` fetches its own detail via `useQuery`. Since the query key is `['pokemon', name]` — the same key used on the detail page — clicking a card that was already rendered loads the detail page instantly from cache.

**No double fetching** — `RawGrid` and `QueryGrid` are separate components. Only the active one mounts, so only one hook runs at a time.

---

## Try these manually

| Scenario | What to look for |
|---|---|
| Load the page | Skeleton cards appear first, then data fills in |
| DevTools → Network → Offline | Error message shows, Retry button works |
| Type quickly in search | DevTools Network shows cancelled (strikethrough) requests |
| Search `bul` | Only Bulbasaur visible |
| Search `zzz` | Empty state message |
| Switch to React Query → click a card → back | Still on React Query mode |
| Click same card twice | Second visit is instant (no network request) |
| 375px viewport in DevTools | Grid readable, no horizontal scroll |

---

## Stack

| | |
|---|---|
| React 19 + TypeScript | UI and type safety |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| React Router v7 | `/` and `/pokemon/:name` routes |
| TanStack Query v5 | Caching on cards and detail page |
| Vitest + React Testing Library | Unit tests |

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Commands

```bash
pnpm dev             # dev server
pnpm build           # type-check + production build
pnpm lint            # eslint
pnpm test            # vitest watch mode
pnpm test:coverage   # coverage report
```

---

## Project structure

```
src/
  api/
    pokemon.ts              fetch functions + TypeScript types, no React
  components/
    PokemonCard.tsx         sprite, name, types, ID — fetches its own detail via useQuery
    SkeletonCard.tsx        animated placeholder shown while loading
    ErrorState.tsx          error message + retry button
    EmptyState.tsx          no results message
  hooks/
    usePokemonList.ts       raw fetch with AbortController + retryCount pattern
    useQueryPokemonList.ts  React Query version, identical return shape
  pages/
    ListPage.tsx            search + mode toggle (stored in URL) + grid
    DetailPage.tsx          full detail view, cached by React Query
  lib/
    queryClient.ts          single QueryClient instance
    typeColors.ts           pokemon type → tailwind class map
  __tests__/
    usePokemonList.test.ts
    useQueryPokemonList.test.ts
    ListPage.test.tsx
    DetailPage.test.tsx
```

---

## Tests

All tests mock `src/api/pokemon.ts` at the module level — no real network calls. Each component and hook is tested across all 4 async states (loading, success, error, empty).

```bash
pnpm test:coverage
```

Current coverage: 85%+
