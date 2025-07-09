import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";
import { notificationsService } from "@/services/api/notificationsService";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationsService.getAll();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

const handleNotificationClick = async (notification) => {
    try {
      // Mark as read first
      await notificationsService.markAsRead(notification.Id);
      setNotifications(prev => 
        prev.map(n => 
          n.Id === notification.Id 
            ? { ...n, isRead: true }
            : n
        )
      );

      // Navigate to appropriate existing routes
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
      } else {
        // Fallback navigation to existing routes only
        switch (notification.type) {
          case "like":
          case "comment":
          case "mention":
            // Navigate to home feed where posts are displayed
            navigate("/");
            break;
          case "follow":
            // Navigate to profile page
            navigate("/profile");
            break;
          default:
            navigate("/");
        }
      }
      
      toast.success("Notification opened");
    } catch (err) {
      console.error("Failed to handle notification:", err);
      toast.error("Failed to open notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return "Heart";
      case "comment":
        return "MessageCircle";
      case "follow":
        return "UserPlus";
      case "mention":
        return "AtSign";
      default:
        return "Bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "like":
        return "text-accent";
      case "comment":
        return "text-primary";
      case "follow":
        return "text-success";
      case "mention":
        return "text-warning";
      default:
        return "text-gray-400";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const filters = [
    { id: "all", label: "All", icon: "Bell" },
    { id: "unread", label: "Unread", icon: "Circle" },
    { id: "like", label: "Likes", icon: "Heart" },
    { id: "comment", label: "Comments", icon: "MessageCircle" },
    { id: "follow", label: "Follows", icon: "UserPlus" },
  ];

  if (loading) {
    return <Loading variant="posts" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadNotifications} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
              <p className="text-gray-400 mt-2">Stay updated with your activity</p>
            </div>
            
            {notifications.some(n => !n.isRead) && (
              <Button variant="primary" onClick={handleMarkAllAsRead}>
                <ApperIcon name="CheckCheck" size={16} className="mr-2" />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="bg-surface rounded-xl p-4 border border-gray-700">
            <div className="flex flex-wrap gap-2">
              {filters.map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    filter === filterOption.id
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <ApperIcon name={filterOption.icon} size={16} />
                  <span className="font-medium">{filterOption.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Empty 
              variant="notifications"
              message="No notifications"
              description="You're all caught up! New notifications will appear here"
            />
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`bg-surface rounded-xl p-6 border transition-all duration-200 cursor-pointer ${
                    notification.isRead 
                      ? "border-gray-700 hover:border-gray-600" 
                      : "border-primary/50 bg-primary/5"
                  }`}
onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      notification.isRead ? "bg-gray-800" : "bg-primary/20"
                    }`}>
                      <ApperIcon 
                        name={getNotificationIcon(notification.type)} 
                        size={20} 
                        className={getNotificationColor(notification.type)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar 
                          src={notification.userAvatar} 
                          alt={notification.userName} 
                          size="sm" 
                        />
                        <span className="font-medium text-white">
                          {notification.userName}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {notification.action}
                        </span>
                        {!notification.isRead && (
                          <Badge variant="primary" size="sm">New</Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        
                        {notification.actionUrl && (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;