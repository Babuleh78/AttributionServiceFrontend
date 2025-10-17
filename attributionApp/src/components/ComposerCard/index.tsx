import React from 'react';
import { Link } from 'react-router-dom';
import type { Composer } from '../../modules/types';
import defaultComposerImage from '../../assets/default-composer.png';
import styles from './ComposerCard.module.css';
import { useAnalysis } from '../../hooks/useAnalyses';

interface ComposerCardProps {
  composer: Composer;
}

const ComposerCard: React.FC<ComposerCardProps> = ({ composer }) => {

 const { createNewAnalysis } = useAnalysis(null);

  const handleAddToDraft = () => {
    // Создаём новый анализ с этим композитором
    const newId = createNewAnalysis([composer.id]);
    window.location.href = `/analysiss/${newId}`;
  };

  return (
    <div className={styles.composerCard}>
      <div className={styles.composerImage}>
        <img
          src={composer.portraitUrl || defaultComposerImage}
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultComposerImage;
          }}
        />
      </div>

      <div className={styles.composerContent}>
        <div className={styles.composerHeader}>
          <h3 className={styles.composerName}>{composer.name}</h3>
        </div>

        <div className={styles.composerStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Проанализировано произведений:</span>
            <span className={styles.statValue}>{composer.analyzedWorks}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Общее количество интервалов:</span>
            <span className={styles.statValue}>
              {composer.totalIntervals ? composer.totalIntervals.toLocaleString() : null}
            </span>
          </div>
        </div>

        <div className={styles.composerActions}>
            <Link to={`/composers/${composer.id}`} className={styles.detailsLink}>
            Подробнее
            </Link>
            <button className={styles.orderLink} onClick={handleAddToDraft}>
            Добавить в заявку
            </button>
        </div>
      </div>
    </div>
  );
};

export default ComposerCard;