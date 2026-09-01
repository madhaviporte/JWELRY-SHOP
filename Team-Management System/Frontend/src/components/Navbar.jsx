import { useAuth } from '../context/AuthContext';

const Navbar = ({ title, onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuToggle}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="navbar__title">{title}</h1>
      </div>

      <div className="navbar__right">
        <div className="navbar__user">
          <div className="navbar__avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="navbar__user-info">
            <span>{user?.name}</span>
            <span>{user?.role}</span>
          </div>
        </div>

        <button className="btn btn--outline btn--sm navbar__logout" onClick={logout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
