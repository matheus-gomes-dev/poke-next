import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar';
import { PokemonsProvider } from '@/context/pokemons';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PokemonsProvider>
      <Navbar />
      <Component {...pageProps} />
    </PokemonsProvider>
  );
}
