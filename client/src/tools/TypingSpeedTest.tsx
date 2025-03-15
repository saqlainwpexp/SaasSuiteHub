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

// Result type definition
type TestResult = {
  id: string;
  date: Date;
  wpm: number;
  cpm: number; 
  accuracy: number;
  errors: number;
  difficulty: string;
  duration: number;
};

// Leaderboard entry type
type LeaderboardEntry = {
  name: string;
  wpm: number;
  accuracy: number;
  difficulty: string;
};

export default function TypingSpeedTest() {
  // Core state
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeDuration, setTimeDuration] = useState(60); // Default 60 seconds
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Statistics
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Difficulty and mode settings
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentView, setCurrentView] = useState<"test" | "results" | "history" | "leaderboard">("test");
  
  // Refs and history
  const timerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  
  // Mock leaderboard data
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { name: "TypeMaster99", wpm: 120, accuracy: 98, difficulty: "hard" },
    { name: "SpeedDemon", wpm: 115, accuracy: 96, difficulty: "hard" },
    { name: "KeyboardWarrior", wpm: 105, accuracy: 97, difficulty: "medium" },
    { name: "SwiftFingers", wpm: 98, accuracy: 95, difficulty: "medium" },
    { name: "FastTyper23", wpm: 92, accuracy: 94, difficulty: "medium" },
    { name: "WordSmith", wpm: 88, accuracy: 98, difficulty: "easy" },
    { name: "QuickKeys", wpm: 85, accuracy: 93, difficulty: "easy" },
    { name: "RapidTyper", wpm: 82, accuracy: 91, difficulty: "easy" },
    { name: "TypeNinja", wpm: 78, accuracy: 96, difficulty: "easy" },
    { name: "KeyMaster", wpm: 75, accuracy: 95, difficulty: "easy" },
  ]);

  // Initialize with random text based on difficulty
  useEffect(() => {
    const texts = sampleTexts[difficulty];
    setText(texts[Math.floor(Math.random() * texts.length)]);
  }, [difficulty]);

  // Timer effect
  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endTest();
            return 0;
          }
          // Update progress percentage
          setProgress(Math.round(((timeDuration - prev + 1) / timeDuration) * 100));
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, timeDuration]);

  // Start the test
  const startTest = () => {
    setStarted(true);
    setCompleted(false);
    setInputText("");
    setWpm(0);
    setCpm(0);
    setAccuracy(0);
    setErrors(0);
    setProgress(0);
    setTimeLeft(timeDuration);
    setCurrentView("test");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Reset the test
  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setCompleted(false);
    setInputText("");
    setWpm(0);
    setCpm(0);
    setAccuracy(0);
    setErrors(0);
    setProgress(0);
    setTimeLeft(timeDuration);
    const texts = sampleTexts[difficulty];
    setText(texts[Math.floor(Math.random() * texts.length)]);
    setCurrentView("test");
  };

  // End the test and calculate results
  const endTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStarted(false);
    setCompleted(true);
    setProgress(100);
    
    // Calculate results
    const words = inputText.trim().split(/\s+/).length;
    const minutes = (timeDuration - timeLeft) / 60;
    const calculatedWpm = Math.round(words / minutes) || 0;
    
    // Calculate characters per minute
    const chars = inputText.length;
    const calculatedCpm = Math.round(chars / minutes) || 0;
    
    // Calculate accuracy
    let correctChars = 0;
    const minLength = Math.min(inputText.length, text.length);
    
    for (let i = 0; i < minLength; i++) {
      if (inputText[i] === text[i]) {
        correctChars++;
      }
    }
    
    const calculatedAccuracy = Math.round((correctChars / (inputText.length || 1)) * 100);
    const calculatedErrors = inputText.length > 0 ? inputText.length - correctChars : 0;
    
    // Update state with calculated values
    setWpm(calculatedWpm);
    setCpm(calculatedCpm);
    setAccuracy(calculatedAccuracy);
    setErrors(calculatedErrors);
    
    // Add to history
    const newResult: TestResult = {
      id: Date.now().toString(),
      date: new Date(),
      wpm: calculatedWpm,
      cpm: calculatedCpm,
      accuracy: calculatedAccuracy,
      errors: calculatedErrors,
      difficulty,
      duration: timeDuration - timeLeft,
    };
    
    setTestHistory(prev => [newResult, ...prev.slice(0, 9)]); // Keep only the last 10 results
    setCurrentView("results");
  };

  // Handle typing input
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

  // Change difficulty level
  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    if (started) return; // Don't change during a test
    
    setDifficulty(newDifficulty);
    // Reset the test with new text from the selected difficulty
    resetTest();
  };

  // Change time duration
  const changeTimeDuration = (seconds: number) => {
    if (started) return; // Don't change during a test
    
    setTimeDuration(seconds);
    setTimeLeft(seconds);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format date for history
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="test" value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="test" disabled={started}>Test</TabsTrigger>
                <TabsTrigger value="results" disabled={started}>Results</TabsTrigger>
                <TabsTrigger value="history" disabled={started}>History</TabsTrigger>
                <TabsTrigger value="leaderboard" disabled={started}>Leaderboard</TabsTrigger>
              </TabsList>
              
              <div className="flex space-x-4 items-center">
                {(currentView === "test" && !started) && (
                  <>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={difficulty === "easy" ? "default" : "outline"} 
                        onClick={() => changeDifficulty("easy")}
                        className={difficulty === "easy" ? "bg-primary text-white" : ""}
                      >
                        Easy
                      </Button>
                      <Button 
                        size="sm" 
                        variant={difficulty === "medium" ? "default" : "outline"} 
                        onClick={() => changeDifficulty("medium")}
                        className={difficulty === "medium" ? "bg-primary text-white" : ""}
                      >
                        Medium
                      </Button>
                      <Button 
                        size="sm" 
                        variant={difficulty === "hard" ? "default" : "outline"} 
                        onClick={() => changeDifficulty("hard")}
                        className={difficulty === "hard" ? "bg-primary text-white" : ""}
                      >
                        Hard
                      </Button>
                    </div>
                    
                    <div className="border-l h-8 mx-2" />
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant={timeDuration === 30 ? "default" : "outline"} 
                        onClick={() => changeTimeDuration(30)}
                        className={timeDuration === 30 ? "bg-primary text-white" : ""}
                      >
                        30s
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeDuration === 60 ? "default" : "outline"} 
                        onClick={() => changeTimeDuration(60)}
                        className={timeDuration === 60 ? "bg-primary text-white" : ""}
                      >
                        1m
                      </Button>
                      <Button 
                        size="sm" 
                        variant={timeDuration === 120 ? "default" : "outline"} 
                        onClick={() => changeTimeDuration(120)}
                        className={timeDuration === 120 ? "bg-primary text-white" : ""}
                      >
                        2m
                      </Button>
                    </div>
                  </>
                )}
                
                {currentView === "test" && started && (
                  <span className="text-xl font-mono flex items-center">
                    <Clock className="h-5 w-5 mr-1 text-primary" />
                    {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </div>

            {/* TEST CONTENT */}
            <TabsContent value="test" className="space-y-4 mt-0">
              {started && (
                <div className="w-full mb-2">
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{wpm}</div>
                        <div className="text-sm text-gray-500">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{cpm}</div>
                        <div className="text-sm text-gray-500">CPM</div>
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
                </CardContent>
              </Card>
              
              <div className="mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Tips to improve your typing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Maintain proper posture and hand position</li>
                      <li>Practice regularly, even just for 10-15 minutes</li>
                      <li>Focus on accuracy first, then speed</li>
                      <li>Learn the correct finger placement on home row keys</li>
                      <li>Try not to look at the keyboard while typing</li>
                      <li>Use all ten fingers and practice proper hand positioning</li>
                      <li>Take breaks to prevent fatigue and strain</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* RESULTS CONTENT */}
            <TabsContent value="results" className="mt-0">
              {testHistory.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-primary" />
                      Your Latest Result
                    </CardTitle>
                    <CardDescription>
                      Test completed on {formatDate(testHistory[0].date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">{testHistory[0].wpm}</div>
                        <div className="text-sm text-gray-500">Words Per Minute</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">{testHistory[0].cpm}</div>
                        <div className="text-sm text-gray-500">Characters Per Minute</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">{testHistory[0].accuracy}%</div>
                        <div className="text-sm text-gray-500">Accuracy</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-3xl font-bold text-primary">{testHistory[0].errors}</div>
                        <div className="text-sm text-gray-500">Errors</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Difficulty:</span>
                        <Badge className={cn("capitalize", {
                          "bg-green-100 text-green-800": testHistory[0].difficulty === "easy",
                          "bg-yellow-100 text-yellow-800": testHistory[0].difficulty === "medium",
                          "bg-red-100 text-red-800": testHistory[0].difficulty === "hard",
                        })}>
                          {testHistory[0].difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Test Duration:</span>
                        <span>{testHistory[0].duration} seconds</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentView("test")}
                      className="flex items-center"
                    >
                      Try again
                    </Button>
                    <Button 
                      onClick={() => setCurrentView("history")}
                      className="flex items-center bg-primary text-white"
                    >
                      View all results <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            {/* HISTORY CONTENT */}
            <TabsContent value="history" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2 text-primary" />
                    Your Test History
                  </CardTitle>
                  <CardDescription>
                    Your last {testHistory.length} test results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {testHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">No history yet</div>
                      <p className="text-sm text-gray-500">Complete a typing test to see your results here</p>
                      <Button 
                        className="mt-4 bg-primary text-white" 
                        onClick={() => setCurrentView("test")}
                      >
                        Take a test
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {testHistory.map(result => (
                        <div key={result.id} className="border rounded-lg p-3 hover:bg-gray-50">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">{formatDate(result.date)}</div>
                            <Badge className={cn("capitalize", {
                              "bg-green-100 text-green-800": result.difficulty === "easy",
                              "bg-yellow-100 text-yellow-800": result.difficulty === "medium",
                              "bg-red-100 text-red-800": result.difficulty === "hard",
                            })}>
                              {result.difficulty}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-primary">{result.wpm}</div>
                              <div className="text-xs text-gray-500">WPM</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-primary">{result.cpm}</div>
                              <div className="text-xs text-gray-500">CPM</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-primary">{result.accuracy}%</div>
                              <div className="text-xs text-gray-500">Accuracy</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-primary">{result.errors}</div>
                              <div className="text-xs text-gray-500">Errors</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* LEADERBOARD CONTENT */}
            <TabsContent value="leaderboard" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Global Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how you rank against other typists
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={entry.name} 
                        className={cn("border rounded-lg p-3 flex items-center", {
                          "bg-yellow-50 border-yellow-200": index === 0,
                          "bg-gray-50 border-gray-200": index === 1,
                          "bg-amber-50 border-amber-200": index === 2,
                        })}
                      >
                        <div className="mr-4 font-bold w-8 text-center">
                          {index + 1}.
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-xs text-gray-500">
                            Difficulty: <span className="capitalize">{entry.difficulty}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-right">
                          <div>
                            <div className="text-lg font-bold text-primary">{entry.wpm}</div>
                            <div className="text-xs text-gray-500">WPM</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-primary">{entry.accuracy}%</div>
                            <div className="text-xs text-gray-500">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
