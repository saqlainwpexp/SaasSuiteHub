import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { tools } from "@/lib/tools";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import ToolGrid from "@/components/ToolGrid";
import Footer from "@/components/Footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [location] = useLocation();
  
  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.split("?")[1]);
    const categoryParam = params.get("category");
    const filterParam = params.get("filter");
    
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else if (filterParam === "popular") {
      // Special filter for popular tools
      setActiveCategory("All");
      // We'll filter by popular tag in the ToolGrid component
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />
      <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <ToolGrid 
        tools={tools} 
        category={activeCategory} 
        searchQuery={searchQuery} 
      />
      <Footer />
    </div>
  );
}
