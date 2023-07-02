import React from 'react';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next'
import { range } from 'lodash';
import { NUMBER_OF_FIRST_GENERATION_POKEMONS } from '@/constants';
import { ParsedUrlQuery } from 'querystring';
import { getPokemonDetails } from '@/utils';
import { useRouter } from 'next/router';
import { IPokemonDetails } from '@/types';
import styles from '@/styles/Pokemon.module.css'

interface IParams extends ParsedUrlQuery {
  slug: string;
}

interface IPokemonDetailsProps {
  pokemonDetails: IPokemonDetails;
}

export const getStaticPaths: GetStaticPaths = (): GetStaticPathsResult<IParams> => {
  const paths = range(1, NUMBER_OF_FIRST_GENERATION_POKEMONS + 1).map(id => ({
    params: {
      slug: String(id),
    },
  }));
  return {
    paths,
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams;
  try {
    const pokemonDetails = await getPokemonDetails(slug);
    console.log(pokemonDetails);
    return { props: { pokemonDetails }};
  } catch (error) {
    return { props: { pokemonDetails: {} }};
  }
}

const PokemonDetails = ({ pokemonDetails }: IPokemonDetailsProps) => {
  const router = useRouter();
  if (router.isFallback) {
    return <span>Loading...</span>
  }
  return (
    <main className={styles.main}>
      <div className={styles.mainContentWrapper}>
        <span>{JSON.stringify(pokemonDetails)}</span>
      </div>
    </main>
  );
};

export default PokemonDetails;
