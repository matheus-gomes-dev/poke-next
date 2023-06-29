import React from 'react';
import styles from '@/styles/components/Card.module.css';
import Image from 'next/image';

interface ICardProps {
  name: string;
  id: number;
  imageUrl: string;
  animationUrl: string;
};

const Card = ({ name, id, imageUrl, animationUrl }: ICardProps): React.ReactElement => (
  <article className={styles.cardContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pokemonNumber}>
        <div>
          <span>{`#${id}`}</span>
        </div>
      </div>
      <div className={styles.pokemonImage}>
        <Image
          src={imageUrl}
          width={170}
          height={170}
          alt='pokémon image'
        />
      </div>
      <div className={styles.footer}>
        <div className="pokemonName">
          {name}
        </div>
        <div className="pokemonAnimated">
          <Image
            src={animationUrl}
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