
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreakingNewsItem {
  id: string;
  title: string;
  link: string;
}

const BreakingNews: React.FC = () => {
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch random breaking news from existing news service
    const fetchRandomBreakingNews = async () => {
      try {
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=pub_693974f412d293680cb67af55d0e29710a0ed&country=in&language=en&category=top`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch breaking news");
        }
        
        const data = await response.json();
        
        // Select news items for the breaking news banner
        const randomNews = data.results
          .slice(0, 5)
          .map((article: any) => ({
            id: article.article_id,
            title: article.title,
            link: article.link
          }));
          
        setBreakingNews(randomNews);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
        // Fallback breaking news in case of error
        setBreakingNews([
          { 
            id: "1", 
            title: "Breaking: Major economic reforms announced", 
            link: "#" 
          },
          { 
            id: "2", 
            title: "Tech giant launches revolutionary AI product", 
            link: "#" 
          },
          { 
            id: "3", 
            title: "International summit addresses climate change", 
            link: "#" 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomBreakingNews();
  }, []);

  const handleNewsClick = (link: string) => {
    window.open(link, "_blank", "noopener noreferrer");
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <div className="font-bold mr-3 whitespace-nowrap flex items-center">
          <span className="pulse mr-2">●</span> BREAKING NEWS
        </div>
        <div className="overflow-hidden flex-grow relative">
          <div className="animate-marquee whitespace-nowrap inline-flex items-center">
            {breakingNews.map((item, index) => (
              <div 
                key={item.id} 
                className="inline-flex items-center cursor-pointer mr-12 transition-all hover:scale-105"
                onClick={() => handleNewsClick(item.link)}
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                <span className="hover:underline">{item.title}</span>
              </div>
            ))}
            {/* Duplicate items for infinite scroll effect */}
            {breakingNews.map((item, index) => (
              <div 
                key={`repeat-${item.id}`} 
                className="inline-flex items-center cursor-pointer mr-12 transition-all hover:scale-105"
                onClick={() => handleNewsClick(item.link)}
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                <span className="hover:underline">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
