
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedArticles, NewsArticle } from "@/services/newsService";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import SavedNewsItem from "@/components/SavedNewsItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Load saved articles
    const articles = getSavedArticles(user.id);
    setSavedArticles(articles);
  }, [user, navigate]);
  
  const handleRemoveArticle = (articleId: string) => {
    setSavedArticles(prev => prev.filter(article => article.article_id !== articleId));
  };
  
  const filteredArticles = searchTerm.trim() === "" 
    ? savedArticles 
    : savedArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Saved News</h1>
              {isAdmin() && (
                <Button 
                  onClick={() => navigate("/add-news")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add News
                </Button>
              )}
            </div>
            
            {savedArticles.length > 0 ? (
              <>
                <p className="text-gray-600 mb-6">
                  You have {savedArticles.length} saved {savedArticles.length === 1 ? 'article' : 'articles'}
                </p>
                
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search your saved articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {filteredArticles.length > 0 ? (
                  <div className="space-y-4">
                    {filteredArticles.map((article) => (
                      <SavedNewsItem
                        key={article.article_id}
                        article={article}
                        onRemove={() => handleRemoveArticle(article.article_id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No articles match your search</p>
                    <Button 
                      variant="link" 
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 mb-4">You haven't saved any news articles yet</p>
                <div className="flex justify-center gap-4">
                  <Button asChild>
                    <a href="/">Browse News Articles</a>
                  </Button>
                  {isAdmin() && (
                    <Button variant="outline" asChild>
                      <a href="/add-news">Create Your Own</a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 News Hub. Powered by newsdata.io</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
