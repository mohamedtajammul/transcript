import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // API returns fileId
      const { fileId } = res.data;
      console.log("Uploaded successfully:", fileId);

      // Reset file input
      setFile(null);

      // Redirect to dashboard
      if (fileId) {
        // Redirect to AudioDetailPage for the uploaded file
        navigate(`/details/${fileId}`);
      } else {
        alert('something went wrong')
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Upload Audio</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <label className="block mb-2 font-medium">Select Audio File:</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="w-full border p-2 mb-4 rounded"
        />

        {file && (
          <p className="mb-4 text-gray-700">
            Selected File: <span className="font-semibold">{file.name}</span>
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
