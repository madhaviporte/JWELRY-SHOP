import { useState, useEffect } from 'react';
import { tasksAPI, membersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, membersRes] = await Promise.all([
        tasksAPI.getAll({
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        }),
        membersAPI.getAll(),
      ]);
      setTasks(tasksRes.data.data);
      setMembers(membersRes.data.data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getAll({
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      });
      setTasks(response.data.data);
    } catch (err) {
      // Silently fail - user will see stale data
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'Medium',
      dueDate: '',
    });
    setFormError('');
    setEditingTask(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      assignedTo: task.assignedTo?._id || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!formData.assignedTo) {
      setFormError('Please assign this task to a team member');
      return false;
    }
    if (!formData.dueDate) {
      setFormError('Due date is required');
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        dueDate: formData.dueDate,
      };

      if (editingTask) {
        await tasksAPI.update(editingTask._id, payload);
      } else {
        await tasksAPI.create(payload);
      }

      closeModal();
      fetchTasks();
    } catch (err) {
      const message = err.response?.data?.message || 'Operation failed';
      setFormError(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await tasksAPI.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  if (loading) {
    return (
      <div className="loading loading--full">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="empty-state__text" style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <h1>Tasks</h1>
        {isAdmin && (
          <button className="btn btn--primary" onClick={openCreateModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Task
          </button>
        )}
      </div>

      <div className="tasks-page__filters">
        <select
          className="form-group__select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="form-group__select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-state__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <h3 className="empty-state__title">No tasks found</h3>
          <p className="empty-state__text">
            {statusFilter || priorityFilter
              ? 'Try adjusting your filters'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="tasks-page__list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
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
              <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-group__label">Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-group__input"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Task title"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Description</label>
                    <textarea
                      name="description"
                      className="form-group__textarea"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Task description"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-group__label">Assign To *</label>
                    <select
                      name="assignedTo"
                      className="form-group__select"
                      value={formData.assignedTo}
                      onChange={handleChange}
                    >
                      <option value="">Select team member</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} ({member.position})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-group__label">Priority</label>
                      <select
                        name="priority"
                        className="form-group__select"
                        value={formData.priority}
                        onChange={handleChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-group__label">Due Date *</label>
                      <input
                        type="date"
                        name="dueDate"
                        className="form-group__input"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal__footer" style={{ padding: '0', marginTop: '20px', border: 'none' }}>
                  <button type="button" className="btn btn--outline" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn--primary ${formLoading ? 'btn--loading' : ''}`}
                    disabled={formLoading}
                  >
                    {formLoading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal__header">
              <h2>Delete Task</h2>
              <button className="modal__header-close" onClick={() => setDeleteConfirm(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal__body">
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.
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

export default Tasks;
