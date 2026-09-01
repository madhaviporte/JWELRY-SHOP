import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    // Password is optional — only validate if the user is trying to change it
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };

      // Only include password if the user entered a new one
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await authAPI.updateProfile(payload);
      const updatedUser = response.data.data;

      // Update the user in context (and localStorage)
      updateUser(updatedUser);

      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });

      setSuccess('Profile updated successfully');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const roleDisplay = user?.role === 'admin' ? 'Administrator' : 'Manager';

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <h1>Profile Settings</h1>
        <p>Update your account information</p>
      </div>

      <div className="profile-page__card">
        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="profile-page__success">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="profile-page__fields">
            <div className="form-group">
              <label className="form-group__label" htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                name="name"
                className="form-group__input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                name="email"
                className="form-group__input"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="profile-password">
                New Password
              </label>
              <input
                id="profile-password"
                type="password"
                name="password"
                className="form-group__input"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
                disabled={loading}
                autoComplete="new-password"
              />
              <span className="form-group__hint">
                Leave blank if you do not want to change your password.
              </span>
            </div>

            <div className="form-group">
              <label className="form-group__label" htmlFor="profile-confirm-password">
                Confirm New Password
              </label>
              <input
                id="profile-confirm-password"
                type="password"
                name="confirmPassword"
                className="form-group__input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">Role</label>
              <div className="profile-page__role">
                <div className="profile-page__role-value">{roleDisplay}</div>
                <span className="profile-page__role-hint">
                  Role cannot be changed
                </span>
              </div>
            </div>
          </div>

          <div className="profile-page__actions">
            <button
              type="submit"
              className={`btn btn--primary ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
