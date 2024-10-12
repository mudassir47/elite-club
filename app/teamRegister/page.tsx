"use client";
import { useEffect, useState } from "react";
import { auth } from "../../lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FormPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    team: string;
    designation: string; // New property for designation
    photo: File | null;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  }>({
    name: "",
    email: "",
    team: "",
    designation: "", // Initialize designation
    photo: null,
    facebook: "",
    twitter: "",
    linkedin: "",
    github: "",
  });
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid);
      } else {
        setUser(null);
        setFormData({ name: "", email: "", team: "", designation: "", photo: null }); // Reset designation
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    const db = getDatabase();
    const userRef = dbRef(db, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      setFormData((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
      }));
    } else {
      console.log("No data available for user:", uid);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, photo: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const storage = getStorage();
    const photoRef = ref(storage, `user_photos/${user?.uid}/${formData.photo?.name}`);

    try {
      let photoURL = "";

      if (formData.photo) {
        await uploadBytes(photoRef, formData.photo);
        console.log("Photo uploaded successfully.");
        photoURL = await getDownloadURL(photoRef);
      }

      const db = getDatabase();
      await set(dbRef(db, `teams/${user?.uid}`), {
        name: formData.name,
        email: formData.email,
        designation: formData.designation, // Include designation in the database
        photoURL,
        facebook: formData.facebook || "",
        twitter: formData.twitter || "",
        linkedin: formData.linkedin || "",
        github: formData.github || "",
      });

      console.log("Form submitted:", formData);
      setShowPopup(true);
      setFormData({ name: "", email: "", team: "", designation: "", photo: null }); // Reset form data

    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push("/");
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {user ? (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Register Team Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select designation</option>
                <option value="Technical Member">Technical Member</option>
                <option value="Marketing Team">Marketing Team</option>
                <option value="Designing Team">Designing Team</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Facebook (Optional)</label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Facebook profile link"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Twitter (Optional)</label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Twitter profile link"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">LinkedIn (Optional)</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="LinkedIn profile link"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">GitHub (Optional)</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="GitHub profile link"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </form>
          {showPopup && (
            <div
              className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50"
              onClick={handleClosePopup}
            >
              <div className="bg-white p-6 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
                <h1 className="text-xl font-bold">Thank You, {formData.name}!</h1>
                <p>We will review your submission and get back to you soon.</p>
                <button onClick={handleClosePopup} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="bg-gray-800 text-black p-6 rounded-lg shadow-lg text-center">
            <h1 className="text-xl font-bold text-red-900">Login or Register First</h1>
            <p className="mt-2 text-red-200">You must be logged in to fill out the team details.</p>
            <button
              onClick={handleOpenModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Show Warning
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute top-0 left-0 right-0 bottom-0" onClick={handleCloseModal}></div>
          <div className="bg-white p-6 rounded shadow-lg z-10">
            <h1 className="text-xl font-bold text-red-900">Warning</h1>
            <p>You must be logged in to fill out the form.</p>
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;
