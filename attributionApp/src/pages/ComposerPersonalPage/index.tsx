// src/pages/ComposerPersonalPage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert, Container } from 'react-bootstrap';
import { useComposer } from '../../hooks/useComposers';
import defaultComposerImage from '/default-composer.png';
import styles from './ComposerPersonalPage.module.css';

const ComposerPersonalPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const composerId = id ? parseInt(id, 10) : 0;
  
  const { composer, loading, error } = useComposer(composerId);

  // Функция для получения статистики интервалов
  const getIntervalStats = () => {
    if (!composer) return [];

    // Если данные уже в формате моков (отдельные поля)
    if (composer.unisonsSecondsFreq !== undefined) {
      return [
        {
          group: 'Унисоны и секунды',
          freq: composer.unisonsSecondsFreq,
          stddev: composer.unisonsSecondsStddev
        },
        {
          group: 'Терции',
          freq: composer.thirdsFreq,
          stddev: composer.thirdsStddev
        },
        {
          group: 'Кварты и квинты',
          freq: composer.fourthsFifthsFreq,
          stddev: composer.fourthsFifthsStddev
        },
        {
          group: 'Сексты и септимы',
          freq: composer.sixthsSeventhsFreq,
          stddev: composer.sixthsSeventhsStddev
        },
        {
          group: 'Октавы',
          freq: composer.octavesFreq,
          stddev: composer.octavesStddev
        }
      ];
    }

    return [];
  };

  const getImageUrl = () => {
    if (!composer?.portraitUrl) {
      return defaultComposerImage;
    }
    
    const imagePath = composer.portraitUrl;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:9000${imagePath}`;
    }
    
    return `http://localhost:9000/images/${imagePath}`;
  };

  // Состояние загрузки
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
          <p className="mt-3">Загрузка данных композитора...</p>
        </div>
      </Container>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Ошибка</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  // Композитор не найден
  if (!composer) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <Alert.Heading>Композитор не найден</Alert.Heading>
          <p>Запрошенный композитор не существует или был удален.</p>
        </Alert>
      </Container>
    );
  }

  const intervalStats = getIntervalStats();
  const imageUrl = getImageUrl();

  return (
    <div className={styles.composerContent}> 
      <div className={styles.composerContainer}> 
        <h1 className={styles.composerTitle}>{composer.name}</h1>

        <div className={styles.composerImage}>
          <img
            src={imageUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultComposerImage;
            }}
            alt={`Портрет ${composer.name}`}
            className="img-fluid"
          />
        </div>

        <div className={styles.intervalStats}>
          <h2>Статистика интервалов</h2>
          {intervalStats.length > 0 ? (
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
                    <td>{stat.freq !== null ? stat.freq.toFixed(1) : '-'}</td>
                    <td>{stat.stddev !== null ? stat.stddev.toFixed(1) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Статистика интервалов недоступна</p>
          )}
        </div>

        <div className={styles.infoSectionsContainer}>
          <div className={styles.infoSection}>
            <h3>Основная информация</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Период творчества:</span>
              <span className={styles.infoValue}>{composer.period || 'Не указано'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Проанализировано произведений:</span>
              <span className={styles.infoValue}>
                {composer.analyzedWorks !== null && composer.analyzedWorks !== undefined 
                  ? composer.analyzedWorks 
                  : 'Не указано'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Общее количество интервалов:</span>
              <span className={styles.infoValue}>
                {composer.totalIntervals !== null && composer.totalIntervals !== undefined 
                  ? composer.totalIntervals.toLocaleString() 
                  : 'Не указано'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Тип полифонии:</span>
              <span className={styles.infoValue}>{composer.polyphonyType || 'Не указано'}</span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3>Биография</h3>
            <div className={styles.infoItem}>
              <span className={styles.bioLabel}>{composer.biography || 'Биография отсутствует'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposerPersonalPage;