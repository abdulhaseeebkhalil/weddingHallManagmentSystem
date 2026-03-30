import { HiOutlineCurrencyDollar } from 'react-icons/hi2';

const Accounts = () => (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Accounts & Finance</h1>
        <p className="page-header-subtitle">Chart of accounts, ledgers, and financial reports</p>
      </div>
    </div>
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon"><HiOutlineCurrencyDollar /></div>
        <h3>Accounts & Finance</h3>
        <p>This module is coming in Phase 4. It will include account management, ledgers, P&L, and balance sheets.</p>
      </div>
    </div>
  </div>
);

export default Accounts;
