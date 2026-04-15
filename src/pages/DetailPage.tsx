import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDetail } from '../api/pokemon'
import ErrorState from '../components/ErrorState'

const typeColors: Record<string, string> = {
  fire: 'bg-orange-100 text-orange-700',
  water: 'bg-blue-100 text-blue-700',
  grass: 'bg-green-100 text-green-700',
  electric: 'bg-yellow-100 text-yellow-700',
  psychic: 'bg-pink-100 text-pink-700',
  ice: 'bg-cyan-100 text-cyan-700',
  dragon: 'bg-indigo-100 text-indigo-700',
  dark: 'bg-gray-800 text-gray-100',
  fairy: 'bg-pink-100 text-pink-500',
  normal: 'bg-gray-100 text-gray-600',
  fighting: 'bg-red-100 text-red-700',
  flying: 'bg-sky-100 text-sky-700',
  poison: 'bg-purple-100 text-purple-700',
  ground: 'bg-yellow-100 text-yellow-800',
  rock: 'bg-stone-100 text-stone-700',
  bug: 'bg-lime-100 text-lime-700',
  ghost: 'bg-violet-100 text-violet-700',
  steel: 'bg-slate-100 text-slate-700',
}

export default function DetailPage() {
  const { name } = useParams<{ name: string }>()
  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetail(name!),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-48 h-48 bg-gray-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState message="Failed to load Pokémon" onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-500 hover:underline"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <img
            src={data?.sprites.front_default}
            alt={data?.name}
            className="w-40 h-40 mx-auto"
          />
          <h1 className="text-2xl font-bold capitalize mt-2">{data?.name}</h1>
          <p className="text-gray-400 text-sm mb-4">#{String(data?.id).padStart(3, '0')}</p>

          <div className="flex gap-2 justify-center mb-6">
            {data?.types.map(t => (
              <span
                key={t.type.name}
                className={`text-sm px-3 py-1 rounded-full font-medium ${typeColors[t.type.name] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold">{((data?.height ?? 0) / 10).toFixed(1)}m</p>
              <p className="text-xs text-gray-400">Height</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{((data?.weight ?? 0) / 10).toFixed(1)}kg</p>
              <p className="text-xs text-gray-400">Weight</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{data?.base_experience}</p>
              <p className="text-xs text-gray-400">Base XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
