import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Image as ImageIcon,
  Upload,
  Download,
  X,
  Loader2,
  HelpCircle,
  ScanSearch,
} from "lucide-react";

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedFile(null);
    setCompressedPreview(null);
    setCompressedSize(0);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const compressImage = () => {
    if (!selectedFile) return;
    
    setCompressing(true);
    
    const img = new Image();
    img.src = preview as string;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Resize if needed
      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with quality setting
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedFile(blob);
            setCompressedSize(blob.size);
            
            const reader = new FileReader();
            reader.onload = (e) => {
              setCompressedPreview(e.target?.result as string);
              setCompressing(false);
            };
            reader.readAsDataURL(blob);
          }
        },
        selectedFile.type,
        quality / 100
      );
    };
  };
  
  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setCompressedPreview(null);
    setCompressedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const downloadCompressedImage = () => {
    if (!compressedFile || !selectedFile) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedFile);
    
    // Create a filename with "compressed_" prefix
    const originalName = selectedFile.name;
    const dotIndex = originalName.lastIndexOf('.');
    const name = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
    const ext = dotIndex !== -1 ? originalName.substring(dotIndex) : '';
    link.download = `compressed_${name}${ext}`;
    
    link.click();
  };
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const calculateSavings = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Image Compressor</h2>
        <p className="text-gray-600">
          Reduce image file sizes while preserving quality
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border mb-6">
        {!selectedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="mb-4 flex justify-center">
              <ImageIcon className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an image</h3>
            <p className="text-gray-500 mb-4">
              PNG, JPG, JPEG, or WebP (max. 10MB)
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Compression Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearImage}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="quality">Quality: {quality}%</Label>
                <div className="flex text-sm text-gray-500 items-center">
                  <HelpCircle className="h-3.5 w-3.5 mr-1" />
                  Lower quality = smaller file size
                </div>
              </div>
              <Slider
                id="quality"
                min={1}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="max-width">Max Width: {maxWidth}px</Label>
                <div className="flex text-sm text-gray-500 items-center">
                  <HelpCircle className="h-3.5 w-3.5 mr-1" />
                  Larger images will be resized
                </div>
              </div>
              <Slider
                id="max-width"
                min={100}
                max={4000}
                step={100}
                value={[maxWidth]}
                onValueChange={(value) => setMaxWidth(value[0])}
              />
            </div>
            
            <Button
              className="w-full bg-primary text-white hover:bg-primary/90 mb-6"
              onClick={compressImage}
              disabled={compressing}
            >
              {compressing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <ScanSearch className="mr-2 h-4 w-4" />
                  Compress Image
                </>
              )}
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-medium mb-2 flex justify-between">
                  <span>Original Image</span>
                  <span className="text-gray-500 text-sm">{formatSize(originalSize)}</span>
                </div>
                <div className="border rounded-lg overflow-hidden bg-gray-50 h-60 flex items-center justify-center">
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Original" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-medium mb-2 flex justify-between">
                  <span>Compressed Image</span>
                  {compressedSize > 0 && (
                    <span className="text-gray-500 text-sm">{formatSize(compressedSize)}</span>
                  )}
                </div>
                <div className="border rounded-lg overflow-hidden bg-gray-50 h-60 flex items-center justify-center">
                  {compressing ? (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-sm text-gray-500">Processing...</p>
                    </div>
                  ) : compressedPreview ? (
                    <img 
                      src={compressedPreview} 
                      alt="Compressed" 
                      className="max-w-full max-h-full object-contain" 
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>Compress to preview</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {compressedFile && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium text-green-800">Compression Complete!</h3>
                  <span className="text-green-700 font-medium">Saved {calculateSavings()}%</span>
                </div>
                <p className="text-green-700 mb-3">
                  Original: {formatSize(originalSize)} → Compressed: {formatSize(compressedSize)}
                </p>
                <Button 
                  onClick={downloadCompressedImage}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed Image
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Image Compression</h3>
        <p className="text-sm text-gray-600 mb-2">
          Image compression reduces file size by removing unnecessary data while preserving visual quality.
          This tool uses a combination of quality adjustment and resizing to optimize images.
        </p>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Adjust quality slider to control the compression level</li>
          <li>Lower quality values result in smaller files but may reduce image quality</li>
          <li>Set max width to resize large images which significantly reduces file size</li>
          <li>Compression is done locally in your browser—your images are never uploaded to a server</li>
        </ul>
      </div>
    </div>
  );
}
