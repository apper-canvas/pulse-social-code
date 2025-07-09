import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import UserCard from "@/components/molecules/UserCard";
import { followsService } from "@/services/api/followsService";
import { usersService } from "@/services/api/usersService";

const UsersList = ({ searchQuery = "", variant = "suggestions" }) => {
  const [users, setUsers] = useState([]);
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [usersData, followsData] = await Promise.all([
        usersService.getAll(),
        followsService.getAll()
      ]);
      
      let filteredUsers = usersData;
      
      if (searchQuery) {
        filteredUsers = usersData.filter(user => 
          (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
          ((user.display_name || user.displayName) && (user.display_name || user.displayName).toLowerCase().includes(searchQuery.toLowerCase()))
        );
      } else if (variant === "suggestions") {
        // For friend suggestions, calculate mutual connections and sort by them
        const currentUserId = 1; // Mock current user ID
        
        // Filter out current user and already followed users
        const unfollowedUsers = usersData.filter(user => 
          user.Id !== currentUserId && 
          !followsData.some(follow => 
            follow.follower_id === currentUserId && follow.following_id === user.Id
          )
        );
        
        // Calculate mutual connections for each user
        const usersWithMutualConnections = await Promise.all(
          unfollowedUsers.map(async (user) => {
            const mutualConnections = await followsService.getMutualConnections(currentUserId, user.Id);
            return {
              ...user,
              mutualConnections: mutualConnections.length
            };
          })
        );
        
        // Sort by mutual connections (descending) and take top suggestions
        filteredUsers = usersWithMutualConnections
          .sort((a, b) => b.mutualConnections - a.mutualConnections)
          .slice(0, 12); // Show top 12 friend suggestions
      }
      
      setUsers(filteredUsers);
      setFollows(followsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

const handleFollow = async (userId) => {
    try {
      await followsService.follow(userId);
      setFollows(prev => [...prev, { follower_id: 1, following_id: userId }]);
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

const handleUnfollow = async (userId) => {
    try {
      await followsService.unfollow(userId);
      setFollows(prev => prev.filter(follow => follow.following_id !== userId));
    } catch (err) {
      console.error("Failed to unfollow user:", err);
    }
  };

const isFollowing = (userId) => {
    return follows.some(follow => follow.following_id === userId);
  };
  if (loading) {
    return <Loading variant="users" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadUsers} />;
  }

  if (users.length === 0) {
    return (
      <Empty 
        variant={searchQuery ? "search" : "users"}
        message={searchQuery ? "No users found" : "No users available"}
      />
    );
  }

return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <motion.div
          key={user.Id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <UserCard
            user={user}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            isFollowing={isFollowing(user.Id)}
            showMutualConnections={variant === "suggestions"}
            mutualConnections={user.mutualConnections}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default UsersList;