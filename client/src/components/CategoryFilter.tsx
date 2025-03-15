import { toolCategories } from "@/lib/tools";

interface CategoryFilterProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, setActiveCategory }: CategoryFilterProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-hide">
          {toolCategories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
