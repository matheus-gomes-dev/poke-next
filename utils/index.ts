import { IPokemonGenericResult, IPokemonGenericInformation, IGetPokemonsResponse } from "@/types";
import { compact } from 'lodash';

// const API_POKEMON_COUNT = 1281;
const MAX_GIFS_LIMIT = 649;
const MAX_IMAGES_LIMIT = 905;

export const mapPokemonInformation = (
  pokemonInfo: IPokemonGenericResult,
  index: number,
): IPokemonGenericInformation => {
  const splittedPokemonUrl = compact(pokemonInfo.url.split('/'));
  const id = Number(splittedPokemonUrl[splittedPokemonUrl.length - 1]);
  const threeDigitsId = ('000' + id).slice(-3);
  const imageUrl = `${process.env.POKEMON_IMAGES_URL}/${threeDigitsId}.png`;
  const animationUrl = id <= MAX_GIFS_LIMIT ? `${process.env.POKEMON_ANIMATED_GIF_URL}/${id}.gif` : imageUrl;
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