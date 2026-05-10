import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Film, FileWarning, Activity, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({
    movies: 0,
    reports: 0,
    ads: 0,
  });

  useEffect(() => {
    const unsubMovies = onSnapshot(collection(db, 'movies'), (snapshot) => {
      setStats(prev => ({ ...prev, movies: snapshot.size }));
    });
    const unsubReports = onSnapshot(collection(db, 'reports'), (snapshot) => {
      setStats(prev => ({ ...prev, reports: snapshot.size }));
    });
    const unsubAds = onSnapshot(collection(db, 'ads'), (snapshot) => {
      setStats(prev => ({ ...prev, ads: snapshot.size }));
    });

    return () => {
      unsubMovies();
      unsubReports();
      unsubAds();
    };
  }, []);

  const statCards = [
    { name: 'Total Movies', value: stats.movies, icon: Film, color: 'bg-blue-500' },
    { name: 'Total Reports', value: stats.reports, icon: FileWarning, color: 'bg-yellow-500' },
    { name: 'Total Ads Running', value: stats.ads, icon: Megaphone, color: 'bg-purple-500' },
    { name: 'Active Streams', value: '1,204', icon: Activity, color: 'bg-[#e50914]' }, // Placeholder
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-[#2a2a2a] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10 dark:bg-opacity-20`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Recently Added</h2>
        <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center justify-center h-64">
           <p className="text-gray-500 dark:text-gray-400">Loading recent movies...</p>
        </div>
      </div>
    </div>
  );
}
