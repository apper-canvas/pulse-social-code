import { toast } from "react-toastify";

class ChatService {
  constructor() {
    this.chatTableName = "chat";
    this.messageTableName = "message";
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
          { field: { Name: "last_message" } },
          { field: { Name: "last_message_at" } },
          { field: { Name: "unread_count" } },
          { field: { Name: "created_at" } },
          { field: { Name: "participant_1_id" } },
          { field: { Name: "participant_2_id" } }
        ],
        orderBy: [{ fieldName: "last_message_at", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords(this.chatTableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform the data to match the expected format with participants array
      const chats = (response.data || []).map(chat => ({
        ...chat,
        participants: [
          { Id: chat.participant_1_id },
          { Id: chat.participant_2_id }
        ]
      }));

      return chats;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching chats:", error?.response?.data?.message);
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
          { field: { Name: "last_message" } },
          { field: { Name: "last_message_at" } },
          { field: { Name: "unread_count" } },
          { field: { Name: "created_at" } },
          { field: { Name: "participant_1_id" } },
          { field: { Name: "participant_2_id" } }
        ]
      };

      const response = await apperClient.getRecordById(this.chatTableName, parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      // Transform the data to match the expected format with participants array
      const chat = {
        ...response.data,
        participants: [
          { Id: response.data.participant_1_id },
          { Id: response.data.participant_2_id }
        ]
      };

      return chat;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching chat with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getMessages(chatId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "chat_id" } },
          { field: { Name: "sender_id" } },
          { field: { Name: "content" } },
          { field: { Name: "type" } },
          { field: { Name: "created_at" } },
          { field: { Name: "is_read" } }
        ],
        where: [
          {
            FieldName: "chat_id",
            Operator: "EqualTo",
            Values: [parseInt(chatId)]
          }
        ],
        orderBy: [{ fieldName: "created_at", sorttype: "ASC" }]
      };

      const response = await apperClient.fetchRecords(this.messageTableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching messages:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async sendMessage(messageData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: messageData.content?.substring(0, 50) || "New Message",
          chat_id: messageData.chatId,
          sender_id: messageData.senderId,
          content: messageData.content,
          type: messageData.type || "text",
          created_at: new Date().toISOString(),
          is_read: false
        }]
      };

      const response = await apperClient.createRecord(this.messageTableName, params);

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
        console.error("Error sending message:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async markAsRead(chatId) {
    try {
      // Get all unread messages for this chat
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const searchParams = {
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
                  fieldName: "chat_id",
                  operator: "EqualTo",
                  values: [parseInt(chatId)],
                  include: true
                }
              ]
            },
            {
              operator: "AND",
              conditions: [
                {
                  fieldName: "is_read",
                  operator: "EqualTo",
                  values: [false],
                  include: true
                }
              ]
            }
          ]
        }]
      };

      const searchResponse = await apperClient.fetchRecords(this.messageTableName, searchParams);

      if (!searchResponse.success || !searchResponse.data || searchResponse.data.length === 0) {
        return true; // No unread messages
      }

      // Update all unread messages to read
      const updateRecords = searchResponse.data.map(message => ({
        Id: message.Id,
        is_read: true
      }));

      const updateParams = {
        records: updateRecords
      };

      const response = await apperClient.updateRecord(this.messageTableName, updateParams);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error marking messages as read:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  async create(chatData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: chatData.Name || `Chat between ${chatData.participant_1_id} and ${chatData.participant_2_id}`,
          last_message: chatData.last_message || "",
          last_message_at: chatData.last_message_at || new Date().toISOString(),
          unread_count: chatData.unread_count || 0,
          created_at: chatData.created_at || new Date().toISOString(),
          participant_1_id: chatData.participant_1_id || chatData.participants?.[0]?.Id,
          participant_2_id: chatData.participant_2_id || chatData.participants?.[1]?.Id
        }]
      };

      const response = await apperClient.createRecord(this.chatTableName, params);

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

        const chatData = successfulRecords.length > 0 ? successfulRecords[0].data : null;
        if (chatData) {
          // Transform the data to match the expected format with participants array
          return {
            ...chatData,
            participants: [
              { Id: chatData.participant_1_id },
              { Id: chatData.participant_2_id }
            ]
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating chat:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updateData.Name !== undefined) updateRecord.Name = updateData.Name;
      if (updateData.last_message !== undefined) updateRecord.last_message = updateData.last_message;
      if (updateData.last_message_at !== undefined) updateRecord.last_message_at = updateData.last_message_at;
      if (updateData.unread_count !== undefined) updateRecord.unread_count = updateData.unread_count;
      if (updateData.created_at !== undefined) updateRecord.created_at = updateData.created_at;
      if (updateData.participant_1_id !== undefined) updateRecord.participant_1_id = updateData.participant_1_id;
      if (updateData.participant_2_id !== undefined) updateRecord.participant_2_id = updateData.participant_2_id;

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord(this.chatTableName, params);

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

        const chatData = successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
        if (chatData) {
          // Transform the data to match the expected format with participants array
          return {
            ...chatData,
            participants: [
              { Id: chatData.participant_1_id },
              { Id: chatData.participant_2_id }
            ]
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating chat:", error?.response?.data?.message);
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

      // First delete all associated messages
      const messages = await this.getMessages(id);
      if (messages.length > 0) {
        const messageIds = messages.map(message => message.Id);
        const deleteMessagesParams = {
          RecordIds: messageIds
        };
        await apperClient.deleteRecord(this.messageTableName, deleteMessagesParams);
      }

      // Then delete the chat
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.chatTableName, params);

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
        console.error("Error deleting chat:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
}

export const chatService = new ChatService();