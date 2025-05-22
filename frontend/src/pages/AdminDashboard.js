import React, { useState, useContext, useEffect, useCallback } from 'react'; // Import useCallback
import { AuthContext } from '../AuthContext';
import UserTable from '../components/UserTable';
import StoreTable from '../components/StoreTable';
import AddUserModal from '../components/AddUserModal';
import AddStoreModal from '../components/AddStoreModal';
import UpdatePasswordModal from '../components/UpdatePasswordModal';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

function AdminDashboard() {
  const { token, role, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);

  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [userSortConfig, setUserSortConfig] = useState({ key: null, direction: 'ascending' });

  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });
  const [storeSortConfig, setStoreSortConfig] = useState({ key: null, direction: 'ascending' });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (role !== 'admin') {
        setError('Access Denied: Not an admin.');
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const [usersRes, storesRes, ratingsCountRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/users`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/stores`, { headers }),
        fetch(`${BACKEND_URL}/api/admin/ratings/count`, { headers }),
      ]);

      if (!usersRes.ok || !storesRes.ok || !ratingsCountRes.ok) {
        throw new Error('Failed to fetch dashboard data. Please check server status.');
      }

      const usersData = await usersRes.json();
      const storesData = await storesRes.json();
      const ratingsCountData = await ratingsCountRes.json();

      setUsers(usersData);
      setStores(storesData);
      setRatingsCount(ratingsCountData.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, role, BACKEND_URL]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
  };

  const handleUserFilterChange = (e) => {
    const { name, value } = e.target;
    setUserFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSort = (key) => {
    let direction = 'ascending';
    if (userSortConfig.key === key && userSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setUserSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = [...users]
    .filter((user) => {
      return (
        user.name.toLowerCase().includes(userFilters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(userFilters.email.toLowerCase()) &&
        user.address.toLowerCase().includes(userFilters.address.toLowerCase()) &&
        user.role.toLowerCase().includes(userFilters.role.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (userSortConfig.key) {
        const aValue = a[userSortConfig.key];
        const bValue = b[userSortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return userSortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return userSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return userSortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

  const handleStoreFilterChange = (e) => {
    const { name, value } = e.target;
    setStoreFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStoreSort = (key) => {
    let direction = 'ascending';
    if (storeSortConfig.key === key && storeSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setStoreSortConfig({ key, direction });
  };

  const filteredAndSortedStores = [...stores]
    .filter((store) => {
      return (
        store.name.toLowerCase().includes(storeFilters.name.toLowerCase()) &&
        store.email.toLowerCase().includes(storeFilters.email.toLowerCase()) &&
        store.address.toLowerCase().includes(storeFilters.address.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (storeSortConfig.key) {
        const aValue = a[storeSortConfig.key];
        const bValue = b[storeSortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return storeSortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
          return storeSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return storeSortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });

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
        <h1 className="h2 text-dark">Admin Dashboard</h1>
        <div className="d-flex align-items-center">
          <Button variant="warning" onClick={() => setShowUpdatePasswordModal(true)} className="me-2" >Update Password</Button>
          <Button variant="danger" onClick={handleLogout} >Logout</Button>
        </div>
      </header>

      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="shadow-sm p-4 text-center">
            <Card.Title className="h5 text-muted mb-2">Total Users</Card.Title>
            <p className="display-4 text-primary">{users.length}</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm p-4 text-center">
            <Card.Title className="h5 text-muted mb-2">Total Stores</Card.Title>
            <p className="display-4 text-success">{stores.length}</p>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm p-4 text-center">
            <Card.Title className="h5 text-muted mb-2">Total Ratings</Card.Title>
            <p className="display-4 text-info">{ratingsCount}</p>
          </Card>
        </Col>
      </Row>

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 text-dark">Manage Users</h2>
          <Button variant="primary" onClick={() => setShowAddUserModal(true)} >Add New User</Button>
        </div>
        <UserTable
          users={filteredAndSortedUsers}
          filters={userFilters}
          onFilterChange={handleUserFilterChange}
          onSort={handleUserSort}
          sortConfig={userSortConfig}
        />
      </section>

      <section className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 text-dark">Manage Stores</h2>
          <Button variant="success" onClick={() => setShowAddStoreModal(true)} >Add New Store</Button>
        </div>
        <StoreTable
          stores={filteredAndSortedStores}
          filters={storeFilters}
          onFilterChange={handleStoreFilterChange}
          onSort={handleStoreSort}
          sortConfig={storeSortConfig}
        />
      </section>

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={fetchDashboardData}
          token={token}
        />
      )}

      {showAddStoreModal && (
        <AddStoreModal
          onClose={() => setShowAddStoreModal(false)}
          onStoreAdded={fetchDashboardData}
          token={token}
          users={users.filter(u => u.role === 'store_owner' || u.role === 'user')}
        />
      )}

      {showUpdatePasswordModal && (<UpdatePasswordModal onClose={() => setShowUpdatePasswordModal(false)} />)}
    </Container>
  );
}

export default AdminDashboard;