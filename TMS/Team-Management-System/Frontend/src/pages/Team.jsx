import { useState, useEffect, useCallback } from 'react';
import { membersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TeamMemberCard from '../components/TeamMemberCard';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joiningDate: '',
    skills: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const { isAdmin } = useAuth();

  const fetchMembers = useCallback(async () => {
    try {
      const response = await membersAPI.getAll(search);
      setMembers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchMembers]);

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joiningDate: '',
      skills: ''
    });
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      position: member.position,
      department: member.department,
      joiningDate: member.joiningDate
        ? new Date(member.joiningDate).toISOString().split('T')[0]
        : '',
      skills: member.skills?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    try {
      await membersAPI.delete(deletingMember._id);
      setDeletingMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Failed to delete member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      joiningDate: formData.joiningDate || undefined,
      skills: formData.skills
        ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingMember) {
        await membersAPI.update(editingMember._id, payload);
      } else {
        await membersAPI.create(payload);
      }
      setShowModal(false);
      fetchMembers();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Operation failed.';
      alert(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="team">
      <div className="team__header">
        <h1 className="team__title">Team Members</h1>
        <div className="team__actions">
          <input
            type="text"
            className="team__search"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && (
            <button className="team__add-btn" onClick={handleAdd}>
              + Add Member
            </button>
          )}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="team__empty">
          <div className="team__empty-icon">👥</div>
          <p className="team__empty-text">No team members found.</p>
        </div>
      ) : (
        <div className="team__grid">
          {members.map((member) => (
            <TeamMemberCard
              key={member._id}
              member={member}
              onEdit={handleEdit}
              onDelete={(m) => setDeletingMember(m)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h2>
              <button
                className="modal__close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="modal__field">
                <label>Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="modal__field">
                <label>Email *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="modal__field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+1-555-0000"
                />
              </div>
              <div className="modal__field">
                <label>Position *</label>
                <input
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>
              <div className="modal__field">
                <label>Department *</label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>
              <div className="modal__field">
                <label>Joining Date</label>
                <input
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleFormChange}
                />
              </div>
              <div className="modal__field">
                <label>Skills (comma-separated)</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleFormChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="modal__actions">
                <button
                  type="button"
                  className="modal__cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal__submit"
                  disabled={formLoading}
                >
                  {formLoading
                    ? 'Saving...'
                    : editingMember
                    ? 'Update Member'
                    : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingMember && (
        <div
          className="modal-overlay"
          onClick={() => setDeletingMember(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Delete Member</h2>
              <button
                className="modal__close"
                onClick={() => setDeletingMember(null)}
              >
                ✕
              </button>
            </div>
            <p className="modal__delete-text">
              Are you sure you want to delete <strong>{deletingMember.name}</strong>?
              This action cannot be undone. All assigned tasks will also be deleted.
            </p>
            <div className="modal__actions">
              <button
                className="modal__cancel"
                onClick={() => setDeletingMember(null)}
              >
                Cancel
              </button>
              <button
                className="modal__delete-btn"
                onClick={handleDelete}
              >
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
