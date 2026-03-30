import { useState, useEffect } from 'react';
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineFunnel
} from 'react-icons/hi2';
import { bookingsAPI, hallsAPI } from '../../services/api';
import './Calendar.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const statusColors = {
  Confirmed: 'var(--status-confirmed)',
  Tentative: 'var(--status-tentative)',
  Postponed: 'var(--status-postponed)',
  Cancelled: 'var(--status-cancelled)'
};

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [calendarData, setCalendarData] = useState({});
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchCalendarData();
    fetchHalls();
  }, [currentMonth, currentYear]);

  const fetchHalls = async () => {
    try {
      const { data } = await hallsAPI.getAll();
      setHalls(data.data || []);
    } catch (error) {
      console.error('Fetch halls error:', error);
    }
  };

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const { data } = await bookingsAPI.getCalendar(currentYear, currentMonth + 1);
      setCalendarData(data.data || {});
    } catch (error) {
      console.error('Calendar data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Build calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, type: 'prev' });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayBookings = calendarData[dateStr] || [];

    // Filter by hall if selected
    const filtered = selectedHall
      ? dayBookings.filter(b => b.hall?._id === selectedHall)
      : dayBookings;

    calendarDays.push({
      day: d,
      type: 'current',
      date: dateStr,
      bookings: filtered,
      isToday: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
    });
  }

  // Next month padding
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ day: i, type: 'next' });
  }

  // Count total bookings this month
  const totalMonthBookings = Object.values(calendarData).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Booking Calendar</h1>
          <p className="page-header-subtitle">{totalMonthBookings} events in {MONTHS[currentMonth]} {currentYear}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="form-select" style={{ width: 160 }} value={selectedHall}
            onChange={e => setSelectedHall(e.target.value)}>
            <option value="">All Halls</option>
            {halls.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="card calendar-card">
        {/* Navigation */}
        <div className="calendar-nav">
          <div className="calendar-nav-left">
            <button className="btn btn-ghost btn-icon" onClick={prevMonth}>
              <HiOutlineChevronLeft />
            </button>
            <h2 className="calendar-month-title">{MONTHS[currentMonth]} {currentYear}</h2>
            <button className="btn btn-ghost btn-icon" onClick={nextMonth}>
              <HiOutlineChevronRight />
            </button>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={goToToday}>Today</button>
        </div>

        {/* Legend */}
        <div className="calendar-legend">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="legend-item">
              <span className="legend-dot" style={{ background: color }}></span>
              <span>{status}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="calendar-grid">
          {/* Day Headers */}
          {DAYS.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}

          {/* Days */}
          {calendarDays.map((cell, idx) => (
            <div
              key={idx}
              className={`calendar-cell ${cell.type !== 'current' ? 'calendar-cell-muted' : ''} ${cell.isToday ? 'calendar-cell-today' : ''} ${cell.bookings?.length ? 'calendar-cell-has-events' : ''}`}
              onClick={() => cell.type === 'current' && cell.bookings?.length && setSelectedDay(cell)}
            >
              <span className="cell-day">{cell.day}</span>
              {cell.bookings?.length > 0 && (
                <div className="cell-events">
                  {cell.bookings.slice(0, 3).map((booking, bi) => (
                    <div
                      key={bi}
                      className="cell-event"
                      style={{ '--event-color': statusColors[booking.status] || 'var(--primary-500)' }}
                    >
                      <span className="event-dot"></span>
                      <span className="event-text">{booking.clientName}</span>
                      <span className="event-hall">{booking.hall?.name}</span>
                    </div>
                  ))}
                  {cell.bookings.length > 3 && (
                    <div className="cell-more">+{cell.bookings.length - 3} more</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {new Date(selectedDay.date).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                })}
              </h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelectedDay(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: '0.85rem' }}>
                {selectedDay.bookings.length} booking(s) on this day
              </p>
              {selectedDay.bookings.map((booking, idx) => (
                <div key={idx} className="day-detail-card">
                  <div className="detail-row">
                    <span className="detail-label">Booking</span>
                    <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{booking.bookingNumber}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Client</span>
                    <span>{booking.clientName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Hall</span>
                    <span>{booking.hall?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Time</span>
                    <span className="badge badge-gold">{booking.timeSlot}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Type</span>
                    <span>{booking.functionType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Guests</span>
                    <span>{booking.guestCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className={`badge badge-${booking.status?.toLowerCase()}`}>{booking.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
