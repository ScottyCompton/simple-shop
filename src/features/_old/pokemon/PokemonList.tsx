/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { useGetPokemonListQuery } from "./pokemonApiSlice";
import styles from "./styles.module.css";

interface PokemonListProps {
  onSelect: (url: string) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ onSelect }) => {
  const { isError, data,  isLoading, isUninitialized } = useGetPokemonListQuery(10);

  if (isError) {
    return (
      <div>
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading || isUninitialized) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
      <div>
        {data.results.map((pokemon) => (
            <div key={pokemon.name} className={styles.pokemonItem}>
                <button onClick={() => {onSelect(pokemon.name)}}>
                {pokemon.name}
                </button>
            </div>
            ))}
      </div>
  );
};

export default PokemonList;
