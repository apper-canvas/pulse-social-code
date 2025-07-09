import { postsService } from "@/services/api/postsService";

class HashtagService {
  constructor() {
    this.hashtagRegex = /#[a-zA-Z0-9_]+/g;
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  extractHashtags(content) {
    if (!content) return [];
    const matches = content.match(this.hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  }

  async getTrendingHashtags(limit = 10) {
    await this.delay();
    
    try {
      const posts = await postsService.getAll();
      const hashtagCounts = {};
      
      posts.forEach(post => {
        const hashtags = this.extractHashtags(post.content);
        hashtags.forEach(tag => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      });
      
      return Object.entries(hashtagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([tag, count]) => ({
          tag,
          posts: count,
          displayTag: tag.charAt(0).toUpperCase() + tag.slice(1)
        }));
    } catch (error) {
      console.error("Failed to get trending hashtags:", error);
      return [];
    }
  }

  async getPostsByHashtag(hashtag) {
    await this.delay();
    
    try {
      const posts = await postsService.getAll();
      const searchTag = hashtag.toLowerCase();
      const normalizedTag = searchTag.startsWith('#') ? searchTag : `#${searchTag}`;
      
      return posts.filter(post => {
        const hashtags = this.extractHashtags(post.content);
        return hashtags.includes(normalizedTag);
      });
    } catch (error) {
      console.error("Failed to get posts by hashtag:", error);
      return [];
    }
  }

  renderHashtags(content, onHashtagClick) {
    if (!content) return content;
    
    return content.split(this.hashtagRegex).reduce((acc, part, index, array) => {
      acc.push(part);
      
      if (index < array.length - 1) {
        const hashtags = content.match(this.hashtagRegex);
        if (hashtags && hashtags[index]) {
          const tag = hashtags[index];
          acc.push(
            <span
              key={`hashtag-${index}`}
              onClick={() => onHashtagClick(tag.slice(1))}
              className="text-primary hover:text-secondary cursor-pointer font-medium"
            >
              {tag}
            </span>
          );
        }
      }
      
      return acc;
    }, []);
  }

  validateHashtag(hashtag) {
    if (!hashtag) return false;
    const cleanTag = hashtag.replace('#', '');
    return /^[a-zA-Z0-9_]+$/.test(cleanTag) && cleanTag.length >= 2 && cleanTag.length <= 50;
  }

  suggestHashtags(content) {
    const words = content.toLowerCase().split(/\s+/);
    const suggestions = [];
    
    const commonTags = [
      'tech', 'webdev', 'react', 'javascript', 'coding', 'programming',
      'ai', 'machinelearning', 'design', 'ux', 'ui', 'startup',
      'productivity', 'motivation', 'fitness', 'travel', 'photography'
    ];
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
      if (cleanWord.length >= 3 && commonTags.includes(cleanWord)) {
        suggestions.push(`#${cleanWord}`);
      }
    });
    
    return [...new Set(suggestions)].slice(0, 5);
  }
}

export const hashtagService = new HashtagService();