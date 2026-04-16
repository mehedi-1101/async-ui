import { renderHook, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { usePokemonList, clearListCache } from '../hooks/usePokemonList'
import * as api from '../api/pokemon'

vi.mock('../api/pokemon')

const mockList = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
  { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
]

beforeEach(() => {
  vi.resetAllMocks()
  clearListCache()
})

describe('usePokemonList', () => {
  it('starts in loading state', () => {
    vi.mocked(api.fetchPokemonList).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => usePokemonList(''))

    expect(result.current.loading).toBe(true)
    expect(result.current.list).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('shows data after fetch resolves', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => usePokemonList(''))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual(mockList)
    expect(result.current.error).toBeNull()
  })

  it('shows error when fetch fails', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => usePokemonList(''))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Network error')
    expect(result.current.list).toEqual([])
  })

  it('filters list by query', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => usePokemonList('bul'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([{ name: 'bulbasaur', url: mockList[0].url }])
  })

  it('returns empty list when query has no match', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    const { result } = renderHook(() => usePokemonList('zzz'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([])
  })

  it('aborts the request on unmount', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort')
    vi.mocked(api.fetchPokemonList).mockReturnValue(new Promise(() => {}))

    const { unmount } = renderHook(() => usePokemonList(''))
    unmount()

    expect(abortSpy).toHaveBeenCalled()
  })
})
