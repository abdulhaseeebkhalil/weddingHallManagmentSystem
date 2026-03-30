import { useState, useEffect } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineFunnel,
  HiOutlineXMark
} from 'react-icons/hi2';
import { bookingsAPI, hallsAPI } from '../../services/api';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [filter, setFilter] = useState({ status: '', hall: '' });

  // Form state
  const initialForm = {
    clientName: '', clientPhone: '', clientCNIC: '', clientAddress: '',
    hall: '', eventDate: '', timeSlot: 'Dinner', functionType: 'Walima',
    guestCount: '', hallCharges: '', discount: 0, additionalCharges: [],
    totalAmount: 0, advanceAmount: 0, status: 'Tentative', specialInstructions: '', notes: ''
  };
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, hallsRes] = await Promise.all([
        bookingsAPI.getAll(),
        hallsAPI.getAll()
      ]);
      setBookings(bookingsRes.data.data || []);
      setHalls(hallsRes.data.data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };

      // Auto-fill hall charges when hall selected
      if (name === 'hall') {
        const selectedHall = halls.find(h => h._id === value);
        if (selectedHall) {
          updated.hallCharges = selectedHall.basePrice;
          updated.totalAmount = selectedHall.basePrice - (updated.discount || 0);
        }
      }

      // Recalculate total when charges or discount change
      if (name === 'hallCharges' || name === 'discount') {
        const charges = parseFloat(name === 'hallCharges' ? value : updated.hallCharges) || 0;
        const disc = parseFloat(name === 'discount' ? value : updated.discount) || 0;
        updated.totalAmount = charges - disc;
      }

      return updated;
    });
  };

  const openCreateModal = () => {
    setEditingBooking(null);
    setForm(initialForm);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setForm({
      clientName: booking.clientName,
      clientPhone: booking.clientPhone,
      clientCNIC: booking.clientCNIC || '',
      clientAddress: booking.clientAddress || '',
      hall: booking.hall?._id || booking.hall,
      eventDate: booking.eventDate?.split('T')[0],
      timeSlot: booking.timeSlot,
      functionType: booking.functionType,
      guestCount: booking.guestCount,
      hallCharges: booking.hallCharges,
      discount: booking.discount || 0,
      totalAmount: booking.totalAmount,
      advanceAmount: booking.advanceAmount || 0,
      status: booking.status,
      specialInstructions: booking.specialInstructions || '',
      notes: booking.notes || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        guestCount: parseInt(form.guestCount),
        hallCharges: parseFloat(form.hallCharges),
        discount: parseFloat(form.discount) || 0,
        totalAmount: parseFloat(form.totalAmount),
        advanceAmount: parseFloat(form.advanceAmount) || 0
      };

      if (editingBooking) {
        await bookingsAPI.update(editingBooking._id, payload);
      } else {
        await bookingsAPI.create(payload);
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter.status && b.status !== filter.status) return false;
    if (filter.hall && (b.hall?._id || b.hall) !== filter.hall) return false;
    return true;
  });

  const formatCurrency = (amt) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(amt || 0);

  const getStatusBadge = (status) => <span className={`badge badge-${status?.toLowerCase()}`}>{status}</span>;
  const getPaymentBadge = (status) => <span className={`badge badge-${status?.toLowerCase()}`}>{status}</span>;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Booking Management</h1>
          <p className="page-header-subtitle">{filteredBookings.length} total bookings</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select className="form-select" style={{ width: 160 }} value={filter.status}
            onChange={e => setFilter(prev => ({ ...prev, status: e.target.value }))}>
            <option value="">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Tentative">Tentative</option>
            <option value="Postponed">Postponed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select className="form-select" style={{ width: 160 }} value={filter.hall}
            onChange={e => setFilter(prev => ({ ...prev, hall: e.target.value }))}>
            <option value="">All Halls</option>
            {halls.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openCreateModal} id="create-booking-btn">
            <HiOutlinePlus /> New Booking
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>Client</th>
                  <th>Hall</th>
                  <th>Event Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Guests</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td><span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{booking.bookingNumber}</span></td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{booking.clientName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{booking.clientPhone}</div>
                      </div>
                    </td>
                    <td>{booking.hall?.name || '-'}</td>
                    <td>{new Date(booking.eventDate).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span className="badge badge-gold">{booking.timeSlot}</span></td>
                    <td>{booking.functionType}</td>
                    <td>{booking.guestCount}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(booking.totalAmount)}</td>
                    <td>{getPaymentBadge(booking.paymentStatus)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditModal(booking)} title="Edit">
                          <HiOutlinePencilSquare />
                        </button>
                        {booking.status !== 'Cancelled' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(booking._id)} title="Cancel"
                            style={{ color: 'var(--danger-500)' }}>
                            <HiOutlineTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No bookings found</h3>
            <p>Create your first booking to get started</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBooking ? 'Edit Booking' : 'New Booking'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                <HiOutlineXMark />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && (
                  <div className="login-error" style={{ marginBottom: 16 }}>
                    <span>⚠️</span> {formError}
                  </div>
                )}

                {/* Client Details */}
                <h4 style={{ color: 'var(--primary-400)', marginBottom: 12, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Client Details
                </h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Name *</label>
                    <input className="form-input" name="clientName" value={form.clientName} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" name="clientPhone" value={form.clientPhone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CNIC</label>
                    <input className="form-input" name="clientCNIC" value={form.clientCNIC} onChange={handleChange} placeholder="xxxxx-xxxxxxx-x" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" name="clientAddress" value={form.clientAddress} onChange={handleChange} />
                  </div>
                </div>

                {/* Event Details */}
                <h4 style={{ color: 'var(--primary-400)', marginBottom: 12, marginTop: 8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Event Details
                </h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hall *</label>
                    <select className="form-select" name="hall" value={form.hall} onChange={handleChange} required>
                      <option value="">Select Hall</option>
                      {halls.map(h => (
                        <option key={h._id} value={h._id}>{h.name} (Cap: {h.capacity})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Date *</label>
                    <input className="form-input" type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Time Slot *</label>
                    <select className="form-select" name="timeSlot" value={form.timeSlot} onChange={handleChange}>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Function Type *</label>
                    <select className="form-select" name="functionType" value={form.functionType} onChange={handleChange}>
                      <option value="Walima">Walima</option>
                      <option value="Mehndi">Mehndi</option>
                      <option value="Barat">Barat</option>
                      <option value="Reception">Reception</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guest Count *</label>
                    <input className="form-input" type="number" name="guestCount" value={form.guestCount} onChange={handleChange} required />
                  </div>
                </div>

                {/* Financial Details */}
                <h4 style={{ color: 'var(--primary-400)', marginBottom: 12, marginTop: 8, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Financial Details
                </h4>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Hall Charges (PKR) *</label>
                    <input className="form-input" type="number" name="hallCharges" value={form.hallCharges} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount (PKR)</label>
                    <input className="form-input" type="number" name="discount" value={form.discount} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Amount (PKR)</label>
                    <input className="form-input" type="number" name="totalAmount" value={form.totalAmount} readOnly
                      style={{ background: 'var(--bg-elevated)', fontWeight: 700, color: 'var(--primary-400)' }} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Advance Amount (PKR)</label>
                    <input className="form-input" type="number" name="advanceAmount" value={form.advanceAmount} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                      <option value="Tentative">Tentative</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Postponed">Postponed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Special Instructions</label>
                  <textarea className="form-textarea" name="specialInstructions" value={form.specialInstructions} onChange={handleChange}
                    rows="2" placeholder="Any special requirements..."></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting} id="save-booking-btn">
                  {submitting ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Saving...</> :
                    editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
