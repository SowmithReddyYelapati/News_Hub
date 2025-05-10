
import userLoginDataTemplate from "@/data/userLoginData.json";
import savedNewsDataTemplate from "@/data/savedNewsData.json";

// Login data management
export interface LoginRecord {
  userId: string;
  email: string;
  timestamp: string;
  ipAddress?: string;
}

export const saveLoginRecord = (loginData: LoginRecord): void => {
  try {
    // Get existing data
    const existingDataStr = localStorage.getItem("user_login_records");
    const existingData = existingDataStr 
      ? JSON.parse(existingDataStr) 
      : { ...userLoginDataTemplate };
    
    // Add new record
    existingData.users.push({
      ...loginData,
      timestamp: new Date().toISOString(),
      ipAddress: loginData.ipAddress || "127.0.0.1"
    });
    
    // Save back to local storage
    localStorage.setItem("user_login_records", JSON.stringify(existingData));
    
    console.log("Login record saved successfully");
  } catch (error) {
    console.error("Error saving login record:", error);
  }
};

export const getLoginRecords = (): LoginRecord[] => {
  try {
    const recordsStr = localStorage.getItem("user_login_records");
    if (!recordsStr) {
      // Initialize with template data
      localStorage.setItem("user_login_records", JSON.stringify(userLoginDataTemplate));
      return userLoginDataTemplate.users;
    }
    
    const records = JSON.parse(recordsStr);
    return records.users || [];
  } catch (error) {
    console.error("Error retrieving login records:", error);
    return [];
  }
};

// Saved news management
export interface SavedNewsRecord {
  userId: string;
  articles: any[];
}

export const saveNewsRecord = (userId: string, article: any): void => {
  try {
    // Get existing data
    const existingDataStr = localStorage.getItem("saved_news_records");
    const existingData = existingDataStr 
      ? JSON.parse(existingDataStr) 
      : { ...savedNewsDataTemplate };
    
    // Find user's saved articles or create new entry
    const userRecordIndex = existingData.savedArticles.findIndex(
      (record: SavedNewsRecord) => record.userId === userId
    );
    
    if (userRecordIndex >= 0) {
      // Check if article already exists
      const articleExists = existingData.savedArticles[userRecordIndex].articles.some(
        (item: any) => item.article_id === article.article_id
      );
      
      if (!articleExists) {
        existingData.savedArticles[userRecordIndex].articles.push(article);
      }
    } else {
      // Create new user record
      existingData.savedArticles.push({
        userId,
        articles: [article]
      });
    }
    
    // Save back to local storage
    localStorage.setItem("saved_news_records", JSON.stringify(existingData));
    
  } catch (error) {
    console.error("Error saving news record:", error);
  }
};

export const getSavedNewsForUser = (userId: string): any[] => {
  try {
    const recordsStr = localStorage.getItem("saved_news_records");
    if (!recordsStr) {
      // Initialize with template data if no data exists
      localStorage.setItem("saved_news_records", JSON.stringify(savedNewsDataTemplate));
      
      // Check if user has data in the template
      const userRecord = savedNewsDataTemplate.savedArticles.find(
        (record: SavedNewsRecord) => record.userId === userId
      );
      return userRecord ? userRecord.articles : [];
    }
    
    const records = JSON.parse(recordsStr);
    const userRecord = records.savedArticles.find(
      (record: SavedNewsRecord) => record.userId === userId
    );
    
    return userRecord ? userRecord.articles : [];
  } catch (error) {
    console.error("Error retrieving saved news:", error);
    return [];
  }
};

export const removeNewsFromSaved = (userId: string, articleId: string): boolean => {
  try {
    const recordsStr = localStorage.getItem("saved_news_records");
    if (!recordsStr) return false;
    
    const records = JSON.parse(recordsStr);
    const userRecordIndex = records.savedArticles.findIndex(
      (record: SavedNewsRecord) => record.userId === userId
    );
    
    if (userRecordIndex >= 0) {
      const userRecord = records.savedArticles[userRecordIndex];
      const articleIndex = userRecord.articles.findIndex(
        (article: any) => article.article_id === articleId
      );
      
      if (articleIndex >= 0) {
        userRecord.articles.splice(articleIndex, 1);
        localStorage.setItem("saved_news_records", JSON.stringify(records));
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error removing saved news:", error);
    return false;
  }
};
