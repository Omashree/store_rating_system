import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { validateForm } from '../utils/validation';

function AddUserModal({ onClose, onUserAdded, token }) {
  const [formData, setFormData] = useState({name: '', email: '', password: '', address: '', role: 'user'});
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
      const response = await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user.');
      }

      setMessage('User added successfully!');
      onUserAdded();
      setTimeout(onClose, 1500);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (<Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>)}
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
          <Form.Group className="mb-3">
            <Form.Label htmlFor="address">Address</Form.Label>
            <Form.Control as="textarea" id="address" name="address" value={formData.address} onChange={handleChange} rows="3" isInvalid={!!errors.address} required />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="role">Role</Form.Label>
            <Form.Select id="role" name="role" value={formData.role} onChange={handleChange} >
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">System Administrator</option>
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2" disabled={loading} >Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading} > {loading ? 'Adding...' : 'Add User'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddUserModal;
