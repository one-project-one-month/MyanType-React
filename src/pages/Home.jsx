import React from 'react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/button';
import Navbar from '../components/NavBar';

const Homepage = () => {
  return (
    <div className="min-h-screen p-4 text-white flex flex-col">
      <Navbar />
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
        <div className="w-3/4 max-w-2xl bg-[#0e0f15] border border-gray-600 rounded-lg p-4 mb-6 text-lg font-mono text-gray-200 min-h-[60px] flex items-center">
          <TypeAnimation
            sequence={[
              'the quick brown fox jumps over the lazy dog .... ',
              2000,
              'ကီးဘုတ်ပေါ် က ချစ်ခြင်း နဲ့ ပြိုင်ဆိုင်မှု !',
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
      <footer className="py-4 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Myan-Type. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;