import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Rss } from "lucide-react";

export interface Blogger {
  id: string;
  name: string;
  url: string;
  feed: string;
  background: string;
  focus: string;
  tags: string[];
  style: string;
  freq: string;
  lang: string;
}

interface BloggerCardProps {
  blogger: Blogger;
}

export function BloggerCard({ blogger }: BloggerCardProps) {
  return (
    <Card className="neo-card h-full flex flex-col rounded-none overflow-hidden">
      <CardHeader className="border-b-2 border-black dark:border-white bg-secondary/20 pb-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-xl leading-tight truncate-2-lines h-[3.5rem] flex items-center">
            {blogger.name}
          </CardTitle>
          <div className="flex gap-2 shrink-0">
             {blogger.url && (
              <a 
                href={blogger.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                title="Visit Website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
             )}
             {blogger.feed && (
              <a 
                href={blogger.feed} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 border-2 border-black dark:border-white hover:bg-orange-500 hover:text-white transition-colors"
                title="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </a>
             )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2 min-h-[1.5rem]">
          <Badge variant="outline" className="neo-badge bg-white dark:bg-black rounded-none">
            {blogger.lang || 'N/A'}
          </Badge>
          <Badge variant="outline" className="neo-badge bg-yellow-300 dark:bg-yellow-900 text-black dark:text-white rounded-none">
            {blogger.freq || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-4">
        <div className="mb-4">
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-muted-foreground">Background</h4>
          <p className="text-sm line-clamp-3 text-pretty" title={blogger.background}>
            {blogger.background || "No background info provided."}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-muted-foreground">Focus</h4>
          <p className="text-sm font-medium line-clamp-2">
            {blogger.focus}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 px-6 block">
        <div className="flex flex-wrap gap-1.5 max-h-[4.5rem] overflow-hidden">
          {blogger.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] px-1.5 py-0.5 border border-black/50 dark:border-white/50 bg-secondary/50 font-mono"
            >
              #{tag.trim()}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
