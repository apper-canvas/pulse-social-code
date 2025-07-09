import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { hashtagService } from "@/services/api/hashtagService";
const CreatePostForm = ({ onSubmit, currentUser }) => {
const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (content.trim()) {
      const suggestions = hashtagService.suggestHashtags(content);
      setSuggestedHashtags(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSuggestedHashtags([]);
      setShowSuggestions(false);
    }
  }, [content]);
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setMediaPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

const handleHashtagClick = (hashtag) => {
    const cursorPosition = content.length;
    const newContent = content + (content.endsWith(' ') ? '' : ' ') + hashtag + ' ';
    setContent(newContent);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !mediaFile) {
      toast.error("Please add some content or media");
      return;
    }

    if (content.length > 500) {
      toast.error("Post content cannot exceed 500 characters");
      return;
    }

    // Validate hashtags
    const hashtags = hashtagService.extractHashtags(content);
    const invalidTags = hashtags.filter(tag => !hashtagService.validateHashtag(tag));
    if (invalidTags.length > 0) {
      toast.error(`Invalid hashtags: ${invalidTags.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const postData = {
        content: content.trim(),
        mediaUrl: mediaPreview,
        mediaType: mediaFile ? (mediaFile.type.startsWith("image/") ? "image" : "video") : null,
      };
      
      await onSubmit(postData);
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
      setSuggestedHashtags([]);
      setShowSuggestions(false);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 500 - content.length;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl p-6 border border-gray-700"
    >
      <div className="flex space-x-4">
        <Avatar 
          src={currentUser.avatar} 
          alt={currentUser.displayName} 
          size="md" 
        />
        
        <div className="flex-1 space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            className="border-none bg-transparent text-lg placeholder-gray-400 resize-none focus:ring-0"
          />
          
          {mediaPreview && (
            <div className="relative">
              <img
                src={mediaPreview}
                alt="Upload preview"
                className="w-full rounded-lg max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveMedia}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer text-primary hover:text-secondary">
                <ApperIcon name="Image" size={20} />
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </label>
              
              <button
                type="button"
                className="text-primary hover:text-secondary"
                onClick={() => toast.info("Poll feature coming soon!")}
              >
                <ApperIcon name="BarChart3" size={20} />
              </button>
              
              <button
                type="button"
                className="text-primary hover:text-secondary"
                onClick={() => toast.info("Emoji picker coming soon!")}
              >
                <ApperIcon name="Smile" size={20} />
              </button>
</div>
            
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${remainingChars < 20 ? "text-warning" : "text-gray-400"}`}>
                {remainingChars}
              </span>
              
              <Button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !mediaFile)}
                className="px-6"
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </div>
          
          {showSuggestions && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300 mb-2">Suggested hashtags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedHashtags.map((hashtag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleHashtagClick(hashtag)}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm hover:bg-primary/30 transition-colors"
                  >
                    {hashtag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.form>
  );
};

export default CreatePostForm;