import commentsData from "@/services/mockData/comments.json";

class CommentsService {
  constructor() {
    this.comments = [...commentsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.comments];
  }

  async getById(id) {
    await this.delay();
    const comment = this.comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  }

  async getByPostId(postId) {
    await this.delay();
    return this.comments
      .filter(comment => comment.postId === parseInt(postId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async create(commentData) {
    await this.delay();
    const newComment = {
      ...commentData,
      Id: Math.max(...this.comments.map(c => c.Id), 0) + 1,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, commentData) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    this.comments[index] = { ...this.comments[index], ...commentData };
    return { ...this.comments[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    this.comments.splice(index, 1);
    return true;
  }

  async toggleLike(id, isLiked) {
    await this.delay();
    const comment = this.comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    comment.likes = isLiked ? comment.likes + 1 : Math.max(0, comment.likes - 1);
    return { ...comment };
  }
}

export const commentsService = new CommentsService();