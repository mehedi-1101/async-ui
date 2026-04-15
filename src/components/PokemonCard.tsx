import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchPokemonDetail, type PokemonListItem } from '../api/pokemon'

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

type Props = {
  pokemon: PokemonListItem
}

export default function PokemonCard({ pokemon }: Props) {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['pokemon', pokemon.name],
    queryFn: () => fetchPokemonDetail(pokemon.name),
  })

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
        <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-3" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
      </div>
    )
  }

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      className="rounded-xl border border-gray-200 bg-white p-4 cursor-pointer hover:shadow-md hover:border-gray-300 transition-shadow"
    >
      <img
        src={data.sprites.front_default}
        alt={data.name}
        className="w-24 h-24 mx-auto"
      />
      <p className="text-center font-medium capitalize mt-1">{data.name}</p>
      <p className="text-center text-xs text-gray-400 mb-2">#{String(data.id).padStart(3, '0')}</p>
      <div className="flex gap-1 justify-center flex-wrap">
        {data.types.map(t => (
          <span
            key={t.type.name}
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[t.type.name] ?? 'bg-gray-100 text-gray-600'}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  )
}
