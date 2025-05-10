
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { NewsArticle, saveArticle } from "@/services/newsService";

const AddNews: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [sourceName, setSourceName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      toast({
        title: "Login required",
        description: "You need to be logged in to add news",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!title || !description || !link) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a new article object
      const newArticle: NewsArticle = {
        article_id: uuidv4(),
        title,
        description,
        content: content || description,
        link: link.startsWith("http") ? link : `https://${link}`,
        pubDate: new Date().toISOString(),
        source_name: sourceName || "Custom Source",
        category: category ? [category] : ["General"],
      };
      
      // Save the article
      saveArticle(user.id, newArticle);
      
      // Reset form
      setTitle("");
      setDescription("");
      setContent("");
      setLink("");
      setSourceName("");
      setCategory("");
      
      toast({
        title: "News added successfully",
        description: "Your article has been created and saved",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding news:", error);
      toast({
        title: "Error adding news",
        description: "There was a problem creating your article",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Custom News</h1>
            
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Create News Article</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Article title"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the article"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Full Content (optional)</Label>
                    <Textarea 
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Full article content"
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="link">URL / Link *</Label>
                    <Input 
                      id="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://example.com/article"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sourceName">Source (optional)</Label>
                      <Input 
                        id="sourceName"
                        value={sourceName}
                        onChange={(e) => setSourceName(e.target.value)}
                        placeholder="Source name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category (optional)</Label>
                      <Input 
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="News category"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Publish News
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
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

export default AddNews;
