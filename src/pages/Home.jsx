import React, { useContext } from 'react';
import TypingArea from "../components/TypingArea";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { AuthContext } from '../context/AuthProvider';

const TypingTestUI = () => {
  const { isLoggedIn } = useContext(AuthContext); // Ensure AuthContext is provided in a parent component
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      {/* Logo and Slogan at the Top */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold">Myan-Type</h1>
        <p className="m-4 text-lg text-gray-400">
          Master the Keyboard in Myanmar and English — Instant Feedback, Improved Speed
        </p>
      </div>

      {/* Typing Test Components */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <TypingArea />
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-gray-700 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link to="/test" className="text-gray-400 hover:text-white transition">
            Typing Test
          </Link>
          <Link to="/leaderboard" className="text-gray-400 hover:text-white transition">
            LeaderBoard
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition">
            Contact
          </Link>
          {isLoggedIn ? (
            <Link to="/profiles" className="text-gray-400 hover:text-white transition">
              Go to Your Profile
            </Link>
          ) : (
            <Link to="/sign-up" className="text-gray-400 hover:text-white transition">
              Sign-Up
            </Link>
          )}
        </div>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Myan-Type. All rights reserved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={scrollToTop}
            className="text-gray-400 hover:text-white"
          >
            <ArrowUp className="w-4 h-4 mr-1" />
            Back to Top
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default TypingTestUI;