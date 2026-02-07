// frontend/src/components/KnowledgeBase.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { knowledgeBaseService } from "@/services/api.service";
import type { KnowledgeBaseArticle } from "@/services/api.service";
import { Search, BookOpen, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function KnowledgeBase() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<
    KnowledgeBaseArticle[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] =
    useState<KnowledgeBaseArticle | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch articles and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData] = await Promise.all([
          knowledgeBaseService.getAllArticles(),
          knowledgeBaseService.getCategories(),
        ]);
        setArticles(articlesData);
        setFilteredArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching knowledge base:", error);
        toast({
          title: "Error",
          description: "Failed to load knowledge base",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, toast]);

  // Handle search
  useEffect(() => {
    let results = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter(
        (article) => article.category === selectedCategory,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    setFilteredArticles(results);
  }, [searchQuery, selectedCategory, articles]);

  // Handle article click
  const handleArticleClick = (article: KnowledgeBaseArticle) => {
    setSelectedArticle(article);
  };

  // Handle back to list
  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  // Viewing single article
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={handleBackToList}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
            <div className="flex items-center space-x-2 mb-2">
              <Badge
                variant="outline"
                className="border-primary/50 text-primary"
              >
                {selectedArticle.category}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-white">
              {selectedArticle.title}
            </h1>
            <p className="text-muted-foreground text-sm mt-2">
              Last updated:{" "}
              {new Date(selectedArticle.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-white whitespace-pre-wrap leading-relaxed">
                  {selectedArticle.content}
                </p>
              </div>

              {/* Tags */}
              {selectedArticle.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedArticle.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-white/20 text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Helpful Actions */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-muted-foreground mb-4">
                  Was this article helpful?
                </p>
                <div className="flex space-x-4">
                  <Link href="/support/chat">
                    <Button
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      Start a Chat
                    </Button>
                  </Link>
                  <Link href="/support/tickets/new">
                    <Button
                      variant="outline"
                      className="border-white/10 hover:bg-white/5"
                    >
                      Create a Ticket
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Articles list view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/support/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Browse help articles and troubleshooting guides
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-primary focus:outline-none text-white placeholder:text-muted-foreground"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border-white/10 hover:bg-white/5"
              }
            >
              All Articles
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                {articles.length}
              </span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "border-white/10 hover:bg-white/5"
                }
              >
                {category}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/10">
                  {articles.filter((a) => a.category === category).length}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredArticles.length === 0 ? (
          <Card className="bg-black/40 border-white/10">
            <CardContent className="py-16 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No articles match "${searchQuery}". Try different search terms.`
                  : "No articles available in this category."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="border-white/10 hover:bg-white/5"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="bg-black/40 border-white/10 hover:border-primary/50 cursor-pointer transition-all"
                onClick={() => handleArticleClick(article)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge
                      variant="outline"
                      className="border-primary/50 text-primary"
                    >
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {article.content}
                  </p>
                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-white/20 text-xs text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="border-white/20 text-xs text-muted-foreground"
                        >
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
