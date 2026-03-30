const express = require('express');
const router = express.Router();
const { getRoles, getRole, createRole, updateRole, deleteRole } = require('../controllers/roleController');
const protect = require('../middleware/auth');
const rbac = require('../middleware/rbac');

router.use(protect);
router.use(rbac('settings', 'full'));

router.route('/')
  .get(getRoles)
  .post(createRole);

router.route('/:id')
  .get(getRole)
  .put(updateRole)
  .delete(deleteRole);

module.exports = router;
