import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { validateForm } from '../utils/validation';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function UpdatePasswordModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({currentPassword: '', newPassword: '', confirmNewPassword: ''});
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

  const validatePasswordFields = () => {
    const newErrors = {};
    const passwordErrors = validateForm({ password: formData.newPassword }, 'user').password;

    if (passwordErrors) {
      newErrors.newPassword = passwordErrors;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'New password and confirm password do not match.';
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validatePasswordFields()) {
      setMessage('Please correct the form errors.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password.');
      }

      setMessage('Password updated successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
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
        <Modal.Title>Update Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (<Alert variant={message.startsWith('Error') ? 'danger' : 'success'}>{message}</Alert>)}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
            <Form.Control type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} isInvalid={!!errors.currentPassword} required />
            <Form.Control.Feedback type="invalid">{errors.currentPassword}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="newPassword">New Password</Form.Label>
            <Form.Control type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} isInvalid={!!errors.newPassword} required />
            <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="confirmNewPassword">Confirm New Password</Form.Label>
            <Form.Control type="password" id="confirmNewPassword" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} isInvalid={!!errors.confirmNewPassword} required />
            <Form.Control.Feedback type="invalid">{errors.confirmNewPassword}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onClose} className="me-2" disabled={loading} >Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading} >{loading ? 'Updating...' : 'Update Password'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UpdatePasswordModal;
