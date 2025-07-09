import { createContext, useContext, useState, useEffect } from "react";
import { notificationsService } from "@/services/api/notificationsService";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      toast.error("This browser doesn't support notifications");
      return false;
    }

    if (notificationPermission === "granted") {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === "granted") {
        toast.success("Notifications enabled!");
        return true;
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
      toast.error("Failed to request notification permission");
      return false;
    }
  };

  const createNotification = async (type, fromUserId, targetUserId, postId = null) => {
    try {
      // Create notification in service
      const notification = await notificationsService.create({
        type,
        fromUserId: parseInt(fromUserId),
        targetUserId: parseInt(targetUserId),
        postId: postId ? parseInt(postId) : null,
        message: getNotificationMessage(type, fromUserId),
      });

      // Update unread count
      setUnreadCount(prev => prev + 1);

      // Create push notification if permission granted
      if (notificationPermission === "granted") {
        await notificationsService.createPushNotification(notification);
      }

      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  };

  const getNotificationMessage = (type, fromUserId) => {
    switch (type) {
      case "like":
        return `liked your post`;
      case "comment":
        return `commented on your post`;
      case "follow":
        return `started following you`;
      default:
        return `interacted with your content`;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const value = {
    notificationPermission,
    unreadCount,
    requestNotificationPermission,
    createNotification,
    markAsRead,
    markAllAsRead,
    loadUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};