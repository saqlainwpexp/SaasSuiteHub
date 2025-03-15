import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Code, 
  Download, 
  Copy,
  Check
} from "lucide-react";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(
    "# Hello Markdown\n\nThis is a **bold text** and this is an *italic text*.\n\n## Lists\n\n- Item 1\n- Item 2\n- Item 3\n\n## Code\n\n```javascript\nconst greeting = 'Hello World!';\nconsole.log(greeting);\n```\n\n## Link\n\n[Visit our website](https://example.com)\n\n![Image Alt Text](https://via.placeholder.com/150)"
  );
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState("write");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // In a real implementation, we would use a proper Markdown library
    // This is a simple placeholder implementation
    const convertMarkdownToHtml = (markdown: string): string => {
      let html = markdown;
      
      // Headers
      html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
      html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
      html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
      
      // Bold and Italic
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Lists
      html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
      html = html.replace(/(<li>.*?<\/li>\n)+/g, '<ul>$&</ul>');
      
      // Code blocks
      html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
      
      // Links
      html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
      
      // Images
      html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');
      
      // Line breaks
      html = html.replace(/\n/g, '<br />');
      
      return html;
    };
    
    setHtml(convertMarkdownToHtml(markdown));
  }, [markdown]);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadHtml = () => {
    const blob = new Blob([`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Markdown to HTML</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        img { max-width: 100%; height: auto; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        code { font-family: Consolas, Monaco, 'Andale Mono', monospace; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    ${html}
</body>
</html>
`], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Markdown Editor</h2>
        <p className="text-gray-600">
          Write in Markdown and convert to HTML
        </p>
      </div>
      
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="write" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>Write</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex gap-2 items-center">
            <Code className="h-4 w-4" />
            <span>Preview</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="write" className="pt-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadMarkdown}
              >
                <Download className="h-4 w-4 mr-1" />
                Download .md
              </Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="font-mono h-[50vh] resize-none"
              placeholder="Write your markdown here..."
            />
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="pt-4">
          <div className="bg-white rounded-lg border">
            <div className="flex justify-between p-4 border-b">
              <h3 className="font-medium">HTML Preview</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyHtml}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy HTML
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadHtml}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download .html
                </Button>
              </div>
            </div>
            <div className="p-4 h-[50vh] overflow-auto">
              <div 
                dangerouslySetInnerHTML={{ __html: html }} 
                className="prose max-w-none"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 bg-gray-50 rounded-lg border p-4">
        <h3 className="font-medium mb-2">Markdown Cheat Sheet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><code># Heading 1</code></p>
            <p><code>## Heading 2</code></p>
            <p><code>**Bold Text**</code></p>
            <p><code>*Italic Text*</code></p>
            <p><code>[Link Text](url)</code></p>
          </div>
          <div>
            <p><code>- List Item</code></p>
            <p><code>1. Numbered Item</code></p>
            <p><code>![Alt Text](image-url)</code></p>
            <p><code>```code block```</code></p>
            <p><code>> Blockquote</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}