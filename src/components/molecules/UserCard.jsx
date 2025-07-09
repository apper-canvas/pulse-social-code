import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useNotifications } from "@/context/NotificationContext";
const UserCard = ({ user, onFollow, onUnfollow, isFollowing = false }) => {
  const { createNotification } = useNotifications();
  
  const handleFollowClick = async () => {
    if (isFollowing) {
      onUnfollow(user.Id);
    } else {
      onFollow(user.Id);
      
      // Create notification for the user being followed
      try {
        await createNotification("follow", 1, user.Id);
      } catch (error) {
        console.error("Failed to create follow notification:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-surface rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar src={user.avatar} alt={user.displayName} size="xl" />
          {user.isPrivate && (
            <div className="absolute -top-1 -right-1 bg-warning rounded-full p-1">
              <ApperIcon name="Lock" size={12} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-white">
            {user.displayName}
          </h3>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          
          {user.bio && (
            <p className="text-gray-300 text-sm line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Users" size={16} />
            <span>{user.followersCount || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="MessageSquare" size={16} />
            <span>{user.postsCount || 0}</span>
          </div>
        </div>

        <Button
          variant={isFollowing ? "secondary" : "primary"}
          size="sm"
          onClick={handleFollowClick}
          className="w-full"
        >
          {isFollowing ? (
            <>
              <ApperIcon name="UserCheck" size={16} className="mr-2" />
              Following
            </>
          ) : (
            <>
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Follow
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default UserCard;