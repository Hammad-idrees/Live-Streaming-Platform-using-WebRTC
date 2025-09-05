import { useState, useEffect, useCallback } from "react";
import { getMyPlaylists, createPlaylist } from "../../utils/api/playlist";

export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlaylists = useCallback(() => {
    setLoading(true);
    getMyPlaylists()
      .then((res) => {
        setPlaylists(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load playlists");
        setLoading(false);
      });
  }, []);

  const handleCreate = async (name) => {
    if (!name.trim()) return;
    try {
      const res = await createPlaylist(name);
      setPlaylists((prev) => [res.data, ...prev]);
      return true;
    } catch (err) {
      setError(err.message || "Failed to create playlist");
      return false;
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return {
    playlists,
    loading,
    error,
    fetchPlaylists,
    handleCreate,
    setError,
  };
}
