import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            Team<span>Hub</span>
          </div>
        </div>
        <nav className="sidebar__nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={onClose}
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/team"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={onClose}
          >
            👥 Team
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
            onClick={onClose}
          >
            📋 Tasks
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
