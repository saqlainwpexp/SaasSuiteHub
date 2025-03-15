import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  ExternalLink, 
  Loader2, 
  RefreshCw, 
  Trash2, 
  XCircle,
  CheckCircle,
  Bell,
  BellOff,
  Globe,
  Plus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type MonitoredWebsite = {
  id: string;
  url: string;
  name: string;
  status: "up" | "down" | "unknown";
  lastChecked: Date;
  responseTime: number;
  uptime: number;
  notifications: boolean;
  checkInterval: number;
  history: {
    timestamp: Date;
    status: "up" | "down";
    responseTime: number;
  }[];
};

export default function WebsiteMonitor() {
  const [websites, setWebsites] = useState<MonitoredWebsite[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [checkInterval, setCheckInterval] = useState<string>("5");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [currentWebsite, setCurrentWebsite] = useState<MonitoredWebsite | null>(null);
  
  // Initialize with demo data
  useEffect(() => {
    const demoWebsites: MonitoredWebsite[] = [
      {
        id: "1",
        url: "https://example.com",
        name: "Example Site",
        status: "up",
        lastChecked: new Date(),
        responseTime: 187,
        uptime: 99.98,
        notifications: true,
        checkInterval: 5,
        history: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 3600000),
          status: Math.random() > 0.1 ? "up" : "down",
          responseTime: Math.floor(Math.random() * 300) + 100,
        })).reverse(),
      },
      {
        id: "2",
        url: "https://demo-down-site.com",
        name: "Demo Down Site",
        status: "down",
        lastChecked: new Date(),
        responseTime: 0,
        uptime: 86.72,
        notifications: true,
        checkInterval: 5,
        history: Array.from({ length: 24 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 3600000),
          status: i < 3 ? "down" : "up",
          responseTime: i < 3 ? 0 : Math.floor(Math.random() * 300) + 100,
        })).reverse(),
      },
    ];
    
    setWebsites(demoWebsites);
  }, []);
  
  const addWebsite = () => {
    if (!newUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(newUrl);
    } catch (error) {
      alert("Please enter a valid URL including the protocol (http:// or https://)");
      return;
    }
    
    setIsAdding(true);
    
    // Simulate checking site status
    setTimeout(() => {
      const newWebsite: MonitoredWebsite = {
        id: Date.now().toString(),
        url: newUrl,
        name: newName.trim() || new URL(newUrl).hostname,
        status: "up",
        lastChecked: new Date(),
        responseTime: Math.floor(Math.random() * 300) + 100,
        uptime: 100,
        notifications: enableNotifications,
        checkInterval: parseInt(checkInterval),
        history: [{
          timestamp: new Date(),
          status: "up",
          responseTime: Math.floor(Math.random() * 300) + 100,
        }],
      };
      
      setWebsites(prev => [...prev, newWebsite]);
      setNewUrl("");
      setNewName("");
      setIsAdding(false);
      
      // Alert that this is a demo
      alert("This is a demo. In a real application, this would actually check the website and monitor it at the specified interval.");
    }, 2000);
  };
  
  const removeWebsite = (id: string) => {
    setWebsites(prev => prev.filter(site => site.id !== id));
    if (currentWebsite?.id === id) {
      setCurrentWebsite(null);
    }
  };
  
  const checkAllWebsites = () => {
    if (isChecking) return;
    
    setIsChecking(true);
    
    // Simulate checking all websites
    setTimeout(() => {
      setWebsites(prev => prev.map(site => {
        const now = new Date();
        const status = Math.random() > 0.9 ? "down" : "up";
        const responseTime = status === "up" ? Math.floor(Math.random() * 300) + 100 : 0;
        
        // Add to history
        const newHistory = [...site.history, {
          timestamp: now,
          status,
          responseTime,
        }];
        
        // Keep only last 100 records
        if (newHistory.length > 100) {
          newHistory.shift();
        }
        
        return {
          ...site,
          status,
          lastChecked: now,
          responseTime,
          history: newHistory,
        };
      }));
      
      setIsChecking(false);
    }, 2000);
  };
  
  const toggleNotifications = (id: string) => {
    setWebsites(prev => prev.map(site => 
      site.id === id
        ? { ...site, notifications: !site.notifications }
        : site
    ));
    
    if (currentWebsite?.id === id) {
      setCurrentWebsite(prev => prev ? { ...prev, notifications: !prev.notifications } : null);
    }
  };
  
  const viewDetails = (website: MonitoredWebsite) => {
    setCurrentWebsite(website);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };
  
  const filteredWebsites = websites.filter(site => {
    if (currentTab === "all") return true;
    if (currentTab === "up") return site.status === "up";
    if (currentTab === "down") return site.status === "down";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Website Monitor</h2>
        <p className="text-gray-600">
          Monitor websites for uptime and performance
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Website to Monitor</CardTitle>
              <CardDescription>
                Enter the URL of the website you want to monitor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input
                    id="website-url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://example.com"
                    disabled={isAdding}
                  />
                </div>
                
                <div>
                  <Label htmlFor="website-name">Display Name (optional)</Label>
                  <Input
                    id="website-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="My Website"
                    disabled={isAdding}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="check-interval" className="mb-2 block">Check Interval</Label>
                    <RadioGroup 
                      defaultValue="5" 
                      value={checkInterval}
                      onValueChange={setCheckInterval}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="r1" />
                          <Label htmlFor="r1">1 min</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5" id="r2" />
                          <Label htmlFor="r2">5 min</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="15" id="r3" />
                          <Label htmlFor="r3">15 min</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="60" id="r4" />
                          <Label htmlFor="r4">60 min</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={enableNotifications}
                        onCheckedChange={setEnableNotifications}
                        id="notifications"
                      />
                      <Label htmlFor="notifications">
                        {enableNotifications ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={addWebsite} disabled={isAdding || !newUrl.trim()}>
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Website
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Monitored Websites</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkAllWebsites}
                  disabled={isChecking}
                >
                  {isChecking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Check Now
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="up">
                    Up
                    <Badge variant="outline" className="ml-1 bg-green-50">
                      {websites.filter(site => site.status === "up").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="down">
                    Down
                    <Badge variant="outline" className="ml-1 bg-red-50">
                      {websites.filter(site => site.status === "down").length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-3">
                  {filteredWebsites.length === 0 ? (
                    <div className="text-center py-8 border rounded-md">
                      <Globe className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-gray-500">No websites to display</p>
                      {currentTab !== "all" && (
                        <p className="text-sm text-gray-400">
                          Try switching to "All" or add a new website
                        </p>
                      )}
                    </div>
                  ) : (
                    filteredWebsites.map(website => (
                      <div 
                        key={website.id} 
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => viewDetails(website)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {website.status === "up" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <div>
                              <p className="font-medium">{website.name}</p>
                              <p className="text-xs text-gray-500">{website.url}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {website.status === "up" ? (
                                  <span className="text-green-600">Up</span>
                                ) : (
                                  <span className="text-red-600">Down</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {website.responseTime > 0 ? `${website.responseTime}ms` : "Timeout"}
                              </p>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleNotifications(website.id);
                              }}
                            >
                              {website.notifications ? (
                                <Bell className="h-4 w-4" />
                              ) : (
                                <BellOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeWebsite(website.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div>
          {currentWebsite ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{currentWebsite.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a href={currentWebsite.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentWebsite(null)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{currentWebsite.url}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`font-medium ${currentWebsite.status === "up" ? "text-green-600" : "text-red-600"}`}>
                      {currentWebsite.status === "up" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Response Time</p>
                    <p className="font-medium">
                      {currentWebsite.responseTime > 0 ? `${currentWebsite.responseTime}ms` : "Timeout"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Uptime</p>
                    <p className="font-medium">{currentWebsite.uptime}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500">Last Checked</p>
                    <p className="font-medium text-sm">
                      {formatDate(currentWebsite.lastChecked)}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    Response Time History
                  </h4>
                  <div className="h-36 w-full relative">
                    <div className="absolute inset-0 flex items-end">
                      {currentWebsite.history.map((entry, index) => {
                        const height = entry.status === "up" ? Math.min(100, (entry.responseTime / 500) * 100) : 0;
                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center justify-end"
                          >
                            <div
                              className={`w-full max-w-[10px] mx-auto rounded-t ${
                                entry.status === "up" 
                                  ? entry.responseTime < 200
                                    ? "bg-green-500"
                                    : entry.responseTime < 500
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                  : "bg-red-500"
                              }`}
                              style={{ height: `${entry.status === "up" ? height : 5}%` }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200"></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>24 hours ago</span>
                    <span>Now</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Settings</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="site-notifications" className="text-sm">Notifications</Label>
                    <Switch
                      id="site-notifications"
                      checked={currentWebsite.notifications}
                      onCheckedChange={() => toggleNotifications(currentWebsite.id)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Check Interval</Label>
                    <span className="text-sm">{currentWebsite.checkInterval} minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">Select a website to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-4 bg-gray-50 rounded-lg border p-4">
            <h3 className="font-medium mb-2">About Website Monitoring</h3>
            <p className="text-sm text-gray-600">
              This tool helps you monitor website uptime and performance.
              Add websites to track their availability and response times.
              Receive notifications when a website goes down or 
              experiences performance issues.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Note about the Demo
        </h3>
        <p className="text-sm text-gray-600">
          This is a demonstration version. In a real implementation, the tool would actually
          ping the specified websites at regular intervals and track their uptime over time.
          The data shown here is simulated for demonstration purposes.
        </p>
      </div>
    </div>
  );
}