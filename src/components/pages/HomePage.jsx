import { useState } from "react";
import { motion } from "framer-motion";
import FeedList from "@/components/organisms/FeedList";
import CreatePostForm from "@/components/molecules/CreatePostForm";
import { postsService } from "@/services/api/postsService";
import { toast } from "react-toastify";

const HomePage = ({ currentUser }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreatePost = async (postData) => {
    try {
await postsService.create({
        ...postData,
        user_id: currentUser.Id,
        createdAt: new Date().toISOString(),
      });
      
      setRefreshTrigger(prev => prev + 1);
      return true;
    } catch (error) {
      throw new Error("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold gradient-text">Welcome back!</h1>
            <p className="text-gray-400">See what's happening in your world</p>
          </div>

          {/* Create Post Form */}
          <CreatePostForm 
            onSubmit={handleCreatePost}
            currentUser={currentUser}
          />

          {/* Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Latest Posts</h2>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="text-primary hover:text-secondary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <FeedList refreshTrigger={refreshTrigger} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;