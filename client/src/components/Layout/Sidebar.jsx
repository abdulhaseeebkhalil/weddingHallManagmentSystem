import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBuildingStorefront,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';
import { GiCookingPot } from 'react-icons/gi';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome, module: 'dashboard' },
  { path: '/bookings', label: 'Bookings', icon: HiOutlineCalendar, module: 'bookings' },
  { path: '/calendar', label: 'Calendar', icon: HiOutlineClipboardDocumentList, module: 'bookings' },
  { path: '/events', label: 'Events & Billing', icon: HiOutlineDocumentText, module: 'events' },
  { path: '/accounts', label: 'Accounts', icon: HiOutlineCurrencyDollar, module: 'accounts' },
  { path: '/expenses', label: 'Expenses', icon: HiOutlineBuildingStorefront, module: 'expenses' },
  { path: '/hr', label: 'HR & Payroll', icon: HiOutlineUserGroup, module: 'hr' },
  { path: '/kitchen', label: 'Kitchen', icon: GiCookingPot, module: 'kitchen' },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth, module: 'settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { hasPermission, logout, user } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter(item => hasPermission(item.module, 'read'));

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span>👑</span>
        </div>
        {!collapsed && (
          <div className="logo-text">
            <h2>WHMS</h2>
            <p>Hall Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul>
          {filteredItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'nav-link-active' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="nav-icon" />
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.fullName || 'Admin'}</span>
              <span className="user-role">{user?.role?.name || 'Admin'}</span>
            </div>
          </div>
        )}
        <button className="btn-ghost sidebar-logout" onClick={logout} title="Logout">
          <HiOutlineArrowRightOnRectangle />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
      </button>
    </aside>
  );
};

export default Sidebar;
