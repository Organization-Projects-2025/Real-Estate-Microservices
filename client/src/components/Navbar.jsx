import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaBuilding,
  FaUserTie,
  FaPlus,
  FaClipboardList,
} from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Main navigation links
  const mainNavLinks = [
    { name: 'Buy', path: '/buy' },
    { name: 'Rent', path: '/rent' },
    { name: 'Sell', path: '/sell' },
    { name: 'Agents', path: '/agent' },
    { name: 'New Projects', path: '/developer-properties' },
  ];

  // Get role-specific menu items
  const getRoleMenuItems = () => {
    if (!user) return [{ name: 'My Profile', path: '/profile', icon: <FaUser /> }];

    switch (user.role) {
      case 'admin':
        return [
          { name: 'Admin Dashboard', path: '/admin', icon: <HiOutlineViewGrid /> },
          { name: 'Manage Agents', path: '/manage-agents', icon: <FaUserTie /> },
          { name: 'My Profile', path: '/profile', icon: <FaUser /> },
        ];
      case 'agent':
        return [
          { name: 'My Profile', path: '/profile', icon: <FaUser /> },
          { name: 'My Listings', path: '/my-listings', icon: <FaBuilding /> },
          { name: 'Add Property', path: '/sell', icon: <FaPlus /> },
        ];
      case 'developer':
        return [
          { name: 'My Profile', path: '/profile', icon: <FaUser /> },
          { name: 'My Projects', path: '/my-projects', icon: <FaClipboardList /> },
        ];
      default:
        return [
          { name: 'My Profile', path: '/profile', icon: <FaUser /> },
          { name: 'Become an Agent', path: '/become-agent', icon: <FaUserTie /> },
        ];
    }
  };

  const isActivePath = (path) => location.pathname === path;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  // Get role badge color
  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'admin':
        return 'bg-red-500';
      case 'agent':
        return 'bg-blue-500';
      case 'developer':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0d0d0d]/95 backdrop-blur-lg shadow-lg shadow-black/20'
          : 'bg-[#0d0d0d]/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#703BF7] to-[#9D6FFF] flex items-center justify-center shadow-lg shadow-[#703BF7]/30 group-hover:shadow-[#703BF7]/50 transition-shadow">
              <FaHome className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 hidden sm:block">
              Tamalak
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActivePath(link.path)
                    ? 'text-[#703BF7] bg-[#703BF7]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              /* User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-full transition-all duration-200 ${
                    isUserMenuOpen
                      ? 'bg-[#703BF7]/20 ring-2 ring-[#703BF7]'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.firstName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#703BF7]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#703BF7] to-[#9D6FFF] flex items-center justify-center text-white font-semibold text-sm">
                        {getUserInitials()}
                      </div>
                    )}
                    {/* Role indicator dot */}
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0d0d0d] ${getRoleBadgeColor()}`}
                    />
                  </div>
                  <span className="text-white font-medium hidden md:block max-w-[100px] truncate">
                    {user?.firstName || 'User'}
                  </span>
                  <FaChevronDown
                    className={`text-gray-400 text-xs transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] rounded-xl border border-gray-800 shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-[#703BF7]/10 to-transparent">
                      <p className="text-white font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white ${getRoleBadgeColor()}`}
                      >
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {getRoleMenuItems().map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="text-[#703BF7]">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors hidden sm:block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-[#703BF7] hover:bg-[#5f2cc6] text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-[#703BF7]/30 hover:shadow-[#703BF7]/50"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 bg-[#0d0d0d]/98 backdrop-blur-xl transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto pb-20">
          {/* Main Nav Links */}
          <div className="px-4 py-6 space-y-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-xl font-medium text-lg transition-all ${
                  isActivePath(link.path)
                    ? 'text-[#703BF7] bg-[#703BF7]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-4 border-t border-gray-800" />

          {/* User Section */}
          {isAuthenticated ? (
            <div className="px-4 py-6">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 px-4">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#703BF7]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#703BF7] to-[#9D6FFF] flex items-center justify-center text-white font-semibold">
                    {getUserInitials()}
                  </div>
                )}
                <div>
                  <p className="text-white font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white ${getRoleBadgeColor()}`}
                  >
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Role Menu Items */}
              <div className="space-y-1">
                {getRoleMenuItems().map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span className="text-[#703BF7]">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/login"
                className="block px-4 py-3 text-center text-gray-300 hover:text-white font-medium rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-3 text-center bg-[#703BF7] hover:bg-[#5f2cc6] text-white font-semibold rounded-xl transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
