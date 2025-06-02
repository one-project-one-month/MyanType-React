import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Keyboard from '../components/KeyBoard';
import {Home} from 'lucide-react';
const NotFound = () => {
  const messages = [
    "Oops! Page not found...",
    "Looks like you took a wrong turn!",
    "404: Let's get you back on track!"
  ];

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeKey, setActiveKey] = useState(''); // State for the current character to highlight

  useEffect(() => {
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const delayBetweenMessages = 2000;

    const type = () => {
      const currentText = messages[messageIndex];

      if (!isDeleting && charIndex < currentText.length) {
        // Typing
        setCurrentMessage(currentText.substring(0, charIndex + 1));
        setActiveKey(currentText[charIndex]); // Set the current character as activeKey
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setCurrentMessage(currentText.substring(0, charIndex - 1));
        setActiveKey(currentText[charIndex - 1] || ''); // Set the previous character or empty
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentText.length) {
        // Pause at end of typing
        setActiveKey(''); // Clear activeKey when pausing
        setTimeout(() => setIsDeleting(true), delayBetweenMessages);
      } else if (isDeleting && charIndex === 0) {
        // Move to next message
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setActiveKey(''); // Clear activeKey when switching messages
      }
    };

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, messageIndex, messages]);

  return (
    <div className="min-h-screen bg-[#0e0f15] flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <div className="text-2xl font-mono mb-8 h-13 border-2 border-white rounded px-4 py-2">
        <span className="inline-block">{currentMessage}</span>
        <span className="animate-blink">|</span>
      </div>
      <Keyboard activeKey={activeKey} layout="english" shiftActive={false}/>
      <Link
        to="/"
        className="mt-4 bg-[#0e0f15] border-2 border-white hover:border-glow hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] transition-shadow duration-300 text-white px-6 py-2 rounded mb-8"
      >
       <Home size={24} />
      </Link>
  
    </div>
  );
};

export default NotFound;
