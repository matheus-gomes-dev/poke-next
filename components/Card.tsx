import React from 'react';
import styles from '@/styles/components/Card.module.css';
import Image from 'next/image';

const Card = (): React.ReactElement => (
  <article className={styles.cardContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pokemonNumber}>
        <div>
          <span>#9</span>
        </div>
      </div>
      <div className={styles.pokemonImage}>
        <Image
          src="https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png"
          width={170}
          height={170}
          alt='pokémon image'
        />
      </div>
      <div className={styles.footer}>
        <div className="pokemonName">
          Bulbasaur
        </div>
        <div className="pokemonAnimated">
          <Image
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif"
            width={50}
            height={50}
            alt='pokémon animation'
          />
        </div>
      </div>
    </div>
  </article>
);

export default Card;