
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { saveLoginRecord } from "@/services/localStorageService";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: "admin" | "user") => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing user data in localStorage
const USER_STORAGE_KEY = "news_hub_user";
const USERS_DB_KEY = "news_hub_users_db";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize or get users database from localStorage
  const getUsersDb = (): Record<string, { id: string, name: string, password: string, role: "admin" | "user" }> => {
    const usersDb = localStorage.getItem(USERS_DB_KEY);
    return usersDb ? JSON.parse(usersDb) : {};
  };

  const saveUsersDb = (db: Record<string, any>) => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  };

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Check if current user is admin
  const isAdmin = () => {
    return user?.role === "admin";
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersDb = getUsersDb();
      const userRecord = usersDb[email];
      
      if (!userRecord || userRecord.password !== password) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }
      
      const loggedInUser = {
        id: userRecord.id,
        email: email,
        name: userRecord.name,
        role: userRecord.role || "user" // Default to user if no role exists
      };
      
      setUser(loggedInUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      
      // Save login record
      saveLoginRecord({
        userId: loggedInUser.id,
        email: loggedInUser.email,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userRecord.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: "admin" | "user" = "user"): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersDb = getUsersDb();
      
      if (usersDb[email]) {
        toast({
          title: "Signup failed",
          description: "Email already in use",
          variant: "destructive",
        });
        return false;
      }
      
      // Generate a simple ID (in a real app, this would come from the backend)
      const newUserId = `user_${Date.now()}`;
      
      // Add user to "database"
      usersDb[email] = {
        id: newUserId,
        name,
        password,
        role
      };
      
      saveUsersDb(usersDb);
      
      // Log user in after signup
      const newUser = {
        id: newUserId,
        email,
        name,
        role
      };
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      toast({
        title: "Signup successful",
        description: `Welcome, ${name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
