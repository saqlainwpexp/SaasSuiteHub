import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface GrammarError {
  index: number;
  length: number;
  message: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style';
  suggestions: string[];
}

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [checking, setChecking] = useState(false);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [checkedText, setCheckedText] = useState("");
  const [selectedError, setSelectedError] = useState<GrammarError | null>(null);
  
  const checkGrammar = async () => {
    if (!text.trim()) return;
    
    setChecking(true);
    setErrors([]);
    setSelectedError(null);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated grammar checking results
      // In a real implementation, this would come from a grammar checking API
      const sampleErrors: GrammarError[] = [
        {
          index: text.toLowerCase().indexOf("i am"),
          length: 4,
          message: "Consider using a contraction for more natural flow.",
          type: 'style',
          suggestions: ["I'm"]
        },
        {
          index: text.toLowerCase().indexOf("their"),
          length: 5,
          message: "Check if you meant 'there' or 'they're' instead.",
          type: 'grammar',
          suggestions: ["there", "they're"]
        },
        {
          index: text.toLowerCase().indexOf("alot"),
          length: 4,
          message: "'Alot' should be 'a lot' (two separate words).",
          type: 'spelling',
          suggestions: ["a lot"]
        }
      ].filter(error => error.index !== -1);
      
      setErrors(sampleErrors);
      setCheckedText(text);
    } catch (error) {
      console.error("Error checking grammar:", error);
    } finally {
      setChecking(false);
    }
  };
  
  const applyCorrection = (suggestion: string) => {
    if (!selectedError) return;
    
    const before = checkedText.substring(0, selectedError.index);
    const after = checkedText.substring(selectedError.index + selectedError.length);
    const newText = before + suggestion + after;
    
    setText(newText);
    setCheckedText(newText);
    
    // Remove the fixed error from the list
    setErrors(errors.filter(e => e !== selectedError));
    setSelectedError(null);
  };
  
  const renderHighlightedText = () => {
    if (!checkedText || errors.length === 0) return checkedText;
    
    let result = [];
    let lastIndex = 0;
    
    // Sort errors by index to process them in order
    const sortedErrors = [...errors].sort((a, b) => a.index - b.index);
    
    sortedErrors.forEach((error, i) => {
      // Add text before the error
      if (error.index > lastIndex) {
        result.push(checkedText.substring(lastIndex, error.index));
      }
      
      // Add the error text with highlighting
      const errorText = checkedText.substring(error.index, error.index + error.length);
      result.push(
        <span 
          key={i} 
          className={`cursor-pointer underline ${
            error === selectedError 
              ? 'bg-yellow-200' 
              : error.type === 'grammar' 
                ? 'decoration-red-500' 
                : error.type === 'spelling' 
                  ? 'decoration-blue-500' 
                  : 'decoration-yellow-500'
          }`}
          onClick={() => setSelectedError(error)}
        >
          {errorText}
        </span>
      );
      
      lastIndex = error.index + error.length;
    });
    
    // Add remaining text after the last error
    if (lastIndex < checkedText.length) {
      result.push(checkedText.substring(lastIndex));
    }
    
    return result;
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-medium">Check your text for grammar and spelling issues</h2>
          <div className="text-sm text-gray-500">
            {errors.length > 0 ? (
              <span>{errors.length} issues found</span>
            ) : checkedText ? (
              <span className="text-primary flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                No issues found
              </span>
            ) : null}
          </div>
        </div>
        
        <div className="mb-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here to check for grammar and spelling issues..."
            className="min-h-[200px] p-4"
          />
        </div>
        
        <div className="flex justify-between">
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={checkGrammar}
            disabled={checking || !text.trim()}
          >
            {checking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Check Grammar'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setText("");
              setCheckedText("");
              setErrors([]);
              setSelectedError(null);
            }}
            disabled={checking || !text.trim()}
          >
            Clear Text
          </Button>
        </div>
      </div>
      
      {checkedText && (
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-medium mb-3">Results</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4 min-h-[100px]">
            {renderHighlightedText()}
          </div>
          
          {selectedError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{selectedError.message}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium text-yellow-800 mb-1">Suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedError.suggestions.map((suggestion, i) => (
                        <Button
                          key={i}
                          size="sm"
                          variant="secondary"
                          onClick={() => applyCorrection(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <h3 className="font-medium text-gray-700 mb-2">How to use</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Enter or paste your text in the editor</li>
          <li>Click "Check Grammar" to analyze your text</li>
          <li>Click on any highlighted errors to see suggestions</li>
          <li>Select a suggestion to automatically correct the error</li>
        </ul>
      </div>
    </div>
  );
}
