import { useState } from "react";
import { Tool, tools as allTools } from "@/lib/tools";
import ToolCard from "./ToolCard";
import { Button } from "@/components/ui/button";

interface ToolGridProps {
  tools: Tool[];
  category: string;
  searchQuery: string;
}

export default function ToolGrid({ tools, category, searchQuery }: ToolGridProps) {
  const [visibleTools, setVisibleTools] = useState<number>(8);
  
  const filteredTools = tools.filter(tool => {
    const matchesCategory = category === "All" || tool.category.includes(category as any);
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showMoreTools = () => {
    setVisibleTools(prev => prev + 8);
  };

  const displayedTools = filteredTools.slice(0, visibleTools);
  const hasMoreTools = filteredTools.length > visibleTools;

  return (
    <main id="tools" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
        
        {hasMoreTools && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center mt-4">
            <Button 
              variant="outline" 
              onClick={showMoreTools}
              className="px-6 py-5"
            >
              Load more tools <span className="ml-2 text-gray-500">({filteredTools.length - visibleTools} more)</span>
            </Button>
          </div>
        )}
        
        {displayedTools.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No tools found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
