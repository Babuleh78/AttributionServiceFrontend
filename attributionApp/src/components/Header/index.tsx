import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./Header.module.css"

const Header: React.FC = () => {
  return (
    <header className={styles.mainHeader}>
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>
          <Link to="/composers">ALLMUSIC</Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;