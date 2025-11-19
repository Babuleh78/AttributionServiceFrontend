import React from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ComposerCard from '../../components/ComposerCard';
import noteIcon from '/note-icon.png';
import searchIcon from '/search-icon.png';
import styles from './ComposerHomePage.module.css';
import { useComposers } from '../../hooks/useComposers';
import { setSearchTerm, setSearchQuery} from '../../features/searchSlice';
const ComposersHomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { searchTerm, searchQuery } = useSelector((state: any) => state.search);
  const { composers, loading, error, refetch } = useComposers();

  const filteredComposers = composers.filter(composer =>
    searchQuery === '' ||
    composer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    composer.period?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRetry = () => {
    refetch();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchTerm));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <Container fluid className={styles.mainContent}>
      <div className={styles.searchContainerMain}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Найти композитора..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
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

      {/* Остальное без изменений — loading, error, composersGrid */}

      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner animation="border" variant="primary" />
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
                    : 'Нет доступных композиторов'}
                </p>
              </div>
            </Col>
          )}
        </Row>
      )}

      <div className={styles.cartIconContainer}>
        <div className={styles.cartIcon} style={{ cursor: 'pointer' }}>
          <img src={noteIcon} alt="Корзина" className={styles.cartImage} />
        </div>
      </div>
    </Container>
  );
};

export default ComposersHomePage;