import { Link } from 'react-router-dom';

const TeamMemberCard = ({ member, onEdit, onDelete, canManage }) => {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="member-card">
      <div className="member-card__header">
        <div className="member-card__avatar">{initials}</div>
        <div className="member-card__info">
          <div className="member-card__info-name">{member.name}</div>
          <div className="member-card__info-position">{member.position}</div>
        </div>
      </div>

      <div className="member-card__details">
        <div className="member-card__detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          {member.department}
        </div>
        <div className="member-card__detail">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          {member.email}
        </div>
      </div>

      {member.skills && member.skills.length > 0 && (
        <div className="member-card__skills">
          {member.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="member-card__skill">{skill}</span>
          ))}
          {member.skills.length > 3 && (
            <span className="member-card__skill">+{member.skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="member-card__actions">
        <Link to={`/team/${member._id}`} className="btn btn--primary btn--sm">
          View Details
        </Link>
        {canManage && (
          <>
            <button className="btn btn--outline btn--sm" onClick={() => onEdit(member)}>
              Edit
            </button>
            <button className="btn btn--danger btn--sm" onClick={() => onDelete(member)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
