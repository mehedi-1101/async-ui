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
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Pokédex</h1>
          <p className="text-gray-400 mt-1 text-sm">Original 151 — click any card for details</p>
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

        <div className="mb-5">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${mode === 'raw' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mode === 'raw' ? 'bg-gray-400' : 'bg-blue-400'}`} />
            {mode === 'raw' ? 'Manual fetch · AbortController cancels stale requests' : 'React Query · automatic caching, instant back-navigation'}
          </span>
        </div>

        {mode === 'raw' ? <RawGrid query={query} /> : <QueryGrid query={query} />}

      </div>
    </div>
  )
}
