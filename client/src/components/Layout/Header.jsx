import { useLocation } from 'react-router-dom';
import { HiOutlineBell, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const pageTitles = {
  '/': 'Dashboard',
  '/bookings': 'Booking Management',
  '/calendar': 'Booking Calendar',
  '/events': 'Events & Billing',
  '/accounts': 'Accounts & Finance',
  '/expenses': 'Expense Management',
  '/hr': 'HR & Payroll',
  '/kitchen': 'Kitchen & Menu',
  '/settings': 'System Settings',
};

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{currentTitle}</h1>
        <p className="header-greeting">
          {greeting}, <span>{user?.fullName?.split(' ')[0] || 'Admin'}</span> 👋
        </p>
      </div>

      <div className="header-right">
        <div className="header-search">
          <HiOutlineMagnifyingGlass className="search-icon" />
          <input
            type="text"
            placeholder="Search bookings, events..."
            className="search-input"
            id="global-search"
          />
        </div>

        <button className="header-notification" id="notifications-btn">
          <HiOutlineBell />
          <span className="notification-dot"></span>
        </button>

        <div className="header-date">
          <span className="date-day">{now.toLocaleDateString('en-US', { weekday: 'short' })}</span>
          <span className="date-full">{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
