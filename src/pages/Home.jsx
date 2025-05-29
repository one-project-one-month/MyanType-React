import React, {useState} from 'react';
import TypingArea from '../components/TypingArea';
import Keyboard from '../components/KeyBoard';
import {Link} from 'react-router-dom';
import {Button} from '@/components/ui/button';

const TypingTestUI = () => {
    const [lastKey, setLastKey] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div className="min-h-screen p-4 text-white">
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
                        <img src="person.png" alt="Profile" className="w-8 h-8"/>
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
            <div className="flex flex-col items-center justify-center mt-15">
                <TypingArea onKeyPress={setLastKey}/>
                <div className="w-full flex justify-center pb-4 px-2 mt-8">
        <Keyboard activeKey={lastKey} />
      </div>
            </div>
        </div>
    );
};

export default TypingTestUI;