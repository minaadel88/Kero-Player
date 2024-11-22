import { Link, useLocation } from 'react-router-dom';
import { Home, Library, LogIn, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, signOut, user } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/library', icon: Library, label: 'Playlist' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-xl font-bold ml-2 lg:ml-0">Kiro Player</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  isActive(link.path)
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated && user?.displayName && (
              <div className="hidden lg:flex items-center space-x-2 px-3 py-2">
                <User className="w-5 h-5" />
                <span>{user.displayName}</span>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogIn className="w-5 h-5" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 ${
                  isActive(link.path)
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}