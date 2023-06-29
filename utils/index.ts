import { IPokemonGenericResult, IPokemonGenericInformation, IGetPokemonsResponse } from "@/types";

// const API_POKEMON_COUNT = 1281;
// const MAX_LIMIT = 649; // with image and gif
// const KNOWN_POKEMONS = 1010; // with valid api response

export const mapPokemonInformation = (
  pokemonInfo: IPokemonGenericResult,
  index: number,
): IPokemonGenericInformation => {
  const id = index + 1;
  const threeDigitsId = ('000' + id).slice(-3);
  const imageUrl = `${process.env.POKEMON_IMAGES_URL}/${threeDigitsId}.png`;
  const animationUrl = `${process.env.POKEMON_ANIMATED_GIF_URL}/${id}.gif`;
  return ({
    name: pokemonInfo.name,
    id,
    imageUrl,
    animationUrl,
  });
};

export const fetchPokemons = async (offset: number, limit = 60) => {
  const apiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const response = await apiResponse.json() as IGetPokemonsResponse;
  const pokemons = response.results.map(mapPokemonInformation);
  return pokemons;
}