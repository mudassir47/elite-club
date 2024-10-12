"use client";
import React, { useEffect, useState } from "react";
import { getDatabase, ref, set, onValue, remove, update } from "firebase/database";

const CertificateForm = () => {
  const [formData, setFormData] = useState({ name: "", number: "" });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [certificates, setCertificates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const generateAuthCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const authCode = generateAuthCode();

    try {
      const db = getDatabase();
      const certificateRef = ref(db, "certificates/" + authCode);
      await set(certificateRef, {
        name: formData.name,
        number: formData.number,
        authCode: authCode,
      });
      setSuccessMessage("Certificate details submitted successfully!");
      setFormData({ name: "", number: "" });
    } catch (error) {
      console.error("Error submitting data:", error);
      setSuccessMessage("Error submitting data. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const db = getDatabase();
    const certificatesRef = ref(db, "certificates");
    onValue(certificatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCertificates(data);
      }
    });
  }, []);

  const handleDelete = async (authCode: string) => {
    const db = getDatabase();
    const certificateRef = ref(db, "certificates/" + authCode);
    await remove(certificateRef);
  };

  const handleEdit = async (authCode: string, updatedData: { name: string; number: string }) => {
    const db = getDatabase();
    const certificateRef = ref(db, "certificates/" + authCode);
    await update(certificateRef, updatedData);
  };

  const filteredCertificates = Object.values(certificates).filter((certificate: any) =>
    certificate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Certificate Details Form</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          <label className="block text-sm font-medium text-gray-700">Number</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter your number"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <div className="mt-8">
        <input
          type="text"
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        {Object.keys(certificates).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate: any) => (
              <div key={certificate.authCode} className="bg-white shadow-md rounded p-4">
                <img src="/mudassir.png" alt="Certificate" className="w-full h-15 object-cover rounded-t" />
                <div className="text-center mt-4">
                  <h2 className="text-lg font-semibold">{certificate.name}</h2>
                  <p className="text-gray-600">Auth Code: {certificate.authCode}</p>
                  <p className="text-gray-600">Number: {certificate.number}</p>
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => handleDelete(certificate.authCode)}
                      className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(certificate.authCode, { name: "New Name", number: "New Number" })} // Example edit
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateForm;
