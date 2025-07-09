import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postsService } from "@/services/api/postsService";
import { usersService } from "@/services/api/usersService";

const FeedList = ({ refreshTrigger = 0, posts: externalPosts = null }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const loadFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (externalPosts) {
        const usersData = await usersService.getAll();
        setPosts(externalPosts);
        setUsers(usersData);
      } else {
        const [postsData, usersData] = await Promise.all([
          postsService.getAll(),
          usersService.getAll()
        ]);
        
        setPosts(postsData);
        setUsers(usersData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [refreshTrigger, externalPosts]);

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

  const handleComment = (postId) => {
    // Navigate to post detail page for commenting
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId) => {
    // Handle post sharing
    console.log("Share post:", postId);
  };

  const getUserById = (userId) => {
    return users.find(user => user.Id === userId) || {
      Id: userId,
      username: "unknown",
      displayName: "Unknown User",
      avatar: null
    };
  };

  if (loading) {
    return <Loading variant="posts" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadFeed} />;
  }

  if (posts.length === 0) {
    return <Empty variant="posts" message="No posts in your feed" />;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const user = getUserById(post.userId);
        return (
          <motion.div
            key={post.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PostCard
              post={post}
              user={user}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeedList;