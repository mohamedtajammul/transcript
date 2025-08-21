import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all uploaded audio files
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/upload/fetch"); // your API to get all files
      setFiles(res.data.files || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();

    // const interval = setInterval(fetchFiles, 1000);
    // return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-300 text-gray-800";
      case "processing":
        return "bg-yellow-300 text-yellow-900";
      case "transcribed":
        return "bg-green-300 text-green-900";
      case "failed":
        return "bg-red-300 text-red-900";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome back! Here are your uploaded audios:</p>

      <Link
        to="/upload"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-6 inline-block"
      >
        Go to Upload Page
      </Link>

      {loading ? (
        <p>Loading files...</p>
      ) : files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg"
              onClick={() => navigate(`/details/${file._id}`)}
            >
              <h2 className="font-semibold mb-2">{file.originalName}</h2>
              <p className={`inline-block px-2 py-1 rounded text-sm ${getStatusColor(file.status)}`}>
                {file.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
