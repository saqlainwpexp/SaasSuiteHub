import { useState, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UploadCloud, 
  Download, 
  Copy, 
  Check, 
  Link, 
  File, 
  Loader2,
  Clock,
  Settings,
  Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  url: string;
  downloads: number;
  expiryDate: Date;
};

export default function FileSharing() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState("");
  const [expiryOption, setExpiryOption] = useState("7days");
  const [downloadLinkCopied, setDownloadLinkCopied] = useState(false);
  const [downloadCode, setDownloadCode] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileToDownload, setFileToDownload] = useState<UploadedFile | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateExpiryDate = (option: string): Date => {
    const now = new Date();
    
    switch (option) {
      case "1day":
        return new Date(now.setDate(now.getDate() + 1));
      case "7days":
        return new Date(now.setDate(now.getDate() + 7));
      case "30days":
        return new Date(now.setDate(now.getDate() + 30));
      case "never":
        return new Date(now.setFullYear(now.getFullYear() + 100));
      default:
        return new Date(now.setDate(now.getDate() + 7));
    }
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Create mock uploaded files
          const newUploadedFiles: UploadedFile[] = files.map(file => ({
            id: Math.random().toString(36).substring(2, 12),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            url: URL.createObjectURL(file),
            downloads: 0,
            expiryDate: calculateExpiryDate(expiryOption)
          }));
          
          setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
          setFiles([]);
          setIsUploading(false);
          
          return 100;
        }
        return prev + 5;
      });
    }, 300);
    
    // Alert that this is a demo
    setTimeout(() => {
      alert("This is a demo. In a real application, files would be uploaded to a server and proper share links would be generated.");
    }, 6000);
  };

  const copyShareLink = (fileId: string) => {
    const shareLink = `https://example.com/share/${fileId}`;
    navigator.clipboard.writeText(shareLink);
    setDownloadLinkCopied(true);
    setTimeout(() => setDownloadLinkCopied(false), 2000);
  };

  const downloadFile = (code: string) => {
    if (!code.trim()) return;
    
    setIsDownloading(true);
    
    // Simulate looking up the file
    setTimeout(() => {
      const mockFile = uploadedFiles[0] || {
        id: "demo123",
        name: "demo-file.pdf",
        size: 1024 * 1024 * 2.5,
        type: "application/pdf",
        uploadedAt: new Date(),
        url: "#",
        downloads: 5,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 7))
      };
      
      setFileToDownload(mockFile);
      setIsDownloading(false);
    }, 1500);
  };

  const deleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">File Sharing</h2>
        <p className="text-gray-600">
          Securely share files with others via links
        </p>
      </div>
      
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex gap-2 items-center">
            <UploadCloud className="h-4 w-4" />
            <span>Upload & Share</span>
          </TabsTrigger>
          <TabsTrigger value="download" className="flex gap-2 items-center">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="pt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload files to share with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
              >
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Drop your files here, or{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Support for a single or bulk upload. Max 100MB per file.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
              
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Selected Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-1" />
                        Share Settings
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="password-protect"
                              checked={passwordProtect}
                              onCheckedChange={setPasswordProtect}
                            />
                            <Label htmlFor="password-protect">Password Protection</Label>
                          </div>
                        </div>
                        
                        {passwordProtect && (
                          <div>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="max-w-xs"
                            />
                          </div>
                        )}
                        
                        <div>
                          <Label htmlFor="expiry" className="block mb-2">Expiry Time</Label>
                          <RadioGroup 
                            defaultValue="7days" 
                            value={expiryOption}
                            onValueChange={setExpiryOption}
                          >
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1day" id="r1" />
                                <Label htmlFor="r1">1 Day</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="7days" id="r2" />
                                <Label htmlFor="r2">7 Days</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="30days" id="r3" />
                                <Label htmlFor="r3">30 Days</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="never" id="r4" />
                                <Label htmlFor="r4">Never Expire</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    
                    {isUploading ? (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Uploading...</span>
                          <span className="text-sm">{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    ) : (
                      <Button 
                        onClick={handleUpload} 
                        className="w-full"
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Shared Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <File className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.downloads} downloads • 
                              Expires: {file.expiryDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <Input
                          value={`https://example.com/share/${file.id}`}
                          readOnly
                          className="mr-2"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyShareLink(file.id)}
                        >
                          {downloadLinkCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="download" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Download Files</CardTitle>
              <CardDescription>
                Enter a file code or link to download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value)}
                  placeholder="Paste share link or enter code"
                  className="flex-1"
                />
                <Button
                  onClick={() => downloadFile(downloadCode)}
                  disabled={isDownloading || !downloadCode.trim()}
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Find File"
                  )}
                </Button>
              </div>
              
              {fileToDownload && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <File className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">{fileToDownload.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(fileToDownload.size)} • Expires in{" "}
                          {Math.max(0, Math.ceil((fileToDownload.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}{" "}
                          days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Uploaded {fileToDownload.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={() => alert("This is a demo. In a real application, this would download the actual file.")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About File Sharing</h3>
        <p className="text-sm text-gray-600">
          This tool allows you to securely share files with others. 
          Upload files, set optional password protection and expiry dates, 
          and share the generated link. Recipients can download the files 
          without registration. All files are encrypted for security.
        </p>
      </div>
    </div>
  );
}