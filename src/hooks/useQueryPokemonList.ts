import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPokemonList } from '../api/pokemon'

export function useQueryPokemonList(query: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: () => fetchPokemonList(),
  })

  const list = useMemo(() => {
    if (!data) return []
    if (!query) return data
    return data.filter(p => p.name.includes(query.toLowerCase()))
  }, [data, query])

  return {
    list,
    loading: isLoading,
    error: error ? error.message : null,
    refetch,
  }
}
