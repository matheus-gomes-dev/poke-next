export interface IPokemonGenericResult {
  name: string,
  url: string,
};

export interface IPokemonGenericInformation {
  name: string,
  id: number,
  imageUrl: string,
  animationUrl: string,
};

export interface IGetPokemonsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokemonGenericResult[];
}

interface IPokemonAPIAttribute {
  name: string;
  url: string;
}

interface IVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: IPokemonAPIAttribute;
  version_group: IPokemonAPIAttribute;
}

export interface IPokemonType {
  slot: number;
  type: IPokemonAPIAttribute;
}

export interface IPokemonMove {
  move: IPokemonAPIAttribute;
  version_group_details: IVersionGroupDetail[];
}

export interface IPokemonDetails extends IPokemonGenericInformation {
  weight: number;
  height: number;
  types: string[];
  moves: string[];
}