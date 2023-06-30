import { IPokemonGenericInformation } from "@/types";
import { fetchPokemons } from "@/utils";
import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface IPokemonContext {
  pokemons: IPokemonGenericInformation[];
  isLoading: boolean;
  loadMorePokemons: () => void;
};

const Context = createContext<IPokemonContext | null>(null);

export function PokemonsProvider({ children }: PropsWithChildren): JSX.Element {
  const [pokemons, setPokemons] = useState<IPokemonGenericInformation[]>([]);
  const [offset, setOffset] = useState<number>(150);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMorePokemons = async () => {
    setIsLoading(true);
    try {
      const newPokemons = await fetchPokemons(offset, 60);
      setIsLoading(false);
      setOffset(offset + newPokemons.length);
      setPokemons([...pokemons, ...newPokemons]);
    } catch (error) {
      setIsLoading(false);
    }
  }

  return (
    <Context.Provider value={{ pokemons, isLoading, loadMorePokemons }}>{children}</Context.Provider>
  );
}

export function usePokemonContext() {
  return useContext(Context);
}