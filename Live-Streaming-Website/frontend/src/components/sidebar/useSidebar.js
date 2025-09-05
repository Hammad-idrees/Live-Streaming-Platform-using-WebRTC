import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  navigation,
  discover,
  categories,
  followedStreamers,
} from "./sidebar.data";

export function useSidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const viewToRoute = {
    home: "/dashboard",
    browse: "/browse",
    following: "/following",
    library: "/library",
    playlists: "/playlists",
    trending: "/trending",
    recent: "/recently-watched",
    liked: "/liked",
    saved: "/saved",
    settings: "/settings",
    live: "/live",
  };
  return {
    user,
    navigate,
    navigation,
    discover,
    categories,
    followedStreamers,
    viewToRoute,
  };
}
