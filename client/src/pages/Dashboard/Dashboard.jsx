import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowTrendingUp,
  HiOutlinePlus,
  HiOutlineEye
} from 'react-icons/hi2';
import { bookingsAPI, hallsAPI } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: bookingsRes } = await bookingsAPI.getAll();
      const bookings = bookingsRes.data || [];

      const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
      const revenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const pending = bookings.filter(b => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partial').length;

      setStats({
        totalBookings: bookings.length,
        confirmedBookings: confirmed,
        totalRevenue: revenue,
        pendingPayments: pending
      });

      setRecentBookings(bookings.slice(-5).reverse());
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const cls = `badge badge-${status?.toLowerCase()}`;
    return <span className={cls}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ width: 48, height: 48 }}></div>
              <div>
                <div className="skeleton" style={{ width: 80, height: 28, marginBottom: 8 }}></div>
                <div className="skeleton" style={{ width: 120, height: 14 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-accent': 'var(--primary-500)' }}>
          <div className="stat-icon gold">
            <HiOutlineCalendar />
          </div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': 'var(--success-500)' }}>
          <div className="stat-icon green">
            <HiOutlineClipboardDocumentCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.confirmedBookings}</h3>
            <p>Confirmed Events</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': 'var(--accent-500)' }}>
          <div className="stat-icon purple">
            <HiOutlineCurrencyDollar />
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-accent': 'var(--danger-500)' }}>
          <div className="stat-icon red">
            <HiOutlineArrowTrendingUp />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingPayments}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Recent Bookings */}
        <div className="card dashboard-card-wide">
          <div className="card-header">
            <h3 className="card-title">Recent Bookings</h3>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/bookings')}>
              <HiOutlinePlus /> New Booking
            </button>
          </div>

          {recentBookings.length > 0 ? (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Client</th>
                    <th>Hall</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
                          {booking.bookingNumber}
                        </span>
                      </td>
                      <td>{booking.clientName}</td>
                      <td>{booking.hall?.name || '-'}</td>
                      <td>{new Date(booking.eventDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(booking.totalAmount)}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" title="View Details">
                          <HiOutlineEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No bookings yet</h3>
              <p>Create your first booking to get started</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/bookings')}>
                <HiOutlinePlus /> Create Booking
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card dashboard-card-side">
          <h3 className="card-title" style={{ marginBottom: 20 }}>Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate('/bookings')}>
              <div className="qa-icon gold"><HiOutlineCalendar /></div>
              <span>New Booking</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/calendar')}>
              <div className="qa-icon purple"><HiOutlineClipboardDocumentCheck /></div>
              <span>View Calendar</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/hr')}>
              <div className="qa-icon green"><HiOutlineUserGroup /></div>
              <span>Employees</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/accounts')}>
              <div className="qa-icon blue"><HiOutlineCurrencyDollar /></div>
              <span>Accounts</span>
            </button>
          </div>

          <div className="upcoming-section">
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              System Info
            </h4>
            <div className="info-row">
              <span>Version</span>
              <span className="badge badge-gold">v1.0.0</span>
            </div>
            <div className="info-row">
              <span>Currency</span>
              <span>PKR</span>
            </div>
            <div className="info-row">
              <span>Tax Rate</span>
              <span>16% GST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
