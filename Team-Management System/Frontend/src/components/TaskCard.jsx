import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityClass = (priority) => {
    return `priority-badge priority-badge--${priority.toLowerCase()}`;
  };

  const getAssignedInitials = () => {
    if (!task.assignedTo?.name) return '?';
    return task.assignedTo.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed'];

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__meta">
        <div className={getPriorityClass(task.priority)}>
          {task.priority}
        </div>
        <div className="task-card__meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Due: {formatDate(task.dueDate)}
        </div>
      </div>

      <div className="task-card__footer">
        <div className="task-card__assigned">
          <div className="task-card__assigned-avatar">
            {getAssignedInitials()}
          </div>
          <span className="task-card__assigned-name">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        <div className="task-card__actions">
          <select
            className="task-card__status-select"
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {isAdmin && (
            <>
              <button className="btn btn--outline btn--sm" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button className="btn btn--danger btn--sm" onClick={() => onDelete(task)}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
