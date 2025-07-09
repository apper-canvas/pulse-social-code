import postsData from "@/services/mockData/posts.json";

class PostsService {
  constructor() {
    this.posts = [...postsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  }

  async getByUserId(userId) {
    await this.delay();
    return this.posts
      .filter(post => post.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(postData) {
    await this.delay();
    const newPost = {
      ...postData,
      Id: Math.max(...this.posts.map(p => p.Id), 0) + 1,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };
    this.posts.push(newPost);
    return { ...newPost };
  }

  async update(id, postData) {
    await this.delay();
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    this.posts[index] = { ...this.posts[index], ...postData };
    return { ...this.posts[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    this.posts.splice(index, 1);
    return true;
  }

  async toggleLike(id, isLiked) {
    await this.delay();
    const post = this.posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    post.likes = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
    return { ...post };
  }

  async getFeed(userId, limit = 20) {
    await this.delay();
    // In a real app, this would filter by followed users
    return this.posts
      .slice(0, limit)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

async getTrending(limit = 10) {
    await this.delay();
    return this.posts
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  async searchByHashtag(hashtag) {
    await this.delay();
    const searchTag = hashtag.toLowerCase();
    const normalizedTag = searchTag.startsWith('#') ? searchTag : `#${searchTag}`;
    
    return this.posts.filter(post => 
      post.content && post.content.toLowerCase().includes(normalizedTag)
    );
  }
}

export const postsService = new PostsService();