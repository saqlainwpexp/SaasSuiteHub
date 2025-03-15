import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Download,
  Trash2,
  FileText
} from "lucide-react";

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<{ id: number; blob: Blob; duration: number; transcription?: string }[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [transcribeLoading, setTranscribeLoading] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  
  useEffect(() => {
    return () => {
      // Clean up
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      // Stop any playing audio
      Object.values(audioRefs.current).forEach(audio => {
        if (!audio.paused) {
          audio.pause();
        }
      });
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const newRecording = {
          id: Date.now(),
          blob: audioBlob,
          duration: recordingTime,
        };
        
        setRecordings(prevRecordings => [...prevRecordings, newRecording]);
        setRecordingTime(0);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      const startTime = Date.now();
      timerIntervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsedSeconds);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Failed to access microphone. Please ensure you have granted the necessary permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };
  
  const togglePlayback = (id: number) => {
    if (currentlyPlaying === id) {
      // Pause the current audio
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing audio
      if (currentlyPlaying !== null && audioRefs.current[currentlyPlaying]) {
        audioRefs.current[currentlyPlaying].pause();
      }
      
      // Start playing the new audio
      const recording = recordings.find(rec => rec.id === id);
      if (recording) {
        // Create audio element if it doesn't exist
        if (!audioRefs.current[id]) {
          const audioUrl = URL.createObjectURL(recording.blob);
          const audio = new Audio(audioUrl);
          audio.onended = () => setCurrentlyPlaying(null);
          audioRefs.current[id] = audio;
        }
        
        // Start playing
        audioRefs.current[id].play();
        setCurrentlyPlaying(id);
      }
    }
  };
  
  const deleteRecording = (id: number) => {
    if (currentlyPlaying === id && audioRefs.current[id]) {
      audioRefs.current[id].pause();
      setCurrentlyPlaying(null);
    }
    
    if (audioRefs.current[id]) {
      delete audioRefs.current[id];
    }
    
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  };
  
  const downloadRecording = (id: number) => {
    const recording = recordings.find(rec => rec.id === id);
    if (recording) {
      const url = URL.createObjectURL(recording.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${id}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  const transcribeRecording = (id: number) => {
    // In a real implementation, this would call a speech-to-text API
    setTranscribeLoading(id);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setRecordings(prevRecordings => 
        prevRecordings.map(rec => {
          if (rec.id === id) {
            return {
              ...rec,
              transcription: "This is a simulated transcription. In a real application, this would be the text from a speech-to-text service."
            };
          }
          return rec;
        })
      );
      setTranscribeLoading(null);
    }, 2000);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Voice Recorder</h2>
        <p className="text-gray-600">
          Record audio notes and convert to text
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record Audio</CardTitle>
          <CardDescription>
            Record voice notes and convert them to text
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isRecording ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center relative animate-pulse">
                <Mic className="h-16 w-16 text-primary" />
                <span className="absolute top-1 right-1 bg-red-500 h-4 w-4 rounded-full"></span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-mono">{formatTime(recordingTime)}</p>
                <p className="text-sm text-gray-500">Recording...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-32 h-32 rounded-full border-4 border-gray-200 hover:border-primary transition-colors flex items-center justify-center cursor-pointer"
                onClick={startRecording}
              >
                <Mic className="h-16 w-16 text-gray-400 hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-gray-500">Click to start recording</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {isRecording ? (
            <Button onClick={stopRecording} variant="destructive">
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          ) : (
            <Button onClick={startRecording} disabled={recordings.length >= 10}>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {recordings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Your Recordings</h3>
          <div className="space-y-3">
            {recordings.map((recording) => (
              <Card key={recording.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => togglePlayback(recording.id)}
                    >
                      {currentlyPlaying === recording.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">Recording {new Date(recording.id).toLocaleTimeString()}</p>
                        <span className="text-xs text-gray-500">{formatTime(recording.duration)}</span>
                      </div>
                      <Progress 
                        value={currentlyPlaying === recording.id ? 50 : 0} 
                        className="h-1.5"
                      />
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => downloadRecording(recording.id)}
                        title="Download recording"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRecording(recording.id)}
                        title="Delete recording"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {!recording.transcription && (
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => transcribeRecording(recording.id)}
                        disabled={transcribeLoading === recording.id}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {transcribeLoading === recording.id ? 'Transcribing...' : 'Transcribe to Text'}
                      </Button>
                    </div>
                  )}
                  
                  {recording.transcription && (
                    <div className="mt-3">
                      <Textarea
                        value={recording.transcription}
                        readOnly
                        className="h-20 bg-gray-50"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Voice Recorder</h3>
        <p className="text-sm text-gray-600">
          This tool allows you to record voice notes directly in your browser and optionally transcribe them to text.
          Perfect for capturing ideas on the go, creating voice memos, or dictating content without typing.
          The recordings are stored locally and can be downloaded as audio files.
        </p>
      </div>
    </div>
  );
}