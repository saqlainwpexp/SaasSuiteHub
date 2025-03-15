import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Upload,
  FilePlus2,
  FileOutput,
  Loader2,
  Scissors,
  FileType2,
  Download,
  Trash2,
} from "lucide-react";

export default function PDFTools() {
  const [activeTab, setActiveTab] = useState("merge");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultFile, setResultFile] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [convertFormat, setConvertFormat] = useState("docx");
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).filter(
      file => file.type === "application/pdf"
    );
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const processFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setProcessing(true);
    setResultFile(null);
    
    try {
      // Simulate processing with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would handle the appropriate PDF operation
      // based on the active tab, using a library like PDF.js or a backend service
      
      // Simulating a download link
      setResultFile("processed.pdf");
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  const resetTool = () => {
    setSelectedFiles([]);
    setResultFile(null);
    setPageRange("");
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="merge" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="merge" className="flex items-center gap-2">
            <FilePlus2 className="h-4 w-4" />
            <span>Merge PDFs</span>
          </TabsTrigger>
          <TabsTrigger value="split" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>Split PDF</span>
          </TabsTrigger>
          <TabsTrigger value="convert" className="flex items-center gap-2">
            <FileType2 className="h-4 w-4" />
            <span>Convert PDF</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="bg-white p-6 rounded-lg border mb-8">
          <TabsContent value="merge">
            <h2 className="text-lg font-medium mb-4">Merge Multiple PDF Files</h2>
            <p className="text-gray-600 mb-4">
              Combine multiple PDF files into a single document. Upload two or more PDFs and arrange them in your preferred order.
            </p>
          </TabsContent>
          
          <TabsContent value="split">
            <h2 className="text-lg font-medium mb-4">Split PDF into Multiple Files</h2>
            <p className="text-gray-600 mb-4">
              Extract specific pages or split a large PDF into smaller documents. Select a PDF and specify the page range.
            </p>
            
            <div className="mb-4">
              <Label htmlFor="page-range">Page Range</Label>
              <Input
                id="page-range"
                placeholder="e.g., 1-3, 5, 7-9"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Specify individual pages or ranges (e.g., 1-3, 5, 7-9)
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="convert">
            <h2 className="text-lg font-medium mb-4">Convert PDF to Other Formats</h2>
            <p className="text-gray-600 mb-4">
              Convert your PDF files to Word, Excel, or image formats for easier editing.
            </p>
            
            <div className="mb-4">
              <Label htmlFor="convert-format">Output Format</Label>
              <select
                id="convert-format"
                value={convertFormat}
                onChange={(e) => setConvertFormat(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="docx">Word Document (.docx)</option>
                <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                <option value="jpg">JPEG Image (.jpg)</option>
                <option value="png">PNG Image (.png)</option>
                <option value="txt">Text File (.txt)</option>
              </select>
            </div>
          </TabsContent>
          
          <div className="mt-4">
            <Label className="block mb-2">Select PDF {activeTab === "merge" ? "Files" : "File"}</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-4 flex justify-center">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">
                {activeTab === "merge" 
                  ? "Upload multiple PDF files" 
                  : "Upload a PDF file"}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag & drop or click to browse
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("pdf-upload")?.click()}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Browse Files
              </Button>
              <input
                type="file"
                id="pdf-upload"
                accept="application/pdf"
                multiple={activeTab === "merge"}
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Selected Files</h3>
              <ul className="space-y-2 mb-4">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </li>
                ))}
              </ul>
              
              <div className="flex justify-between">
                <Button
                  className="bg-primary text-white hover:bg-primary/90"
                  onClick={processFiles}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileOutput className="mr-2 h-4 w-4" />
                      {activeTab === "merge" 
                        ? "Merge Files" 
                        : activeTab === "split" 
                          ? "Split PDF" 
                          : "Convert PDF"}
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={resetTool}
                  disabled={processing}
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
          
          {resultFile && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Process Complete!
              </h3>
              <p className="text-green-700 mb-3">Your file has been processed successfully.</p>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Download Result
              </Button>
            </div>
          )}
        </div>
        
        <div className="rounded border p-4 bg-gray-50">
          <h3 className="font-medium mb-2">PDF Tools Features</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <FilePlus2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span><strong>Merge PDFs:</strong> Combine multiple PDF files into one document.</span>
            </li>
            <li className="flex items-start">
              <Scissors className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span><strong>Split PDF:</strong> Extract pages or split a PDF into multiple smaller documents.</span>
            </li>
            <li className="flex items-start">
              <FileType2 className="h-4 w-4 text-primary mr-2 mt-0.5" />
              <span><strong>Convert PDF:</strong> Transform PDFs into various formats like Word, Excel, or images.</span>
            </li>
          </ul>
        </div>
      </Tabs>
    </div>
  );
}
