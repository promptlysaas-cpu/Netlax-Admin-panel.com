import React from 'react';
import { Mail, Shield, User } from 'lucide-react';
import { auth } from '../firebase';

export default function Settings() {
  const user = auth.currentUser;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold dark:text-white">Account Settings</h1>

      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#141414] border-4 border-[#e50914] flex items-center justify-center text-4xl text-white font-bold select-none">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold dark:text-white">Admin Profile</h2>
              <p className="text-gray-500 dark:text-gray-400">Manage your administrative access</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 mb-2">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Email Address</span>
               </div>
               <div className="bg-gray-50 dark:bg-[#2a2a2a] px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium">
                  {user?.email}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 mb-2">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Role</span>
               </div>
               <div className="bg-gray-50 dark:bg-[#2a2a2a] px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-medium flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Super Admin
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <h3 className="text-lg font-bold dark:text-white mb-4">Platform Configuration</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          General settings for the Natlax streaming platform. Features like changing branding will be added shortly.
        </p>
        
        <div className="space-y-4">
           {/* Placeholder toggles */}
           <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700">
             <div>
               <div className="font-medium dark:text-white">Maintenance Mode</div>
               <div className="text-sm text-gray-500">Temporarily disable user access</div>
             </div>
             <button className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 relative">
               <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
             </button>
           </div>

           <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700">
             <div>
               <div className="font-medium dark:text-white">Enable User Signups</div>
               <div className="text-sm text-gray-500">Allow new users to register</div>
             </div>
             <button className="w-12 h-6 rounded-full bg-green-500 relative">
               <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
