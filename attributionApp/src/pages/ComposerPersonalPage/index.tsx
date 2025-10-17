// src/pages/ComposerPersonalPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { ComposerMocks } from '../../modules/mocks';
import defaultComposerImage from '../../assets/default-composer.png';
import styles from './ComposerPersonalPage.module.css';

const ComposerPersonalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const composerId = parseInt(id || '', 10);
  const composer = ComposerMocks.find(c => c.id === composerId);

  console.log('CSS styles:', styles);

  if (!composer) {
    return <div>Композитор не найден.</div>;
  }

  const intervalStats = [
    { group: "Унисоны и секунды", freq: composer.unisonsSecondsFreq, stddev: composer.unisonsSecondsStddev },
    { group: "Терции", freq: composer.thirdsFreq, stddev: composer.thirdsStddev },
    { group: "Кварты и квинты", freq: composer.fourthsFifthsFreq, stddev: composer.fourthsFifthsStddev },
    { group: "Сексты и септимы", freq: composer.sixthsSeventhsFreq, stddev: composer.sixthsSeventhsStddev },
    { group: "Октавы", freq: composer.octavesFreq, stddev: composer.octavesStddev },
  ];

  return (
    <div className={styles.composerContent}> 
      <div className={styles.composerContainer}> 
        <h1 className={styles.composerTitle}>{composer.name}</h1>

        <div className={styles.composerImage}>
          <img
            src={composer.portraitUrl || defaultComposerImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultComposerImage;
            }}
          />
        </div>

        <div className={styles.intervalStats}>
          <h2>Статистика интервалов</h2>
          <table className={styles.intervalTable}>
            <thead>
              <tr>
                <th>Интервал</th>
                <th>Частотность (%)</th>
                <th>Стандартное отклонение</th>
              </tr>
            </thead>
            <tbody>
              {intervalStats.map((stat, index) => (
                <tr key={index} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                  <td>{stat.group}</td>
                  <td>{stat.freq?.toFixed(1) || '-'}</td>
                  <td>{stat.stddev?.toFixed(1) || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.infoSectionsContainer}>
          <div className={styles.infoSection}>
            <h3>Основная информация</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Период творчества:</span>
              <span className={styles.infoValue}>{composer.period}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Проанализировано произведений:</span>
              <span className={styles.infoValue}>{composer.analyzedWorks}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Общее количество интервалов:</span>
              <span className={styles.infoValue}>{composer.totalIntervals?.toLocaleString()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Тип полифонии:</span>
              <span className={styles.infoValue}>{composer.polyphonyType}</span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3>Биография</h3>
            <div className={styles.infoItem}>
              <span className={styles.bioLabel}>{composer.biography}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposerPersonalPage;