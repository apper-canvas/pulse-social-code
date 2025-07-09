import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import UsersList from "@/components/organisms/UsersList";
import SearchBar from "@/components/molecules/SearchBar";
import FeedList from "@/components/organisms/FeedList";
import { usersService } from "@/services/api/usersService";
import { hashtagService } from "@/services/api/hashtagService";
const ExplorePage = () => {
const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [hashtagPosts, setHashtagPosts] = useState([]);
  const [isLoadingHashtag, setIsLoadingHashtag] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadTrendingTopics = async () => {
      try {
        const trending = await hashtagService.getTrendingHashtags(5);
        setTrendingTopics(trending);
      } catch (error) {
        console.error("Failed to load trending topics:", error);
      }
    };

    loadTrendingTopics();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get('tag');
    
    if (tag) {
      setSelectedHashtag(tag);
      loadHashtagPosts(tag);
    } else {
      setSelectedHashtag("");
      setHashtagPosts([]);
    }
  }, [location.search]);

  const loadHashtagPosts = async (hashtag) => {
    setIsLoadingHashtag(true);
    try {
      const posts = await hashtagService.getPostsByHashtag(hashtag);
      setHashtagPosts(posts);
    } catch (error) {
      console.error("Failed to load hashtag posts:", error);
      setHashtagPosts([]);
    } finally {
      setIsLoadingHashtag(false);
    }
  };
const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        if (query.startsWith('#')) {
          // Hashtag search
          const hashtag = query.slice(1);
          setSelectedHashtag(hashtag);
          loadHashtagPosts(hashtag);
          setSearchResults([]);
        } else {
          // User search
          const users = await usersService.getAll();
          const filtered = users.filter(user => 
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.displayName.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(filtered);
          setSelectedHashtag("");
          setHashtagPosts([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setSelectedHashtag("");
      setHashtagPosts([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold gradient-text">Explore</h1>
            <p className="text-gray-400 text-lg">Discover new people and trending content</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for users, topics, or content..."
              results={searchResults}
            />
          </div>

          {/* Trending Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {selectedHashtag ? `Posts tagged with #${selectedHashtag}` : 
                 searchQuery ? `Search Results for "${searchQuery}"` : "Friend Suggestions"}
              </h2>
              
              {selectedHashtag ? (
                <div>
                  {isLoadingHashtag ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : hashtagPosts.length > 0 ? (
                    <FeedList posts={hashtagPosts} />
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No posts found for #{selectedHashtag}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!searchQuery && (
                    <p className="text-gray-400 mb-6">
                      Connect with people you may know through mutual connections
                    </p>
                  )}
                  <UsersList searchQuery={searchQuery} variant="suggestions" />
                </div>
              )}
            </div>

            {/* Trending Sidebar */}
            <div className="space-y-6">
              <div className="bg-surface rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Trending Now</h3>
                <div className="space-y-3">
{trendingTopics.map((trend, index) => (
                    <div 
                      key={trend.tag} 
                      onClick={() => {
                        setSelectedHashtag(trend.tag.replace('#', ''));
                        loadHashtagPosts(trend.tag.replace('#', ''));
                      }}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="text-primary font-medium">{trend.tag}</p>
                        <p className="text-gray-400 text-sm">{trend.posts.toLocaleString()} posts</p>
                      </div>
                      <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
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
                    <span className="text-gray-400">New Users</span>
                    <span className="text-white font-medium">1.2K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorePage;