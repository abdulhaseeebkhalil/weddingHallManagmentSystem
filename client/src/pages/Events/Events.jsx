import { HiOutlineDocumentText } from 'react-icons/hi2';

const Events = () => (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Events & Billing</h1>
        <p className="page-header-subtitle">Manage event details, invoices, and payments</p>
      </div>
    </div>
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon"><HiOutlineDocumentText /></div>
        <h3>Events & Billing</h3>
        <p>This module is coming in Phase 3. It will include event cost summaries, invoice generation, and payment tracking.</p>
      </div>
    </div>
  </div>
);

export default Events;
