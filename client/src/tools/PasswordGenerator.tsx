import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  RefreshCw,
  Check,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  Save,
  Trash2
} from "lucide-react";

interface PasswordSettings {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

interface SavedPassword {
  password: string;
  website: string;
  username: string;
  createdAt: string;
}

export default function PasswordGenerator() {
  const [settings, setSettings] = useState<PasswordSettings>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savedPasswords, setSavedPasswords] = useState<SavedPassword[]>([]);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    generatePassword();
  }, []);
  
  useEffect(() => {
    calculateStrength();
  }, [password]);
  
  const generatePassword = () => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = settings;
    
    let charset = "";
    let newPassword = "";
    
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    // Ensure at least one character from each selected category
    if (charset.length === 0) {
      // Default to lowercase if nothing selected
      charset = "abcdefghijklmnopqrstuvwxyz";
      setSettings(prev => ({ ...prev, includeLowercase: true }));
    }
    
    // Generate random password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
  };
  
  const calculateStrength = () => {
    const { length, includeUppercase, includeLowercase, includeNumbers, includeSymbols } = settings;
    
    let strength = 0;
    
    // Adjust strength based on password length
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;
    if (length >= 20) strength += 1;
    
    // Adjust strength based on character types
    if (includeLowercase) strength += 1;
    if (includeUppercase) strength += 1;
    if (includeNumbers) strength += 1;
    if (includeSymbols) strength += 1;
    
    // Check for sequential characters
    const sequentialRegex = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
    if (sequentialRegex.test(password)) strength -= 1;
    
    // Check for repeated characters
    const repeatedRegex = /(.)\1{2,}/;
    if (repeatedRegex.test(password)) strength -= 1;
    
    // Normalize strength (0-100)
    const normalizedStrength = Math.max(0, Math.min(100, strength * 12.5));
    setStrength(normalizedStrength);
  };
  
  const handleLengthChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, length: value[0] }));
  };
  
  const toggleSetting = (setting: keyof PasswordSettings) => {
    setSettings(prev => {
      const newValue = !prev[setting];
      
      // Ensure at least one option is selected
      if (!newValue && 
          !Object.entries(prev)
            .filter(([key, _]) => key !== setting && key !== 'length')
            .some(([_, value]) => value)) {
        return prev;
      }
      
      return { ...prev, [setting]: newValue };
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const savePassword = () => {
    if (!password || !website) return;
    
    const newSavedPassword: SavedPassword = {
      password,
      website,
      username,
      createdAt: new Date().toLocaleDateString()
    };
    
    setSavedPasswords(prev => [newSavedPassword, ...prev]);
    setWebsite("");
    setUsername("");
  };
  
  const deletePassword = (index: number) => {
    setSavedPasswords(prev => prev.filter((_, i) => i !== index));
  };
  
  const getStrengthText = () => {
    if (strength < 25) return { text: "Weak", color: "text-red-500", icon: <ShieldAlert className="h-5 w-5 text-red-500" /> };
    if (strength < 50) return { text: "Fair", color: "text-orange-500", icon: <Shield className="h-5 w-5 text-orange-500" /> };
    if (strength < 75) return { text: "Good", color: "text-yellow-500", icon: <Shield className="h-5 w-5 text-yellow-500" /> };
    return { text: "Strong", color: "text-green-500", icon: <ShieldCheck className="h-5 w-5 text-green-500" /> };
  };
  
  const getProgressColor = () => {
    if (strength < 25) return "bg-red-500";
    if (strength < 50) return "bg-orange-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Secure Password Generator</h2>
        <p className="text-gray-600">
          Create strong, random passwords to keep your accounts safe
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border mb-6">
        <div className="mb-6">
          <Label htmlFor="password" className="mb-2 block">Generated Password</Label>
          <div className="relative">
            <Input
              id="password"
              value={password}
              readOnly
              type={showPassword ? "text" : "password"}
              className="pr-20 font-mono text-lg"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="mr-2">Password Strength:</span>
              {getStrengthText().icon}
              <span className={`font-medium ${getStrengthText().color}`}>{getStrengthText().text}</span>
            </div>
            <Button
              onClick={generatePassword}
              variant="outline"
              size="sm"
              className="text-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
          </div>
          <Progress value={strength} className={`h-2 ${getProgressColor()}`} />
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="length">Password Length: {settings.length}</Label>
            </div>
            <Slider
              id="length"
              min={8}
              max={32}
              step={1}
              value={[settings.length]}
              onValueChange={handleLengthChange}
              className="mb-6"
            />
          </div>
          
          <div className="space-y-3 mb-6">
            <h3 className="font-medium mb-2">Character Types</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={settings.includeUppercase}
                  onCheckedChange={() => toggleSetting('includeUppercase')}
                />
                <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
              </div>
              <span className="text-gray-500 text-sm">e.g. ABCDEFG</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={settings.includeLowercase}
                  onCheckedChange={() => toggleSetting('includeLowercase')}
                />
                <Label htmlFor="lowercase">Include Lowercase (a-z)</Label>
              </div>
              <span className="text-gray-500 text-sm">e.g. abcdefg</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={settings.includeNumbers}
                  onCheckedChange={() => toggleSetting('includeNumbers')}
                />
                <Label htmlFor="numbers">Include Numbers (0-9)</Label>
              </div>
              <span className="text-gray-500 text-sm">e.g. 1234567</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={settings.includeSymbols}
                  onCheckedChange={() => toggleSetting('includeSymbols')}
                />
                <Label htmlFor="symbols">Include Symbols</Label>
              </div>
              <span className="text-gray-500 text-sm">e.g. !@#$%^&*</span>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-medium mb-4">Save Password</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="website" className="mb-2 block">Website or App</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. example.com"
                />
              </div>
              <div>
                <Label htmlFor="username" className="mb-2 block">Username (optional)</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. user@example.com"
                />
              </div>
              <Button
                onClick={savePassword}
                disabled={!password || !website}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Password
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {savedPasswords.length > 0 && (
        <div className="bg-white p-6 rounded-lg border mb-6">
          <h3 className="font-medium mb-4">Saved Passwords</h3>
          <div className="space-y-3">
            {savedPasswords.map((saved, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{saved.website}</div>
                  {saved.username && (
                    <div className="text-sm text-gray-500">{saved.username}</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(saved.password);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePassword(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Passwords are stored locally in your browser and will be lost if you clear your browser data.
          </div>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">Password Security Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <CheckIcon className="mr-2 mt-0.5" />
            <span>Use a different password for each account</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="mr-2 mt-0.5" />
            <span>Create passwords that are at least 12 characters long</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="mr-2 mt-0.5" />
            <span>Include a mix of letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="mr-2 mt-0.5" />
            <span>Avoid using personal information in your passwords</span>
          </li>
          <li className="flex items-start">
            <CheckIcon className="mr-2 mt-0.5" />
            <span>Consider using a password manager to securely store your passwords</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={`h-4 w-4 text-primary ${className}`} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M5 13l4 4L19 7" 
      />
    </svg>
  );
}
