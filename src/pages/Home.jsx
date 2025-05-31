import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../context/AuthProvider';

const Homepage = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      <nav className="py-4 border-b border-gray-700 text-center">
        <div className="flex justify-center space-x-6">
          <Link to="/" className="text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link to="/test" className="text-gray-400 hover:text-white transition">
            Typing Test
          </Link>
          <Link to="/leaderboard" className="text-gray-400 hover:text-white transition">
            LeaderBoard
          </Link>
          <Link to="/about" className="text-gray-400 hover:text-white transition">
            About
          </Link>
          {isLoggedIn ? (
            <Link to="/profile" className="text-gray-400 hover:text-white transition">
              Profile
            </Link>
          ) : (
            <Link to="/sign-up" className="text-gray-400 hover:text-white transition">
              Sign Up
            </Link>
          )}
        </div>
      </nav>

      {/* User Menu */}
      <div className="absolute top-0 right-0 p-6">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="text-gray-500 hover:text-white transition"
          >
            Logout
          </button>
        ) : null}
      </div>

      {/* Centered Logo, Slogan, Type Display Box, and Start Typing Button */}
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-5xl font-bold mb-4">Myan-Type</h1>
        <div className="text-lg text-gray-400 mb-6">
          <TypeAnimation
            sequence={[
              'Master the Keyboard in Myanmar and English',
              1000,
              'Instant Feedback, Improved Speed',
              1000,
            ]}
            wrapper="p"
            speed={50}
            repeat={Infinity}
          />
        </div>
        {/* Type Display Box */}
        <div className="w-3/4 max-w-2xl bg-[#0e0f15] border border-gray-600 rounded-lg p-4 mb-6 text-lg font-mono text-gray-200 min-h-[60px] flex items-center">
          <TypeAnimation
            sequence={[
              'the quick brown fox jumps over the lazy dog .... ',
              2000,
              'အောင်မြင်ရန် တစ်ခုတည်းသောနည်းလမ်းမှာ သင်လုပ်သည်ကို ချစ်ခြင်းဖြစ်သည်။',
              2000,
              '',
              500,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
          />
        </div>
        <Link to="/test">
          <Button
            className="bg-[#0e0f15] border-2 border-white hover:border-glow hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] transition-shadow duration-300"
            style={{ padding: '0.5rem 1rem' }}
          >
            Start Typing
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-700 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Myan-Type. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;