const express = require('express');
const router = express.Router();
const {
  getBookings, getBooking, createBooking, updateBooking, deleteBooking, getCalendarData
} = require('../controllers/bookingController');
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(protect);

// Calendar route (must be before /:id to avoid conflict)
router.get('/calendar/:year/:month', rbac('bookings', 'read'), getCalendarData);

router.route('/')
  .get(rbac('bookings', 'read'), getBookings)
  .post(rbac('bookings', 'full'), createBooking);

router.route('/:id')
  .get(rbac('bookings', 'read'), getBooking)
  .put(rbac('bookings', 'full'), updateBooking)
  .delete(rbac('bookings', 'full'), deleteBooking);

module.exports = router;
