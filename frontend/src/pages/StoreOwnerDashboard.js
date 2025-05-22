import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../AuthContext';
import UpdatePasswordModal from '../components/UpdatePasswordModal';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';

function StoreOwnerDashboard() {
  const authContext = useContext(AuthContext);
  const [storeRatings, setStoreRatings] = useState([]);
  const [usersWhoRatedStores, setUsersWhoRatedStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchStoreOwnerRatings = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!authContext || !authContext.token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authContext.token}`,
      };

      const [storeRatingsRes, usersRatedRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/ratings/owner`, { headers }),
        fetch(`${BACKEND_URL}/api/ratings/owner/users-rated`, { headers }),
      ]);

      if (!storeRatingsRes.ok || !usersRatedRes.ok) {
        const storeError = !storeRatingsRes.ok ? `Store ratings fetch failed: ${storeRatingsRes.statusText}` : '';
        const usersError = !usersRatedRes.ok ? `Users rated fetch failed: ${usersRatedRes.statusText}` : '';
        throw new Error(`Failed to fetch dashboard data. ${storeError} ${usersError}`);
      }

      const storeRatingsData = await storeRatingsRes.json();
      const usersRatedData = await usersRatedRes.json();

      setStoreRatings(storeRatingsData);
      setUsersWhoRatedStores(usersRatedData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authContext.token, BACKEND_URL]);

  useEffect(() => {
    if (authContext && authContext.token) {
      fetchStoreOwnerRatings();
    } else {
      setLoading(false);
      setError('Not authenticated. Please log in.');
    }
  }, [authContext, fetchStoreOwnerRatings]);

  const { logout } = authContext;

  if (!authContext) {
    console.error("AuthContext is null in StoreOwnerDashboard. Ensure it's rendered within AuthProvider.");
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="h4 text-muted">Authentication context not available. Please log in again.</p>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="h4 text-muted">Loading dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Alert variant="danger" className="h4 text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <header className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h1 className="h2 text-dark">Store Owner Dashboard</h1>
        <div className="d-flex align-items-center">
          <Button variant="warning" onClick={() => setShowUpdatePasswordModal(true)} className="me-2" >Update Password</Button>
          <Button variant="danger" onClick={logout} >Logout</Button>
        </div>
      </header>

      <section className="mb-4">
        <h2 className="h3 text-dark mb-3">Your Stores' Ratings Overview</h2>
        {storeRatings.length === 0 ? (
          <div className="card shadow-sm p-4 text-center text-muted">
            No stores found or no ratings submitted for your stores yet.
          </div>
        ) : (
          <Row className="g-4">
            {storeRatings.map((store) => (
              <Col md={4} key={store.name}>
                <Card className="shadow-sm p-4 text-center">
                  <Card.Title className="h4 text-dark mb-2">{store.name}</Card.Title>
                  <Card.Text className="h5 text-muted mb-2">Average Rating:</Card.Text>
                  <Card.Text className="display-4 text-primary">
                    {typeof store.avg_rating === 'number' && !isNaN(store.avg_rating)
                      ? store.avg_rating.toFixed(2)
                      : (typeof store.avg_rating === 'string' && !isNaN(parseFloat(store.avg_rating))
                          ? parseFloat(store.avg_rating).toFixed(2)
                          : 'N/A')}
                  </Card.Text>
                  <Card.Text className="text-muted">({store.total_ratings} total ratings)</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </section>

      <section>
        <h2 className="h3 text-dark mb-3">Users Who Rated Your Stores</h2>
        {usersWhoRatedStores.length === 0 ? (
          <div className="card shadow-sm p-4 text-center text-muted">
            No users have submitted ratings for your stores yet.
          </div>
        ) : (
          <div className="card shadow-sm p-3">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Store Rated</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {usersWhoRatedStores.map((ratingEntry, index) => (
                  <tr key={index}>
                    <td>{ratingEntry.user_name}</td>
                    <td>{ratingEntry.user_email}</td>
                    <td>{ratingEntry.store_name}</td>
                    <td>{ratingEntry.rating}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </section>

      {showUpdatePasswordModal && (<UpdatePasswordModal onClose={() => setShowUpdatePasswordModal(false)} />)}
    </Container>
  );
}

export default StoreOwnerDashboard;