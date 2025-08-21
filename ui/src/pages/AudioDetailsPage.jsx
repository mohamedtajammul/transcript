import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AudioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

    const fetchAudio = async () => {
      try {
        const res = await fetch(`http://localhost:5000/upload/fetch/${id}`);
        const data = await res.json();
        setAudio(data.file);

        if (data.file.status !== "rated") {
          if (!interval) interval = setInterval(fetchAudio, 3000);
        } else {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();

    return () => clearInterval(interval);
  }, [id]);

  if (loading || !audio) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      {/* Back to Dashboard button */}
      <button
        className="absolute top-0 right-0 mt-4 mr-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-4">{audio.originalName}</h1>

      {/* Status, audio player, transcript, ratings... same as before */}
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

      <audio controls className="w-full mb-4">
        <source
          src={`http://localhost:9000/uploads/${audio.fileName}`}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>

      {/* Transcript box */}
      <div className="bg-gray-100 p-4 rounded mb-4 max-h-96 overflow-y-auto">
        <h2 className="font-semibold mb-2">Transcript:</h2>
        {audio.status === "processing" ? (
          <p className="text-gray-500 animate-pulse">Transcription in progress...</p>
        ) : (
          <p>{audio.transcript}</p>
        )}
      </div>

      {/* Ratings */}
      {audio.status === "transcribed" && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-2 text-gray-500 animate-pulse">
            Rating in progress...
          </h2>
        </div>
      )}

      {audio.status === "rated" && audio.rating && (
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
