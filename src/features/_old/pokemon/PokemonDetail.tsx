import { useGetPokemonDetailsQuery } from "./pokemonApiSlice";

type PokemonDetailsProps = {
  name: string;
}



const PokemonDetails: React.FC<PokemonDetailsProps> = ({name}: PokemonDetailsProps) => {
    const { data, isError, isLoading, isUninitialized } = useGetPokemonDetailsQuery({name});

    if (isLoading || isUninitialized) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      )
    }

    if (isError) {
      return (
        <div>
          <h1>There was an error!!!</h1>
        </div>
      ) 
    }


    
  return (

      <div>
        <h1>Pokémon Details</h1>
        <p>Name: {data.name}</p>
        <p>Height: {data.height}</p>
        <p>Weight: {data.weight}</p>
        <h2>Types:</h2>
        <ul>
          {data.types.map((type, index) => (
            <li key={index}>{type.type.name}</li>
          ))}
        </ul> 
      </div>
  );
};

export default PokemonDetails