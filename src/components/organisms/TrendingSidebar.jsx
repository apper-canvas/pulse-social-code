import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { usersService } from "@/services/api/usersService";
import { hashtagService } from "@/services/api/hashtagService";
const TrendingSidebar = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);

useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const [users, trending] = await Promise.all([
          usersService.getAll(),
          hashtagService.getTrendingHashtags(5)
        ]);
        
        setSuggestedUsers(users.slice(0, 3));
        setTrendingTopics(trending.map(item => ({
          tag: item.tag,
          posts: item.posts,
          displayTag: item.displayTag
        })));
      } catch (error) {
        console.error("Failed to load suggestions:", error);
      }
    };

    loadSuggestions();
  }, []);

  return (
    <aside className="w-80 space-y-6">
      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Trending Topics</h2>
        <div className="space-y-3">
{trendingTopics.map((topic, index) => (
            <Link
              key={topic.tag}
              to={`/explore?tag=${topic.tag.replace('#', '')}`}
              className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-medium">{topic.tag}</p>
                  <p className="text-gray-400 text-sm">{topic.posts.toLocaleString()} posts</p>
                </div>
                <ApperIcon name="TrendingUp" size={16} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
        <Link 
          to="/explore" 
          className="block mt-4 text-primary hover:text-secondary font-medium text-sm"
        >
          See more trending
        </Link>
      </motion.div>

      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Who to Follow</h2>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.Id} className="flex items-center space-x-3">
              <Avatar src={user.avatar} alt={user.displayName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user.displayName}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  @{user.username}
                </p>
              </div>
              <Button variant="primary" size="sm">
                Follow
              </Button>
            </div>
          ))}
        </div>
        <Link 
          to="/explore" 
          className="block mt-4 text-primary hover:text-secondary font-medium text-sm"
        >
          See more suggestions
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-xl p-6 border border-gray-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Platform Stats</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Users</span>
            <span className="text-white font-medium">2.4M</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Posts Today</span>
            <span className="text-white font-medium">45.2K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Trending Tags</span>
            <span className="text-white font-medium">128</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default TrendingSidebar;