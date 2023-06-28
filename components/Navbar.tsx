import React from 'react';
import styles from '@/styles/components/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';

console.log(styles.headerContainer);

const Header = (): React.ReactElement => (
  <nav>
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.logoContainer}>
          <Image src='/pokeball-icon.png' width={50} height={50} alt="pokeball icon" />
          <div>
            PokeNext
          </div>
        </div>
        <ul className={styles.navigationContainer}>
          <li>
            <Link href='/'>Home</Link>
          </li>
          <li>
            <Link href='/about'>About</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Header;