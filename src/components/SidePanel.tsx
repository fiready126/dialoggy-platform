
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  MessageSquare, 
  Trash2, 
  Search, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatSession } from "@/types/chat";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidePanelProps {
  isOpen: boolean;
  sessions: ChatSession[];
  activeSessionId: string;
  onNewSession: () => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SidePanel = ({
  isOpen,
  sessions,
  activeSessionId,
  onNewSession,
  onSwitchSession,
  onDeleteSession,
}: SidePanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // Group sessions by date
  const groupSessionsByDate = () => {
    const groups: Record<string, ChatSession[]> = {};
    
    sessions.forEach(session => {
      const date = new Date(session.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(session);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, sessions]) => ({
        date,
        sessions: sessions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      }));
  };

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Today";
    } else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Yesterday";
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const filteredGroups = groupSessionsByDate().map(group => ({
    ...group,
    sessions: group.sessions.filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.sessions.length > 0);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "flex flex-col w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 z-20",
      isMobile && "absolute h-full"
    )}>
      <div className="p-4">
        <Button 
          onClick={onNewSession}
          variant="outline" 
          className="w-full justify-start gap-2 bg-background hover:bg-accent"
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>

        <div className="relative mt-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 pb-4">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <div key={group.date} className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {formatGroupDate(group.date)}
              </h3>
              <div className="space-y-1">
                {group.sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => onSwitchSession(session.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg flex items-center group",
                      session.id === activeSessionId
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    )}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1">{session.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            {searchQuery ? "No matching chats found" : "No chats yet"}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          Dialoggy v1.0
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
