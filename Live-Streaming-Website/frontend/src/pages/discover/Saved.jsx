import React, { useEffect, useState } from "react";
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

const Saved = () => {
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const vodsData = await fetchJson("/api/v1/vod/saved");
        if (!vodsData.success)
          throw new Error(vodsData.error || "Failed to fetch saved videos");
        setVods(vodsData.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch saved videos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white mb-4">Saved Videos</h1>
      {loading ? (
        <div className="text-white">Loading...</div>
      ) : error ? (
        <div className="text-red-400 whitespace-pre-line">{error}</div>
      ) : (
        <>
          {vods.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vods.map((vod) => (
                  <VodCard key={vod._id} vod={vod} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-dark-400">
              You haven't saved any videos yet.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Saved;
