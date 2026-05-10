import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort pending first
      data.sort((a, b) => (a.status === 'pending' ? -1 : 1));
      setReports(data);
    });
    return () => unsub();
  }, []);

  const handleResolve = async (id: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'reports', id), {
        status: currentStatus === 'pending' ? 'resolved' : 'pending'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this report?')) {
      try {
        await deleteDoc(doc(db, 'reports', id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Broken Link Reports</h1>
      </div>

      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-[#2a2a2a] dark:text-gray-300">
              <tr>
                <th className="px-6 py-4">Movie</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Reported</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {report.movieTitle || 'Unknown Movie'}
                    <div className="text-xs text-gray-500 font-mono mt-1">{report.movieId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {report.reportedAt ? new Date(report.reportedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleResolve(report.id, report.status)}
                      className={`font-medium hover:underline ${report.status === 'pending' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
                      title={report.status === 'pending' ? 'Mark Resolved' : 'Mark Pending'}
                    >
                      {report.status === 'pending' ? <CheckCircle className="w-5 h-5 inline" /> : <XCircle className="w-5 h-5 inline" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="font-medium text-red-600 dark:text-[#e50914] hover:underline"
                      title="Delete Report"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No reports found. All good!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
