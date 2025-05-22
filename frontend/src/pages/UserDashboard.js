import React, { useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../AuthContext';
import UpdatePasswordModal from '../components/UpdatePasswordModal';
import { Container, Row, Col, Form, Button, Table, Alert, Modal } from 'react-bootstrap';

function UserDashboard() {
  const { token, logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState({ name: '', address: '' });
  const [userRatings, setUserRatings] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState('');
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchStoresAndRatings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const [storesRes, userRatingsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/stores`, { headers }),
        fetch(`${BACKEND_URL}/api/ratings/user`, { headers }),
      ]);

      if (!storesRes.ok || !userRatingsRes.ok) {
        throw new Error('Failed to fetch data. Please check server status.');
      }

      const storesData = await storesRes.json();
      const userRatingsData = await userRatingsRes.json();

      setStores(storesData);

      const ratingsMap = userRatingsData.reduce((acc, rating) => {
        acc[rating.store_id] = rating.rating;
        return acc;
      }, {});
      setUserRatings(ratingsMap);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, BACKEND_URL]);

  useEffect(() => {
    fetchStoresAndRatings();
  }, [fetchStoresAndRatings]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({ ...prev, [name]: value }));
  };

  const filteredStores = stores.filter((store) => {
    return (
      store.name.toLowerCase().includes(searchQuery.name.toLowerCase()) &&
      store.address.toLowerCase().includes(searchQuery.address.toLowerCase())
    );
  });

  const openRatingModal = (store) => {
    setSelectedStore(store);
    setCurrentRating(userRatings[store.id] || 0);
    setRatingMessage('');
    setShowRatingModal(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedStore || currentRating < 1 || currentRating > 5) {
      setRatingMessage('Please select a store and a rating between 1 and 5.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ store_id: selectedStore.id, rating: currentRating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating.');
      }

      setRatingMessage('Rating submitted successfully!');
      await fetchStoresAndRatings();
      setTimeout(() => setShowRatingModal(false), 1500);
    } catch (err) {
      setRatingMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="h4 text-muted">Loading stores...</p>
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
        <h1 className="h2 text-dark">User Dashboard</h1>
        <div className="d-flex align-items-center">
          <Button variant="warning" onClick={() => setShowUpdatePasswordModal(true)} className="me-2" >Update Password</Button>
          <Button variant="danger" onClick={logout} >Logout</Button>
        </div>
      </header>

      <section className="mb-4 card shadow-sm p-3">
        <h2 className="h4 card-title mb-3">Search Stores</h2>
        <Form>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="searchName">Store Name</Form.Label>
                <Form.Control type="text" id="searchName" name="name" value={searchQuery.name} onChange={handleSearchChange} placeholder="Search by name" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="searchAddress">Address</Form.Label>
                <Form.Control type="text" id="searchAddress" name="address" value={searchQuery.address} onChange={handleSearchChange} placeholder="Search by address" />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </section>

      <section>
        <h2 className="h3 text-dark mb-3">All Stores</h2>
        <div className="card shadow-sm p-3">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>
                    {typeof store.rating === 'number' && !isNaN(store.rating)
                      ? store.rating.toFixed(2)
                      : (typeof store.rating === 'string' && !isNaN(parseFloat(store.rating))
                          ? parseFloat(store.rating).toFixed(2)
                          : 'N/A')}
                  </td>
                  <td>
                    {userRatings[store.id] || 'Not rated'}
                  </td>
                  <td>
                    <Button variant="info" onClick={() => openRatingModal(store)} size="sm" >
                      {userRatings[store.id] ? 'Modify Rating' : 'Submit Rating'}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredStores.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No stores found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </section>

      {showRatingModal && selectedStore && (
        <Modal show={true} onHide={() => setShowRatingModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Rate {selectedStore.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <Form.Group className="mb-3">
              <Form.Label className="h5">Your Rating (1-5)</Form.Label>
              <Form.Control type="number" min="1" max="5" value={currentRating} onChange={(e) => setCurrentRating(parseInt(e.target.value) || 0)} className="w-auto mx-auto text-center" />
            </Form.Group>
            {ratingMessage && (<Alert variant={ratingMessage.startsWith('Error') ? 'danger' : 'success'}>{ratingMessage}</Alert>)}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRatingModal(false)} disabled={loading} >Cancel</Button>
            <Button variant="primary" onClick={handleSubmitRating} disabled={loading} >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {showUpdatePasswordModal && (<UpdatePasswordModal onClose={() => setShowUpdatePasswordModal(false)}/>)}
    </Container>
  );
}

export default UserDashboard;