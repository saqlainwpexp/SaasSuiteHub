import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  History,
  BarChart, 
  Award 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sample texts organized by difficulty level
const sampleTexts = {
  easy: [
    "The quick brown fox jumps over the lazy dog. Typing is an essential skill in today's digital world. Practice makes perfect when it comes to typing speed and accuracy.",
    "Learning to type without looking at the keyboard is a valuable skill. Professional typists can often reach speeds of 60 to 80 words per minute.",
    "Proper finger positioning is key to typing efficiently. Your fingers should rest on the home row keys: A, S, D, F for your left hand and J, K, L, ; for your right hand."
  ],
  medium: [
    "According to research, the average typing speed is around 40 words per minute. However, professionals who use computers regularly can achieve 65 to 75 WPM. With dedicated practice, anyone can improve their typing speed significantly.",
    "The QWERTY keyboard layout we use today was designed in the 1870s for mechanical typewriters. It was specifically arranged to slow typists down and prevent jamming of the keys. Despite this origin, it remains the standard layout worldwide.",
    "Touch typing is the ability to type without looking at the keyboard. This skill allows you to maintain focus on the screen, resulting in higher productivity. The home row technique is the foundation of touch typing."
  ],
  hard: [
    "While QWERTY remains the standard keyboard layout globally, alternatives like Dvorak and Colemak claim to offer more efficient finger movement patterns. These layouts place the most frequently used letters on the home row, potentially reducing finger movement by up to 60%.",
    "The world record for typing speed is an astonishing 216 words per minute, achieved by Stella Pajunas in 1946 on an IBM electric typewriter. Modern typing competitions often have participants exceeding 150 WPM with exceptional accuracy.",
    "Ergonomic keyboard designs aim to reduce strain and prevent repetitive stress injuries. Split keyboards, vertical alignment, and mechanical switches with varying actuation forces are among the features that professionals consider when selecting a keyboard for extensive daily use."
  ]
};

export default function TypingSpeedTest() {
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const timerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  }, []);

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started]);

  const startTest = () => {
    setStarted(true);
    setCompleted(false);
    setInputText("");
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    setTimeLeft(60);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setCompleted(false);
    setInputText("");
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    setTimeLeft(60);
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  };

  const endTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setCompleted(true);
    
    // Calculate results
    const words = inputText.trim().split(/\s+/).length;
    const minutes = (60 - timeLeft) / 60;
    const calculatedWpm = Math.round(words / minutes);
    
    // Calculate accuracy
    let correctChars = 0;
    const minLength = Math.min(inputText.length, text.length);
    
    for (let i = 0; i < minLength; i++) {
      if (inputText[i] === text[i]) {
        correctChars++;
      }
    }
    
    const calculatedAccuracy = Math.round((correctChars / text.length) * 100);
    const calculatedErrors = inputText.length > 0 ? text.length - correctChars : 0;
    
    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setErrors(calculatedErrors);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    
    if (!started && value.length > 0) {
      startTest();
    }
    
    // Check if completed the text
    if (value === text) {
      endTest();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{wpm}</div>
              <div className="text-sm text-gray-500">WPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{errors}</div>
              <div className="text-sm text-gray-500">Errors</div>
            </div>
          </div>
          <div>
            <span className="text-xl font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50 mb-4 h-32 overflow-y-auto font-medium text-lg leading-relaxed">
          {text.split('').map((char, index) => {
            let className = '';
            if (inputText[index] === char) {
              className = 'text-primary';
            } else if (index < inputText.length) {
              className = 'text-red-500';
            } else {
              className = 'text-gray-600';
            }
            return <span key={index} className={className}>{char}</span>;
          })}
        </div>
        
        <Textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleTyping}
          className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-20"
          placeholder="Start typing when ready..."
          disabled={completed || (!started && inputText.length > 0)}
        />
        
        <div className="mt-4 flex justify-between">
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={startTest}
            disabled={started}
          >
            Start Test
          </Button>
          <Button
            variant="outline"
            onClick={resetTest}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Tips to improve your typing</h3>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Maintain proper posture and hand position</li>
          <li>Practice regularly, even just for 10-15 minutes</li>
          <li>Focus on accuracy first, then speed</li>
          <li>Learn the correct finger placement on home row keys</li>
          <li>Try not to look at the keyboard while typing</li>
        </ul>
      </div>
    </div>
  );
}
