import followsData from "@/services/mockData/follows.json";

class FollowsService {
  constructor() {
    this.follows = [...followsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.follows];
  }

  async getFollowers(userId) {
    await this.delay();
    return this.follows.filter(follow => follow.followingId === parseInt(userId));
  }

  async getFollowing(userId) {
    await this.delay();
    return this.follows.filter(follow => follow.followerId === parseInt(userId));
  }

  async follow(followingId) {
    await this.delay();
    const currentUserId = 1; // Mock current user ID
    const existingFollow = this.follows.find(
      f => f.followerId === currentUserId && f.followingId === parseInt(followingId)
    );
    
    if (existingFollow) {
      throw new Error("Already following this user");
    }

    const newFollow = {
      followerId: currentUserId,
      followingId: parseInt(followingId),
      createdAt: new Date().toISOString(),
    };
    
    this.follows.push(newFollow);
    return { ...newFollow };
  }

  async unfollow(followingId) {
    await this.delay();
    const currentUserId = 1; // Mock current user ID
    const index = this.follows.findIndex(
      f => f.followerId === currentUserId && f.followingId === parseInt(followingId)
    );
    
    if (index === -1) {
      throw new Error("Not following this user");
    }

    this.follows.splice(index, 1);
    return true;
  }

  async isFollowing(followerId, followingId) {
    await this.delay();
    return this.follows.some(
      f => f.followerId === parseInt(followerId) && f.followingId === parseInt(followingId)
    );
  }

  async getFollowersCount(userId) {
    await this.delay();
    return this.follows.filter(follow => follow.followingId === parseInt(userId)).length;
  }

  async getFollowingCount(userId) {
    await this.delay();
return this.follows.filter(follow => follow.followerId === parseInt(userId)).length;
  }

  async getMutualConnections(userId1, userId2) {
    await this.delay();
    
    // Get people that userId1 follows
    const user1Following = this.follows
      .filter(follow => follow.followerId === parseInt(userId1))
      .map(follow => follow.followingId);
    
    // Get people that userId2 follows
    const user2Following = this.follows
      .filter(follow => follow.followerId === parseInt(userId2))
      .map(follow => follow.followingId);
    
    // Find mutual connections (people both users follow)
    const mutualConnections = user1Following.filter(id => user2Following.includes(id));
    
    return mutualConnections.map(id => ({ userId: id }));
  }
}

export const followsService = new FollowsService();