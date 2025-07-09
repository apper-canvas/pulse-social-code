import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CommentCard = ({ comment, user, onLike, onReply, isLiked = false }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    
    if (onLike) {
      onLike(comment.Id, newLikedState);
    }
  };

  const handleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex space-x-3 py-4 border-b border-gray-700 last:border-b-0"
    >
      <Avatar src={user.avatar} alt={user.displayName} size="sm" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="text-white font-medium text-sm">{user.displayName}</h4>
          <span className="text-gray-400 text-xs">@{user.username}</span>
          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-gray-200 text-sm leading-relaxed mb-3">
          {comment.content}
        </p>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center space-x-1 text-xs ${
              liked ? "text-accent" : "text-gray-400 hover:text-accent"
            }`}
          >
            <ApperIcon 
              name="Heart" 
              size={14} 
              className={liked ? "fill-current" : ""}
            />
            <span>{likeCount}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReply}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-primary"
          >
            <ApperIcon name="MessageCircle" size={14} />
            <span>Reply</span>
          </motion.button>
        </div>
        
        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 pt-3 border-t border-gray-700"
          >
            <div className="flex space-x-2">
              <Avatar src="/api/placeholder/32/32" alt="You" size="sm" />
              <div className="flex-1">
                <textarea
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentCard;