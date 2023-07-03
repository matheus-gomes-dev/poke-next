import styles from '@/styles/NotFound.module.css';
import Image from 'next/image';

const NotFound = (): React.ReactElement => (
  <main className={styles.main}>
    <div className={styles.notFoundContainer}>
      <Image
        src='/sad-pikachu-face.png'
        width={180}
        height={180}
        alt='Pokémon not found image'
      />
      <span>Nothing found here...</span>
    </div>
  </main>
);

export default NotFound;
