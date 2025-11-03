// src/pages/GuestPage/index.tsx
import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './GuestPage.module.css';
import { useAnalysis } from '../../hooks/useAnalyses';

const GuestPage: React.FC = () => {
  const { analyses, draftAnalysisId } = useAnalysis();
  
  const activeAnalysis = draftAnalysisId ? analyses.find(a => a.id === draftAnalysisId) : null;
  

  return (
    <div className={styles.content}>
      <video 
        autoPlay 
        muted 
        loop 
        className={styles.videoBackground}
      >
        <source src="/video.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>
      
      <div className={styles.videoOverlay}></div>
      
      <div className={styles.videoBlur}></div>

      <div className={styles.headerFixed}>
        <Container>
          <Row className="align-items-center">
            <Col className="text-end">
              <Nav className={styles.nav}>
                <Nav.Link as={Link} to="/composers" className={styles.navLink}>
                  Композиторы
                </Nav.Link>
                <Nav.Link as={Link} to="/analysiss" className={styles.navLink}>
                  Заявки
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className={styles.mainContent}>
        <Row className="justify-content-center text-center">
          <Col xl={8} lg={10}>
            <div className={styles.heroSection}>
              <h2 className={styles.heroTitle}>
                Атрибуция анонимных музыкальных произведений
              </h2>
              <p className={styles.heroDescription}>
                Наш сервис использует передовые технологии анализа музыкальных интервалов 
                для определения авторства анонимных произведений. Сравнивая стилистические 
                особенности с базой данных известных композиторов, мы помогаем раскрыть 
                тайны музыкального наследия.
              </p>

             <Row className={`justify-content-center ${styles.features}`}>
                <Col xs={12} sm={6} md={5} lg={4} className="mb-4">
                  <Card as={Link} to="/composers" className={`${styles.featureButton} ${styles.squareCard}`}>
                    <Card.Body className="d-flex flex-column justify-content-center text-center">
                      <h4 className="card-title">Анализ интервалов</h4>
                      <p className="card-text mt-2">
                        Статистический анализ музыкальных интервалов
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col xs={12} sm={6} md={5} lg={4} className="mb-4">
                  <Card 
                    as={Link} 
                    to={activeAnalysis ? `/analysiss/${activeAnalysis.id}` : "/analysiss"} 
                    className={`${styles.featureButton} ${styles.squareCard}`}
                  >
                    <Card.Body>
                      <h4>
                        Сравнение стилей
                      </h4>
                      <p>
                        Сопоставление с базой композиторов
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GuestPage;