const express = require('express');
const router = express.Router();
const { getHalls, getHall, createHall, updateHall, deleteHall } = require('../controllers/hallController');
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(protect);

router.route('/')
  .get(rbac('bookings', 'read'), getHalls)
  .post(rbac('settings', 'full'), createHall);

router.route('/:id')
  .get(rbac('bookings', 'read'), getHall)
  .put(rbac('settings', 'full'), updateHall)
  .delete(rbac('settings', 'full'), deleteHall);

module.exports = router;
