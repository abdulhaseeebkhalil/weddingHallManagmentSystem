import { HiOutlineBuildingStorefront } from 'react-icons/hi2';

const Expenses = () => (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Expense Management</h1>
        <p className="page-header-subtitle">Log expenses and manage suppliers</p>
      </div>
    </div>
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon"><HiOutlineBuildingStorefront /></div>
        <h3>Expense & Supplier Management</h3>
        <p>This module is coming in Phase 5. It will include expense logging, receipt uploads, and supplier payments.</p>
      </div>
    </div>
  </div>
);

export default Expenses;
