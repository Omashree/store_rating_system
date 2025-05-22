import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { validateForm } from '../utils/validation';

function RegisterPage() {
  const [formData, setFormData] = useState({name: '', email: '', password: '', address: ''});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const newErrors = validateForm(formData, 'user');
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage('Please correct the form errors.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      }

      setMessage('Registration successful! You can now log in.');
      setFormData({ name: '', email: '', password: '', address: '' });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-info bg-gradient p-3 w-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Title className="text-center mb-4 h3">Register</Card.Title>
        {message && (<Alert variant={message.startsWith('Error') ? 'danger' : 'success'} className="text-center">{message}</Alert>)}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control type="text" id="name" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} required />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control type="email" id="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} required />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control type="password" id="password" name="password" value={formData.password} onChange={handleChange} isInvalid={!!errors.password} required />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label htmlFor="address">Address</Form.Label>
            <Form.Control as="textarea" id="address" name="address" value={formData.address} onChange={handleChange} rows="3" isInvalid={!!errors.address} required />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Button variant="info" type="submit" className="w-100 py-2" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
        </Form>
      </Card>
      <p className="mt-3 text-white text-center">
        Already have an account?{' '}
        <a href="#login" className="text-white text-decoration-none" onClick={(e) => {
          e.preventDefault();
          window.location.hash = '';
        }}>Login here</a>
      </p>
    </div>
  );
}

export default RegisterPage;
