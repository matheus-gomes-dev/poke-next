import {
  IPokemonGenericResult,
  IPokemonGenericInformation,
  IGetPokemonsResponse,
  IPokemonType,
  IPokemonMove,
  IPokemonDetails,
} from "@/types";
import { compact } from 'lodash';

// const API_POKEMON_COUNT = 1281;
const MAX_GIFS_LIMIT = 649;
const MAX_IMAGES_LIMIT = 905;

export const getPokemonAssets = (id: number | string): { imageUrl: string; animationUrl: string } => {
  const idNumber = Number(id);
  const threeDigitsId = ('000' + idNumber).slice(-3);
  const imageUrl = `${process.env.POKEMON_IMAGES_URL}/${threeDigitsId}.png`;
  const animationUrl = idNumber <= MAX_GIFS_LIMIT ? `${process.env.POKEMON_ANIMATED_GIF_URL}/${id}.gif` : imageUrl;
  return { imageUrl, animationUrl };
}

export const mapPokemonInformation = (
  pokemonInfo: IPokemonGenericResult,
): IPokemonGenericInformation => {
  const splittedPokemonUrl = compact(pokemonInfo.url.split('/'));
  const id = Number(splittedPokemonUrl[splittedPokemonUrl.length - 1]);
  const { imageUrl, animationUrl } = getPokemonAssets(id);
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
};

export const getPokemonDetails = async (slug: string | number): Promise<IPokemonDetails> => {
  const apiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon/${slug}`);
  const response = await apiResponse.json();
  const id = response.id;
  const { imageUrl, animationUrl } = getPokemonAssets(id);
  const moves = compact(response.moves.map((pokemonMove: IPokemonMove) => {
    const pokemonKnowsMove = (pokemonMove.version_group_details ?? []).some(item => item.level_learned_at > 0);
    return pokemonKnowsMove ? pokemonMove.move.name : null;
  })) as string[];
  const details = {
    name: response.name,
    id,
    imageUrl,
    animationUrl,
    weight: response.weight / 10,
    height: response.height * 10,
    types: (response.types ?? []).map((pokemonType: IPokemonType) => pokemonType.type.name),
    moves,
  };
  return details;
}