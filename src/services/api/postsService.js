import { toast } from "react-toastify";

class PostsService {
  constructor() {
    this.tableName = "post";
  }

  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching post with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getByUserId(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "user_id",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching user posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(postData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: postData.Name || postData.content?.substring(0, 50) || "New Post",
          content: postData.content,
          media_url: postData.media_url || postData.mediaUrl || "",
          media_type: postData.media_type || postData.mediaType || "",
          likes: postData.likes || 0,
          comments: postData.comments || 0,
          created_at: postData.created_at || postData.createdAt || new Date().toISOString(),
          user_id: postData.user_id || postData.userId
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, postData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (postData.Name !== undefined) updateData.Name = postData.Name;
      if (postData.content !== undefined) updateData.content = postData.content;
      if (postData.media_url !== undefined || postData.mediaUrl !== undefined) {
        updateData.media_url = postData.media_url || postData.mediaUrl;
      }
      if (postData.media_type !== undefined || postData.mediaType !== undefined) {
        updateData.media_type = postData.media_type || postData.mediaType;
      }
      if (postData.likes !== undefined) updateData.likes = postData.likes;
      if (postData.comments !== undefined) updateData.comments = postData.comments;
      if (postData.created_at !== undefined || postData.createdAt !== undefined) {
        updateData.created_at = postData.created_at || postData.createdAt;
      }
      if (postData.user_id !== undefined || postData.userId !== undefined) {
        updateData.user_id = postData.user_id || postData.userId;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting post:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async toggleLike(id, isLiked) {
    try {
      // Get current post data
      const currentPost = await this.getById(id);
      if (!currentPost) {
        throw new Error("Post not found");
      }

      const newLikes = isLiked ? currentPost.likes + 1 : Math.max(0, currentPost.likes - 1);
      
      const updatedPost = await this.update(id, { likes: newLikes });
      return updatedPost;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling like:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getFeed(userId, limit = 20) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching feed:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getTrending(limit = 10) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        orderBy: [{ fieldName: "likes", sorttype: "DESC" }],
        pagingInfo: { limit: limit, offset: 0 }
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching trending posts:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async searchByHashtag(hashtag) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const searchTag = hashtag.toLowerCase();
      const normalizedTag = searchTag.startsWith('#') ? searchTag : `#${searchTag}`;

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "content" } },
          { field: { Name: "media_url" } },
          { field: { Name: "media_type" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "content",
            Operator: "Contains",
            Values: [normalizedTag]
          }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching posts by hashtag:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const postsService = new PostsService();