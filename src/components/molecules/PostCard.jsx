import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { useNotifications } from "@/context/NotificationContext";
const PostCard = ({ 
  post, 
  user, 
  onLike, 
  onComment, 
  onShare,
  isLiked = false,
  showComments = false 
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showFullContent, setShowFullContent] = useState(false);
  const { createNotification } = useNotifications();
const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    if (onLike) {
      onLike(post.Id, newLikedState);
    }
    
    if (newLikedState) {
      toast.success("Post liked!", { autoClose: 1000 });
      
      // Create notification for the post author (if not liking own post)
      if (post.userId !== 1) { // Assuming current user Id is 1
        try {
          await createNotification("like", 1, post.userId, post.Id);
        } catch (error) {
          console.error("Failed to create like notification:", error);
        }
      }
    }
  };

  const handleComment = () => {
    if (onComment) {
      onComment(post.Id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.Id);
    }
    toast.success("Post shared!", { autoClose: 1000 });
  };

  const isLongContent = post.content && post.content.length > 280;
  const displayContent = isLongContent && !showFullContent 
    ? post.content.slice(0, 280) + "..."
    : post.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      {/* User Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar src={user.avatar} alt={user.displayName} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-white font-semibold truncate">
              {user.displayName}
            </h3>
            <span className="text-gray-400 text-sm">@{user.username}</span>
          </div>
          <p className="text-gray-400 text-sm">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <ApperIcon name="MoreHorizontal" size={16} />
        </Button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="mb-4">
          <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {isLongContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-primary hover:text-secondary text-sm mt-2 font-medium"
            >
              {showFullContent ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-4">
          {post.mediaType === "image" ? (
            <img
              src={post.mediaUrl}
              alt="Post media"
              className="w-full rounded-lg max-h-96 object-cover"
            />
          ) : post.mediaType === "video" ? (
            <video
              src={post.mediaUrl}
              controls
              className="w-full rounded-lg max-h-96"
            />
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-2 group ${
              liked ? "text-accent" : "text-gray-400 hover:text-accent"
            }`}
          >
            <div className={`heart-particles ${liked ? "animate-heart-burst" : ""}`}>
              <ApperIcon 
                name={liked ? "Heart" : "Heart"} 
                size={18} 
                className={liked ? "fill-current" : ""}
              />
            </div>
            <span className="text-sm font-medium">{likeCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComment}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary group"
          >
            <ApperIcon name="MessageCircle" size={18} />
            <span className="text-sm font-medium">{post.comments || 0}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-secondary group"
          >
            <ApperIcon name="Share" size={18} />
            <span className="text-sm font-medium">Share</span>
          </motion.button>
        </div>

        <Button variant="ghost" size="sm">
          <ApperIcon name="Bookmark" size={16} />
        </Button>
      </div>
    </motion.div>
  );
};

export default PostCard;