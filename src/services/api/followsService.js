import { toast } from "react-toastify";

class FollowsService {
  constructor() {
    this.tableName = "follow";
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
          { field: { Name: "created_at" } },
          { field: { Name: "follower_id" } },
          { field: { Name: "following_id" } }
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
        console.error("Error fetching follows:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getFollowers(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "follower_id" } },
          { field: { Name: "following_id" } }
        ],
        where: [
          {
            FieldName: "following_id",
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
        console.error("Error fetching followers:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getFollowing(userId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "created_at" } },
          { field: { Name: "follower_id" } },
          { field: { Name: "following_id" } }
        ],
        where: [
          {
            FieldName: "follower_id",
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
        console.error("Error fetching following:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async follow(followingId) {
    try {
      // Mock current user ID - in real app, this would come from auth context
      const currentUserId = 1;
      
      // Check if already following
      const existingFollow = await this.isFollowing(currentUserId, followingId);
      if (existingFollow) {
        throw new Error("Already following this user");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Follow from ${currentUserId} to ${followingId}`,
          created_at: new Date().toISOString(),
          follower_id: currentUserId,
          following_id: parseInt(followingId)
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
        console.error("Error following user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async unfollow(followingId) {
    try {
      // Mock current user ID - in real app, this would come from auth context
      const currentUserId = 1;
      
      // Find the follow record
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "follower_id",
                  operator: "EqualTo",
                  values: [currentUserId],
                  include: true
                }
              ]
            },
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "following_id",
                  operator: "EqualTo",
                  values: [parseInt(followingId)],
                  include: true
                }
              ]
            }
          ]
        }]
      };

      const searchResponse = await apperClient.fetchRecords(this.tableName, params);

      if (!searchResponse.success || !searchResponse.data || searchResponse.data.length === 0) {
        throw new Error("Not following this user");
      }

      const followRecord = searchResponse.data[0];
      
      const deleteParams = {
        RecordIds: [followRecord.Id]
      };

      const response = await apperClient.deleteRecord(this.tableName, deleteParams);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error unfollowing user:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async isFollowing(followerId, followingId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } }
        ],
        whereGroups: [{
          operator: "AND",
          subGroups: [
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "follower_id",
                  operator: "EqualTo",
                  values: [parseInt(followerId)],
                  include: true
                }
              ]
            },
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "following_id",
                  operator: "EqualTo",
                  values: [parseInt(followingId)],
                  include: true
                }
              ]
            }
          ]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking follow status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getFollowersCount(userId) {
    try {
      const followers = await this.getFollowers(userId);
      return followers.length;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting followers count:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  }

  async getFollowingCount(userId) {
    try {
      const following = await this.getFollowing(userId);
      return following.length;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting following count:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  }

  async getMutualConnections(userId1, userId2) {
    try {
      // Get people that userId1 follows
      const user1Following = await this.getFollowing(userId1);
      const user1FollowingIds = user1Following.map(follow => follow.following_id);
      
      // Get people that userId2 follows
      const user2Following = await this.getFollowing(userId2);
      const user2FollowingIds = user2Following.map(follow => follow.following_id);
      
      // Find mutual connections (people both users follow)
      const mutualConnections = user1FollowingIds.filter(id => user2FollowingIds.includes(id));
      
      return mutualConnections.map(id => ({ userId: id }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting mutual connections:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export const followsService = new FollowsService();