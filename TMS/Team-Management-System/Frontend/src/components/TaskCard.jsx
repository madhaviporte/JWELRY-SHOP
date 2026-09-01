import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onStatusChange, onDelete, showMember = true }) => {
  const { isAdmin } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'In Progress';
      case 'In Progress':
        return 'Completed';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(task.status);

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <StatusBadge type="priority" value={task.priority} />
          <StatusBadge type="status" value={task.status} />
        </div>
      </div>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      <div className="task-card__meta">
        <div className="task-card__info">
          {showMember && task.assignedTo && (
            <span className="task-card__detail">
              👤 {task.assignedTo.name}
            </span>
          )}
          <span className="task-card__detail">
            📅 Due: {formatDate(task.dueDate)}
          </span>
        </div>
        <div className="task-card__actions">
          {nextStatus && (
            <button
              className="task-card__action-btn"
              onClick={() => onStatusChange(task._id, nextStatus)}
            >
              → {nextStatus}
            </button>
          )}
          {isAdmin && (
            <button
              className="task-card__delete-btn"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
