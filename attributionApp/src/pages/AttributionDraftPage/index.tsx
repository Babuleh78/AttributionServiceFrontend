import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultComposerImage from '../../assets/default-composer.png';
import styles from './AttributionDraftPage.module.css';
import { useAnalysis } from '../../hooks/useAnalyses';

const AttributionDraftPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const analysisId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();

  const { analyses, draftAnalysis, clearDraftAnalysis } = useAnalysis();

  const analysis = analysisId 
    ? analyses.find(a => a.id === analysisId)
    : draftAnalysis;


  if (!analysis) {
    return (
      <div className={styles.pageContainer}>
        <h1>404 — Анализ не найден</h1>
        <p>Запрашиваемый анализ был удалён или не существует.</p>
        <button onClick={() => navigate('/composers')}>Вернуться к списку</button>
      </div>
    );
  }

  if ((!analysis || analysis.composers.length === 0)) {
    return (
      <div className={styles.pageContainer}>
        <h1>Черновик заявки</h1>
        <p>Ваша заявка пуста. Добавьте композиторов для анализа.</p>
        <button onClick={() => navigate('/composers')}>
          Вернуться к списку композиторов
        </button>
      </div>
    );
  }

  const handleClearAll = () => {
    
      clearDraftAnalysis();
      navigate('/composers');
   
  };

  const anonymousStats = [
    { IntervalGroup: "Унисоны и секунды", Frequency: 29.1 },
    { IntervalGroup: "Терции", Frequency: 26.4 },
    { IntervalGroup: "Кварты и квинты", Frequency: 20.7 },
    { IntervalGroup: "Сексты и септимы", Frequency: 11.8 },
    { IntervalGroup: "Октавы", Frequency: 6.1 },
  ];

  const mockComposers = analysis?.composers.map(composer => ({
    ...composer,
    MatchPercent: 85.5, 
    analyzed_works: composer.analyzedWorks || 15, 
    total_intervals: composer.totalIntervals || 12500, 
  })) || [];

  return (
    <div className={styles.pageContainer}>
     

      <h1 className={styles.pageTitle}>Результаты атрибуции музыкального произведения</h1>

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
          
        </div>

      <div className={styles.orderForm}>
        <div className={styles.orderLeft}>
          <div>
            {mockComposers.map((candidate) => (
              <div key={candidate.id} className={styles.composerItem}>
                <img 
                  src={candidate.portraitUrl || defaultComposerImage} 
                  className={styles.composerImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultComposerImage;
                  }}
                />
                <div className={styles.composerInfo}>
                  <div className={styles.composerName}>{candidate.name}</div>
                  <div className={styles.label}>Композитор</div>
                </div>
                <div className={styles.composerDetails}>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>{candidate.MatchPercent}%</div>
                    <div className={styles.label}>Вероятное совпадение стиля</div>
                  </div>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>{candidate.analyzed_works}</div>
                    <div className={styles.label}>Проанализировано произведений</div>
                  </div>
                  <div className={styles.valueBox}>
                    <div className={styles.value}>{candidate.total_intervals}</div>
                    <div className={styles.label}>Всего интервалов</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>

  <div className={styles.finalTotalSection}>
  <div className={styles.actionsRow}>
    <div className={`${styles.totalItem} ${styles.totalFinal} ${styles.styledButton} ${styles.deleteLink}`} style={{ 
      marginLeft: 'auto', 
      marginRight: 'auto',
      display: 'block',
      textAlign: 'center',
      maxWidth: '300px'
    }}>
      <form 
        method="post" 
        action="#" 
        style={{ display: 'inline' }}
        onSubmit={(e) => {
          e.preventDefault();
          handleClearAll();
        }}
      >
        <button 
          type="submit" 
          className={styles.deleteBtn} 
          style={{ 
            border: 'none', 
            background: 'none', 
            color: 'white', 
            fontWeight: 'bold', 
            cursor: 'pointer', 
            width: '100%',
          }}
        >
          Очистить заявки
        </button>
      </form>
    </div>
  </div>
</div>
</div>
   

    
  );
};

export default AttributionDraftPage;