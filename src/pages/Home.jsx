import React, { useState } from 'react';
import TypingArea from '../components/TypingArea';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

const TypingTestUI = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to scroll to the top of the page
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

      {/* User Menu */}
      <div className="absolute top-0 right-0 p-6">
        {isLoggedIn ? (
          <div className="flex items-center">
            <img src="person.png" alt="Profile" className="w-8 h-8" />
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/sign-up">
              <Button variant="ghost" className="text-gray-500">Sign-Up</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Typing Test Components */}
      <div className="flex flex-col items-center justify-center mt-15 flex-grow">
        <TypingArea />
      </div>

      {/* Footer */}
      <footer className="mt-8 py-4 border-t border-gray-700 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Typing Test
          </Link>
          <Link to="/leaderboard" className="text-gray-400 hover:text-white transition">
            LeaderBoard
          </Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition">
            About
          </Link>
          <Link to="/contact" className="text-gray-400 hover:text-white transition">
            Contact
          </Link>
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