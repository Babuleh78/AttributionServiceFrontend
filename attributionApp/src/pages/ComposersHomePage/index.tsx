import React, { useState } from 'react';
import ComposerCard from '../../components/ComposerCard';
import { ComposerMocks } from '../../modules/mocks';
import { Link } from 'react-router-dom';
import noteIcon from '../../assets/note-icon.png';
import searchIcon from '../../assets/search-icon.png';
import styles from './ComposerHomePage.module.css';

const ComposersHomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredComposers = ComposerMocks.filter(composer => 
    composer.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const draftAnalysis = { id: 1 }; 
  const composersCount = 3; 

  return (
    <div className={styles.mainContent}>
      <div className={styles.searchContainerMain}>
        <form
          onSubmit={(e) => e.preventDefault()} 
          className={styles.searchForm}
        >
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Найти композитора..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <img src={searchIcon} alt="Search" width="20" height="20" />
            </button>
          </div>
        </form>
      </div>

      <div className={styles.composersGrid}>
        {filteredComposers.length > 0 ? (
          filteredComposers.map((composer) => (
            <ComposerCard key={composer.id} composer={composer} />
          ))
        ) : (
          <p>Композиторы не найдены.</p>
        )}
      </div>

      <div className={styles.cartIconContainer}>
        {draftAnalysis ? (
          <Link to={`/analysiss/${draftAnalysis.id}/`} className={styles.cartIcon}>
            <img src={noteIcon} alt="Корзина" className={styles.cartImage} />
            {composersCount > 0 && (
              <span className={styles.cartBadge}>{composersCount}</span>
            )}
          </Link>
        ) : (
          <div className={styles.cartIcon}>
            <img src={noteIcon} alt="Корзина" className={styles.cartImage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposersHomePage;