import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar';
import { PokemonsProvider } from '@/context/pokemons';
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PokemonsProvider>
      <NextNProgress color='#FF1D1F' options={{ showSpinner: false }} />
      <Navbar />
      <Component {...pageProps} />
    </PokemonsProvider>
  );
}
