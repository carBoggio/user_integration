import React, { useState } from 'react';

import { Button, Input } from "@heroui/react";
import { isValidCode, saveAccess } from '@/utils/accessCodes';

const AccessCodeForm: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!code.trim()) {
      setError('Please enter a code.');
      return;
    }

    if (!isValidCode(code)) {
      setError('Invalid code.');
      return;
    }

    // If the code is valid, save access and redirect
    saveAccess();
    window.location.href = '/app';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Restricted Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please enter the access code
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Access
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessCodeForm; 