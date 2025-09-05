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

const RecentlyWatched = () => {
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
          fetchJson("/api/v1/viewer/recently-watched"),
          fetchJson("/api/v1/vod/recently-watched"),
        ]);
        if (!streamsData.success)
          throw new Error(streamsData.error || "Failed to fetch streams");
        if (!vodsData.success)
          throw new Error(vodsData.error || "Failed to fetch VODs");
        setStreams(streamsData.data || []);
        setVods(vodsData.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch recently watched");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Recently Watched</h1>
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
                {streams.map((entry) => (
                  <StreamCard key={entry.stream._id} stream={entry.stream} />
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
                {vods.map((entry) => (
                  <VodCard key={entry.vod._id} vod={entry.vod} />
                ))}
              </div>
            </div>
          )}
          {streams.length === 0 && vods.length === 0 && (
            <div className="text-dark-400">
              No recently watched streams or videos.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentlyWatched;
