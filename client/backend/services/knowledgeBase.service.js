const { supabase } = require("../config/supabase");

class KnowledgeBaseService {
  /**
   * Search knowledge base articles
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Array} Matching articles
   */
  async search(query, limit = 5) {
    try {
      // Search in title and content using Supabase text search
      const { data: articles, error } = await supabase
        .from("knowledge_base")
        .select("id, title, content, category, tags, views")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        console.error("KB Search Error:", error);
        return [];
      }

      if (!articles || articles.length === 0) {
        return [];
      }

      // Increment view count for found articles
      const articleIds = articles.map((a) => a.id);
      await supabase
        .from("knowledge_base")
        .update({ views: supabase.raw("views + 1") })
        .in("id", articleIds);

      // Calculate relevance scores
      return articles
        .map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          category: article.category,
          tags: article.tags || [],
          relevance: this.calculateRelevance(query, article),
        }))
        .sort((a, b) => b.relevance - a.relevance);
    } catch (error) {
      console.error("KB Search Error:", error);
      return [];
    }
  }

  /**
   * Calculate relevance score for search results
   * @param {string} query - Search query
   * @param {Object} article - KB article
   * @returns {number} Relevance score
   */
  calculateRelevance(query, article) {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = article.title.toLowerCase();
    const lowerContent = article.content.toLowerCase();

    // Title match is highly relevant
    if (lowerTitle.includes(lowerQuery)) {
      score += 10;
    }

    // Content match
    const contentMatches = (
      lowerContent.match(new RegExp(lowerQuery, "g")) || []
    ).length;
    score += contentMatches * 2;

    // Tag match
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          score += 5;
        }
      });
    }

    return score;
  }

  /**
   * Get all KB articles with optional filtering
   * @param {Object} filters - Category, tags, etc.
   * @returns {Array} Articles
   */
  async getAllArticles(filters = {}) {
    try {
      let query = supabase
        .from("knowledge_base")
        .select("*")
        .order("views", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get All Articles Error:", error);
      throw error;
    }
  }

  /**
   * Get a single KB article by ID
   * @param {string} articleId - Article ID
   * @returns {Object} Article
   */
  async getArticleById(articleId) {
    try {
      const { data: article, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) throw new Error("Article not found");

      // Increment view count
      await supabase
        .from("knowledge_base")
        .update({ views: supabase.raw("views + 1") })
        .eq("id", articleId);

      return article;
    } catch (error) {
      console.error("Get Article Error:", error);
      throw error;
    }
  }

  /**
   * Create a new KB article (admin function)
   * @param {Object} articleData - Article data
   * @returns {Object} Created article
   */
  async createArticle(articleData) {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .insert([
          {
            title: articleData.title,
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags || [],
            views: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Create Article Error:", error);
      throw error;
    }
  }

  /**
   * Update a KB article (admin function)
   * @param {string} articleId - Article ID
   * @param {Object} updates - Updated fields
   * @returns {Object} Updated article
   */
  async updateArticle(articleId, updates) {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId)
        .select()
        .single();

      if (error) throw new Error("Article not found");
      return data;
    } catch (error) {
      console.error("Update Article Error:", error);
      throw error;
    }
  }

  /**
   * Delete a KB article (admin function)
   * @param {string} articleId - Article ID
   */
  async deleteArticle(articleId) {
    try {
      const { error } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("id", articleId);

      if (error) throw new Error("Article not found");
    } catch (error) {
      console.error("Delete Article Error:", error);
      throw error;
    }
  }

  /**
   * Get popular articles
   * @param {number} limit - Number of articles to return
   * @returns {Array} Popular articles
   */
  async getPopularArticles(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("id, title, category, views, tags")
        .order("views", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get Popular Articles Error:", error);
      throw error;
    }
  }

  /**
   * Get articles by category
   * @param {string} category - Category name
   * @returns {Array} Articles in category
   */
  async getArticlesByCategory(category) {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .eq("category", category)
        .order("views", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Get Articles By Category Error:", error);
      throw error;
    }
  }

  /**
   * Get all categories with article counts
   * @returns {Array} Categories with counts
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("category");

      if (error) throw error;

      const categoryCount = (data || []).reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count,
      }));
    } catch (error) {
      console.error("Get Categories Error:", error);
      throw error;
    }
  }

  /**
   * Get all unique tags
   * @returns {Array} Tags
   */
  async getAllTags() {
    try {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("tags");

      if (error) throw error;

      const tags = new Set();
      (data || []).forEach((article) => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag) => tags.add(tag));
        }
      });

      return Array.from(tags).sort();
    } catch (error) {
      console.error("Get All Tags Error:", error);
      throw error;
    }
  }
}

module.exports = new KnowledgeBaseService();
