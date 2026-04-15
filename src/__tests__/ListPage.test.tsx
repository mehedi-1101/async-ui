import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ListPage from '../pages/ListPage'
import * as api from '../api/pokemon'

vi.mock('../api/pokemon')

const mockList = [
  { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
]

const mockDetail = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
  height: 7,
  weight: 69,
  base_experience: 64,
}

function renderListPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ListPage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('ListPage', () => {
  it('shows skeleton cards while loading', () => {
    vi.mocked(api.fetchPokemonList).mockReturnValue(new Promise(() => {}))

    renderListPage()

    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('shows pokemon cards after data loads', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)
    vi.mocked(api.fetchPokemonDetail).mockResolvedValue(mockDetail)

    renderListPage()

    await waitFor(() => expect(screen.getByText('bulbasaur')).toBeInTheDocument())
  })

  it('shows error state when fetch fails', async () => {
    vi.mocked(api.fetchPokemonList).mockRejectedValue(new Error('Network error'))

    renderListPage()

    await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('calls refetch when retry button is clicked', async () => {
    vi.mocked(api.fetchPokemonList)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(mockList)
    vi.mocked(api.fetchPokemonDetail).mockResolvedValue(mockDetail)

    renderListPage()

    await waitFor(() => screen.getByRole('button', { name: 'Retry' }))
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))

    await waitFor(() => expect(api.fetchPokemonList).toHaveBeenCalledTimes(2))
  })

  it('shows empty state when search has no match', async () => {
    vi.mocked(api.fetchPokemonList).mockResolvedValue(mockList)

    renderListPage()

    await waitFor(() => expect(screen.queryByText(/animate-pulse/)).not.toBeInTheDocument())

    fireEvent.change(screen.getByPlaceholderText('Search Pokémon...'), {
      target: { value: 'zzz' },
    })

    expect(screen.getByText(/No Pokémon found for "zzz"/)).toBeInTheDocument()
  })
})
