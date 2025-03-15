import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { tools } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Import all tool components
import TypingSpeedTest from "@/tools/TypingSpeedTest";
import InternetSpeedTest from "@/tools/InternetSpeedTest";
import GrammarChecker from "@/tools/GrammarChecker";
import PDFTools from "@/tools/PDFTools";
import CurrencyConverter from "@/tools/CurrencyConverter";
import UnitConverter from "@/tools/UnitConverter";
import ImageCompressor from "@/tools/ImageCompressor";
import SEOTools from "@/tools/SEOTools";
import ColorPicker from "@/tools/ColorPicker";
import PasswordGenerator from "@/tools/PasswordGenerator";

export default function ToolPage() {
  const [match, params] = useRoute<{ id: string }>("/tool/:id");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTool, setCurrentTool] = useState(tools[0]);

  useEffect(() => {
    if (match && params.id) {
      const tool = tools.find((t) => t.id === params.id);
      if (tool) {
        setCurrentTool(tool);
        // Set page title
        document.title = `${tool.name} | ToolKit`;
      }
    }
  }, [match, params]);

  // Map tool IDs to components
  const toolComponents: Record<string, React.ReactNode> = {
    "typing-speed-test": <TypingSpeedTest />,
    "internet-speed-test": <InternetSpeedTest />,
    "grammar-checker": <GrammarChecker />,
    "pdf-tools": <PDFTools />,
    "currency-converter": <CurrencyConverter />,
    "unit-converter": <UnitConverter />,
    "image-compressor": <ImageCompressor />,
    "seo-tools": <SEOTools />,
    "color-picker": <ColorPicker />,
    "password-generator": <PasswordGenerator />,
    // Add more mappings as tools are implemented
  };

  if (!match || !currentTool) {
    return <div>Tool not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link href="/">
              <a className="flex items-center text-gray-500 hover:text-gray-700">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to tools
              </a>
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <currentTool.icon className="text-primary text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{currentTool.name}</h1>
            </div>
            <p className="text-gray-600 mb-4">{currentTool.description}</p>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            {toolComponents[currentTool.id] || (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-2">This tool is coming soon</h2>
                <p className="text-gray-500 mb-6">
                  We're still working on implementing this tool. Please check back later.
                </p>
                <Link href="/">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Explore other tools
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
