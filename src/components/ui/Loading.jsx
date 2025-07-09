import { motion } from "framer-motion";

const Loading = ({ variant = "posts" }) => {
  if (variant === "posts") {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 border border-gray-700"
          >
            {/* User header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full shimmer" />
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-32 mb-2 shimmer" />
                <div className="h-3 bg-gray-600 rounded w-20 shimmer" />
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-gray-600 rounded w-full shimmer" />
              <div className="h-4 bg-gray-600 rounded w-3/4 shimmer" />
              <div className="h-4 bg-gray-600 rounded w-1/2 shimmer" />
            </div>
            
            {/* Image placeholder */}
            <div className="h-48 bg-gray-600 rounded-lg mb-4 shimmer" />
            
            {/* Actions */}
            <div className="flex items-center space-x-6">
              <div className="h-6 bg-gray-600 rounded w-16 shimmer" />
              <div className="h-6 bg-gray-600 rounded w-16 shimmer" />
              <div className="h-6 bg-gray-600 rounded w-16 shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "users") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl p-6 border border-gray-700"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gray-600 rounded-full shimmer" />
              <div className="text-center space-y-2">
                <div className="h-5 bg-gray-600 rounded w-32 shimmer" />
                <div className="h-4 bg-gray-600 rounded w-24 shimmer" />
              </div>
              <div className="h-10 bg-gray-600 rounded-lg w-full shimmer" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className="space-y-6">
        {/* Profile header */}
        <div className="bg-surface rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-24 h-24 bg-gray-600 rounded-full shimmer" />
            <div className="flex-1 text-center md:text-left">
              <div className="h-8 bg-gray-600 rounded w-48 mb-2 shimmer" />
              <div className="h-4 bg-gray-600 rounded w-32 mb-4 shimmer" />
              <div className="flex justify-center md:justify-start space-x-6">
                <div className="h-6 bg-gray-600 rounded w-20 shimmer" />
                <div className="h-6 bg-gray-600 rounded w-20 shimmer" />
                <div className="h-6 bg-gray-600 rounded w-20 shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-gray-700">
              <div className="h-32 bg-gray-600 rounded-lg mb-3 shimmer" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-600 rounded w-full shimmer" />
                <div className="h-4 bg-gray-600 rounded w-3/4 shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-32">
      <motion.div
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;