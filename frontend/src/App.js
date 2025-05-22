import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthProvider, AuthContext } from './AuthContext';
import { Container, Alert, Button } from 'react-bootstrap';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function MainAppContent() {
  const { token, role, logout } = useContext(AuthContext);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [currentPage, setCurrentPage] = useState(window.location.hash === '#register' ? 'register' : 'login');

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const verifyToken = useCallback(async () => {
    if (token) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.warn("Token verification failed, logging out.");
          logout();
        }
      } catch (error) {
          console.error("Error during token verification:", error);
          logout();
      }
    }
    setIsAuthChecking(false);
  }, [token, logout, BACKEND_URL]);

  useEffect(() => {
    verifyToken();

    const handleHashChange = () => {
      setCurrentPage(window.location.hash === '#register' ? 'register' : 'login');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [verifyToken]);

  if (isAuthChecking) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="h4 text-muted">Checking authentication...</p>
      </Container>
    );
  }

  let content;
  if (!token) {
    content = (
      <>
        {currentPage === 'login' ? (
          <LoginPage />
        ) : (
          <RegisterPage />
        )}
      </>
    );
  } else {
    switch (role) {
      case 'admin':
        content = <AdminDashboard />;
        break;
      case 'user':
        content = <UserDashboard />;
        break;
      case 'store_owner':
        content = <StoreOwnerDashboard />;
        break;
      default:
        content = (
          <Container className="d-flex justify-content-center align-items-center min-vh-100 flex-column">
            <Alert variant="danger" className="h4 text-center">
              Access Denied: Your role is not recognized or authorized.
            </Alert>
            <Button variant="danger" onClick={logout} className="mt-3">
              Logout
            </Button>
          </Container>
        );
    }
  }

  return (
    <div className="bg-light font-sans text-dark">
      {content}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;