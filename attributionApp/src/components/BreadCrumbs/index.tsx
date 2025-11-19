// src/components/BreadCrumbs/index.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './BreadCrumbs.module.css';
import { useAnalysis } from '../../hooks/useAnalyses';
import { ComposerMocks } from '../../modules/mocks';

interface BreadcrumbItem {
  path: string;
  label: string;
  isActive: boolean;
}

const BreadCrumbs: React.FC = () => {
  const location = useLocation();
  const { getAnalysisFromUrl } = useAnalysis();
  
  const pathnames = location.pathname.split('/').filter(x => x);

  // Функция для получения имени композитора по ID
  const getComposerName = (composerId: string): string => {
    const id = parseInt(composerId);
    const composer = ComposerMocks.find(c => c.id === id);
    return composer?.name || `Композитор #${composerId}`;
  };

  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    // Всегда добавляем "Главная"
    breadcrumbs.push({
      path: '/',
      label: 'Главная',
      isActive: false
    });

    pathnames.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === pathnames.length - 1;

      switch (path) {
        case 'composers':
          if (pathnames[index + 1]) {
            // Страница конкретного композитора - используем настоящее имя
            const composerId = pathnames[index + 1];
            const composerName = getComposerName(composerId);
             breadcrumbs.push({
              path: currentPath,
              label: 'Композиторы',
              isActive: false
            });
            breadcrumbs.push({
              path: currentPath,
              label: composerName,
              isActive: true,
            });
          } else {
            // Список композиторов
            breadcrumbs.push({
              path: currentPath,
              label: 'Композиторы',
              isActive: isLast
            });
          }
          break;

        case 'analysiss':
          if (pathnames[index + 1]) {
            // Страница конкретной заявки
            const analysisId = pathnames[index + 1];
            const analysis = getAnalysisFromUrl(analysisId);
            const composerCount = analysis?.composers.length || 0;
             breadcrumbs.push({
              path: "/composers",
              label: 'Композиторы',
              isActive: isLast
            });

            breadcrumbs.push({
              path: currentPath,
              label: `Заявка #${analysisId} (${composerCount} комп.)`,
              isActive:  true
            });
          } else {
            // Список заявок
            breadcrumbs.push({
              path: "/composers",
              label: 'Композиторы',
              isActive: isLast
            });
          }
          break;

        default:
          break;
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <div className={styles.breadcrumbsContainer}>
        {breadcrumbs.map((breadcrumb) => (
          <div key={breadcrumb.path} className={styles.breadcrumbItem}>
            {breadcrumb.isActive ? (
              <span 
                className={styles.currentPage}
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <>
                <Link 
                  to={breadcrumb.path} 
                  className={styles.breadcrumbLink}
                >
                  {breadcrumb.label}
                </Link>
                <span className={styles.separator}>/</span>
              </>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default BreadCrumbs;