import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DetailPage from '../pages/DetailPage'
import * as api from '../api/pokemon'

vi.mock('../api/pokemon')

const mockDetail = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  height: 7,
  weight: 69,
  base_experience: 64,
}

function renderDetailPage(name = 'bulbasaur') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/pokemon/${name}`]}>
        <Routes>
          <Route path="/pokemon/:name" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('DetailPage', () => {
  it('shows skeleton while loading', () => {
    vi.mocked(api.fetchPokemonDetail).mockReturnValue(new Promise(() => {}))

    renderDetailPage()

    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders pokemon detail after load', async () => {
    vi.mocked(api.fetchPokemonDetail).mockResolvedValue(mockDetail)

    renderDetailPage()

    await waitFor(() => expect(screen.getByText('bulbasaur')).toBeInTheDocument())

    expect(screen.getByText('#001')).toBeInTheDocument()
    expect(screen.getByText('grass')).toBeInTheDocument()
    expect(screen.getByText('poison')).toBeInTheDocument()
    expect(screen.getByText('0.7m')).toBeInTheDocument()
    expect(screen.getByText('6.9kg')).toBeInTheDocument()
    expect(screen.getByText('64')).toBeInTheDocument()
  })

  it('shows error state when fetch fails', async () => {
    vi.mocked(api.fetchPokemonDetail).mockRejectedValue(new Error('Not found'))

    renderDetailPage()

    await waitFor(() =>
      expect(screen.getByText('Failed to load Pokémon')).toBeInTheDocument()
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})
