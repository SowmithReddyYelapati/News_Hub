
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { NewsArticle, saveArticle } from "@/services/newsService";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    saveArticle(user.id, article);
  };
  
  const formatPublishedDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };
  
  const handleCardClick = () => {
    window.open(article.link, "_blank", "noopener noreferrer");
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="p-4">
        {article.image_url ? (
          <div className="w-full h-48 mb-4 overflow-hidden rounded-md">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-full object-cover article-image"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        ) : (
          <div className="w-full h-48 mb-4 bg-slate-100 flex items-center justify-center rounded-md">
            <span className="text-slate-400">No image available</span>
          </div>
        )}
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          {article.source_name || "Unknown Source"} • {formatPublishedDate(article.pubDate)}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {article.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex gap-1">
          {article.category && article.category.slice(0, 2).map((cat, index) => (
            <span key={index} className="bg-secondary px-2 py-1 text-xs rounded-full">
              {cat}
            </span>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSave}
          className="flex items-center gap-1"
        >
          <BookmarkPlus className="h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
