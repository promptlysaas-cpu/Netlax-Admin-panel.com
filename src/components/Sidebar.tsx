import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Film, FileWarning, Megaphone, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/movies', name: 'Movies', icon: Film },
  { path: '/reports', name: 'Reports', icon: FileWarning },
  { path: '/ads', name: 'Ads Manager', icon: Megaphone },
  { path: '/settings', name: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-[#1f1f1f] border-r border-gray-200 dark:border-[#2a2a2a] flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#2a2a2a]">
        <Film className="w-8 h-8 text-[#e50914] mr-3" />
        <span className="text-xl font-bold tracking-wider text-gray-900 dark:text-white">NATLAX</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-colors relative ${
                    isActive
                      ? 'bg-red-50 dark:bg-white/10 text-[#e50914] dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#e50914]' : ''}`} />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-full bg-[#e50914] rounded-r-full"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
