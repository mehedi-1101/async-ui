import { useState } from 'react'
import { usePokemonList } from '../hooks/usePokemonList'
import PokemonCard from '../components/PokemonCard'
import SkeletonCard from '../components/SkeletonCard'
import ErrorState from '../components/ErrorState'
import EmptyState from '../components/EmptyState'

export default function ListPage() {
  const [query, setQuery] = useState('')
  const { list, loading, error, refetch } = usePokemonList(query)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Pokémon Browser</h1>

        <input
          type="text"
          placeholder="Search Pokémon..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && list.length === 0 && (
          <EmptyState query={query} />
        )}

        {!loading && !error && list.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map(pokemon => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
