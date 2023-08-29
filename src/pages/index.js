import React from 'react';
import styles from '../styles/FrontPage.module.css'; // Import CSS module
import NavBar from '../components/NavBar';

function Home() {
  return (
    <div className={styles.rec}>
      <NavBar />
    </div>
  );
}

export default Home;
