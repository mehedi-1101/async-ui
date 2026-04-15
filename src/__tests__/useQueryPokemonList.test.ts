import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createElement } from 'react'
import { useQueryPokemonList } from '../hooks/useQueryPokemonList'
import * as api from '../api/pokemon'

vi.mock('../api/pokemon')

const mockList = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
]

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return createElement(QueryClientProvider, { client }, children)
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useQueryPokemonList', () => {
  it('starts in loading state', () => {
    vi.mocked(api.fetchPokemonList).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useQueryPokemonList(''), { wrapper })

    expect(result.current.loading).toBe(true)
    expect(result.current.list).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('shows data after fetch resolves', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => useQueryPokemonList(''), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual(mockList)
    expect(result.current.error).toBeNull()
  })

  it('shows error when fetch fails', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useQueryPokemonList(''), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network error')
    expect(result.current.list).toEqual([])
  })

  it('filters list by query', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => useQueryPokemonList('bul'), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([{ name: 'bulbasaur', url: mockList[0].url }])
  })

  it('returns empty list when query has no match', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => useQueryPokemonList('zzz'), { wrapper })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([])
  })
})
