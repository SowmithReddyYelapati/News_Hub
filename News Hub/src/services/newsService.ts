import { toast } from "@/components/ui/use-toast";
import {
  saveNewsRecord,
  removeNewsFromSaved,
  getSavedNewsForUser,
} from "@/services/localStorageService";

export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  description: string;
  content?: string;
  pubDate: string;
  image_url?: string;
  source_id?: string;
  source_name?: string;
  creator?: string[];
  category?: string[];
  country?: string[];
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

const FULL_URL =
  "https://newsdata.io/api/1/news?apikey=pub_86147e4c6763799e06ca8b0b19a28eafd574a ";

// Fallback data for when API requests fail
const FALLBACK_NEWS: NewsArticle[] = [
  {
    article_id: "fallback_article_1",
    title: "Global Economic Summit Announces New Trade Agreements",
    link: "https://example.com/news/1",
    description:
      "Major economies reach consensus on new trade policies aimed at sustainable growth.",
    pubDate: new Date().toISOString(),
    image_url: "https://source.unsplash.com/random/800x600/?economy",
    source_name: "Economic Times",
    category: ["business", "economy"],
  },
  {
    article_id: "fallback_article_2",
    title: "Breakthrough in Renewable Energy Technology Announced",
    link: "https://example.com/news/2",
    description:
      "Scientists reveal new solar panel design with record-breaking efficiency ratings.",
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    image_url: "https://source.unsplash.com/random/800x600/?solar",
    source_name: "Science Today",
    category: ["technology", "science"],
  },
  {
    article_id: "fallback_article_3",
    title: "Space Agency Plans New Mission to Mars",
    link: "https://example.com/news/3",
    description:
      "A new rover will be sent to the red planet to study its geological history.",
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    image_url: "https://source.unsplash.com/random/800x600/?mars",
    source_name: "Space News",
    category: ["science", "space"],
  },
];

export const fetchNews = async (page?: string): Promise<NewsResponse> => {
  try {
    let url = FULL_URL;
    if (page) {
      url += `&page=${page}`;
    }

    console.log("Attempting to fetch news from:", url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch news: ${response.statusText}`);

      return {
        status: "ok",
        totalResults: FALLBACK_NEWS.length,
        results: FALLBACK_NEWS,
        nextPage: undefined,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching news:", error);
    toast({
      title: "Error fetching news",
      description: "Using fallback data instead",
      variant: "destructive",
    });

    return {
      status: "ok",
      totalResults: FALLBACK_NEWS.length,
      results: FALLBACK_NEWS,
      nextPage: undefined,
    };
  }
};

// Exported for use in BreakingNews component
export const BREAKING_NEWS_FALLBACK = [
  {
    id: "breaking_1",
    title: "Major Political Summit Concludes With New Agreements",
    link: "https://example.com/breaking/1",
  },
  {
    id: "breaking_2",
    title: "Scientists Discover Potential Cure for Common Disease",
    link: "https://example.com/breaking/2",
  },
  {
    id: "breaking_3",
    title: "Stock Markets Reach Record Highs Across Global Exchanges",
    link: "https://example.com/breaking/3",
  },
];

// Saved articles functions
export const getSavedArticles = (userId: string): NewsArticle[] => {
  return getSavedNewsForUser(userId);
};

export const saveArticle = (userId: string, article: NewsArticle): void => {
  const savedArticles = getSavedArticles(userId);

  if (!savedArticles.some((item) => item.article_id === article.article_id)) {
    saveNewsRecord(userId, article);

    toast({
      title: "Article saved",
      description: "The article has been added to your saved items",
    });
  } else {
    toast({
      title: "Article already saved",
      description: "This article is already in your saved items",
    });
  }
};

export const removeArticle = (userId: string, articleId: string): void => {
  const removed = removeNewsFromSaved(userId, articleId);

  if (removed) {
    toast({
      title: "Article removed",
      description: "The article has been removed from your saved items",
    });
  }
};
