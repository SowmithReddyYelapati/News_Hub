
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import NewsCard from "@/components/NewsCard";
import BreakingNews from "@/components/BreakingNews";
import { fetchNews, NewsArticle, NewsResponse } from "@/services/newsService";

const Index: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [nextPage, setNextPage] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialNews = async () => {
      setLoading(true);
      try {
        const response = await fetchNews();
        setNews(response.results);
        setNextPage(response.nextPage);
      } catch (error) {
        console.error("Failed to load news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialNews();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetchNews(searchQuery);
      setNews(response.results);
      setNextPage(response.nextPage);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (!nextPage || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const response = await fetchNews(searchQuery || "india", "au,de,in,jp,us", "en", nextPage);
      setNews(prev => [...prev, ...response.results]);
      setNextPage(response.nextPage);
    } catch (error) {
      console.error("Failed to load more news:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BreakingNews />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Stay Informed with News Hub</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your one-stop destination for the latest news from around the world
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </form>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : news.length > 0 ? (
            <>
              <div className="news-grid">
                {news.map((article) => (
                  <NewsCard key={article.article_id} article={article} />
                ))}
              </div>
              
              {nextPage && (
                <div className="flex justify-center mt-8">
                  <Button 
                    onClick={loadMoreNews} 
                    disabled={loadingMore}
                    variant="outline"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading more...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">No news articles found</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  fetchNews().then(response => {
                    setNews(response.results);
                    setNextPage(response.nextPage);
                  });
                }}
              >
                Reset search
              </Button>
            </div>
          )}
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

export default Index;
