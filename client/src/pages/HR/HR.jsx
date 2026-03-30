import { HiOutlineUserGroup } from 'react-icons/hi2';

const HR = () => (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>HR & Payroll</h1>
        <p className="page-header-subtitle">Employee management, attendance, and salary</p>
      </div>
    </div>
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon"><HiOutlineUserGroup /></div>
        <h3>HR & Payroll System</h3>
        <p>This module is coming in Phase 6. It will include employee profiles, attendance tracking, and salary generation.</p>
      </div>
    </div>
  </div>
);

export default HR;
