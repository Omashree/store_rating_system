import React from 'react';
import { Table, Form, Button, Card } from 'react-bootstrap';

function UserTable({ users, filters, onFilterChange, onSort, sortConfig }) {

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <Card className="shadow-sm p-3">
      <Table striped bordered hover responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th className="align-middle text-start text-muted text-uppercase small fw-medium">
              <div className="d-flex align-items-center">
                Name
                <Button variant="link" className="p-0 ms-1 text-decoration-none text-dark" onClick={() => onSort('name')}>
                  {getSortIndicator('name')}
                </Button>
              </div>
              <Form.Control type="text" name="name" value={filters.name} onChange={onFilterChange} placeholder="Filter Name" className="mt-1 form-control-sm" />
            </th>
            <th className="align-middle text-start text-muted text-uppercase small fw-medium">
              <div className="d-flex align-items-center">
                Email
                <Button variant="link" className="p-0 ms-1 text-decoration-none text-dark" onClick={() => onSort('email')}>
                  {getSortIndicator('email')}
                </Button>
              </div>
              <Form.Control type="text" name="email" value={filters.email} onChange={onFilterChange} placeholder="Filter Email" className="mt-1 form-control-sm" />
            </th>
            <th className="align-middle text-start text-muted text-uppercase small fw-medium">
              <div className="d-flex align-items-center">
                Address
                <Button variant="link" className="p-0 ms-1 text-decoration-none text-dark" onClick={() => onSort('address')}>
                  {getSortIndicator('address')}
                </Button>
              </div>
              <Form.Control type="text" name="address" value={filters.address} onChange={onFilterChange} placeholder="Filter Address" className="mt-1 form-control-sm" />
            </th>
            <th className="align-middle text-start text-muted text-uppercase small fw-medium">
              <div className="d-flex align-items-center">
                Role
                <Button variant="link" className="p-0 ms-1 text-decoration-none text-dark" onClick={() => onSort('role')}>
                  {getSortIndicator('role')}
                </Button>
              </div>
              <Form.Control type="text" name="role" value={filters.role} onChange={onFilterChange} placeholder="Filter Role" className="mt-1 form-control-sm" />
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="text-start fw-medium">{user.name}</td>
              <td className="text-start text-muted">{user.email}</td>
              <td className="text-start text-muted">{user.address}</td>
              <td className="text-start text-muted">{user.role}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">No users found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default UserTable;
