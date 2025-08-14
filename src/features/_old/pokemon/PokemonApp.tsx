import PokemonList from "./PokemonList";
import PokemonDetail from "./PokemonDetail";
import React from "react";

const PokemonApp = () => {
    const [selectedPokemon, setSelectedPokemon] = React.useState<string | undefined>(undefined);

    const doSelect = (name: string) => { 
        setSelectedPokemon(name);
    }

  return (
    <div className="PokemonApp">
      <header className="PokemonApp-header">
        <h1>Pokémon App</h1>
      </header>
      {selectedPokemon && (
          <PokemonDetail name={selectedPokemon} />
        )}        
        <PokemonList onSelect={doSelect} />

    </div>
  );
};


export default PokemonApp;