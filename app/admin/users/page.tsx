"use client";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, get, update } from "firebase/database";

const AdminPage = () => {
  const [users, setUsers] = useState<{ [key: string]: any }>({});
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getDatabase();
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        setUsers(snapshot.val());
      } else {
        console.log("No user data available");
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (userId: string) => {
    setEditingUserId(userId);
    setEditForm({
      name: users[userId].name,
      email: users[userId].email,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = getDatabase();
    const userRef = ref(db, `users/${editingUserId}`);

    try {
      await update(userRef, editForm);
      alert("User details updated successfully!");
      setEditingUserId(null);
      setEditForm({ name: "", email: "" });
      // Re-fetch users after updating
      const snapshot = await get(ref(db, "users"));
      if (snapshot.exists()) {
        setUsers(snapshot.val());
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-blue-600 text-black p-6 text-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-xl">Manage User Details</p>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">User List</h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-black">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Profile Picture</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(users).map(([userId, user]) => (
              <tr key={userId} className="hover:bg-gray-100">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditClick(userId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editingUserId && (
          <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter user name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter user email"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-green-700  transition duration-200"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-blue-600 text-white p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Admin Dashboard. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminPage;
