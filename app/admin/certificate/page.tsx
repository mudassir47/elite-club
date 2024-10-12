"use client";
import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";

const CertificateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Function to generate a random 10-character uppercase alphanumeric auth code
  const generateAuthCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Use uppercase letters
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
      const certificateRef = ref(db, "certificates/" + authCode); // Store by auth code as key
      await set(certificateRef, {
        name: formData.name,
        number: formData.number,
        authCode: authCode,
      });
      setSuccessMessage("Certificate details submitted successfully!");
      setFormData({ name: "", number: "" }); // Reset form fields
    } catch (error) {
      console.error("Error submitting data:", error);
      setSuccessMessage("Error submitting data. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
    </div>
  );
};

export default CertificateForm;
