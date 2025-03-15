import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  List,
  BarChart3
} from "lucide-react";

export default function SEOTools() {
  const [activeTab, setActiveTab] = useState("keyword-research");
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState("");
  
  // For keyword research
  const handleKeywordResearch = async () => {
    if (!keyword.trim()) return;
    
    setAnalyzing(true);
    setError("");
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate results - in a real implementation, this would call an SEO API
      const mockKeywords = [
        { keyword: keyword, volume: Math.floor(Math.random() * 10000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `best ${keyword}`, volume: Math.floor(Math.random() * 8000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} online`, volume: Math.floor(Math.random() * 7000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} guide`, volume: Math.floor(Math.random() * 5000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `how to use ${keyword}`, volume: Math.floor(Math.random() * 4000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} alternatives`, volume: Math.floor(Math.random() * 3000), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} benefits`, volume: Math.floor(Math.random() * 2500), difficulty: Math.floor(Math.random() * 100) },
        { keyword: `${keyword} example`, volume: Math.floor(Math.random() * 2000), difficulty: Math.floor(Math.random() * 100) },
      ];
      
      setResults(mockKeywords);
      // Also add to keywords list for saving
      setKeywords(prev => [...new Set([...prev, keyword])]);
    } catch (error) {
      console.error("Error researching keywords:", error);
      setError("Failed to research keywords. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };
  
  // For SEO analysis
  const handleSEOAnalysis = async () => {
    if (!url.trim() || !url.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    
    setAnalyzing(true);
    setError("");
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate SEO analysis results
      setResults({
        score: Math.floor(Math.random() * 41) + 60, // Score between 60-100
        title: {
          status: Math.random() > 0.3 ? "good" : "warning",
          message: Math.random() > 0.3 ? "Title tag is well optimized" : "Title could be improved"
        },
        description: {
          status: Math.random() > 0.3 ? "good" : "warning",
          message: Math.random() > 0.3 ? "Meta description is present and appropriate length" : "Meta description could be more descriptive"
        },
        headings: {
          status: Math.random() > 0.3 ? "good" : "warning",
          message: Math.random() > 0.3 ? "Heading structure is well organized" : "Heading structure could be improved"
        },
        images: {
          status: Math.random() > 0.5 ? "good" : "error",
          message: Math.random() > 0.5 ? "All images have alt attributes" : "Some images are missing alt attributes"
        },
        keywords: {
          status: Math.random() > 0.3 ? "good" : "warning",
          message: Math.random() > 0.3 ? "Keyword usage is appropriate" : "Keywords could be better distributed"
        },
        links: {
          status: Math.random() > 0.5 ? "good" : "warning",
          message: Math.random() > 0.5 ? "Link structure is good" : "Some links may need attention"
        },
        speed: {
          status: Math.random() > 0.7 ? "good" : "warning",
          message: Math.random() > 0.7 ? "Page speed is good" : "Page could load faster"
        },
        mobile: {
          status: Math.random() > 0.5 ? "good" : "warning",
          message: Math.random() > 0.5 ? "Site is mobile friendly" : "Mobile experience could be improved"
        }
      });
    } catch (error) {
      console.error("Error analyzing website:", error);
      setError("Failed to analyze the website. Please check the URL and try again.");
    } finally {
      setAnalyzing(false);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="keyword-research" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="keyword-research" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            <span>Keyword Research</span>
          </TabsTrigger>
          <TabsTrigger value="seo-analyzer" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>SEO Analyzer</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white p-6 rounded-lg border mb-8">
          <TabsContent value="keyword-research">
            <h2 className="text-lg font-medium mb-4">Keyword Research Tool</h2>
            <p className="text-gray-600 mb-4">
              Discover relevant keywords for your content and get insights on search volume and competition.
            </p>
            
            <div className="mb-6">
              <Label htmlFor="keyword" className="mb-2 block">Enter a keyword or topic</Label>
              <div className="flex gap-2">
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., digital marketing"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleKeywordResearch()}
                />
                <Button
                  onClick={handleKeywordResearch}
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={analyzing || !keyword.trim()}
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Research
                </Button>
              </div>
              
              {keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {keywords.map((k, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setKeyword(k);
                        handleKeywordResearch();
                      }}
                      className="text-xs"
                    >
                      {k}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {results && activeTab === "keyword-research" && (
              <div>
                <h3 className="font-medium mb-3">Results for "{keyword}"</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Search Volume</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((item: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.keyword}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.volume.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    item.difficulty < 33 ? 'bg-green-500' :
                                    item.difficulty < 66 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.difficulty}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">{item.difficulty}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    <strong>Keyword difficulty</strong> indicates how hard it would be to rank for this term.
                    Lower values (green) suggest easier ranking opportunities.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="seo-analyzer">
            <h2 className="text-lg font-medium mb-4">Website SEO Analyzer</h2>
            <p className="text-gray-600 mb-4">
              Analyze your website for on-page SEO factors and receive recommendations for improvement.
            </p>
            
            <div className="mb-6">
              <Label htmlFor="url" className="mb-2 block">Enter your website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSEOAnalysis()}
                />
                <Button
                  onClick={handleSEOAnalysis}
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={analyzing || !url.trim()}
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Analyze
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {results && activeTab === "seo-analyzer" && (
              <div>
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gray-50 mb-3">
                    <span className="text-3xl font-bold text-primary">{results.score}</span>
                  </div>
                  <h3 className="font-medium">SEO Score</h3>
                  <p className="text-sm text-gray-500">
                    {results.score >= 80 ? "Great job! Your site is well optimized." :
                     results.score >= 60 ? "Good, but there's room for improvement." :
                     "Needs significant improvements."}
                  </p>
                </div>
                
                <h3 className="font-medium mb-3">SEO Analysis Results</h3>
                <div className="space-y-3">
                  {["title", "description", "headings", "images", "keywords", "links", "speed", "mobile"].map((factor) => (
                    <div key={factor} className="p-3 bg-gray-50 rounded-lg flex items-start">
                      <div className="mr-3 mt-0.5">
                        {getStatusIcon(results[factor].status)}
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">{factor}</h4>
                        <p className="text-sm text-gray-600">{results[factor].message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </div>
        
        <div className="rounded border p-4 bg-gray-50">
          <h3 className="font-medium mb-2">SEO Best Practices</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span>Research keywords with good search volume and lower competition</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span>Include keywords naturally in titles, headings, and content</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span>Optimize meta descriptions to improve click-through rates</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span>Ensure your website loads quickly and is mobile-friendly</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span>Create high-quality content that answers search queries</span>
            </li>
          </ul>
        </div>
      </Tabs>
    </div>
  );
}
