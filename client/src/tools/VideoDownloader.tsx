import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Video, 
  Download, 
  AlertCircle, 
  Loader2, 
  Check, 
  Music, 
  Clock,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type VideoInfo = {
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
  author: string;
  formats: {
    id: string;
    resolution: string;
    fps: number;
    filesize: string;
  }[];
};

export default function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadState, setDownloadState] = useState<"idle" | "downloading" | "complete">("idle");
  const [extractAudio, setExtractAudio] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoInfo();
  };

  const fetchVideoInfo = () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoInfo(null);
    
    // In a real implementation, this would call a backend API
    // For this demo, we'll simulate an API call
    setTimeout(() => {
      try {
        // URL validation (very basic)
        const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        
        if (!urlPattern.test(url.trim())) {
          throw new Error("Invalid URL. Please enter a valid YouTube URL.");
        }
        
        // Mock video data
        const mockVideoInfo: VideoInfo = {
          title: "Sample Video - This is a demo",
          duration: "10:23",
          thumbnail: "https://via.placeholder.com/480x270.png?text=Sample+Video+Thumbnail",
          views: "1,234,567",
          author: "Sample Channel",
          formats: [
            { id: "1080p", resolution: "1080p", fps: 60, filesize: "320 MB" },
            { id: "720p", resolution: "720p", fps: 60, filesize: "180 MB" },
            { id: "480p", resolution: "480p", fps: 30, filesize: "90 MB" },
            { id: "360p", resolution: "360p", fps: 30, filesize: "60 MB" },
            { id: "240p", resolution: "240p", fps: 30, filesize: "35 MB" },
          ]
        };
        
        setVideoInfo(mockVideoInfo);
        setSelectedFormat(mockVideoInfo.formats[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleDownload = () => {
    // In a real implementation, this would initiate a download from a backend API
    // For this demo, we'll simulate a download with a progress indicator
    setDownloadState("downloading");
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadState("complete");
          return 100;
        }
        return prev + 10;
      });
    }, 500);
    
    // Show alert about the demo
    setTimeout(() => {
      alert("This is a demo. In a real application, this would download the actual video. Due to terms of service restrictions for many platforms, a real implementation would need to comply with their policies.");
    }, 5500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Video Downloader</h2>
        <p className="text-gray-600">
          Download videos from popular platforms
        </p>
      </div>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>
          Only download videos that you have the right to download. Respect copyright laws and the terms of service of the platforms you're downloading from.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Enter Video URL</CardTitle>
          <CardDescription>
            Paste the link to the video you want to download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Get Info"
              )}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
      
      {videoInfo && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Video Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img 
                  src={videoInfo.thumbnail} 
                  alt={videoInfo.title} 
                  className="w-full rounded-md shadow"
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="font-bold text-lg mb-2">{videoInfo.title}</h3>
                <div className="grid grid-cols-2 gap-y-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{videoInfo.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Info className="h-4 w-4" />
                    <span>{videoInfo.views} views</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="format-select" className="mb-2 block">
                    Select Format
                  </Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger id="format-select">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      {videoInfo.formats.map((format) => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.resolution} ({format.fps}fps) - {format.filesize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox 
                    id="extract-audio" 
                    checked={extractAudio}
                    onCheckedChange={(checked) => setExtractAudio(checked as boolean)}
                  />
                  <Label htmlFor="extract-audio" className="flex items-center">
                    <Music className="mr-1 h-4 w-4" />
                    Extract audio only (MP3)
                  </Label>
                </div>
                
                {downloadState === "downloading" && (
                  <div className="mb-4">
                    <Label className="mb-2 block">Downloading...</Label>
                    <Progress value={downloadProgress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-1">{downloadProgress}% complete</p>
                  </div>
                )}
                
                <Button 
                  className="w-full"
                  onClick={handleDownload}
                  disabled={downloadState === "downloading"}
                >
                  {downloadState === "complete" ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Download Complete
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {downloadState === "downloading" ? "Downloading..." : "Download Now"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Video Downloader</h3>
        <p className="text-sm text-gray-600">
          This tool allows you to download videos from popular platforms.
          You can select different quality options and extract audio from videos.
          Please remember to respect copyright and terms of service of the platforms you're downloading from.
        </p>
      </div>
    </div>
  );
}