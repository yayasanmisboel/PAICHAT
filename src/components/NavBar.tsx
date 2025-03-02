import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Bookmark className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                IslamEdu AI
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
                {user.isAdmin ? (
                  <Link
                    to="/admin"
                    className="px-3 py-2 rounded text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/demo"
                  className="px-3 py-2 rounded text-sm font-medium text-green-600 border border-green-600 hover:bg-green-50"
                >
                  Try Demo
                </Link>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2 rounded text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
