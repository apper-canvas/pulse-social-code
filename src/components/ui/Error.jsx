import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  variant = "default" 
}) => {
  const getErrorIcon = () => {
    switch (variant) {
      case "network":
        return "WifiOff";
      case "notFound":
        return "Search";
      case "server":
        return "Server";
      default:
        return "AlertCircle";
    }
  };

  const getErrorTitle = () => {
    switch (variant) {
      case "network":
        return "Connection Error";
      case "notFound":
        return "Not Found";
      case "server":
        return "Server Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={getErrorIcon()} size={32} className="text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;