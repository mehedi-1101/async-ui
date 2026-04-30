import { useState, useEffect, useMemo } from 'react'
import { fetchPokemonList, type PokemonListItem } from '../api/pokemon'

type State = {
  data: PokemonListItem[] | null
  loading: boolean
  error: string | null
}

const listCache = new Map<string, PokemonListItem[]>()

export const clearListCache = () => listCache.clear()

export function usePokemonList(query: string) {
  const [state, setState] = useState<State>(() => {
    const cached = listCache.get('pokemon-list')
    return { data: cached ?? null, loading: !cached, error: null }
  })

  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (retryCount === 0 && listCache.has('pokemon-list')) return

    if (retryCount > 0) listCache.delete('pokemon-list')

    const controller = new AbortController()

    fetchPokemonList(controller.signal)
      .then(data => {
        listCache.set('pokemon-list', data)
        setState({ data, loading: false, error: null })
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setState({ data: null, loading: false, error: err.message })
      })

    return () => controller.abort()
  }, [retryCount])

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    setRetryCount(c => c + 1)
  }

  const list = useMemo(() => {
    if (!state.data) return []
    if (!query) return state.data
    return state.data.filter(p => p.name.includes(query.toLowerCase()))
  }, [state.data, query])

  return {
    list,
    loading: state.loading,
    error: state.error,
    refetch,
  }
}
