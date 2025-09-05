import React, { useEffect, useState } from "react";
import StreamCard from "../../components/ui/StreamCard";
import VodCard from "../../components/ui/VodCard";
import { getAuthToken } from "../../utils/api/config";

const fetchJson = async (url) => {
  const token = getAuthToken();
  const res = await fetch(url, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Unexpected response from server. Status: ${
        res.status
      }. Body: ${text.slice(0, 100)}`
    );
  }
  return res.json();
};

const Liked = () => {
  const [streams, setStreams] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [streamsData, vodsData] = await Promise.all([
          fetchJson("/api/v1/stream/liked"),
          fetchJson("/api/v1/vod/liked"),
        ]);
        if (!streamsData.success)
          throw new Error(streamsData.error || "Failed to fetch liked streams");
        if (!vodsData.success)
          throw new Error(vodsData.error || "Failed to fetch liked videos");
        setStreams(streamsData.data || []);
        setVods(vodsData.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch liked content");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Liked Streams & Videos
      </h1>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-400 whitespace-pre-line">{error}</div>
      ) : (
        <>
          {streams.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Streams</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {streams.map((stream) => (
                  <StreamCard key={stream._id} stream={stream} />
                ))}
              </div>
            </div>
          )}
          {vods.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 mt-6">
                Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vods.map((vod) => (
                  <VodCard key={vod._id} vod={vod} />
                ))}
              </div>
            </div>
          )}
          {streams.length === 0 && vods.length === 0 && (
            <div className="text-dark-400">
              You haven't liked any streams or videos yet.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Liked;
