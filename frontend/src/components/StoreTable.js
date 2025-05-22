import React from 'react';
import { Table, Form, Button, Card } from 'react-bootstrap';

function StoreTable({ stores, filters, onFilterChange, onSort, sortConfig }) {

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
                Rating
                <Button variant="link" className="p-0 ms-1 text-decoration-none text-dark" onClick={() => onSort('rating')}>
                  {getSortIndicator('rating')}
                </Button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="text-start fw-medium">{store.name}</td>
              <td className="text-start text-muted">{store.email}</td>
              <td className="text-start text-muted">{store.address}</td>
              <td className="text-start text-muted">
                {typeof store.rating === 'number' && !isNaN(store.rating)
                  ? store.rating.toFixed(2)
                  : (typeof store.rating === 'string' && !isNaN(parseFloat(store.rating))
                      ? parseFloat(store.rating).toFixed(2)
                      : 'N/A')}
              </td>
            </tr>
          ))}
          {stores.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted">No stores found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}

export default StoreTable;
