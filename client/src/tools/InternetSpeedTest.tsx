import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wifi, Upload, DownloadCloud } from "lucide-react";

export default function InternetSpeedTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const startTest = async () => {
    setStatus('testing');
    setProgress(0);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    
    // Measure ping first
    const pingStart = performance.now();
    try {
      await fetch('https://www.google.com', { mode: 'no-cors' });
      const pingEnd = performance.now();
      setPing(Math.round(pingEnd - pingStart));
      setProgress(10);
    } catch (e) {
      setPing(999);
    }
    
    // Download speed test
    await testDownloadSpeed();
    setProgress(60);
    
    // Upload speed test
    await testUploadSpeed();
    setProgress(100);
    
    setStatus('complete');
  };
  
  const testDownloadSpeed = async () => {
    // Use a test file from a CDN
    const fileUrl = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
    const iterations = 5;
    let totalSpeed = 0;
    
    abortControllerRef.current = new AbortController();
    
    try {
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        const response = await fetch(`${fileUrl}?cachebust=${Date.now()}`, {
          signal: abortControllerRef.current.signal
        });
        const blob = await response.blob();
        const endTime = performance.now();
        
        const fileSizeInBits = blob.size * 8;
        const speedMbps = (fileSizeInBits / (endTime - startTime)) / 1000;
        totalSpeed += speedMbps;
        
        setProgress(prev => prev + 10);
      }
      
      setDownloadSpeed(totalSpeed / iterations);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        console.log('Download test aborted');
      } else {
        console.error('Download test error:', e);
      }
    }
  };
  
  const testUploadSpeed = async () => {
    // Upload test is simulated
    const iterations = 3;
    let totalSpeed = 0;
    
    abortControllerRef.current = new AbortController();
    
    try {
      for (let i = 0; i < iterations; i++) {
        // Create a large blob (1MB)
        const blob = new Blob([new ArrayBuffer(1024 * 1024)]);
        const startTime = performance.now();
        
        // Simulate upload by posting to an echo API
        const formData = new FormData();
        formData.append('file', blob);
        
        await fetch('https://httpbin.org/post', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal
        });
        
        const endTime = performance.now();
        const fileSizeInBits = blob.size * 8;
        const speedMbps = (fileSizeInBits / (endTime - startTime)) / 1000;
        totalSpeed += speedMbps;
        
        setProgress(prev => prev + 10);
      }
      
      setUploadSpeed(totalSpeed / iterations);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        console.log('Upload test aborted');
      } else {
        console.error('Upload test error:', e);
      }
    }
  };
  
  const cancelTest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setProgress(0);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Test Your Internet Speed</h2>
        <p className="text-gray-600">
          Measure your connection's download speed, upload speed, and ping
        </p>
      </div>
      
      <div className="p-6 bg-gray-50 rounded-lg mb-8">
        <div className="flex justify-between gap-8 mb-6">
          <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-2">
              <DownloadCloud className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Download</p>
            <h3 className="text-2xl font-bold">
              {downloadSpeed !== null ? downloadSpeed.toFixed(2) : '-'} <span className="text-lg font-normal">Mbps</span>
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-2">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Upload</p>
            <h3 className="text-2xl font-bold">
              {uploadSpeed !== null ? uploadSpeed.toFixed(2) : '-'} <span className="text-lg font-normal">Mbps</span>
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
            <div className="p-3 rounded-full bg-primary/10 mb-2">
              <Wifi className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Ping</p>
            <h3 className="text-2xl font-bold">
              {ping !== null ? ping : '-'} <span className="text-lg font-normal">ms</span>
            </h3>
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {status === 'idle' && 'Ready to test'}
            {status === 'testing' && 'Testing in progress...'}
            {status === 'complete' && 'Test complete!'}
          </p>
        </div>
        
        <div className="flex justify-center">
          {status === 'idle' || status === 'complete' ? (
            <Button 
              className="bg-primary text-white hover:bg-primary/90 px-6 py-2"
              onClick={startTest}
            >
              Start Speed Test
            </Button>
          ) : (
            <Button 
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50 px-6 py-2"
              onClick={cancelTest}
            >
              Cancel Test
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">What do these results mean?</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li><span className="font-medium">Download Speed:</span> How quickly your connection can retrieve data from the internet (for streaming, browsing, etc.)</li>
          <li><span className="font-medium">Upload Speed:</span> How quickly your connection can send data to the internet (for video calls, sharing files, etc.)</li>
          <li><span className="font-medium">Ping:</span> The response time of your connection in milliseconds. Lower ping means faster response.</li>
        </ul>
      </div>
    </div>
  );
}
