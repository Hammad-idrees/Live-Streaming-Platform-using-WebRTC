import { apiClient } from "./client";

export const getMyPlaylists = async () => {
  const res = await apiClient.get("/api/v1/playlist/my");
  return res.data;
};

export const createPlaylist = async (name) => {
  const res = await apiClient.post("/api/v1/playlist/create", { name });
  return res.data;
};

export const addVideoToPlaylist = async (playlistId, vodId) => {
  const res = await apiClient.post("/api/v1/playlist/add-video", {
    playlistId,
    vodId,
  });
  return res.data;
};

export const removeVideoFromPlaylist = async (playlistId, vodId) => {
  const res = await apiClient.post("/api/v1/playlist/remove-video", {
    playlistId,
    vodId,
  });
  return res.data;
};

export const getPlaylistById = async (id) => {
  const res = await apiClient.get(`/api/v1/playlist/${id}`);
  return res.data;
};

export const deletePlaylist = async (id) => {
  const res = await apiClient.delete(`/api/v1/playlist/${id}`);
  return res.data;
};
