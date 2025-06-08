import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Keyboard, Trophy, User, LogOut, Info } from 'lucide-react'; // Add Info icon
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <nav className="py-4 text-center">
        <div className="flex justify-center space-x-10 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white transition'
            }
            title="Home"
          >
            <Home size={24} />
          </NavLink>

          <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white transition'
            }
            title="Typing Test"
          >
            <Keyboard size={24} />
          </NavLink>

          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white transition'
            }
            title="Leaderboard"
          >
            <Trophy size={24} />
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'text-white'
                : 'text-gray-400 hover:text-white transition'
            }
            title="About"
          >
            <Info size={24} />
          </NavLink>

          {isLoggedIn ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white transition'
              }
              title="Profile"
            >
              <User size={24} />
            </NavLink>
          ) : (
            <NavLink to="/sign-up">
              <Button
                className="bg-[#0e0f15] border-2 border-white hover:border-glow hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] transition-shadow duration-300 text-white"
                style={{ padding: '0.5rem 1rem' }}
              >
                Sign Up
              </Button>
            </NavLink>
          )}
        </div>
      </nav>

      <div className="absolute top-0 right-0 p-6">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition"
            title="Logout"
            aria-label="Log out"
          >
            <LogOut size={24} />
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;
