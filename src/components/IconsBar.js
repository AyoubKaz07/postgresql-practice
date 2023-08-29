import React from 'react';
import Link from 'next/link';
import styles from './IconsBar.module.css'; // Import CSS module

const IconsBar = () => {
  return (
    <div className={styles.iconsBar}>
      <Link href="/cart">
        <div className={styles.iconLink}>
          <img src="../images/cart-icon.jpeg" alt="Cart" className={styles.icon} />
        </div>
      </Link>
      <Link href="/account">
        <div className={styles.iconLink}>
          <img src="../images/account-icon.jpeg" alt="Account" className={styles.icon} />
        </div>
      </Link>
    </div>
  );
};

export default IconsBar;