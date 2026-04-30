type Props = {
  query: string
}

export default function EmptyState({ query }: Props) {
  return (
    <div className="text-center py-16 text-gray-500">
      No Pokémon found for "{query}"
    </div>
  )
}
