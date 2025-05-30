import React from 'react';
import { Button } from "@/components/ui/button";

const ThemeSelector = ({ themes, currentTheme, changeTheme }) => {
  const buttonBase = "rounded-md h-7 px-3 text-xs font-mono";
  const activeClass = "bg-white text-black";
  const inactiveClass = "bg-transparent text-white/50 hover:text-white hover:bg-white/10";

  return (
    <div className="mt-4 p-4">
      <p className="text-lg font-medium text-white-800 mb-4 text-center">Choose your theme</p>
      <div className="grid grid-cols-5 gap-2">
        {Object.keys(themes).map((theme) => (
          <label
            key={theme}
            className="flex items-center"
          >
            <input
              type="radio"
              name="theme"
              value={theme}
              checked={currentTheme === theme}
              onChange={() => changeTheme(theme)}
              className="hidden"
            />
            <Button
              onClick={() => changeTheme(theme)}
              className={`${buttonBase} w-full ${
                currentTheme === theme ? activeClass : inactiveClass
              }`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;