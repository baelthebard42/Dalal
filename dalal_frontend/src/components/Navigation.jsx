import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { MessageCircle, User, LogOut, UserPlus, LogIn } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navigation = () => {
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!auth) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Dalal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-colors ${
                  isActive('/login')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-colors ${
                  isActive('/register')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">Dalal</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/chat"
              className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-colors ${
                isActive('/chat')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;