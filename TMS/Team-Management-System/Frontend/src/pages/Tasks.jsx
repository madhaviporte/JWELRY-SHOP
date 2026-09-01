import { useState, useEffect } from 'react';
import { tasksAPI, membersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  });
  const { isAdmin, isManager } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, membersRes] = await Promise.all([
        tasksAPI.getAll(),
        membersAPI.getAll()
      ]);
      setTasks(tasksRes.data.data);
      setMembers(membersRes.data.data);
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await tasksAPI.create({
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        dueDate: formData.dueDate
      });
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'Medium',
        dueDate: ''
      });
      fetchData();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to create task.';
      alert(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchData();
    } catch (error) {
      console.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      fetchData();
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const canCreateTasks = isAdmin || isManager;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks">
      <div className="tasks__header">
        <h1 className="tasks__title">Tasks</h1>
        {canCreateTasks && (
          <button className="tasks__add-btn" onClick={() => setShowModal(true)}>
            + Create Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="tasks__empty">
          <div className="tasks__empty-icon">📋</div>
          <p className="tasks__empty-text">No tasks found.</p>
        </div>
      ) : (
        <div className="tasks__list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Create New Task</h2>
              <button
                className="modal__close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="modal__field">
                <label>Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Task title"
                  required
                />
              </div>
              <div className="modal__field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Task description"
                />
              </div>
              <div className="modal__field">
                <label>Assign To *</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} — {member.position}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal__field">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleFormChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="modal__field">
                <label>Due Date *</label>
                <input
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  required
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
                  {formLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
