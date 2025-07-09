import usersData from "@/services/mockData/users.json";

class UsersService {
  constructor() {
    this.users = [...usersData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.users];
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await this.delay();
    const newUser = {
      ...userData,
      Id: Math.max(...this.users.map(u => u.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      followersCount: 0,
      postsCount: 0,
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users.splice(index, 1);
    return true;
  }

  async searchUsers(query) {
    await this.delay();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getSuggestions(limit = 5) {
    await this.delay();
    return this.users.slice(0, limit);
  }
}

export const usersService = new UsersService();