import {
  IPokemonGenericResult,
  IPokemonGenericInformation,
  IGetPokemonsResponse,
  IPokemonType,
  IPokemonMove,
  IPokemonDetails,
  IPokemonSpecieResponse,
  IEvolutionChainPayload,
  IPokemonEvolutionChain,
  IChainNode,
} from "@/types";
import { compact, isEmpty, uniq } from 'lodash';

const MAX_GIFS_LIMIT = 649;
const MAX_HIGH_QUALITY_IMAGES_LIMIT = 905;
const MAX_LOW_QUALITY_IMAGES_LIMIT = 10157;

export const getPokemonAssets = (id: number | string): { imageUrl: string; animationUrl: string } => {
  const idNumber = Number(id);
  if (idNumber > MAX_LOW_QUALITY_IMAGES_LIMIT || idNumber === 10153 || idNumber === 10154) {
    return {
      imageUrl: '/question-mark.png',
      animationUrl: '/question-mark.png',
    }
  }
  const threeDigitsId = ('000' + idNumber).slice(-3);
  const imageUrl = idNumber <= MAX_HIGH_QUALITY_IMAGES_LIMIT ? `${process.env.POKEMON_IMAGES_URL}/${threeDigitsId}.png` : `${process.env.POKEMON_IMAGES_LOW_QUALITY_URL}/${idNumber}.png`;
  const animationUrl = idNumber <= MAX_GIFS_LIMIT ? `${process.env.POKEMON_ANIMATED_GIF_URL}/${id}.gif` : imageUrl;
  return { imageUrl, animationUrl };
}

const getIdFromUrl = (url: string): number=> {
  if (!url) return 0;
  const splittedUrl = compact(url.split('/'));
  return Number(splittedUrl[splittedUrl.length - 1]);
}

export const mapPokemonInformation = (
  pokemonInfo: IPokemonGenericResult,
): IPokemonGenericInformation => {
  const id = getIdFromUrl(pokemonInfo.url);
  const { imageUrl, animationUrl } = getPokemonAssets(id);
  return ({
    name: pokemonInfo.name,
    id,
    imageUrl,
    animationUrl,
  });
};

export const fetchPokemons = async (offset: number, limit = 60): Promise<IPokemonGenericInformation[]> => {
  const apiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon?offset=${offset}&limit=${limit}`);
  const response = await apiResponse.json() as IGetPokemonsResponse;
  const pokemons = response.results.map(mapPokemonInformation);
  return pokemons;
};

export const getPokemonMoves = (moves: IPokemonMove[]): string[] => compact(moves?.map((pokemonMove: IPokemonMove) => {
  const pokemonKnowsMove = (pokemonMove.version_group_details ?? []).some(item => item.level_learned_at > 0);
  return pokemonKnowsMove ? pokemonMove.move.name : null;
}));

export const mapSpecieResponse = (specieResponse: IPokemonSpecieResponse): string[] => (
  uniq(compact(specieResponse.flavor_text_entries
    .filter(entry => entry?.flavor_text && entry?.language?.name === 'en')
    .map(entry => (entry?.flavor_text ?? '').replaceAll('\n', ' ').replaceAll('\f', ' '))))
    .slice(0, 3)
);

export const getEvolutionChain = (payload: IChainNode): IPokemonEvolutionChain => {
  const name = payload.species.name;
  const id = getIdFromUrl(payload.species.url);
  if (isEmpty(payload.evolves_to)) return { name, id, evolvesTo: []};
  const evolvesTo = payload.evolves_to
    .map(item => ({
      name: item.species.name,
      id: getIdFromUrl(item.species.url),
      evolvesTo: (item.evolves_to ?? []).map(evolutionPayload => getEvolutionChain(evolutionPayload)),
    }));
  return { name, id, evolvesTo };
}

export const getEvolvesFrom = (evolutionChain: IPokemonEvolutionChain, id: number): IPokemonEvolutionChain => {
  let result = {};

  const isNextEvolution = (chain: IPokemonEvolutionChain): boolean =>
    (chain.evolvesTo ?? []).some(pokemon => pokemon.id === id);

  const searchEvolvesTo = (evolvesTo: IPokemonEvolutionChain[]) => {
    evolvesTo.forEach(item => {
      if (!isEmpty(result)) return;
      if (isNextEvolution(item)) {
        result = { name: item.name as string , id: item.id as number };
        return;
      }
      if (!isEmpty(item.evolvesTo)) searchEvolvesTo(item.evolvesTo ?? []);
    });
  };

  if (isNextEvolution(evolutionChain)) {
    return { name: evolutionChain?.name as string , id: evolutionChain.id as number };
  }
  searchEvolvesTo(evolutionChain.evolvesTo ?? []);
  return result;
};

export const getEvolvesTo = (evolutionChain: IPokemonEvolutionChain, id: number): IPokemonEvolutionChain[] => {
  let result = [] as IPokemonEvolutionChain[];

  const isTargetPokemon = (chain: IPokemonEvolutionChain): boolean => id === chain.id;

  const searchEvolvesTo = (evolvesTo: IPokemonEvolutionChain[]) => {
    evolvesTo.forEach(item => {
      if (!isEmpty(result)) return;
      if (isTargetPokemon(item)) {
        result = (item.evolvesTo ?? []).map(item => ({ name: item.name as string, id: item.id as number }));
        return;
      }
      if (!isEmpty(item.evolvesTo)) searchEvolvesTo(item.evolvesTo ?? []);
    });
  };

  if (isTargetPokemon(evolutionChain)) {
    return (evolutionChain.evolvesTo ?? []).map(item => ({ name: item.name as string, id: item.id as number }));
  }
  searchEvolvesTo(evolutionChain.evolvesTo ?? []);
  return result;
}

export const getPokemonDetails = async (slug: string | number): Promise<IPokemonDetails> => {
  const apiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon/${slug}`);
  const response = await apiResponse.json();
  const id = response.id;
  const { imageUrl, animationUrl } = getPokemonAssets(id);
  const moves = getPokemonMoves(response.moves);
  const specieApiResponse = await fetch(`${process.env.POKE_API_URL}/pokemon-species/${id}`);
  const specieResponse = await specieApiResponse.json() as IPokemonSpecieResponse;
  const evolutionChainApiResponse = await fetch(specieResponse.evolution_chain.url);
  const evolutionChainResponse = await evolutionChainApiResponse.json() as IEvolutionChainPayload;
  const evolutionChain = getEvolutionChain(evolutionChainResponse.chain);
  const evolvesFrom = getEvolvesFrom(evolutionChain, id);
  const evolvesTo = getEvolvesTo(evolutionChain, id);
  const about = mapSpecieResponse(specieResponse);
  const details = {
    name: response.name,
    id,
    imageUrl,
    animationUrl,
    weight: response.weight / 10,
    height: response.height * 10,
    types: (response.types ?? []).map((pokemonType: IPokemonType) => pokemonType.type.name),
    evolvesFrom,
    evolvesTo,
    moves,
    about,
  };
  return details;
}