"use client";
import { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { realtimeDB } from '@/lib/firebaseConfig';

const AdminPanel = () => {
  const [teams, setTeams] = useState<any[]>([]);

  const fetchTeams = () => {
    const teamsRef = ref(realtimeDB, 'teams');
    onValue(teamsRef, (snapshot) => {
      const teamData = snapshot.val();
      if (teamData) {
        setTeams(Object.keys(teamData).map((key) => ({ id: key, ...teamData[key] })));
      } else {
        setTeams([]);
      }
    });
  };

  const updateApprovalStatus = (id: string, status: boolean) => {
    const teamRef = ref(realtimeDB, `teams/${id}`);
    set(teamRef, { ...teams.find(team => team.id === id), approved: status })
      .then(() => {
        console.log(`Team ${id} approval status updated to ${status}`);
      })
      .catch((error) => {
        console.error("Error updating approval status:", error);
      });
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-2xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Admin Panel</h1>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Designation</th>
                <th className="py-3 px-6 text-center">Approved</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">{team.name}</td>
                  <td className="py-3 px-6 text-left">{team.designation}</td>
                  <td className="py-3 px-6 text-center">{team.approved ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => updateApprovalStatus(team.id, true)}
                      className="bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-600  bg-circlebg transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateApprovalStatus(team.id, false)}
                      className="bg-red-500 text-white font-bold py-1 px-3 rounded ml-2 hover:bg-red-600 transition bg-beach duration-200"
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
