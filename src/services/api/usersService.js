import { toast } from "react-toastify";

class UsersService {
  constructor() {
    this.tableName = "app_User";
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
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "bio" } },
          { field: { Name: "avatar" } },
          { field: { Name: "is_private" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "posts_count" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [{ fieldName: "Id", sorttype: "DESC" }]
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
        console.error("Error fetching users:", error?.response?.data?.message);
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
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "bio" } },
          { field: { Name: "avatar" } },
          { field: { Name: "is_private" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "posts_count" } },
          { field: { Name: "created_at" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching user with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(userData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: userData.Name || userData.display_name || userData.displayName,
          username: userData.username,
          display_name: userData.display_name || userData.displayName,
          bio: userData.bio || "",
          avatar: userData.avatar || "",
          is_private: userData.is_private || userData.isPrivate || false,
          followers_count: userData.followers_count || userData.followersCount || 0,
          posts_count: userData.posts_count || userData.postsCount || 0,
          created_at: userData.created_at || userData.createdAt || new Date().toISOString()
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
        console.error("Error creating user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, userData) {
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
      if (userData.Name !== undefined) updateData.Name = userData.Name;
      if (userData.username !== undefined) updateData.username = userData.username;
      if (userData.display_name !== undefined || userData.displayName !== undefined) {
        updateData.display_name = userData.display_name || userData.displayName;
      }
      if (userData.bio !== undefined) updateData.bio = userData.bio;
      if (userData.avatar !== undefined) updateData.avatar = userData.avatar;
      if (userData.is_private !== undefined || userData.isPrivate !== undefined) {
        updateData.is_private = userData.is_private || userData.isPrivate;
      }
      if (userData.followers_count !== undefined || userData.followersCount !== undefined) {
        updateData.followers_count = userData.followers_count || userData.followersCount;
      }
      if (userData.posts_count !== undefined || userData.postsCount !== undefined) {
        updateData.posts_count = userData.posts_count || userData.postsCount;
      }
      if (userData.created_at !== undefined || userData.createdAt !== undefined) {
        updateData.created_at = userData.created_at || userData.createdAt;
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
        console.error("Error updating user:", error?.response?.data?.message);
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
        console.error("Error deleting user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async searchUsers(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "bio" } },
          { field: { Name: "avatar" } },
          { field: { Name: "is_private" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "posts_count" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              operator: "OR",
              conditions: [
                {
                  fieldName: "username",
                  operator: "Contains",
                  values: [query],
                  include: true
                }
              ]
            },
            {
              operator: "OR", 
              conditions: [
                {
                  fieldName: "display_name",
                  operator: "Contains", 
                  values: [query],
                  include: true
                }
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching users:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getSuggestions(limit = 5) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "display_name" } },
          { field: { Name: "bio" } },
          { field: { Name: "avatar" } },
          { field: { Name: "is_private" } },
          { field: { Name: "followers_count" } },
          { field: { Name: "posts_count" } }
        ],
        orderBy: [{ fieldName: "followers_count", sorttype: "DESC" }],
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
        console.error("Error getting user suggestions:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const usersService = new UsersService();