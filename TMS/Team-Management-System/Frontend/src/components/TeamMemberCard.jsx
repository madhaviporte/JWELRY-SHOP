import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TeamMemberCard = ({ member, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="member-card">
      <div className="member-card__header">
        <div className="member-card__avatar">
          {getInitials(member.name)}
        </div>
        {isAdmin && (
          <div className="member-card__actions">
            <button
              className="member-card__action-btn"
              onClick={() => onEdit(member)}
            >
              Edit
            </button>
            <button
              className="member-card__action-btn member-card__action-btn--danger"
              onClick={() => onDelete(member)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <h3 className="member-card__name">{member.name}</h3>
      <p className="member-card__position">{member.position}</p>
      <span className="member-card__department">{member.department}</span>
      <p className="member-card__email">{member.email}</p>
      <button
        className="member-card__view-btn"
        onClick={() => navigate(`/team/${member._id}`)}
      >
        View Details
      </button>
    </div>
  );
};

export default TeamMemberCard;
