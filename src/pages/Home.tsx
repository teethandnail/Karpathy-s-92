import { useState, useMemo, useEffect } from "react";
import { BloggerCard, type Blogger } from "@/components/BloggerCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, X, Github, Moon, Sun, Filter } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import bloggersData from "@/assets/bloggers.json";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Flatten tags logic
const getAllTags = (bloggers: Blogger[]) => {
  const tags = new Set<string>();
  bloggers.forEach(b => {
    b.tags.forEach(t => {
        if(t.trim()) tags.add(t.trim());
    });
  });
  return Array.from(tags).sort();
};

const PAGE_SIZE = 12;

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  
  // Data State
  const [bloggers] = useState<Blogger[]>(bloggersData as Blogger[]);
  const allTags = useMemo(() => getAllTags(bloggers), [bloggers]);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Filter Logic
  const filteredBloggers = useMemo(() => {
    return bloggers.filter(blogger => {
      const matchesSearch = 
        blogger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogger.background.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blogger.focus.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some(tag => blogger.tags.map(t=>t.trim()).includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [bloggers, searchQuery, selectedTags]);

  const visibleBloggers = filteredBloggers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBloggers.length;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedTags]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-black dark:border-white bg-background">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter uppercase">
              Blog<span className="text-primary">Dir</span>_
            </h1>
            <Badge className="hidden md:flex neo-badge rounded-none text-xs bg-black text-white dark:bg-white dark:text-black">
              v1.0.0
            </Badge>
          </div>

          <div className="flex items-center gap-2">
             <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="border-2 border-transparent hover:border-black dark:hover:border-white rounded-none"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <a 
              href="https://github.com/anygen" 
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex"
            >
              <Button variant="outline" className="neo-btn rounded-none font-bold">
                <Github className="mr-2 h-4 w-4" /> Submit
              </Button>
            </a>
            
            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden neo-btn rounded-none">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r-4 border-black dark:border-white p-0">
                <ScrollArea className="h-full p-6">
                    <div className="space-y-6">
                        <div>
                        <h3 className="font-display font-bold text-xl mb-4 border-b-2 border-black dark:border-white pb-2">FILTERS</h3>
                        <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                            <Badge
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                variant={selectedTags.includes(tag) ? "default" : "outline"}
                                className={`cursor-pointer rounded-none border-black dark:border-white ${
                                selectedTags.includes(tag) 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                                    : "hover:bg-secondary"
                                }`}
                            >
                                {tag}
                            </Badge>
                            ))}
                        </div>
                        </div>
                    </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="h-full flex flex-col gap-6 border-r-2 border-black/10 dark:border-white/10 pr-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-2 border-black dark:border-white rounded-none focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg">TOPICS</h3>
                  {selectedTags.length > 0 && (
                    <button 
                      onClick={() => setSelectedTags([])}
                      className="text-xs underline text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer rounded-none border border-black dark:border-white transition-all ${
                        selectedTags.includes(tag) 
                          ? "bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-x-[-1px] translate-y-[-1px]" 
                          : "bg-background hover:bg-secondary"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </ScrollArea>
            
            <div className="text-xs text-muted-foreground border-t-2 border-black/10 pt-4 font-mono">
              Displaying {filteredBloggers.length} of {bloggers.length} sources
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Search */}
          <div className="md:hidden mb-6 relative">
             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authors, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-2 border-black dark:border-white rounded-none"
              />
          </div>

          {filteredBloggers.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-black/20 dark:border-white/20 p-8 text-center">
              <div className="text-4xl mb-4">∅</div>
              <h3 className="font-display font-bold text-xl mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
              <Button onClick={clearFilters} variant="outline" className="neo-btn rounded-none">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {visibleBloggers.map((blogger) => (
                  <BloggerCard key={blogger.id} blogger={blogger} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button 
                    onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                    size="lg"
                    className="neo-btn bg-white text-black hover:bg-gray-100 dark:bg-black dark:text-white dark:hover:bg-gray-900 rounded-none min-w-[200px] font-bold tracking-wider"
                  >
                    LOAD MORE records_
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
