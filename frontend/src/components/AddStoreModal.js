import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { validateForm } from '../utils/validation';

function AddStoreModal({ onClose, onStoreAdded, token, users }) {
  const [formData, setFormData] = useState({name: '', email: '', address: '', owner_id: ''});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (users.length > 0 && !formData.owner_id) {
      setFormData((prev) => ({ ...prev, owner_id: users[0].id }));
    }
  }, [users, formData.owner_id]);

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

    const newErrors = validateForm(formData, 'store');
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage('Please correct the form errors.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add store.');
      }

      setMessage('Store added successfully!');
      onStoreAdded();
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
        <Modal.Title>Add New Store</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (<Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>)}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="storeName">Name</Form.Label>
            <Form.Control type="text" id="storeName" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} required />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="storeEmail">Email</Form.Label>
            <Form.Control type="email" id="storeEmail" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} required />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="storeAddress">Address</Form.Label>
            <Form.Control as="textarea" id="storeAddress" name="address" value={formData.address} onChange={handleChange} rows="3" isInvalid={!!errors.address} required />
            <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="owner_id">Store Owner</Form.Label>
            <Form.Select id="owner_id" name="owner_id" value={formData.owner_id} onChange={handleChange} isInvalid={!!errors.owner_id} required >
              <option value="">Select an owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.owner_id}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2" disabled={loading} >Cancel</Button>
            <Button variant="success" type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Store'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddStoreModal;
