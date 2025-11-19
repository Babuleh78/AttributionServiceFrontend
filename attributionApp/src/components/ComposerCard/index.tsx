// src/components/ComposerCard/index.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import defaultComposerImage from '/default-composer.png';
import styles from './ComposerCard.module.css';
// import { useAnalysis } from '../../hooks/useAnalyses';

const ComposerCard: React.FC<{ composer: any }> = ({ composer }) => {
  //const { addToDraftAnalysis } = useAnalysis();

   const getImageUrl = () => {
    if (!composer.image) {
     
      return defaultComposerImage;
    }
    
    // Если image уже полный URL, используем как есть
    if (composer.image.startsWith('http')) {
      return composer.image;
    }
    
    // Если image относительный путь, добавляем базовый URL
    if (composer.image.startsWith('/')) {
      return `http://localhost:9000${composer.image}`;
    }
    
    // Для любых других случаев
    return `http://localhost:9000/images/${composer.image}`;
  };

  // const handleAddToDraft = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
    
  //   addToDraftAnalysis(composer.id);
    
  // };

    const imageUrl = getImageUrl();

  return (
    <div className={`${styles.composerCard} card`}>
      <div className={styles.composerImage}>
        <img
          src={imageUrl} 
          onError={(e) => {
            console.log(' Ошибка загрузки изображения:', imageUrl);
            (e.target as HTMLImageElement).src = defaultComposerImage;
          }}
          alt={composer.name || 'Композитор'}
          className="img-fluid"
          onLoad={() => console.log('Изображение загружено:', imageUrl)}
        />
      </div>

      <div className={styles.composerContent}>
        <div className={styles.composerHeader}>
          <h3 className={styles.composerName}>{composer.name}</h3>
        </div>

        <div className={styles.composerStats}>
          <div className={`${styles.statItem} d-flex justify-content-between align-items-center`}>
            <span className={styles.statLabel}>Проанализировано произведений:</span>
            <span className={styles.statValue}>
              {composer.analyzed_works ? composer.analyzed_works : composer.analyzedWorks}
              </span>
          </div>
          <div className={`${styles.statItem} d-flex justify-content-between align-items-center`}>
            <span className={styles.statLabel}>Общее количество интервалов:</span>
            <span className={styles.statValue}>
              {composer.total_intervals ? composer.total_intervals.toLocaleString() : composer.totalIntervals}
            </span>
          </div>
        </div>

        <div className={styles.composerActions}>
          <Link to={`/composers/${composer.id}`} className={`${styles.detailsLink} btn`}>
            Подробнее
          </Link>
          {/* <button 
            className={`${styles.orderLink} btn`}
            onClick={handleAddToDraft}
          >
            Добавить в заявку
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ComposerCard;