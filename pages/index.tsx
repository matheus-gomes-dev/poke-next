import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Card from '@/components/Card';
import { IPokemonGenericInformation } from '@/types';
import { fetchPokemons } from '@/utils';
import { IPokemonContext, usePokemonContext } from '@/context/pokemons';
import { useRouter } from 'next/router';
import { NUMBER_OF_FIRST_GENERATION_POKEMONS } from '@/constants';

interface IHomeProps {
  pokemons: IPokemonGenericInformation[];
}

export async function getStaticProps() {
  const pokemons = await fetchPokemons(0, NUMBER_OF_FIRST_GENERATION_POKEMONS);
  return {
    props: {
      pokemons,
    },
  };
}

export default function Home({ pokemons }: IHomeProps) {
  const { pokemons: newPokemons, isLoading, loadMorePokemons } = usePokemonContext() as IPokemonContext;
  const router = useRouter();
  const pokemonsList = [...pokemons, ...newPokemons];
  return (
    <>
      <Head>
        <title data-cy="page-title">PokéNext</title>
        <meta name="description" content="A pokedex like app, built with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div className={styles.mainContentWrapper}>
          {pokemonsList.map(pokemon => (
            <div
              className={styles.cardWrapper}
              key={pokemon.id}
              onClick={() => router.push(`/pokemon/${pokemon.id}`)}
            >
              <Card
                name={pokemon.name}
                imageUrl={pokemon.imageUrl}
                animationUrl={pokemon.animationUrl}
                id={pokemon.id}
              />
            </div>
          ))}
        </div>
        <div className={styles.buttonContainer}>
          <button
            disabled={isLoading}
            onClick={() => loadMorePokemons()}
            data-cy='load-more-btn'
          >
            Load more
          </button>
        </div>
      </main>
    </>
  )
}
