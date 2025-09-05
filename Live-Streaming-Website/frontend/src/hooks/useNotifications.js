import { useEffect } from "react";
import Pusher from "pusher-js";
import { getUserData } from "../utils/api/config";

export function useNotifications(onNotification) {
  useEffect(() => {
    const userData = getUserData();
    const userId = userData?._id;
    if (!userId) return;

    // Replace with your actual Pusher key and cluster
    const pusher = new Pusher("1957df6041078d344f8c", {
      cluster: "ap2",
      // If using private/auth channels, add authEndpoint here
    });

    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind("notification", (data) => {
      onNotification(data);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [onNotification]);
}
