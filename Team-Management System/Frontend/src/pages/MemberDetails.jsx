import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { membersAPI, tasksAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memberRes, tasksRes] = await Promise.all([
          membersAPI.getById(id),
          tasksAPI.getByMember(id),
        ]);
        setMember(memberRes.data.data);
        setTasks(tasksRes.data.data);
      } catch (err) {
        setError('Failed to load member details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="loading loading--full">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading member details...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="empty-state">
        <p className="empty-state__text" style={{ color: '#ef4444' }}>{error || 'Member not found'}</p>
        <Link to="/team" className="btn btn--primary" style={{ marginTop: '16px' }}>
          Back to Team
        </Link>
      </div>
    );
  }

  return (
    <div className="member-details">
      <Link to="/team" className="member-details__back">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Team
      </Link>

      <div className="member-details__profile">
        <div className="member-details__header">
          <div className="member-details__avatar">
            {getInitials(member.name)}
          </div>
          <div>
            <div className="member-details__name">{member.name}</div>
            <div className="member-details__position">{member.position} · {member.department}</div>
          </div>
        </div>

        <div className="member-details__info">
          <div className="member-details__info-item">
            <span className="member-details__info-item-label">Email</span>
            <span className="member-details__info-item-value">{member.email}</span>
          </div>
          <div className="member-details__info-item">
            <span className="member-details__info-item-label">Phone</span>
            <span className="member-details__info-item-value">{member.phone || 'Not provided'}</span>
          </div>
          <div className="member-details__info-item">
            <span className="member-details__info-item-label">Department</span>
            <span className="member-details__info-item-value">{member.department}</span>
          </div>
          <div className="member-details__info-item">
            <span className="member-details__info-item-label">Joining Date</span>
            <span className="member-details__info-item-value">{formatDate(member.joiningDate)}</span>
          </div>
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="member-details__skills-section">
            <span className="member-details__info-item-label" style={{ display: 'block', marginBottom: '8px' }}>Skills</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {member.skills.map((skill, index) => (
                <span key={index} className="member-card__skill">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="member-details__tasks-section">
        <div className="member-details__section-header">
          <h2>Assigned Tasks ({tasks.length})</h2>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__text">No tasks assigned to this member yet.</p>
          </div>
        ) : (
          <div className="member-details__tasks-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card" style={{ marginBottom: '12px' }}>
                <div className="task-card__header">
                  <h3 className="task-card__title">{task.title}</h3>
                  <StatusBadge status={task.status} />
                </div>
                {task.description && (
                  <p className="task-card__description">{task.description}</p>
                )}
                <div className="task-card__meta">
                  <div className={`priority-badge priority-badge--${task.priority.toLowerCase()}`}>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
