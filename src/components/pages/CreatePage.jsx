import { useState } from 'react';
import { motion } from 'framer-motion';
import CreatePostForm from '@/components/molecules/CreatePostForm';
import { postsService } from '@/services/api/postsService';
import { toast } from 'react-toastify';

const CreatePage = ({ currentUser }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePost = async (postData) => {
    setIsCreating(true);
    try {
const newPost = await postsService.create({
        ...postData,
        user_id: currentUser.Id
      });
      
      toast.success('Post created successfully!');
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-white mb-6">Create New Post</h1>
          
          <div className="bg-surface border border-gray-800 rounded-xl p-6">
            <CreatePostForm
              onSubmit={handleCreatePost}
              currentUser={currentUser}
              disabled={isCreating}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreatePage;