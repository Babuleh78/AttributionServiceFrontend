// src/pages/ComposerHomePage/index.tsx
import React, { useState} from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import ComposerCard from '../../components/ComposerCard';
import noteIcon from '/note-icon.png';
import searchIcon from '/search-icon.png';
import styles from './ComposerHomePage.module.css';
// import { useAnalysis } from '../../hooks/useAnalyses';
import { useComposers } from '../../hooks/useComposers';
// import { apiService } from '../../services/api';

const ComposersHomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // const { draftAnalysis, draftAnalysisId, analyses } = useAnalysis();
  // const [composersCount, setComposersCount] = useState(0);
  //const [refresh, setRefresh] = useState(0);
  // const [isLoadingCart, setIsLoadingCart] = useState(false);
  // const [cartData, setCartData] = useState<{order_id: number, item_count: number} | null>(null);

  const { composers, loading, error, refetch } = useComposers();


  // Фильтрация композиторов на основе поискового запроса
  const filteredComposers = composers.filter(composer => 
    searchQuery === '' || 
    composer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    composer.period?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetry = () => {
    refetch();
  };

  // Обработчик отправки формы поиска
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  // Обработчик клика по корзине
  // const handleCartClick = async (e: React.MouseEvent) => {
  //   e.preventDefault();
    
  //   setIsLoadingCart(true);
    
  //   try {
  //     // Отправляем GET запрос и получаем данные
  //     const data = await apiService.sendAttributionDraft();
      
  //     // Сохраняем данные в состоянии для отображения
  //     setCartData(data);
      
  //     // Выводим в консоль для просмотра в панели разработчика
  //     console.log('Данные корзины:', data);
  //     console.log('order_id:', data.order_id);
  //     console.log('item_count:', data.item_count);
      
  //     alert(`order_id=${data.order_id}, item_count=${data.item_count}`);
      
  //   } catch (error) {
  //     console.error('Ошибка при запросе корзины:', error);
  //     alert('Произошла ошибка при обработке запроса');
  //   } finally {
  //     setIsLoadingCart(false);
  //   }
  // };

  // Обработчик нажатия клавиши Enter в поле поиска
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <Container fluid className={styles.mainContent}>
      <div className={styles.searchContainerMain}>
        <form
          onSubmit={handleSearchSubmit}
          className={styles.searchForm}
        >
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Найти композитора..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.searchInput}
              disabled={loading} 
            />
            <button type="submit" className={styles.searchButton} disabled={loading}>
              <img src={searchIcon} alt="Search" width="20" height="20" />
            </button>
          </div>
        </form>
      </div>

   

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
          <p className="mt-3">Загрузка композиторов...</p>
        </div>
      )}

      {error && (
        <Alert variant="danger" className={styles.errorAlert}>
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button onClick={handleRetry} variant="outline-danger">
              Попробовать снова
            </Button>
          </div>
        </Alert>
      )}

      {!loading && !error && (
        <Row className={styles.composersGrid}>
          {filteredComposers.length > 0 ? (
            filteredComposers.map((composer) => (
              <Col key={composer.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ComposerCard composer={composer} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center">
              <div className={styles.emptyState}>
                <h5>Композиторы не найдены</h5>
                <p>
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено`
                    : 'Нет доступных композиторов'
                  }
                </p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <div className={styles.cartIconContainer}>
        <div 
          className={styles.cartIcon}
          //onClick={handleCartClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={noteIcon} alt="Корзина" className={styles.cartImage} />
         
        </div>
      </div>
    </Container>
  );
};

export default ComposersHomePage;