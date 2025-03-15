import { IconType } from "react-icons";
import {
  Keyboard,
  Gauge,
  SpellCheck,
  FileText,
  Coins,
  Ruler,
  Image,
  Search,
  Palette,
  KeyRound,
  Camera,
  FileType,
  MicVocal,
  Mic,
  Video,
  Share2,
  Calculator,
  Activity,
  QrCode,
  Receipt,
  ImageIcon,
  GitBranch,
  ListTodo,
  Crop,
  Lock,
  Headphones,
  Text,
  Map,
  Brain,
  CalendarClock,
  Upload,
  Scan,
  FileSpreadsheet,
  Newspaper,
  FileJson,
  Antenna,
  Code,
  Accessibility
} from "lucide-react";

export type Category = 
  | "All"
  | "Text & Writing"
  | "Conversion"
  | "Images & Media"
  | "Developer"
  | "Productivity"
  | "Utilities";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: Category[];
  popular?: boolean;
}

export const toolCategories: Category[] = [
  "All",
  "Text & Writing",
  "Conversion",
  "Images & Media",
  "Developer",
  "Productivity",
  "Utilities"
];

export const tools: Tool[] = [
  {
    id: "typing-speed-test",
    name: "Typing Speed Test",
    description: "Test and improve your typing speed and accuracy",
    icon: Keyboard,
    category: ["Productivity", "Utilities"],
    popular: true
  },
  {
    id: "internet-speed-test",
    name: "Internet Speed Test",
    description: "Check your download, upload speeds and ping",
    icon: Gauge,
    category: ["Utilities"]
  },
  {
    id: "grammar-checker",
    name: "Grammar Checker",
    description: "Fix grammar, spelling, and writing style issues",
    icon: SpellCheck,
    category: ["Text & Writing"]
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Merge, split, and convert PDF files",
    icon: FileText,
    category: ["Conversion", "Utilities"]
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    description: "Convert between currencies in real-time",
    icon: Coins,
    category: ["Conversion", "Utilities"]
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between various units of measurement",
    icon: Ruler,
    category: ["Conversion", "Utilities"]
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file sizes while preserving quality",
    icon: Image,
    category: ["Images & Media", "Utilities"]
  },
  {
    id: "seo-tools",
    name: "SEO Tools",
    description: "Keyword research and website SEO analysis",
    icon: Search,
    category: ["Productivity", "Utilities"],
    popular: true
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick colors from images or create color palettes",
    icon: Palette,
    category: ["Images & Media", "Developer"]
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords for your accounts",
    icon: KeyRound,
    category: ["Utilities"],
    popular: true
  },
  {
    id: "screenshot-tool",
    name: "Screenshot Tool",
    description: "Capture, edit, and annotate screenshots",
    icon: Camera,
    category: ["Images & Media", "Productivity"]
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and convert markdown to HTML",
    icon: FileType,
    category: ["Text & Writing", "Developer"]
  },
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Convert text to lifelike speech",
    icon: MicVocal,
    category: ["Text & Writing", "Conversion"]
  },
  {
    id: "voice-recorder",
    name: "Voice Recorder",
    description: "Record audio notes and convert to text",
    icon: Mic,
    category: ["Productivity", "Utilities"]
  },
  {
    id: "video-downloader",
    name: "Video Downloader",
    description: "Download videos from popular platforms",
    icon: Video,
    category: ["Images & Media", "Utilities"]
  },
  {
    id: "file-sharing",
    name: "File Sharing",
    description: "Securely share files with others via links",
    icon: Share2,
    category: ["Utilities", "Productivity"]
  },
  {
    id: "online-calculator",
    name: "Online Calculator",
    description: "Perform basic and advanced calculations",
    icon: Calculator,
    category: ["Utilities", "Productivity"]
  },
  {
    id: "website-monitor",
    name: "Website Monitor",
    description: "Monitor websites for uptime and performance",
    icon: Activity,
    category: ["Developer", "Utilities"]
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Create custom QR codes for various purposes",
    icon: QrCode,
    category: ["Utilities"],
    popular: true
  },
  {
    id: "invoice-generator",
    name: "Invoice Generator",
    description: "Create professional invoices for your clients",
    icon: Receipt,
    category: ["Productivity"]
  },
  {
    id: "image-editor",
    name: "Image Editor",
    description: "Basic editing tools for images",
    icon: ImageIcon,
    category: ["Images & Media"]
  },
  {
    id: "mind-mapping",
    name: "Mind Mapping Tool",
    description: "Create visual mind maps for your ideas",
    icon: GitBranch,
    category: ["Productivity"]
  },
  {
    id: "todo-list",
    name: "Todo List",
    description: "Manage your tasks and track progress",
    icon: ListTodo,
    category: ["Productivity"]
  },
  {
    id: "social-image-resizer",
    name: "Social Media Image Resizer",
    description: "Resize images for social media platforms",
    icon: Crop,
    category: ["Images & Media", "Productivity"]
  },
  {
    id: "text-encryption",
    name: "Text Encryption",
    description: "Encrypt and decrypt text messages securely",
    icon: Lock,
    category: ["Utilities", "Developer"]
  },
  {
    id: "audio-converter",
    name: "Audio Converter",
    description: "Convert audio files between different formats",
    icon: Headphones,
    category: ["Conversion", "Images & Media"]
  },
  {
    id: "font-identifier",
    name: "Font Identifier",
    description: "Identify fonts from images or websites",
    icon: Text,
    category: ["Images & Media", "Developer"]
  },
  {
    id: "ip-lookup",
    name: "IP Geolocation",
    description: "Find location information from IP addresses",
    icon: Map,
    category: ["Utilities", "Developer"]
  },
  {
    id: "ai-content-generator",
    name: "Content Generator",
    description: "Generate content ideas and outlines",
    icon: Brain,
    category: ["Text & Writing", "Productivity"]
  },
  {
    id: "screen-resolution-tester",
    name: "Screen Resolution Tester",
    description: "Test websites on different screen sizes",
    icon: Crop,
    category: ["Developer", "Utilities"]
  },
  {
    id: "timezone-converter",
    name: "Timezone Converter",
    description: "Convert times between different timezones",
    icon: CalendarClock,
    category: ["Utilities", "Productivity"]
  },
  {
    id: "age-calculator",
    name: "Age Calculator",
    description: "Calculate age or time between dates",
    icon: CalendarClock,
    category: ["Utilities"]
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word/Excel",
    description: "Convert PDFs to editable formats",
    icon: FileText,
    category: ["Conversion", "Productivity"]
  },
  {
    id: "qr-scanner",
    name: "QR Code Scanner",
    description: "Scan and decode QR codes with your camera",
    icon: Scan,
    category: ["Utilities"]
  },
  {
    id: "resume-builder",
    name: "Resume Builder",
    description: "Create professional resumes from templates",
    icon: FileSpreadsheet,
    category: ["Productivity"]
  },
  {
    id: "text-summarizer",
    name: "Text Summarizer",
    description: "Automatically summarize long texts",
    icon: Newspaper,
    category: ["Text & Writing", "Productivity"]
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format and beautify JSON data",
    icon: FileJson,
    category: ["Developer"]
  },
  {
    id: "api-tester",
    name: "API Testing Tool",
    description: "Test APIs right from your browser",
    icon: Antenna,
    category: ["Developer"]
  },
  {
    id: "code-snippet",
    name: "Code Snippet Repository",
    description: "Store and share code snippets",
    icon: Code,
    category: ["Developer"]
  },
  {
    id: "accessibility-checker",
    name: "Accessibility Checker",
    description: "Check websites for accessibility issues",
    icon: Accessibility,
    category: ["Developer", "Utilities"]
  }
];
