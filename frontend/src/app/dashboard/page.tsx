import Link from 'next/link';
import React from 'react';

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r  to-teal-500">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Aldrax!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          We are thrilled to have you here. Explore and enjoy our content.
        </p>
        <Link
          className="bg-indigo-700 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
          href="/dashboard/visits"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Page;
