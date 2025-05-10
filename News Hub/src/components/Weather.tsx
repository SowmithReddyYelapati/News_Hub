
import React, { useEffect, useState } from "react";
import { fetchWeather, WeatherData } from "@/services/weatherService";
import { Sun, CloudSun, CloudSunRain } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        // Use Vijayawada as the default city
        const weatherData = await fetchWeather("Vijayawada");
        setWeather(weatherData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-5 w-5" />;
    
    const iconCode = weather.icon;
    
    if (iconCode.includes("01") || iconCode.includes("02")) {
      return <Sun className="h-5 w-5" />;
    } else if (iconCode.includes("03") || iconCode.includes("04")) {
      return <CloudSun className="h-5 w-5" />;
    } else {
      return <CloudSunRain className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="flex items-center text-sm">
      <div className="mr-1">
        {getWeatherIcon()}
      </div>
      <div>
        <span className="font-medium">{weather.temp}°C</span>
        <span className="ml-1 text-muted-foreground hidden md:inline">{weather.city}</span>
      </div>
    </div>
  );
};
