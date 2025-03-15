import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Camera, 
  Download, 
  Upload, 
  Edit2, 
  Scissors, 
  Crop,
  Image as ImageIcon
} from "lucide-react";

export default function ScreenshotTool() {
  const [activeTab, setActiveTab] = useState("capture");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [editMode, setEditMode] = useState<"none" | "crop" | "annotate">("none");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const captureScreen = () => {
    // In a real implementation, this would use the browser's screenshot API
    // or interact with a browser extension. For this demo, we'll simulate it.
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setImageUrl('/demo-screenshot.png');
      // In a real app, we would capture the actual screenshot here
      alert("This is a demo. In a real application, this would capture your screen.");
    }, 1500);
  };

  const downloadImage = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = "screenshot.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Screenshot Tool</h2>
        <p className="text-gray-600">
          Capture, edit, and annotate screenshots of your screen
        </p>
      </div>
      
      <Tabs defaultValue="capture" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="capture" className="flex gap-2 items-center">
            <Camera className="h-4 w-4" />
            <span>Capture</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex gap-2 items-center">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="capture" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Capture Screenshot</CardTitle>
              <CardDescription>
                Capture your entire screen or a specific window
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Button
                  onClick={captureScreen}
                  disabled={isCapturing}
                  className="w-full md:w-auto"
                >
                  {isCapturing ? (
                    <>Capturing...</>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Screen
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-gray-500">
                  Note: Some browsers may require permission to capture your screen.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upload" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Upload an existing screenshot or image to edit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-colors"
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {imageUrl && (
        <div className="bg-white rounded-lg border p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium">Edit Screenshot</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(editMode === "crop" ? "none" : "crop")}
                className={editMode === "crop" ? "bg-gray-100" : ""}
              >
                <Crop className="h-4 w-4 mr-1" />
                Crop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(editMode === "annotate" ? "none" : "annotate")}
                className={editMode === "annotate" ? "bg-gray-100" : ""}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Annotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setImageUrl(null);
                  setEditMode("none");
                }}
              >
                <Scissors className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="rounded border overflow-hidden mb-4 relative">
            <img 
              src={imageUrl} 
              alt="Screenshot" 
              className="max-w-full h-auto"
            />
            
            {editMode === "crop" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="mb-2">Crop mode is a demo feature.</p>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode("none")}
                  >
                    Exit Crop Mode
                  </Button>
                </div>
              </div>
            )}
            
            {editMode === "annotate" && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <p className="mb-2">Annotation tools would appear here.</p>
                  <Button
                    variant="outline"
                    onClick={() => setEditMode("none")}
                  >
                    Exit Annotate Mode
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button onClick={downloadImage} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Screenshot
          </Button>
        </div>
      )}
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Screenshot Tool</h3>
        <p className="text-sm text-gray-600">
          This tool allows you to capture screenshots directly from your browser, upload existing images, 
          and edit them with crop and annotation features. 
          Perfect for creating tutorials, sharing information, or reporting issues.
        </p>
      </div>
    </div>
  );
}