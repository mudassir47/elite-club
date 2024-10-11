"use client";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebaseConfig"; // Adjust the import path
import { onAuthStateChanged, User, updateProfile } from "firebase/auth"; // Import necessary functions
import { getDatabase, ref as dbRef, set } from "firebase/database"; // Import Firebase Realtime Database functions

const Profile = () => {
  const [user, setUser] = useState<User | null>(null); // Define the type
  const [isEditing, setIsEditing] = useState(false); // State to control modal visibility
  const [displayName, setDisplayName] = useState("");
  const database = getDatabase(); // Initialize Firebase Realtime Database

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // currentUser can be User or null
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (user) {
      try {
        // Update user profile
        await updateProfile(user, {
          displayName, // Only update displayName
        });

        // Update user data in Realtime Database
        await set(dbRef(database, `users/${user.uid}`), {
          uid: user.uid,
          displayName,
          email: user.email,
          photoURL: user.photoURL, // Keep existing photo URL
        });

        console.log("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
      } finally {
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-52">
          <div className="flex items-center justify-center h-48 bg-gray-200">
            <img
              src={user.photoURL || ''}
              alt="Profile"
              className="rounded-full w-32 h-32 border-4 border-white shadow-md"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              {user.displayName}
            </h2>
            <p className="mt-2 text-center text-gray-600">{user.email}</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">
          Please log in to see your profile information.
        </p>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setIsEditing(false)} />
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-96">
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your display name"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
