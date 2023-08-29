import React from 'react';
import Link from 'next/link';
import styles from './NavBar.module.css'; // Import CSS module
import IconsBar from './IconsBar';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.iconsBar}>
        <IconsBar />
      </div>
      <div className={styles.navLinks}>
        <Link href="/">
          <div className={styles.navLink}>Home</div>
        </Link>
        <Link href="/products">
          <div className={styles.navLink}>Products</div>
        </Link>
        <Link href="/about">
          <div className={styles.navLink}>About</div>
        </Link>
      </div>
      <div className={styles.logoContainer}>
        <img src="../images/logo.png" alt="Logo" className={styles.logo} />
      </div>
    </div>
  );
};

export default NavBar;
