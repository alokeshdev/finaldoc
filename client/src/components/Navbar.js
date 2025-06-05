import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserMd, FaSignInAlt, FaUserPlus, FaTachometerAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-filter backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-blue-700 tracking-tight group">
            <div className="bg-blue-600 text-white p-2 rounded-full transform group-hover:scale-110 transition-transform duration-300">
              <FaUserMd className="text-2xl" />
            </div>
            <span className="group-hover:text-blue-800 transition-colors duration-300">Where is my Doc</span>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-50">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-50">
                  <FaTachometerAlt className="text-blue-500" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-4 py-2 rounded-md flex items-center gap-1 shadow-md hover:shadow-lg"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-50">
                  <FaUserPlus className="text-blue-500" />
                  Sign Up
                </Link>
                <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition px-4 py-2 rounded-md flex items-center gap-1 shadow-md hover:shadow-lg">
                  <FaSignInAlt />
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fadeIn">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2">
                  <FaTachometerAlt className="text-blue-500" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2">
                  <FaUserPlus className="text-blue-500" />
                  Sign Up
                </Link>
                <Link to="/login" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2">
                  <FaSignInAlt className="text-blue-500" />
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;