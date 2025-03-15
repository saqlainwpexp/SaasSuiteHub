import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  Download, 
  MicVocal,
  Settings
} from "lucide-react";

type Voice = {
  id: string;
  name: string;
  language: string;
  gender: "male" | "female";
};

const voices: Voice[] = [
  { id: "en-us-1", name: "Matthew", language: "English (US)", gender: "male" },
  { id: "en-us-2", name: "Joanna", language: "English (US)", gender: "female" },
  { id: "en-gb-1", name: "Brian", language: "English (UK)", gender: "male" },
  { id: "en-gb-2", name: "Amy", language: "English (UK)", gender: "female" },
  { id: "fr-fr-1", name: "Sophie", language: "French", gender: "female" },
  { id: "de-de-1", name: "Hans", language: "German", gender: "male" },
  { id: "es-es-1", name: "Isabella", language: "Spanish", gender: "female" },
  { id: "it-it-1", name: "Giorgio", language: "Italian", gender: "male" },
  { id: "ja-jp-1", name: "Takumi", language: "Japanese", gender: "male" },
  { id: "ko-kr-1", name: "Seoyeon", language: "Korean", gender: "female" },
];

export default function TextToSpeech() {
  const [text, setText] = useState("Welcome to the text to speech converter. This tool transforms your written text into natural-sounding speech. Try it by typing something and pressing the play button.");
  const [voiceId, setVoiceId] = useState("en-us-1");
  const [speed, setSpeed] = useState([1.0]);
  const [pitch, setPitch] = useState([1.0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePlay = () => {
    // In a real implementation, this would call a TTS API
    // For this demo, we'll use the browser's built-in speech synthesis API
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      const availableVoices = window.speechSynthesis.getVoices();
      
      // Try to map our custom voices to browser voices (a very naive approach)
      const selectedVoice = voices.find(v => v.id === voiceId);
      if (selectedVoice) {
        const browserVoice = availableVoices.find(v => 
          v.lang.includes(selectedVoice.language.split(' ')[0].toLowerCase())
        );
        if (browserVoice) utterance.voice = browserVoice;
      }
      
      utterance.rate = speed[0];
      utterance.pitch = pitch[0];
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download an audio file
    // For this demo, we'll just show an alert
    alert("This is a demo. In a real application, this would download an audio file of the synthesized speech.");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Text to Speech</h2>
        <p className="text-gray-600">
          Convert text to natural-sounding speech
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border p-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="min-h-[200px] mb-4"
            />
            
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2">
                <Button
                  onClick={handlePlay}
                  className="min-w-[100px]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Audio
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-500"
              >
                <Settings className="mr-1 h-4 w-4" />
                {showAdvanced ? "Hide Advanced" : "Advanced Settings"}
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4 flex items-center">
              <MicVocal className="mr-2 h-4 w-4" />
              Voice Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="voice-select">Voice</Label>
                <Select
                  value={voiceId}
                  onValueChange={setVoiceId}
                >
                  <SelectTrigger id="voice-select">
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name} - {voice.language} ({voice.gender})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {showAdvanced && (
                <>
                  <div>
                    <Label>Speed: {speed[0].toFixed(1)}x</Label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="my-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Pitch: {pitch[0].toFixed(1)}</Label>
                    <Slider
                      value={pitch}
                      onValueChange={setPitch}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="my-2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 rounded-lg border p-4">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1 pl-4 list-disc">
              <li>Use punctuation for better speech synthesis</li>
              <li>Adjust speed to make speech more natural</li>
              <li>Choose a voice that matches your content</li>
              <li>For acronyms, add periods between letters</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Text to Speech</h3>
        <p className="text-sm text-gray-600">
          This tool converts written text into natural-sounding speech using advanced text-to-speech technology.
          Perfect for creating audio content, accessibility features, or learning proper pronunciation.
          The text-to-speech engine supports multiple languages and voice options.
        </p>
      </div>
    </div>
  );
}