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

// interface Data {
//   [key: string]: string | number | undefined | null;
// }