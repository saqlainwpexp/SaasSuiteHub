import { Link } from "wouter";
import { Tool } from "@/lib/tools";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="tool-card bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <tool.icon className="text-primary text-xl" />
          </div>
          {tool.popular && (
            <Badge variant="popular">Popular</Badge>
          )}
        </div>
        <h3 className="mt-4 text-lg font-medium text-neutral">{tool.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
        <div className="mt-4">
          <Link href={`/tool/${tool.id}`}>
            <a className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center">
              Try tool <span className="ml-1">→</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
