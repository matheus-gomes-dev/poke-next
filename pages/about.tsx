import styles from '@/styles/About.module.css';
import Image from 'next/image';

const About = () => (
  <main className={styles.main}>
    <div className={styles.aboutContainer}>
      <Image
        src='/professor-oak.png'
        width={115}
        height={250}
        alt='Professor Oak image'
        data-cy="professor-oak-img"
      />
      <section className={styles.textContainer} data-cy="about-section-0">
        PokéNext is a pokedex like app built with <a className={styles.link} href="https://nextjs.org/" target='_blank'>Next.js</a> by <a className={styles.link} href="https://www.linkedin.com/in/matheus-lima-923501a8/" target='_blank'>Matheus Gomes.</a>
      </section>
      <section className={styles.textContainer} data-cy="about-section-1">
        It consumes data from <a className={styles.link} href="https://pokeapi.co/" target='_blank'>PokéApi</a>, a RESTful API to highly detailed objects built from thousands of lines of data related to Pokémon.
      </section>
      <section className={styles.textContainer} data-cy="about-section-2">
        PokéNext source code can be found in this public <a className={styles.link} href="https://github.com/matheus-gomes-dev/poke-next" target='_blank'>Github repository.</a>
      </section>
    </div>
  </main>
);

export default About;