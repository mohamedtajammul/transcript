import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AudioDetailPage() {
  const { id } = useParams();
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const res = await fetch(`http://localhost:5000/upload/fetch/${id}`);
        const data = await res.json();
        setAudio(data.file);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!audio) return <p className="p-6">Audio not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{audio.originalName}</h1>
      <p className="mb-2">
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`px-2 py-1 rounded ${
            audio.status === "pending"
              ? "bg-gray-300"
              : audio.status === "processing"
              ? "bg-yellow-300"
              : audio.status === "transcribed"
              ? "bg-green-300"
              : "bg-red-300"
          }`}
        >
          {audio.status}
        </span>
      </p>
      <p className="mb-4">
        <span className="font-semibold">Uploaded At:</span>{" "}
        {new Date(audio.createdAt).toLocaleString()}
      </p>

      <audio controls className="w-full mb-4">
        <source src={`http://localhost:9000/uploads/${audio.fileName}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {audio.transcript && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Transcript:</h2>
          <p>{audio.transcript}</p>
        </div>
      )}
    </div>
  );
}
