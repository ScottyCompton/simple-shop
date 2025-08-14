import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Pokemon } from './pokemonApiSlice';

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: {
    pokemons: [] as Pokemon[],
    selectedPokemon: null as string | null,
  },
  reducers: {
    // adds a new pokemon to the state
    addPokemon: {
        reducer: (state, action: PayloadAction<Pokemon>) => {
            state.pokemons.push(action.payload);
        },
        prepare: (pokemon: Pokemon) => ({
            payload: pokemon,
        }),
    },
    deletePokemon: (state, action: PayloadAction<string>) => {
        state.pokemons = state.pokemons.filter(pokemon => pokemon.name !== action.payload);
    },
    updatePokemon: (state, action: PayloadAction<Pokemon>) => {
        const index = state.pokemons.findIndex(pokemon => pokemon.name === action.payload.name);
        if (index !== -1) { 
            state.pokemons[index] = action.payload;
        }
    }   
  },
  selectors: {
    currentPokemons: (state) => state.pokemons,
    selectSelectedPokemon: (state) => state.selectedPokemon,
  }
})


export const { addPokemon, deletePokemon, updatePokemon } = pokemonSlice.actions;
export const selectPokemons = (state: { pokemon: { pokemons: Pokemon[] } }) => state.pokemon.pokemons;
  