import styles from '@/styles/components/PokemonId.module.css'

interface IPokemonIdProps {
  id: number;
}

const PokemonId = ({ id }: IPokemonIdProps): React.ReactElement => (
  <div className={styles.pokemonId} data-cy="pokemon-id">
    <span>{`#${id}`}</span>
  </div>
);

export default PokemonId;
