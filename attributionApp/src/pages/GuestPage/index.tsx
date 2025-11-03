// src/pages/GuestPage/index.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './GuestPage.module.css';
// import { useAnalysis } from '../../hooks/useAnalyses';

const GuestPage: React.FC = () => {
  // const { analyses, draftAnalysisId } = useAnalysis();
  //const activeAnalysis = draftAnalysisId ? analyses.find(a => a.id === draftAnalysisId) : null;

  // Состояние для кнопки установки
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
  console.log('[PWA] Регистрация обработчика beforeinstallprompt...');

  const handleBeforeInstallPrompt = (e: Event) => {
    console.log('[PWA] Событие beforeinstallprompt получено!', e);
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstallButton(true);
    console.log('[PWA] Кнопка установки будет показана.');
  };

  const handleAppInstalled = () => {
    console.log('[PWA] Приложение уже установлено — кнопка скрыта.');
    setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);

  // Проверка: возможно, событие уже прошло до монтирования компонента?
  // (Редко, но бывает — тогда нужно убедиться, что SW + manifest в порядке)
  console.log('[PWA] Проверка: поддержка serviceWorker?', 'serviceWorker' in navigator);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log(`[PWA] Зарегистрировано Service Worker: ${registrations.length}`);
      registrations.forEach(reg => console.log('[PWA] SW scope:', reg.scope));
    });
  }

  // Проверим, не установлено ли уже приложение
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] Приложение запущено как standalone (уже установлено)');
    setShowInstallButton(false);
  }

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', handleAppInstalled);
    console.log('[PWA] Обработчики beforeinstallprompt и appinstalled удалены.');
  };
}, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Вызываем стандартный интерфейс установки
    (deferredPrompt as any).prompt();

    // Ждём выбор пользователя
    const { outcome } = await (deferredPrompt as any).userChoice;
    console.log(`Пользователь ${outcome === 'accepted' ? 'установил' : 'отклонил'} PWA`);

    // Скрываем кнопку
    setShowInstallButton(false);
    setDeferredPrompt(null);
  };

  return (
    <div className={styles.content}>
      <video 
        autoPlay 
        muted 
        loop 
        className={styles.videoBackground}
      >
        <source src="/AttributionServiceFrontend/video.mp4" type="video/mp4" />
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
                {/* <Nav.Link as={Link} to="/analysiss" className={styles.navLink}>
                  Заявки
                </Nav.Link> */}
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

              {showInstallButton && (
                <div className="mb-4">
                  <Button
                    variant="outline-light"
                    onClick={handleInstallClick}
                    className={styles.installButton}
                  >
                    Установить приложение
                  </Button>
                </div>
              )}

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
                
                {/* <Col xs={12} sm={6} md={5} lg={4} className="mb-4">
                  <Card 
                    as={Link} 
                    to={activeAnalysis ? `/analysiss/${activeAnalysis.id}` : "/analysiss"} 
                    className={`${styles.featureButton} ${styles.squareCard}`}
                  >
                    <Card.Body>
                      <h4>Сравнение стилей</h4>
                      <p>Сопоставление с базой композиторов</p>
                    </Card.Body>
                  </Card>
                </Col> */}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GuestPage;