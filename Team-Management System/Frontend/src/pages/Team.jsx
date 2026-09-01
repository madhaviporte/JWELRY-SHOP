import { useState, useEffect } from 'react';
import { membersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamMemberCard from '../components/TeamMemberCard';

const Team = () => {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    skills: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await membersAPI.getAll({ search: search || undefined });
      setMembers(response.data.data);
    } catch (err) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joiningDate: '',
      skills: '',
    });
    setFormError('');
    setEditingMember(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      position: member.position,
      department: member.department,
      joiningDate: member.joiningDate ? member.joiningDate.split('T')[0] : '',
      skills: member.skills ? member.skills.join(', ') : '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError('Please enter a valid email');
      return false;
    }
    if (!formData.position.trim()) {
      setFormError('Position is required');
      return false;
    }
    if (!formData.department.trim()) {
      setFormError('Department is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department.trim(),
        joiningDate: formData.joiningDate || undefined,
        skills: formData.skills
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (editingMember) {
        await membersAPI.update(editingMember._id, payload);
      } else {
        await membersAPI.create(payload);
      }

      closeModal();
      fetchMembers();
    } catch (err) {
      const message = err.response?.data?.message || 'Operation failed';
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await membersAPI.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  return (
    <div className="team-page">
      <div className="team-page__header">
        <h1>Team Members</h1>
        {isAdmin && (
          <button className="btn btn--primary" onClick={openCreateModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      <div className="team-page__filters">
        <div className="team-page__search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading loading--full">
          <div className="loading__spinner"></div>
          <p className="loading__text">Loading team members...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p className="empty-state__text" style={{ color: '#ef4444' }}>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3 className="empty-state__title">No team members found</h3>
          <p className="empty-state__text">
            {search ? 'Try a different search term' : 'Get started by adding a team member'}
          </p>
        </div>
      ) : (
        <div className="team-page__grid">
          {members.map((member) => (
            <TeamMemberCard
              key={member._id}
              member={member}
              canManage={isAdmin}
              onEdit={openEditModal}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button className="modal__header-close" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal__body">
              {formError && <div className="auth-error">{formError}</div>}

              <form onSubmit={handleSubmit}>
                <div className="modal-form-grid">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-group__label">Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-group__input"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-group__label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-group__input"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-group__input"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Position *</label>
                    <input
                      type="text"
                      name="position"
                      className="form-group__input"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Job position"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Department *</label>
                    <select
                      name="department"
                      className="form-group__select"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">Human Resources</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Joining Date</label>
                    <input
                      type="date"
                      name="joiningDate"
                      className="form-group__input"
                      value={formData.joiningDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-group__label">Skills (comma separated)</label>
                    <input
                      type="text"
                      name="skills"
                      className="form-group__input"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                </div>

                <div className="modal__footer modal-form-footer">
                  <button type="button" className="btn btn--outline" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn--primary ${formLoading ? 'btn--loading' : ''}`}
                    disabled={formLoading}
                  >
                    {formLoading ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Delete Member</h2>
              <button className="modal__header-close" onClick={() => setDeleteConfirm(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <p className="modal__confirm-text">
                Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This will also delete all assigned tasks. This action cannot be undone.
              </p>
            </div>
            <div className="modal__footer">
              <button className="btn btn--outline" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn--danger" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
