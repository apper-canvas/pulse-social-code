import { toast } from "react-toastify";

class NotificationsService {
  constructor() {
    this.tableName = "app_Notification";
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
          { field: { Name: "type" } },
          { field: { Name: "user_name" } },
          { field: { Name: "user_avatar" } },
          { field: { Name: "action" } },
          { field: { Name: "message" } },
          { field: { Name: "action_url" } },
          { field: { Name: "is_read" } },
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
        console.error("Error fetching notifications:", error?.response?.data?.message);
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
          { field: { Name: "type" } },
          { field: { Name: "user_name" } },
          { field: { Name: "user_avatar" } },
          { field: { Name: "action" } },
          { field: { Name: "message" } },
          { field: { Name: "action_url" } },
          { field: { Name: "is_read" } },
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
        console.error(`Error fetching notification with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getUnread() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "user_name" } },
          { field: { Name: "user_avatar" } },
          { field: { Name: "action" } },
          { field: { Name: "message" } },
          { field: { Name: "action_url" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "user_id" } }
        ],
        where: [
          {
            FieldName: "is_read",
            Operator: "EqualTo",
            Values: [false]
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
        console.error("Error fetching unread notifications:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async markAsRead(id) {
    try {
      const updatedNotification = await this.update(id, { is_read: true });
      return updatedNotification;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking notification as read:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      // Get all unread notifications
      const unreadNotifications = await this.getUnread();
      
      if (unreadNotifications.length === 0) {
        return true;
      }

      // Update all unread notifications to read
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecords = unreadNotifications.map(notification => ({
        Id: notification.Id,
        is_read: true
      }));

      const params = {
        records: updateRecords
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking all notifications as read:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async create(notificationData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: notificationData.Name || notificationData.type || "New Notification",
          type: notificationData.type,
          user_name: notificationData.user_name || notificationData.userName,
          user_avatar: notificationData.user_avatar || notificationData.userAvatar || "",
          action: notificationData.action,
          message: notificationData.message,
          action_url: notificationData.action_url || notificationData.actionUrl || "",
          is_read: notificationData.is_read || notificationData.isRead || false,
          created_at: notificationData.created_at || notificationData.createdAt || new Date().toISOString(),
          user_id: notificationData.user_id || notificationData.userId
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
        console.error("Error creating notification:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, notificationData) {
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
      if (notificationData.Name !== undefined) updateData.Name = notificationData.Name;
      if (notificationData.type !== undefined) updateData.type = notificationData.type;
      if (notificationData.user_name !== undefined || notificationData.userName !== undefined) {
        updateData.user_name = notificationData.user_name || notificationData.userName;
      }
      if (notificationData.user_avatar !== undefined || notificationData.userAvatar !== undefined) {
        updateData.user_avatar = notificationData.user_avatar || notificationData.userAvatar;
      }
      if (notificationData.action !== undefined) updateData.action = notificationData.action;
      if (notificationData.message !== undefined) updateData.message = notificationData.message;
      if (notificationData.action_url !== undefined || notificationData.actionUrl !== undefined) {
        updateData.action_url = notificationData.action_url || notificationData.actionUrl;
      }
      if (notificationData.is_read !== undefined || notificationData.isRead !== undefined) {
        updateData.is_read = notificationData.is_read || notificationData.isRead;
      }
      if (notificationData.created_at !== undefined || notificationData.createdAt !== undefined) {
        updateData.created_at = notificationData.created_at || notificationData.createdAt;
      }
      if (notificationData.user_id !== undefined || notificationData.userId !== undefined) {
        updateData.user_id = notificationData.user_id || notificationData.userId;
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
        console.error("Error updating notification:", error?.response?.data?.message);
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
        console.error("Error deleting notification:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async getUnreadCount() {
    try {
      const unreadNotifications = await this.getUnread();
      return unreadNotifications.length;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching unread count:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return 0;
    }
  }

  async createPushNotification(notification) {
    // Simulate delay like original
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (typeof Notification === "undefined" || Notification.permission !== "granted") {
      return false;
    }

    try {
      const title = "Pulse";
      const options = {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `notification-${notification.Id}`,
        timestamp: new Date(notification.created_at || notification.createdAt).getTime(),
        requireInteraction: false,
        silent: false,
      };

      const pushNotification = new Notification(title, options);
      
      // Auto close after 5 seconds
      setTimeout(() => {
        pushNotification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.error("Failed to create push notification:", error);
      return false;
    }
  }
}

export const notificationsService = new NotificationsService();