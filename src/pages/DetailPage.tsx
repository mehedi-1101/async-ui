import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonDetail } from '../api/pokemon'
import { typeColors } from '../lib/typeColors'
import ErrorState from '../components/ErrorState'

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
        <div className="w-48 h-48 rounded-full bg-gray-200 animate-pulse" />
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
      <div className="max-w-sm mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50 flex items-center justify-center py-8">
            <img
              src={data?.sprites.other['official-artwork'].front_default ?? data?.sprites.front_default}
              alt={data?.name}
              className="w-44 h-44 object-contain drop-shadow-md"
            />
          </div>

          <div className="p-6 text-center">
            <p className="text-xs text-gray-400 font-mono mb-1">
              #{String(data?.id).padStart(3, '0')}
            </p>
            <h1 className="text-2xl font-bold capitalize text-gray-900 mb-3">
              {data?.name}
            </h1>

            <div className="flex gap-2 justify-center mb-6">
              {data?.types.map(t => (
                <span
                  key={t.type.name}
                  className={`text-sm px-3 py-1 rounded-full font-medium ${typeColors[t.type.name] ?? 'bg-gray-100 text-gray-500'}`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-4">
              <div className="px-2">
                <p className="text-lg font-bold text-gray-800">
                  {((data?.height ?? 0) / 10).toFixed(1)}m
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Height</p>
              </div>
              <div className="px-2">
                <p className="text-lg font-bold text-gray-800">
                  {((data?.weight ?? 0) / 10).toFixed(1)}kg
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Weight</p>
              </div>
              <div className="px-2">
                <p className="text-lg font-bold text-gray-800">{data?.base_experience}</p>
                <p className="text-xs text-gray-400 mt-0.5">Base XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
