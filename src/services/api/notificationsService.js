import notificationsData from "@/services/mockData/notifications.json";

class NotificationsService {
  constructor() {
    this.notifications = [...notificationsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    const notification = this.notifications.find(n => n.Id === parseInt(id));
    if (!notification) {
      throw new Error("Notification not found");
    }
    return { ...notification };
  }

  async getUnread() {
    await this.delay();
    return this.notifications.filter(n => !n.isRead);
  }

  async markAsRead(id) {
    await this.delay();
    const notification = this.notifications.find(n => n.Id === parseInt(id));
    if (!notification) {
      throw new Error("Notification not found");
    }
    notification.isRead = true;
    return { ...notification };
  }

  async markAllAsRead() {
    await this.delay();
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    return true;
  }

  async create(notificationData) {
    await this.delay();
    const newNotification = {
      ...notificationData,
      Id: Math.max(...this.notifications.map(n => n.Id), 0) + 1,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(newNotification);
    return { ...newNotification };
  }

  async delete(id) {
    await this.delay();
    const index = this.notifications.findIndex(n => n.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Notification not found");
    }
    this.notifications.splice(index, 1);
    return true;
  }
async getUnreadCount() {
    await this.delay();
    return this.notifications.filter(n => !n.isRead).length;
  }

  async createPushNotification(notification) {
    await this.delay(100);
    
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
        timestamp: new Date(notification.createdAt).getTime(),
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