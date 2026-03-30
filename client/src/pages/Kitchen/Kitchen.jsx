import { GiCookingPot } from 'react-icons/gi';

const Kitchen = () => (
  <div className="page-container">
    <div className="page-header">
      <div>
        <h1>Kitchen & Menu</h1>
        <p className="page-header-subtitle">Menu management, recipes, and kitchen operations</p>
      </div>
    </div>
    <div className="card">
      <div className="empty-state">
        <div className="empty-state-icon"><GiCookingPot /></div>
        <h3>Kitchen & Menu Management</h3>
        <p>This module is coming in Phase 7. It will include menu builder, recipe management, and kitchen issue tracking.</p>
      </div>
    </div>
  </div>
);

export default Kitchen;
