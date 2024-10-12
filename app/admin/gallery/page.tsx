"use client";
import { useState, useEffect } from 'react';
import { ref, set, onValue, remove } from 'firebase/database';
import { uploadBytes, ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';
import { realtimeDB, storage } from '@/lib/firebaseConfig';

const AdminPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video'>('image');
  const [uploading, setUploading] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isValidType = selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/');
      if (!isValidType) {
        alert('Please select a valid image or video file.');
        return;
      }
      setFile(selectedFile);
      setFileType(selectedFile.type.startsWith('image/') ? 'image' : 'video');
    }
  };

  const sanitizeFileName = (name: string) => {
    return name.replace(/[.#$\[\]]/g, '_'); // Replace invalid characters
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const sanitizedFileName = sanitizeFileName(file.name);
      const storagePath = `${fileType}s/${sanitizedFileName}`;
      const storageReference = storageRef(storage, storagePath);

      await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(storageReference);

      const dbRef = ref(realtimeDB, `gallery/${fileType}s/${sanitizedFileName}`);
      await set(dbRef, { url: downloadURL, name: sanitizedFileName, type: fileType });

      alert('File uploaded successfully!');
      setFile(null);
      fetchMediaItems(); // Refresh the media items
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload the file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const fetchMediaItems = () => {
    const dbRef = ref(realtimeDB, `gallery`);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setMediaItems([]);
        setLoading(false);
        return;
      }

      const items = [];
      for (const type in data) {
        for (const key in data[type]) {
          items.push({ ...data[type][key], id: key, type });
        }
      }
      setMediaItems(items);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching media items:', error);
      alert('Failed to fetch media items.');
      setLoading(false);
    });
  };

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      try {
        const storageReference = storageRef(storage, `${item.type}s/${item.name}`);
        console.log(`Attempting to delete: ${storageReference.fullPath}`); // Log the path

        await deleteObject(storageReference);

        const dbRef = ref(realtimeDB, `gallery/${item.type}s/${item.id}`);
        await remove(dbRef);

        alert('File deleted successfully!');
        fetchMediaItems(); // Refresh the media items
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete the file. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchMediaItems(); // Fetch media items on component mount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Upload Gallery Items</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleUpload}
        className={`p-2 text-white bg-blue rounded ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <h2 className="text-xl font-semibold mt-8 mb-4">
        {loading ? 'Loading media items...' : 'Uploaded Media Items'}
      </h2>
      {loading ? ( 
        <p>Loading media items...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mediaItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded">
              <div className="flex items-center">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                ) : (
                  <video src={item.url} className="w-16 h-16 mr-4" controls />
                )}
                <span>{item.name}</span>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
