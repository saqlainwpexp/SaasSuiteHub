import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Palette,
  Copy,
  Upload,
  Check,
  RefreshCw,
  Pipette,
  Image as ImageIcon,
  Loader2,
  Star,
  Trash2
} from "lucide-react";

interface ColorPalette {
  name: string;
  colors: string[];
}

interface ColorInfo {
  hex: string;
  rgb: string;
  hsl: string;
  copied?: boolean;
}

export default function ColorPicker() {
  const [activeTab, setActiveTab] = useState("picker");
  const [color, setColor] = useState<string>("#00d66f");
  const [colorCopied, setColorCopied] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageColors, setImageColors] = useState<string[]>([]);
  const [palette, setPalette] = useState<ColorPalette[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageError, setImageError] = useState<string>("");
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 214, b: 111 });
  const [hslValues, setHslValues] = useState({ h: 153, s: 100, l: 42 });
  const [colorInfo, setColorInfo] = useState<ColorInfo>({
    hex: "#00d66f",
    rgb: "rgb(0, 214, 111)",
    hsl: "hsl(153, 100%, 42%)",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Generate an initial palette
    generateRandomPalette();
  }, []);
  
  useEffect(() => {
    updateColorInfo(color);
  }, [color]);
  
  const updateColorInfo = (hex: string) => {
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Update RGB values
    setRgbValues({ r, g, b });
    
    // Convert to HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;
    
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    
    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      
      switch (max) {
        case rNorm:
          h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
          break;
        case gNorm:
          h = ((bNorm - rNorm) / delta + 2) * 60;
          break;
        case bNorm:
          h = ((rNorm - gNorm) / delta + 4) * 60;
          break;
      }
    }
    
    // Update HSL values
    setHslValues({
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    });
    
    // Update color info
    setColorInfo({
      hex: hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    });
  };
  
  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgbValues = { ...rgbValues, [key]: value };
    setRgbValues(newRgbValues);
    
    // Convert to hex
    const hex = "#" + 
      newRgbValues.r.toString(16).padStart(2, '0') +
      newRgbValues.g.toString(16).padStart(2, '0') +
      newRgbValues.b.toString(16).padStart(2, '0');
    
    setColor(hex);
  };
  
  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const newHslValues = { ...hslValues, [key]: value };
    setHslValues(newHslValues);
    
    // Convert HSL to RGB
    const h = newHslValues.h / 360;
    const s = newHslValues.s / 100;
    const l = newHslValues.l / 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const rgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
    
    setRgbValues(rgb);
    
    // Convert to hex
    const hex = "#" + 
      rgb.r.toString(16).padStart(2, '0') +
      rgb.g.toString(16).padStart(2, '0') +
      rgb.b.toString(16).padStart(2, '0');
    
    setColor(hex);
  };
  
  const generateRandomPalette = () => {
    // Generate a random color
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    
    // Generate a palette based on the random color
    const palette = generatePalette(randomColor);
    setPalette([{ name: "Random", colors: palette }]);
  };
  
  const generatePalette = (baseColor: string) => {
    const colors: string[] = [baseColor];
    
    // Convert to HSL to create variations
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;
    
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    
    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      
      switch (max) {
        case rNorm:
          h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
          break;
        case gNorm:
          h = ((bNorm - rNorm) / delta + 2) * 60;
          break;
        case bNorm:
          h = ((rNorm - gNorm) / delta + 4) * 60;
          break;
      }
    }
    
    // Create variations
    // Complementary
    colors.push(hslToHex((h + 180) % 360, s * 100, l * 100));
    
    // Analogous
    colors.push(hslToHex((h + 30) % 360, s * 100, l * 100));
    colors.push(hslToHex((h + 330) % 360, s * 100, l * 100));
    
    // Triadic
    colors.push(hslToHex((h + 120) % 360, s * 100, l * 100));
    colors.push(hslToHex((h + 240) % 360, s * 100, l * 100));
    
    return colors;
  };
  
  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    setLoadingImage(true);
    setImageError("");
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.onload = () => {
          setImage(img.src);
          extractColors(img);
        };
        img.onerror = () => {
          setLoadingImage(false);
          setImageError("Failed to load image. Please try a different file.");
        };
        img.src = e.target.result as string;
      }
    };
    
    reader.onerror = () => {
      setLoadingImage(false);
      setImageError("Error reading file. Please try again.");
    };
    
    reader.readAsDataURL(file);
  };
  
  const extractColors = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    // Resize canvas to match image
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image on canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    // Sample colors at various points
    const colors: { [key: string]: number } = {};
    const sampleInterval = Math.max(1, Math.floor(imageData.length / 4 / 10000)); // Sample at most 10000 pixels
    
    for (let i = 0; i < imageData.length; i += 4 * sampleInterval) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      
      if (r === undefined || g === undefined || b === undefined) continue;
      
      // Skip too dark or too light colors
      if ((r + g + b) < 20 || (r + g + b) > 740) continue;
      
      // Convert to hex with some rounding to group similar colors
      const roundedR = Math.round(r / 10) * 10;
      const roundedG = Math.round(g / 10) * 10;
      const roundedB = Math.round(b / 10) * 10;
      
      const hex = "#" +
        Math.min(255, Math.max(0, roundedR)).toString(16).padStart(2, '0') +
        Math.min(255, Math.max(0, roundedG)).toString(16).padStart(2, '0') +
        Math.min(255, Math.max(0, roundedB)).toString(16).padStart(2, '0');
      
      colors[hex] = (colors[hex] || 0) + 1;
    }
    
    // Sort colors by frequency and take top 8
    const sortedColors = Object.entries(colors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => entry[0]);
    
    setImageColors(sortedColors);
    setLoadingImage(false);
  };
  
  const copyColor = (colorValue: string) => {
    navigator.clipboard.writeText(colorValue);
    setColorCopied(true);
    setTimeout(() => setColorCopied(false), 2000);
  };
  
  const savePalette = () => {
    const colors = selectedColors.length > 0 ? selectedColors : [color];
    const newPalette: ColorPalette = {
      name: `Palette ${savedPalettes.length + 1}`,
      colors
    };
    
    setSavedPalettes([...savedPalettes, newPalette]);
    setSelectedColors([]);
  };
  
  const toggleSelectColor = (selectedColor: string) => {
    setSelectedColors(prev => 
      prev.includes(selectedColor)
        ? prev.filter(c => c !== selectedColor)
        : [...prev, selectedColor]
    );
  };
  
  const removePalette = (index: number) => {
    setSavedPalettes(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="picker" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="picker" className="flex items-center gap-2">
            <Pipette className="h-4 w-4" />
            <span>Color Picker</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Extract from Image</span>
          </TabsTrigger>
          <TabsTrigger value="palette" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Color Palettes</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white p-6 rounded-lg border mb-8">
          <TabsContent value="picker">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <Label htmlFor="color-preview" className="mb-2 block">Color Preview</Label>
                  <div 
                    id="color-preview"
                    className="h-40 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => copyColor(color)}
                      className="bg-white hover:bg-gray-100"
                    >
                      {colorCopied ? (
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {colorCopied ? "Copied!" : "Copy Hex"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="color-input" className="mb-2 block">Color Value</Label>
                  <Input
                    id="color-input"
                    type="text"
                    value={colorInfo.hex}
                    onChange={(e) => setColor(e.target.value)}
                    className="mb-2 text-lg"
                  />
                  
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyColor(colorInfo.hex)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      HEX
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyColor(colorInfo.rgb)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      RGB
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyColor(colorInfo.hsl)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      HSL
                    </Button>
                  </div>
                  
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-12 mt-4 cursor-pointer rounded"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">RGB Controls</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-red-600 mb-2 block">Red: {rgbValues.r}</Label>
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgbValues.r]}
                      onValueChange={(value) => handleRgbChange('r', value[0])}
                      className="[&>.bg-primary]:bg-red-600"
                    />
                  </div>
                  <div>
                    <Label className="text-green-600 mb-2 block">Green: {rgbValues.g}</Label>
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgbValues.g]}
                      onValueChange={(value) => handleRgbChange('g', value[0])}
                      className="[&>.bg-primary]:bg-green-600"
                    />
                  </div>
                  <div>
                    <Label className="text-blue-600 mb-2 block">Blue: {rgbValues.b}</Label>
                    <Slider
                      min={0}
                      max={255}
                      step={1}
                      value={[rgbValues.b]}
                      onValueChange={(value) => handleRgbChange('b', value[0])}
                      className="[&>.bg-primary]:bg-blue-600"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">HSL Controls</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Hue: {hslValues.h}°</Label>
                    <div className="h-4 rounded-lg mb-1" style={{
                      background: `linear-gradient(to right, 
                        hsl(0, 100%, 50%), hsl(60, 100%, 50%), 
                        hsl(120, 100%, 50%), hsl(180, 100%, 50%), 
                        hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
                        hsl(360, 100%, 50%))`
                    }}></div>
                    <Slider
                      min={0}
                      max={359}
                      step={1}
                      value={[hslValues.h]}
                      onValueChange={(value) => handleHslChange('h', value[0])}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Saturation: {hslValues.s}%</Label>
                    <div className="h-4 rounded-lg mb-1" style={{
                      background: `linear-gradient(to right, 
                        hsl(${hslValues.h}, 0%, 50%), 
                        hsl(${hslValues.h}, 100%, 50%))`
                    }}></div>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[hslValues.s]}
                      onValueChange={(value) => handleHslChange('s', value[0])}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Lightness: {hslValues.l}%</Label>
                    <div className="h-4 rounded-lg mb-1" style={{
                      background: `linear-gradient(to right, 
                        hsl(${hslValues.h}, ${hslValues.s}%, 0%), 
                        hsl(${hslValues.h}, ${hslValues.s}%, 50%), 
                        hsl(${hslValues.h}, ${hslValues.s}%, 100%))`
                    }}></div>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[hslValues.l]}
                      onValueChange={(value) => handleHslChange('l', value[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="image">
            <h2 className="text-lg font-medium mb-4">Extract Colors from Image</h2>
            <p className="text-gray-600 mb-4">
              Upload an image to extract its main color palette.
            </p>
            
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload an image</h3>
                <p className="text-gray-500 mb-4">
                  PNG, JPG, or WebP (max. 5MB)
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
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Source Image</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      setImageColors([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4 mr-1" /> Clear
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden bg-gray-50 mb-4">
                  <img src={image} alt="Uploaded" className="max-h-60 mx-auto" />
                </div>
                
                {loadingImage ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-gray-600">Extracting colors...</p>
                  </div>
                ) : imageError ? (
                  <div className="text-center py-4 text-red-500">
                    {imageError}
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium mt-6 mb-2">Extracted Colors</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {imageColors.map((color, index) => (
                        <div 
                          key={index} 
                          className="aspect-square relative cursor-pointer rounded-lg overflow-hidden flex flex-col"
                          onClick={() => {
                            setColor(color);
                            toggleSelectColor(color);
                          }}
                        >
                          <div 
                            className="grow" 
                            style={{ backgroundColor: color }}
                          ></div>
                          <div className="p-1 text-[10px] bg-white text-center truncate">
                            {color}
                          </div>
                          {selectedColors.includes(color) && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Check className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={savePalette}
                        disabled={imageColors.length === 0}
                        className="bg-primary text-white hover:bg-primary/90"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Save as Palette
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="palette">
            <h2 className="text-lg font-medium mb-4">Color Palettes</h2>
            <p className="text-gray-600 mb-4">
              Create harmonious color palettes for your designs.
            </p>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Generated Palette</h3>
                <Button
                  onClick={generateRandomPalette}
                  variant="outline"
                  size="sm"
                  className="text-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Palette
                </Button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
                {palette[0]?.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="aspect-square relative cursor-pointer rounded-lg overflow-hidden flex flex-col"
                    onClick={() => {
                      setColor(color);
                      toggleSelectColor(color);
                    }}
                  >
                    <div 
                      className="grow" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="p-1 text-xs bg-white text-center truncate">
                      {color}
                    </div>
                    {selectedColors.includes(color) && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={savePalette}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Save Palette
                </Button>
              </div>
            </div>
            
            {savedPalettes.length > 0 && (
              <div>
                <h3 className="font-medium mb-4">Saved Palettes</h3>
                <div className="space-y-4">
                  {savedPalettes.map((palette, paletteIndex) => (
                    <div key={paletteIndex} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{palette.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePalette(paletteIndex)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                        {palette.colors.map((color, colorIndex) => (
                          <div 
                            key={colorIndex} 
                            className="aspect-square cursor-pointer rounded overflow-hidden flex flex-col group"
                            onClick={() => setColor(color)}
                          >
                            <div 
                              className="grow" 
                              style={{ backgroundColor: color }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 h-full flex items-center justify-center bg-black/20 transition-opacity">
                                <Copy className="h-4 w-4 text-white" />
                              </div>
                            </div>
                            <div className="p-1 text-[10px] bg-white text-center truncate">
                              {color}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </div>
        
        <div className="bg-gray-50 rounded-lg border p-4">
          <h3 className="font-medium mb-2">Color Theory Tips</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 rounded-full h-3 w-3 bg-primary"></div>
              <span><strong>Complementary colors</strong> are opposite on the color wheel and create high contrast.</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 rounded-full h-3 w-3 bg-primary"></div>
              <span><strong>Analogous colors</strong> are adjacent on the color wheel and create harmony.</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 rounded-full h-3 w-3 bg-primary"></div>
              <span><strong>Triadic colors</strong> are evenly spaced on the color wheel and create visual interest.</span>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-0.5 rounded-full h-3 w-3 bg-primary"></div>
              <span><strong>60-30-10 rule:</strong> Use your main color for 60% of the design, secondary for 30%, and accent for 10%.</span>
            </li>
          </ul>
        </div>
      </Tabs>
    </div>
  );
}
