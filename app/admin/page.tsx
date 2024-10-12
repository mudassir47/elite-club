import React from 'react';
import Link from 'next/link';
import { FaUser, FaUpload, FaCertificate, FaCheckCircle } from 'react-icons/fa';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users" className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaUser className="text-4xl text-blue-500 mr-2" />
          <div>
            <h2 className="text-xl">Manage Users</h2>
            <p>View and manage all users.</p>
          </div>
        </Link>
        <Link href="/admin/teamapproval" className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCheckCircle className="text-4xl text-green-500 mr-2" />
          <div>
            <h2 className="text-xl">Team Approval</h2>
            <p>Approve or reject team requests.</p>
          </div>
        </Link>
        <Link href="/admin/gallery" className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaUpload className="text-4xl text-purple-500 mr-2" />
          <div>
            <h2 className="text-xl">Upload Photo</h2>
            <p>Upload photos to the gallery.</p>
          </div>
        </Link>
        <Link href="/admin/certificate" className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <FaCertificate className="text-4xl text-yellow-500 mr-2" />
          <div>
            <h2 className="text-xl">Certificates</h2>
            <p>Add or manage certificates.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
