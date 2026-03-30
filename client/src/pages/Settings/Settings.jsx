import { useState, useEffect } from 'react';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineUserGroup
} from 'react-icons/hi2';
import { rolesAPI, usersAPI } from '../../services/api';
import './Settings.css';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'events', label: 'Events & Billing' },
  { key: 'accounts', label: 'Accounts' },
  { key: 'expenses', label: 'Expenses' },
  { key: 'hr', label: 'HR & Payroll' },
  { key: 'kitchen', label: 'Kitchen' },
  { key: 'settings', label: 'Settings' }
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Role modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({
    name: '', description: '',
    permissions: MODULES.map(m => ({ module: m.key, access: 'none' }))
  });
  const [roleError, setRoleError] = useState('');

  // User modal
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '', email: '', password: '', fullName: '', role: ''
  });
  const [userError, setUserError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, usersRes] = await Promise.all([
        rolesAPI.getAll(),
        usersAPI.getAll()
      ]);
      setRoles(rolesRes.data.data || []);
      setUsers(usersRes.data.data || []);
    } catch (error) {
      console.error('Settings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // — Role Handlers —
  const openCreateRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: MODULES.map(m => ({ module: m.key, access: 'none' })) });
    setRoleError('');
    setShowRoleModal(true);
  };

  const openEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description || '',
      permissions: MODULES.map(m => {
        const existing = role.permissions?.find(p => p.module === m.key);
        return { module: m.key, access: existing?.access || 'none' };
      })
    });
    setRoleError('');
    setShowRoleModal(true);
  };

  const handlePermissionChange = (moduleKey, access) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.map(p =>
        p.module === moduleKey ? { ...p, access } : p
      )
    }));
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');
    try {
      if (editingRole) {
        await rolesAPI.update(editingRole._id, roleForm);
      } else {
        await rolesAPI.create(roleForm);
      }
      setShowRoleModal(false);
      fetchData();
    } catch (error) {
      setRoleError(error.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Delete this role?')) return;
    try {
      await rolesAPI.delete(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete role');
    }
  };

  // — User Handlers —
  const openCreateUser = () => {
    setEditingUser(null);
    setUserForm({ username: '', email: '', password: '', fullName: '', role: '' });
    setUserError('');
    setShowUserModal(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username, email: user.email, password: '',
      fullName: user.fullName, role: user.role?._id || ''
    });
    setUserError('');
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setUserError('');
    try {
      const payload = { ...userForm };
      if (!payload.password) delete payload.password;

      if (editingUser) {
        await usersAPI.update(editingUser._id, payload);
      } else {
        await usersAPI.create(payload);
      }
      setShowUserModal(false);
      fetchData();
    } catch (error) {
      setUserError(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await usersAPI.delete(id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>System Settings</h1>
          <p className="page-header-subtitle">Manage roles, users, and access control</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button className={`tab-btn ${activeTab === 'roles' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('roles')}>
          <HiOutlineShieldCheck /> Roles & Permissions
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}>
          <HiOutlineUserGroup /> User Management
        </button>
      </div>

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Roles ({roles.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={openCreateRole} id="create-role-btn">
              <HiOutlinePlus /> New Role
            </button>
          </div>

          {roles.length > 0 ? (
            <div className="roles-grid">
              {roles.map(role => (
                <div key={role._id} className="role-card">
                  <div className="role-header">
                    <div>
                      <h4 className="role-name">
                        {role.name}
                        {role.isSystem && <span className="badge badge-gold" style={{ marginLeft: 8 }}>System</span>}
                      </h4>
                      <p className="role-desc">{role.description || 'No description'}</p>
                    </div>
                    {!role.isSystem && (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditRole(role)}>
                          <HiOutlinePencilSquare />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteRole(role._id)}
                          style={{ color: 'var(--danger-500)' }}>
                          <HiOutlineTrash />
                        </button>
                      </div>
                    )}
                    {role.isSystem && (
                      <button className="btn btn-ghost btn-sm" onClick={() => openEditRole(role)}>
                        <HiOutlinePencilSquare />
                      </button>
                    )}
                  </div>
                  <div className="role-permissions">
                    {MODULES.map(m => {
                      const perm = role.permissions?.find(p => p.module === m.key);
                      const access = perm?.access || 'none';
                      return (
                        <div key={m.key} className="perm-tag">
                          <span className={`perm-dot perm-${access}`}></span>
                          <span>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛡️</div>
              <h3>No roles created</h3>
              <p>Create roles to manage access control</p>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Users ({users.length})</h3>
            <button className="btn btn-primary btn-sm" onClick={openCreateUser} id="create-user-btn">
              <HiOutlinePlus /> New User
            </button>
          </div>

          {users.length > 0 ? (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                            {user.fullName?.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.fullName}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--primary-400)', fontWeight: 500 }}>{user.username}</td>
                      <td>{user.email}</td>
                      <td><span className="badge badge-purple">{user.role?.name || '-'}</span></td>
                      <td>
                        <span className={`badge ${user.isActive ? 'badge-confirmed' : 'badge-cancelled'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEditUser(user)}>
                            <HiOutlinePencilSquare />
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteUser(user._id)}
                            style={{ color: 'var(--danger-500)' }}>
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3>No users found</h3>
            </div>
          )}
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRole ? 'Edit Role' : 'New Role'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowRoleModal(false)}><HiOutlineXMark /></button>
            </div>
            <form onSubmit={handleRoleSubmit}>
              <div className="modal-body">
                {roleError && <div className="login-error" style={{ marginBottom: 16 }}><span>⚠️</span> {roleError}</div>}
                <div className="form-group">
                  <label className="form-label">Role Name *</label>
                  <input className="form-input" value={roleForm.name} onChange={e => setRoleForm(prev => ({ ...prev, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" value={roleForm.description} onChange={e => setRoleForm(prev => ({ ...prev, description: e.target.value }))} />
                </div>

                <h4 style={{ color: 'var(--primary-400)', margin: '20px 0 12px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Module Permissions
                </h4>
                <div className="permissions-grid">
                  {MODULES.map(m => {
                    const perm = roleForm.permissions.find(p => p.module === m.key);
                    return (
                      <div key={m.key} className="permission-row">
                        <span className="perm-module-name">{m.label}</span>
                        <div className="perm-options">
                          {['none', 'read', 'full'].map(access => (
                            <label key={access} className={`perm-option ${perm?.access === access ? 'perm-option-active' : ''}`}>
                              <input type="radio" name={`perm-${m.key}`} value={access}
                                checked={perm?.access === access}
                                onChange={() => handlePermissionChange(m.key, access)} />
                              <span>{access.charAt(0).toUpperCase() + access.slice(1)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingRole ? 'Update Role' : 'Create Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'New User'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowUserModal(false)}><HiOutlineXMark /></button>
            </div>
            <form onSubmit={handleUserSubmit}>
              <div className="modal-body">
                {userError && <div className="login-error" style={{ marginBottom: 16 }}><span>⚠️</span> {userError}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" value={userForm.fullName}
                      onChange={e => setUserForm(prev => ({ ...prev, fullName: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <input className="form-input" value={userForm.username}
                      onChange={e => setUserForm(prev => ({ ...prev, username: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" value={userForm.email}
                      onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{editingUser ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                    <input className="form-input" type="password" value={userForm.password}
                      onChange={e => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      required={!editingUser} minLength={6} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-select" value={userForm.role}
                    onChange={e => setUserForm(prev => ({ ...prev, role: e.target.value }))} required>
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
