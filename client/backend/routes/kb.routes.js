const express = require("express");
const router = express.Router();
const knowledgeBaseService = require("../services/knowledgeBase.service");
const { authenticateUser } = require("../middleware/auth");

// All routes require authentication
router.use(authenticateUser);

/**
 * GET /api/kb/search
 * Search knowledge base articles
 */
router.get("/search", async (req, res, next) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const articles = await knowledgeBaseService.search(q, parseInt(limit) || 5);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/articles
 * Get all articles with optional filters
 */
router.get("/articles", async (req, res, next) => {
  try {
    const { category, tags } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (tags) filters.tags = tags.split(",");

    const articles = await knowledgeBaseService.getAllArticles(filters);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/articles/popular
 * Get popular articles
 */
router.get("/articles/popular", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const articles = await knowledgeBaseService.getPopularArticles(limit);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/articles/:id
 * Get a specific article
 */
router.get("/articles/:id", async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const article = await knowledgeBaseService.getArticleById(articleId);

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/categories
 * Get all categories with article counts
 */
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await knowledgeBaseService.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/tags
 * Get all tags
 */
router.get("/tags", async (req, res, next) => {
  try {
    const tags = await knowledgeBaseService.getAllTags();

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/kb/categories/:category/articles
 * Get articles by category
 */
router.get("/categories/:category/articles", async (req, res, next) => {
  try {
    const category = req.params.category;
    const articles = await knowledgeBaseService.getArticlesByCategory(category);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
