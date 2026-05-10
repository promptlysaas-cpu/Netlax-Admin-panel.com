import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Film } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background styling for Netflix feel */}
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/ca6a7616-0acb-4bc5-be25-c4deef0419a7/c5af6018-ebbc-4341-8ce5-8f4ce17cb302/US-en-20231211-popsignuptwoweeks-perspective_alpha_website_large.jpg')] bg-cover opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-transparent to-[#141414]"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Film className="w-12 h-12 text-[#e50914]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Natlax Admin Support
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-black/80 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-800 text-center">
            {error && (
              <div className="bg-[#e87c03] text-white p-3 rounded text-sm mb-6 text-left">
                {error}
              </div>
            )}
            
            <p className="text-gray-300 mb-8">
              Sign in with your Google administrator account to access the dashboard.
            </p>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#e50914] hover:bg-[#f40612] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e50914] transition-colors disabled:opacity-50"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  {/* Google Logo simple icon */}
                  <svg className="w-5 h-5 mr-3 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            Natlax Admin Panel &copy; {new Date().getFullYear()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
