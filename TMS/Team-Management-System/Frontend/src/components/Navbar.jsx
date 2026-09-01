import { useAuth } from '../context/AuthContext';
import { getInitials } from '../helpers';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button className="navbar__toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1 className="navbar__title">Team Management</h1>
      </div>
      <div className="navbar__right">
        <div className="navbar__user">
          <div className="navbar__avatar">
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="navbar__info">
            <span className="navbar__name">{user?.name}</span>
            <span className="navbar__role">{user?.role}</span>
          </div>
        </div>
        <button className="navbar__logout" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
