import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { postsService } from "@/services/api/postsService";
import { usersService } from "@/services/api/usersService";

const ProfilePage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userPosts = await postsService.getByUserId(currentUser.Id);
      setPosts(userPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [currentUser.Id]);

  const handleLike = async (postId, isLiked) => {
    try {
      await postsService.toggleLike(postId, isLiked);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.Id === postId 
            ? { ...post, likes: isLiked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const tabs = [
    { id: "posts", label: "Posts", icon: "Grid3x3" },
    { id: "media", label: "Media", icon: "Image" },
    { id: "likes", label: "Likes", icon: "Heart" },
  ];

  if (loading) {
    return <Loading variant="profile" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProfile} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header */}
          <div className="bg-surface rounded-xl p-8 border border-gray-700">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative">
                <Avatar 
                  src={currentUser.avatar} 
                  alt={currentUser.displayName} 
                  size="2xl" 
                />
                <div className="absolute -bottom-2 -right-2 bg-success rounded-full p-2">
                  <ApperIcon name="Check" size={16} className="text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {currentUser.displayName}
                  </h1>
                  <p className="text-gray-400 text-lg">@{currentUser.username}</p>
                </div>
                
                {currentUser.bio && (
                  <p className="text-gray-300 leading-relaxed">
                    {currentUser.bio}
                  </p>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Badge variant="primary">
                    <ApperIcon name="Calendar" size={14} className="mr-1" />
                    Joined 2023
                  </Badge>
                  {currentUser.isPrivate && (
                    <Badge variant="warning">
                      <ApperIcon name="Lock" size={14} className="mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-center md:justify-start space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{posts.length}</div>
                    <div className="text-gray-400 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1.2K</div>
                    <div className="text-gray-400 text-sm">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">384</div>
                    <div className="text-gray-400 text-sm">Following</div>
                  </div>
                </div>
              </div>
              
<div className="flex space-x-3">
                <Button 
                  variant="primary"
                  onClick={() => navigate("/settings/profile")}
                >
                  <ApperIcon name="Edit" size={16} className="mr-2" />
                  Edit Profile
                </Button>
                <Button variant="secondary">
                  <ApperIcon name="Share" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Navigation */}
          <div className="bg-surface rounded-xl p-1 border border-gray-700">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {activeTab === "posts" && (
              <>
                {posts.length === 0 ? (
                  <Empty 
                    variant="posts"
                    message="No posts yet"
                    description="Start sharing your thoughts with the world"
                  />
                ) : (
                  <div className="space-y-6">
                    {posts.map((post) => (
                      <PostCard
                        key={post.Id}
                        post={post}
                        user={currentUser}
                        onLike={handleLike}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            
            {activeTab === "media" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts
                  .filter(post => post.mediaUrl)
                  .map((post) => (
                    <motion.div
                      key={post.Id}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square bg-surface rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={post.mediaUrl}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))
                }
                {posts.filter(post => post.mediaUrl).length === 0 && (
                  <div className="col-span-full">
                    <Empty 
                      variant="posts"
                      message="No media posts yet"
                      description="Share some photos or videos to see them here"
                    />
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "likes" && (
              <Empty 
                variant="posts"
                message="No liked posts yet"
                description="Posts you like will appear here"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;