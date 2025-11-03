import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav} from 'react-bootstrap';
import styles from "./Header.module.css";
//import { useAnalysis } from '../../hooks/useAnalyses';

const Header: React.FC = () => {
  const location = useLocation();
  // const { draftAnalysis } = useAnalysis();

  // const hasComposersInDraft = draftAnalysis && draftAnalysis.composers.length > 0;


  return (
    <Navbar className={styles.mainHeader} expand="lg">
      <div className={styles.headerContent}>
        <Navbar.Brand as={Link} to="/composers" className={styles.brandLink}>
            ALLMUSIC
        </Navbar.Brand>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`ms-auto ${styles.nav}`}>
            <Nav.Link 
              as={Link}
              to="/composers" 
              className={`${styles.navLink} ${
                location.pathname.startsWith('/composers') ? styles.navLinkActive : ''
              }`}
            >
              Композиторы
            </Nav.Link>
            
            {/* {hasComposersInDraft ? (
              <Nav.Link
                className={`${styles.navLink} ${
                  location.pathname.startsWith('/analysiss') ? styles.navLinkActive : ''
                }`}
              >
                Заявки <Badge bg="light" text="dark" className={styles.badge}>
                 
                </Badge>
              </Nav.Link>
            ) : (
              <Nav.Link 
                className={`${styles.navLink} ${styles.navLinkDisabled}`}
                title="Добавьте композиторов в заявку"
                disabled
              >
                Заявки
              </Nav.Link>
            )} */}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;