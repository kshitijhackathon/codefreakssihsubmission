import { useState, useEffect } from 'react';
import { HiRefresh as HiOutlineRefresh } from 'react-icons/hi';

export default function ReloadingPage({ onReloadComplete }) {
  const [progress, setProgress] = useState(0);
  const [isReloading, setIsReloading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReloading(false);
          setTimeout(() => {
            onReloadComplete();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onReloadComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Nabha Text with Animation */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2 animate-pulse">
              NABHA
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Healthcare Access Platform
            </p>
          </div>

          {/* Spinning Icon */}
          <div className="mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 transition-transform duration-300 ${isReloading ? 'animate-spin' : ''}`}>
              <HiOutlineRefresh className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Application
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we load the healthcare services...
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Status Messages */}
          <div className="text-sm text-gray-600">
            {progress < 30 && "Initializing healthcare services..."}
            {progress >= 30 && progress < 60 && "Loading village data..."}
            {progress >= 60 && progress < 90 && "Preparing lab tests..."}
            {progress >= 90 && progress < 100 && "Finalizing setup..."}
            {progress === 100 && "Ready to serve 173 villages!"}
          </div>
        </div>
      </div>
    </div>
  );
}
