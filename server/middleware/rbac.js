/**
 * RBAC Middleware - Check module-level permissions
 * Usage: rbac('bookings', 'full') or rbac('bookings', 'read')
 */
const rbac = (module, requiredAccess = 'read') => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - no role assigned'
      });
    }

    const role = req.user.role;

    // System admin role always has full access
    if (role.name === 'Admin' && role.isSystem) {
      return next();
    }

    // Find the permission for the requested module
    const permission = role.permissions.find(p => p.module === module);

    if (!permission || permission.access === 'none') {
      return res.status(403).json({
        success: false,
        message: `Access denied - no permission for ${module} module`
      });
    }

    // If full access is required, check that the permission is 'full'
    if (requiredAccess === 'full' && permission.access !== 'full') {
      return res.status(403).json({
        success: false,
        message: `Access denied - read-only access for ${module} module`
      });
    }

    // 'read' access is satisfied by both 'read' and 'full'
    next();
  };
};

module.exports = rbac;
