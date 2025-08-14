import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export type PokemonTypes = {
    slot: number
    type: {
        name: string
        url: string
    }
}


export type Pokemon = {
    name: string
    url: string
}


type PokemonListData = {
    results: Pokemon[]
    count: number
    next: string
    previous?: string
}
    
type PokemonDetailData = {
    id: number
    name: string
    height: number
    weight: number
    types: PokemonTypes[]   
    sprites: {
        front_default: string
    }
}

export const pokemonApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  reducerPath: 'pokemonApi',
  tagTypes: ['Pokemon'],
  endpoints: build => ({
    getPokemonList: build.query<PokemonListData, number>({
        query: (limit = 10) =>  `pokemon?limit=${limit.toString()}`,
        providesTags: (_result, _error, id) => [{ type: "Pokemon", id }],
    }),
    getPokemonDetails: build.query<PokemonDetailData, {name: string}>({
      query: ({name}) => `pokemon/${name}`,
      providesTags: (_result, _error, id) => [{ type: 'Pokemon', name: id }],
    }), 
  })
})


export const {  useGetPokemonListQuery, useGetPokemonDetailsQuery } = pokemonApiSlice;