// src/pages/AttributionDraftPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultComposerImage from '../../assets/default-composer.png';
import styles from './AttributionDraftPage.module.css';
import { useAnalysis } from '../../hooks/useAnalyses';

const AttributionDraftPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const analysisId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();

  const { analysis, deleteAnalysis } = useAnalysis(analysisId);

  // Если анализ не найден — 404
  if (!analysis) {
    return (
      <div className={styles.pageContainer}>
        <h1>404 — Анализ не найден</h1>
        <p>Запрашиваемый анализ был удалён или не существует.</p>
        <button onClick={() => navigate('/composers')}>Вернуться к списку</button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteAnalysis();
    navigate('/composers');
  };

  // Моковые данные для анонимного произведения
  const anonymousStats = [
    { IntervalGroup: "Унисоны и секунды", Frequency: 29.1 },
    { IntervalGroup: "Терции", Frequency: 26.4 },
    { IntervalGroup: "Кварты и квинты", Frequency: 20.7 },
    { IntervalGroup: "Сексты и септимы", Frequency: 11.8 },
    { IntervalGroup: "Октавы", Frequency: 6.1 },
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Результаты атрибуции музыкального произведения</h1>

      <div className={styles.orderForm}>
        <div className={styles.orderLeft}>
          <div className={styles.composerList}>
            {analysis.composers.map((composer) => (
              <div key={composer.id} className={styles.composerItem}>
                <img
                  src={composer.portraitUrl || defaultComposerImage}
                  className={styles.composerImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultComposerImage;
                  }}
                />
                <div className={styles.composerInfo}>
                  <div className={styles.composerName}>{composer.name}</div>
                  <div className={styles.label}>Композитор</div>
                </div>
                <div className={styles.composerDetails}>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>85.5%</div>
                    <div className={styles.label}>Вероятное совпадение стиля</div>
                  </div>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>{composer.analyzedWorks}</div>
                    <div className={styles.label}>Проанализировано произведений</div>
                  </div>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>{composer.totalIntervals?.toLocaleString()}</div>
                    <div className={styles.label}>Всего интервалов</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.orderRight}>
          <div className={styles.anonymousWork}>
            <h3>Статистика анонимного произведения</h3>
            <table className={styles.intervalTable}>
              <thead>
                <tr>
                  <th>Интервал</th>
                  <th>Частотность (%)</th>
                </tr>
              </thead>
              <tbody>
                {anonymousStats.map((stat, index) => (
                  <tr key={index}>
                    <td>{stat.IntervalGroup}</td>
                    <td>{stat.Frequency.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.totalItem}>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Очистить заявки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributionDraftPage;