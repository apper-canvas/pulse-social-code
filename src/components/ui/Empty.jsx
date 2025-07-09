import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  message = "No items found", 
  description = "Get started by creating something new",
  actionLabel = "Create New",
  onAction,
  variant = "default" 
}) => {
  const getEmptyIcon = () => {
    switch (variant) {
      case "posts":
        return "MessageSquare";
      case "users":
        return "Users";
      case "search":
        return "Search";
      case "notifications":
        return "Bell";
      case "comments":
        return "MessageCircle";
      default:
        return "Inbox";
    }
  };

  const getEmptyTitle = () => {
    switch (variant) {
      case "posts":
        return "No posts yet";
      case "users":
        return "No users found";
      case "search":
        return "No results found";
      case "notifications":
        return "No notifications";
      case "comments":
        return "No comments yet";
      default:
        return "Nothing here yet";
    }
  };

  const getEmptyDescription = () => {
    switch (variant) {
      case "posts":
        return "Start sharing your thoughts with the world";
      case "users":
        return "Try searching for someone else";
      case "search":
        return "Try different keywords or check your spelling";
      case "notifications":
        return "We'll let you know when something happens";
      case "comments":
        return "Be the first to share your thoughts";
      default:
        return description;
    }
  };

  const getActionLabel = () => {
    switch (variant) {
      case "posts":
        return "Create Post";
      case "users":
        return "Search Again";
      case "search":
        return "Clear Search";
      case "comments":
        return "Add Comment";
      default:
        return actionLabel;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={getEmptyIcon()} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3">
        {getEmptyTitle()}
      </h3>
      
      <p className="text-gray-400 mb-8 max-w-md leading-relaxed">
        {getEmptyDescription()}
      </p>
      
      {onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {getActionLabel()}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;