// src/components/Navbar/Navbar.jsx

import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { theme } = useTheme();

  const isAdmin = user?.roles?.includes('Admin');

  const destination = isAdmin ? '/admin' : '/tasks';

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
      } mb-4`}
    >
      <div className="container-fluid">

        <Link className="navbar-brand" to={destination}>
          Task Tracker
        </Link>

        <div className="d-flex align-items-center">
          <ThemeToggle className="me-3" />
          
          {user && (
            <>
              <span className="me-3">👤 {user.username}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

