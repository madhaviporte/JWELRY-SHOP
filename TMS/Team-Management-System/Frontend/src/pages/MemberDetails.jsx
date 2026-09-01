import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { membersAPI, tasksAPI } from '../services/api';
import TaskCard from '../components/TaskCard';

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberData();
  }, [id]);

  const fetchMemberData = async () => {
    try {
      const [memberRes, tasksRes] = await Promise.all([
        membersAPI.getById(id),
        tasksAPI.getByMember(id)
      ]);
      setMember(memberRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (error) {
      console.error('Failed to load member data');
      navigate('/team');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      fetchMemberData();
    } catch (error) {
      console.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasksAPI.delete(taskId);
      fetchMemberData();
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="team__empty">
        <div className="team__empty-icon">👤</div>
        <p className="team__empty-text">Member not found.</p>
      </div>
    );
  }

  return (
    <div className="member-details">
      <div className="member-details__header">
        <button
          className="member-details__back"
          onClick={() => navigate('/team')}
        >
          ← Back to Team
        </button>
      </div>

      <div className="member-details__profile">
        <div className="member-details__profile-header">
          <div className="member-details__avatar">
            {getInitials(member.name)}
          </div>
          <div className="member-details__info">
            <h1 className="member-details__name">{member.name}</h1>
            <p className="member-details__position">{member.position}</p>
          </div>
        </div>

        <div className="member-details__meta">
          <div className="member-details__meta-item">
            <label>Email</label>
            <span>{member.email}</span>
          </div>
          <div className="member-details__meta-item">
            <label>Phone</label>
            <span>{member.phone || 'N/A'}</span>
          </div>
          <div className="member-details__meta-item">
            <label>Department</label>
            <span>{member.department}</span>
          </div>
          <div className="member-details__meta-item">
            <label>Joining Date</label>
            <span>{formatDate(member.joiningDate)}</span>
          </div>
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="member-details__skills">
            {member.skills.map((skill, index) => (
              <span key={index} className="member-details__skill">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="member-details__tasks-section">
        <h2 className="member-details__tasks-section-title">
          Assigned Tasks ({tasks.length})
        </h2>
        {tasks.length === 0 ? (
          <div className="team__empty">
            <div className="team__empty-icon">📋</div>
            <p className="team__empty-text">No tasks assigned to this member.</p>
          </div>
        ) : (
          <div className="tasks__list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                showMember={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetails;
