const Booking = require('../models/Booking');

// Generate booking number: BK-2026-0001
const generateBookingNumber = async () => {
  const year = new Date().getFullYear();
  const lastBooking = await Booking.findOne({
    bookingNumber: new RegExp(`^BK-${year}`)
  }).sort({ bookingNumber: -1 });

  if (!lastBooking) {
    return `BK-${year}-0001`;
  }

  const lastNum = parseInt(lastBooking.bookingNumber.split('-')[2]);
  return `BK-${year}-${String(lastNum + 1).padStart(4, '0')}`;
};

// @desc    Get all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res, next) => {
  try {
    const { month, year, hall, status } = req.query;
    const filter = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      filter.eventDate = { $gte: startDate, $lte: endDate };
    }

    if (hall) filter.hall = hall;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('hall', 'name capacity')
      .populate('bookedBy', 'fullName')
      .populate('selectedMenu', 'name pricePerHead')
      .sort({ eventDate: 1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hall')
      .populate('bookedBy', 'fullName')
      .populate('selectedMenu');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking
// @route   POST /api/bookings
exports.createBooking = async (req, res, next) => {
  try {
    // Check for conflicting bookings (same hall, same date, same time slot)
    const conflict = await Booking.findOne({
      hall: req.body.hall,
      eventDate: req.body.eventDate,
      timeSlot: req.body.timeSlot,
      status: { $nin: ['Cancelled'] }
    });

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `This hall is already booked for ${req.body.timeSlot} on the selected date (Booking: ${conflict.bookingNumber})`
      });
    }

    req.body.bookingNumber = await generateBookingNumber();
    req.body.bookedBy = req.user._id;

    const booking = await Booking.create(req.body);
    const populated = await Booking.findById(booking._id)
      .populate('hall', 'name')
      .populate('bookedBy', 'fullName');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // If changing date/hall/timeslot, check conflicts
    if (req.body.hall || req.body.eventDate || req.body.timeSlot) {
      const conflict = await Booking.findOne({
        _id: { $ne: req.params.id },
        hall: req.body.hall || booking.hall,
        eventDate: req.body.eventDate || booking.eventDate,
        timeSlot: req.body.timeSlot || booking.timeSlot,
        status: { $nin: ['Cancelled'] }
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Conflicting booking exists for this hall/date/time'
        });
      }
    }

    // Update fields
    Object.assign(booking, req.body);
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('hall', 'name')
      .populate('bookedBy', 'fullName');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (cancel)
// @route   DELETE /api/bookings/:id  
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'Cancelled' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, message: 'Booking cancelled', data: booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get calendar data (all bookings for a month)
// @route   GET /api/bookings/calendar/:year/:month
exports.getCalendarData = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const bookings = await Booking.find({
      eventDate: { $gte: startDate, $lte: endDate },
      status: { $ne: 'Cancelled' }
    })
      .populate('hall', 'name')
      .sort({ eventDate: 1 });

    // Group by date
    const calendarData = {};
    bookings.forEach(booking => {
      const dateKey = booking.eventDate.toISOString().split('T')[0];
      if (!calendarData[dateKey]) {
        calendarData[dateKey] = [];
      }
      calendarData[dateKey].push({
        _id: booking._id,
        bookingNumber: booking.bookingNumber,
        clientName: booking.clientName,
        hall: booking.hall,
        timeSlot: booking.timeSlot,
        functionType: booking.functionType,
        status: booking.status,
        guestCount: booking.guestCount
      });
    });

    res.json({ success: true, data: calendarData });
  } catch (error) {
    next(error);
  }
};
