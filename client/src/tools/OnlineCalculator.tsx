import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Percent, 
  Division, 
  X, 
  Minus, 
  Plus, 
  Equal,
  Square,
  SquareRoot,
  ChevronLeft,
  Calculator as CalculatorIcon,
  Settings,
  Copy
} from "lucide-react";

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  span?: number;
  variant?: "default" | "operator" | "function" | "clear" | "equals";
  icon?: React.ReactNode;
}

function CalculatorButton({
  value,
  onClick,
  span = 1,
  variant = "default",
  icon
}: CalculatorButtonProps) {
  const variantStyles = {
    default: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    operator: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    function: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    clear: "bg-red-100 hover:bg-red-200 text-red-700",
    equals: "bg-primary hover:bg-primary/90 text-white"
  };

  return (
    <button
      className={`rounded-md flex items-center justify-center font-medium text-lg py-3 
      ${variantStyles[variant]} ${span === 2 ? "col-span-2" : ""}`}
      onClick={() => onClick(value)}
    >
      {icon || value}
    </button>
  );
}

function CalculatorHistory({ history, onItemClick }: { 
  history: string[], 
  onItemClick: (item: string) => void 
}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CalculatorIcon className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>No calculation history yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 p-2">
      {history.map((item, index) => (
        <div
          key={index}
          className="p-2 hover:bg-gray-100 rounded cursor-pointer flex justify-between"
          onClick={() => onItemClick(item.split("=")[0])}
        >
          <div className="font-mono overflow-hidden text-ellipsis">
            {item}
          </div>
          <Button variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function OnlineCalculator() {
  const [display, setDisplay] = useState("0");
  const [currentOperation, setCurrentOperation] = useState("");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [calculatorType, setCalculatorType] = useState("standard");
  const [memory, setMemory] = useState(0);

  const clearDisplay = () => {
    setDisplay("0");
    setCurrentOperation("");
    setPreviousValue(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const inputPercent = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const toggleSign = () => {
    const value = parseFloat(display) * -1;
    setDisplay(String(value));
  };

  const backspace = () => {
    if (display.length === 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.substring(0, display.length - 1));
    }
  };

  const performOperation = (nextOperation?: string) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (currentOperation) {
      const result = calculate(previousValue, inputValue, currentOperation);
      setDisplay(String(result));
      setPreviousValue(result);
      
      // Add to history
      const calculation = `${previousValue} ${currentOperation} ${inputValue} = ${result}`;
      setHistory(prev => [calculation, ...prev]);
    }
    
    setWaitingForOperand(true);
    setCurrentOperation(nextOperation || "");
  };

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      case "^":
        return Math.pow(a, b);
      default:
        return b;
    }
  };
  
  const calculateSquareRoot = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
    
    // Add to history
    const calculation = `√(${display}) = ${value}`;
    setHistory(prev => [calculation, ...prev]);
  };
  
  const calculateSquare = () => {
    const value = Math.pow(parseFloat(display), 2);
    setDisplay(String(value));
    
    // Add to history
    const calculation = `(${display})² = ${value}`;
    setHistory(prev => [calculation, ...prev]);
  };
  
  const calculateReciprocal = () => {
    const value = 1 / parseFloat(display);
    setDisplay(String(value));
    
    // Add to history
    const calculation = `1/(${display}) = ${value}`;
    setHistory(prev => [calculation, ...prev]);
  };
  
  const memoryClear = () => {
    setMemory(0);
  };
  
  const memoryRecall = () => {
    setDisplay(String(memory));
  };
  
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };
  
  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };
  
  const useHistoryItem = (item: string) => {
    setDisplay(item);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Online Calculator</h2>
        <p className="text-gray-600">
          Perform basic and advanced calculations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="standard" value={calculatorType} onValueChange={setCalculatorType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard" className="flex gap-2 items-center">
                <Calculator className="h-4 w-4" />
                <span>Standard</span>
              </TabsTrigger>
              <TabsTrigger value="scientific" className="flex gap-2 items-center">
                <Settings className="h-4 w-4" />
                <span>Scientific</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 border rounded-lg mt-4">
              <div className="bg-white p-4 rounded-lg mb-4">
                <div className="font-mono text-right text-3xl h-10 mb-1 overflow-hidden text-ellipsis">
                  {display}
                </div>
                <div className="font-mono text-right text-gray-500 text-sm h-5">
                  {previousValue !== null ? `${previousValue} ${currentOperation}` : ""}
                </div>
              </div>
              
              <TabsContent value="standard" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 */}
                  <CalculatorButton value="C" onClick={clearDisplay} variant="clear" />
                  <CalculatorButton value="±" onClick={toggleSign} variant="function" />
                  <CalculatorButton value="%" onClick={inputPercent} variant="function" icon={<Percent className="h-4 w-4" />} />
                  <CalculatorButton value="÷" onClick={() => performOperation("÷")} variant="operator" icon={<Division className="h-4 w-4" />} />
                  
                  {/* Row 2 */}
                  <CalculatorButton value="7" onClick={inputDigit} />
                  <CalculatorButton value="8" onClick={inputDigit} />
                  <CalculatorButton value="9" onClick={inputDigit} />
                  <CalculatorButton value="×" onClick={() => performOperation("×")} variant="operator" icon={<X className="h-4 w-4" />} />
                  
                  {/* Row 3 */}
                  <CalculatorButton value="4" onClick={inputDigit} />
                  <CalculatorButton value="5" onClick={inputDigit} />
                  <CalculatorButton value="6" onClick={inputDigit} />
                  <CalculatorButton value="-" onClick={() => performOperation("-")} variant="operator" icon={<Minus className="h-4 w-4" />} />
                  
                  {/* Row 4 */}
                  <CalculatorButton value="1" onClick={inputDigit} />
                  <CalculatorButton value="2" onClick={inputDigit} />
                  <CalculatorButton value="3" onClick={inputDigit} />
                  <CalculatorButton value="+" onClick={() => performOperation("+")} variant="operator" icon={<Plus className="h-4 w-4" />} />
                  
                  {/* Row 5 */}
                  <CalculatorButton value="0" onClick={inputDigit} span={2} />
                  <CalculatorButton value="." onClick={inputDecimal} />
                  <CalculatorButton value="=" onClick={() => performOperation()} variant="equals" icon={<Equal className="h-4 w-4" />} />
                </div>
              </TabsContent>
              
              <TabsContent value="scientific" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 - Memory functions */}
                  <CalculatorButton value="MC" onClick={() => memoryClear()} variant="function" />
                  <CalculatorButton value="MR" onClick={() => memoryRecall()} variant="function" />
                  <CalculatorButton value="M+" onClick={() => memoryAdd()} variant="function" />
                  <CalculatorButton value="M-" onClick={() => memorySubtract()} variant="function" />
                  
                  {/* Row 2 */}
                  <CalculatorButton value="C" onClick={clearDisplay} variant="clear" />
                  <CalculatorButton value="⌫" onClick={backspace} variant="function" icon={<ChevronLeft className="h-4 w-4" />} />
                  <CalculatorButton value="^" onClick={() => performOperation("^")} variant="function" />
                  <CalculatorButton value="÷" onClick={() => performOperation("÷")} variant="operator" icon={<Division className="h-4 w-4" />} />
                  
                  {/* Row 3 */}
                  <CalculatorButton value="7" onClick={inputDigit} />
                  <CalculatorButton value="8" onClick={inputDigit} />
                  <CalculatorButton value="9" onClick={inputDigit} />
                  <CalculatorButton value="×" onClick={() => performOperation("×")} variant="operator" icon={<X className="h-4 w-4" />} />
                  
                  {/* Row 4 */}
                  <CalculatorButton value="4" onClick={inputDigit} />
                  <CalculatorButton value="5" onClick={inputDigit} />
                  <CalculatorButton value="6" onClick={inputDigit} />
                  <CalculatorButton value="-" onClick={() => performOperation("-")} variant="operator" icon={<Minus className="h-4 w-4" />} />
                  
                  {/* Row 5 */}
                  <CalculatorButton value="1" onClick={inputDigit} />
                  <CalculatorButton value="2" onClick={inputDigit} />
                  <CalculatorButton value="3" onClick={inputDigit} />
                  <CalculatorButton value="+" onClick={() => performOperation("+")} variant="operator" icon={<Plus className="h-4 w-4" />} />
                  
                  {/* Row 6 */}
                  <CalculatorButton value="±" onClick={toggleSign} variant="function" />
                  <CalculatorButton value="0" onClick={inputDigit} />
                  <CalculatorButton value="." onClick={inputDecimal} />
                  <CalculatorButton value="=" onClick={() => performOperation()} variant="equals" icon={<Equal className="h-4 w-4" />} />
                  
                  {/* Row 7 */}
                  <CalculatorButton value="x²" onClick={calculateSquare} variant="function" icon={<Square className="h-4 w-4" />} />
                  <CalculatorButton value="√" onClick={calculateSquareRoot} variant="function" icon={<SquareRoot className="h-4 w-4" />} />
                  <CalculatorButton value="1/x" onClick={calculateReciprocal} variant="function" />
                  <CalculatorButton value="%" onClick={inputPercent} variant="function" icon={<Percent className="h-4 w-4" />} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div>
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-gray-50 font-medium flex items-center">
              <CalculatorIcon className="h-4 w-4 mr-2" />
              Calculation History
            </div>
            <div className="h-[400px] overflow-y-auto">
              <CalculatorHistory history={history} onItemClick={useHistoryItem} />
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 rounded-lg border p-4">
            <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 text-sm gap-y-1">
              <div>Numbers: 0-9</div>
              <div>Clear: Delete or C</div>
              <div>Operators: +, -, *, /</div>
              <div>Equal: Enter or =</div>
              <div>Decimal: .</div>
              <div>Backspace: ⌫</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">About Online Calculator</h3>
        <p className="text-sm text-gray-600">
          This calculator supports both standard and scientific calculations.
          Use the standard mode for basic arithmetic or switch to scientific mode for more advanced functions.
          Your calculation history is saved for the current session and can be reused.
        </p>
      </div>
    </div>
  );
}