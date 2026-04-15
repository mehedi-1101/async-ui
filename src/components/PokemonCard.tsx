import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { fetchPokemonDetail, type PokemonListItem } from '../api/pokemon'
import { typeColors, typeBg } from '../lib/typeColors'
import SkeletonCard from './SkeletonCard'

type Props = {
  pokemon: PokemonListItem
}

export default function PokemonCard({ pokemon }: Props) {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['pokemon', pokemon.name],
    queryFn: () => fetchPokemonDetail(pokemon.name),
  })

  if (isLoading || !data) return <SkeletonCard />

  const primaryType = data.types[0].type.name
  const cardBg = typeBg[primaryType] ?? 'bg-gray-50'

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemon.name}`)}
      className={`rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col items-center gap-2 cursor-pointer ${cardBg}`}
    >
      <img
        src={data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default}
        alt={data.name}
        className="w-28 h-28 object-contain drop-shadow-sm"
      />
      <p className="font-semibold capitalize text-gray-800">{data.name}</p>
      <p className="text-xs text-gray-400 font-mono">#{String(data.id).padStart(3, '0')}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {data.types.map(t => (
          <span
            key={t.type.name}
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${typeColors[t.type.name] ?? 'bg-gray-100 text-gray-500'}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>
    </div>
  )
}
