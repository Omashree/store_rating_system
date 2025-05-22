import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Form, Button, Alert, Card } from 'react-bootstrap';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      login(data.token, data.role);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-primary bg-gradient p-3 w-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Title className="text-center mb-4 h3">Login</Card.Title>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 py-2">Sign In</Button>
        </Form>
      </Card>
      <p className="mt-3 text-white text-center">
        Don't have an account?{' '}
        <a href="#register" className="text-white text-decoration-none" onClick={(e) => {
          e.preventDefault();
          window.location.hash = '#register';
        }}>Register here</a>
      </p>
    </div>
  );
}

export default LoginPage;
