
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import { NewsArticle, removeArticle } from "@/services/newsService";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface SavedNewsItemProps {
  article: NewsArticle;
  onRemove: () => void;
}

const SavedNewsItem: React.FC<SavedNewsItemProps> = ({ article, onRemove }) => {
  const { user } = useAuth();
  
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    removeArticle(user.id, article.article_id);
    onRemove();
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

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(article.link);
    toast("Link copied to clipboard");
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleCopyLink}
              title="Copy link"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleRemove}
              title="Remove article"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description || "No description available"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        {article.source_name || "Unknown Source"} • {formatPublishedDate(article.pubDate)}
      </CardFooter>
    </Card>
  );
};

export default SavedNewsItem;
