import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePokemonList } from '../hooks/usePokemonList'
import { useQueryPokemonList } from '../hooks/useQueryPokemonList'
import PokemonCard from '../components/PokemonCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

function PokemonGrid({ list }: { list: { name: string; url: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {list.map(pokemon => <PokemonCard key={pokemon.name} pokemon={pokemon} />)}
    </div>
  )
}

function RawGrid({ query }: { query: string }) {
  const { list, loading, error, refetch } = usePokemonList(query)
  if (loading) return <SkeletonGrid />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (list.length === 0) return <EmptyState query={query} />
  return <PokemonGrid list={list} />
}

function QueryGrid({ query }: { query: string }) {
  const { list, loading, error, refetch } = useQueryPokemonList(query)
  if (loading) return <SkeletonGrid />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (list.length === 0) return <EmptyState query={query} />
  return <PokemonGrid list={list} />
}

export default function ListPage() {
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = (searchParams.get('mode') ?? 'raw') as 'raw' | 'query'

  const setMode = (m: 'raw' | 'query') =>
    setSearchParams({ mode: m }, { replace: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <img src="/pokeball.svg" alt="" className="w-9 h-9" />
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Pokémon Explorer</h1>
          </div>
          <p className="text-gray-400 text-sm">Original 151 — click any card for details</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden text-sm font-medium">
            <button
              onClick={() => setMode('raw')}
              className={`px-4 py-2.5 transition-colors ${mode === 'raw' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Raw Fetch
            </button>
            <button
              onClick={() => setMode('query')}
              className={`px-4 py-2.5 transition-colors ${mode === 'query' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              React Query
            </button>
          </div>
        </div>

        <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${mode === 'raw' ? 'bg-gray-50 border-gray-200 text-gray-600' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {mode === 'raw' ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
              <span className="font-semibold text-gray-800">Raw Fetch</span>
              <span>Fetches on mount, cancels on unmount via <code className="font-mono text-xs bg-gray-200 px-1 rounded">AbortController</code></span>
              <span>No cache — back-navigation re-fetches</span>
              <span>Watch cancelled requests in DevTools → Network</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
              <span className="font-semibold text-blue-800">React Query</span>
              <span>Fetches once, caches the result automatically</span>
              <span>Back-navigation is instant — served from cache</span>
              <span>Retry + background refresh built in</span>
            </div>
          )}
        </div>

        {mode === 'raw' ? <RawGrid query={query} /> : <QueryGrid query={query} />}

      </div>
    </div>
  )
}
