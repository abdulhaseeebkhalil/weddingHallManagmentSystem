const Hall = require('../models/Hall');

// @desc    Get all halls
// @route   GET /api/halls
exports.getHalls = async (req, res, next) => {
  try {
    const halls = await Hall.find({ isActive: true });
    res.json({ success: true, count: halls.length, data: halls });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hall
// @route   GET /api/halls/:id
exports.getHall = async (req, res, next) => {
  try {
    const hall = await Hall.findById(req.params.id);
    if (!hall) {
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }
    res.json({ success: true, data: hall });
  } catch (error) {
    next(error);
  }
};

// @desc    Create hall
// @route   POST /api/halls
exports.createHall = async (req, res, next) => {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json({ success: true, data: hall });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hall
// @route   PUT /api/halls/:id
exports.updateHall = async (req, res, next) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!hall) {
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }
    res.json({ success: true, data: hall });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hall (soft delete)
// @route   DELETE /api/halls/:id
exports.deleteHall = async (req, res, next) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hall) {
      return res.status(404).json({ success: false, message: 'Hall not found' });
    }
    res.json({ success: true, message: 'Hall deactivated' });
  } catch (error) {
    next(error);
  }
};
