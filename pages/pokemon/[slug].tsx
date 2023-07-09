import React from 'react';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next'
import { range } from 'lodash';
import { NUMBER_OF_FIRST_GENERATION_POKEMONS } from '@/constants';
import { ParsedUrlQuery } from 'querystring';
import { getPokemonDetails } from '@/utils';
import { IPokemonDetails } from '@/types';
import styles from '@/styles/Pokemon.module.css';
import Image from 'next/image';
import PokemonId from '@/components/PokemonId';

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
    fallback: 'blocking',
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as IParams;
  try {
    const pokemonDetails = await getPokemonDetails(slug);
    return { props: { pokemonDetails }};
  } catch (error) {
    return { notFound: true };
  }
}

const PokemonDetails = ({ pokemonDetails }: IPokemonDetailsProps) => (
  <main className={styles.main}>
    <article className={styles.mainContentWrapper}>
      <div className={styles.headerContainer}>
        <div data-cy="pokemon-details-name">{`${pokemonDetails.name}`}</div>
        <PokemonId id={pokemonDetails.id}/>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src={pokemonDetails.imageUrl}
          width={320}
          height={320}
          alt="Pokémon image"
          data-cy="pokemon-details-image"
        />
      </div>
      <div className={styles.typesContainer}>
        <h2>{pokemonDetails.types.length > 1 ? 'Types:' : 'Type:'}</h2>
        <div className={styles.typesLabels}>
          {pokemonDetails.types.map((type, index) => (
            <div className={styles[`type-${type}`]} key={`${pokemonDetails.id}-type-${index}`}>{type}</div>
          ))}
        </div>
      </div>
      <div className={styles.animationContainer}>
        <Image
          src={pokemonDetails.animationUrl}
          width={50}
          height={50}
          alt="Pokémon animation"
          data-cy="pokemon-details-animation"
        />
      </div>
      <div className={styles.informationContainer}>
        <div className={styles.information} data-cy="pokemon-details-height">
          <span><b>Height:</b></span>
          <div>{`${pokemonDetails.height}cm`}</div>
        </div>
        <div className={styles.information} data-cy="pokemon-details-weight">
          <span><b>Weight:</b></span>
          <div>{`${pokemonDetails.weight}kg`}</div>
        </div>
      </div>
      <div className={styles.moves} data-cy="pokemon-details-moves">
        <span><b>Moves: </b><i>{pokemonDetails.moves.join(', ')}</i></span>
      </div>
    </article>
  </main>
);

export default PokemonDetails;
