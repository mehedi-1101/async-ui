const BASE = 'https://pokeapi.co/api/v2'

export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonType = {
  type: { name: string }
}

export type PokemonDetail = {
  id: number
  name: string
  sprites: {
    front_default: string
    other: { 'official-artwork': { front_default: string } }
  }
  types: PokemonType[]
  height: number
  weight: number
  base_experience: number
}

export async function fetchPokemonList(signal?: AbortSignal): Promise<PokemonListItem[]> {
  const res = await fetch(`${BASE}/pokemon?limit=151`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch pokemon list: ${res.status}`)
  const data = await res.json()
  return data.results
}

export async function fetchPokemonDetail(name: string, signal?: AbortSignal): Promise<PokemonDetail> {
  const res = await fetch(`${BASE}/pokemon/${name}`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`)
  return res.json()
}
