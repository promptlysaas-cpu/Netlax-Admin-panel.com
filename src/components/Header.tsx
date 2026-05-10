import React from 'react';
import { Sun, Moon, LogOut, Menu } from 'lucide-react';
import { signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

interface HeaderProps {
  toggleTheme: () => void;
  theme: 'dark' | 'light';
  user: User;
}

export default function Header({ toggleTheme, theme, user }: HeaderProps) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-[#2a2a2a] flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold dark:text-white hidden sm:block">Dashboard</h2>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 dark:text-gray-400 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-[#2a2a2a] pl-4">
          <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
            {user.email}
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-[#e50914] dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
