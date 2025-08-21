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
              : audio.status === "rated"
              ? "bg-blue-300"
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
        <source
          src={`http://localhost:9000/uploads/${audio.fileName}`}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

      {audio.transcript && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Transcript:</h2>
          <p>{audio.transcript}</p>
        </div>
      )}

      {audio.rating && (
        <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3 text-lg">Ratings</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center bg-red-200 p-3 rounded w-40">
            <span className="font-medium">Opening</span>
            <span className="text-xl font-bold">{audio.rating.opening}</span>
          </div>
          <div className="flex flex-col items-center bg-green-200 p-3 rounded w-40">
            <span className="font-medium">Issue Understanding</span>
            <span className="text-xl font-bold">{audio.rating.issueUnderstanding}</span>
          </div>
          <div className="flex flex-col items-center bg-yellow-200 p-3 rounded w-40">
            <span className="font-medium">Tone / Sentiment</span>
            <span className="text-xl font-bold">{audio.rating.tone}</span>
          </div>
          <div className="flex flex-col items-center bg-purple-200 p-3 rounded w-40">
            <span className="font-medium">CSAT</span>
            <span className="text-xl font-bold">{audio.rating.csat}</span>
          </div>
        </div>
      </div>
      
      
      )}
    </div>
  );
}
