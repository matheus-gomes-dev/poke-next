import React from 'react';
import styles from '@/styles/components/Navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const Header = (): React.ReactElement => {
  const [searchValue, setSearch] = React.useState<string>('');
  const router = useRouter();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    router.push(`/pokemon/${searchValue.toLowerCase()}`);
    setSearch('');
  }
  return (
    <nav data-cy='navbar'>
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoContainer} onClick={() => router.push('/')}>
            <Image src='/pokeball-icon.png' width={50} height={50} alt="pokeball icon" />
            <div>
              PokéNext
            </div>
          </div>
          <div className={styles.searchBar}>
            <input
              placeholder='Search by name or ID'
              value={searchValue}
              type='text'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
              onKeyUp={handleKeyPress}
            />
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
};

export default Header;