
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  MessageSquare, 
  Trash2, 
  Search, 
  X,
  LayoutDashboard 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      "flex flex-col w-[235px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 z-40 relative",
      isMobile && "fixed h-full"
    )}>
      <div className="flex items-center p-4 h-16 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bandera-logo">
            <img 
              src="/lovable-uploads/922b3bde-e4be-41cc-b6aa-f2b6b1676b6d.png" 
              alt="Bandera AI Logo" 
              className="h-6 w-6"
            />
          </div>
          <h2 className="text-lg font-bold brand-gradient">
            Bandera AI
          </h2>
        </div>
      </div>

      <div className="p-3">
        <Button 
          onClick={onNewSession}
          className="w-full justify-start gap-2 bg-[#7b5ce3] hover:bg-[#6a4fd6] text-white rounded-md py-6 shadow-sm hover:shadow transition-all font-medium"
        >
          <PlusCircle className="h-5 w-5" />
          New Conversation
        </Button>

        <div className="relative mt-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5ce3] dark:focus:ring-[#7b5ce3]"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="p-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <div key={group.date} className="mb-4">
                <div className="flex items-center gap-2 px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {formatGroupDate(group.date)}
                  </h3>
                </div>
                <div className="space-y-1">
                  {group.sessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => onSwitchSession(session.id)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg flex items-center group transition-all",
                        session.id === activeSessionId
                          ? "bg-gray-100 dark:bg-gray-800 shadow-sm"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                      )}
                    >
                      <div className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mr-3 text-gray-500",
                      )}>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="truncate font-medium text-sm">
                          {session.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {format(new Date(session.createdAt), "h:mm a")} • {session.messages.length} messages
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                          sessions.length <= 1 && "cursor-not-allowed"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (sessions.length > 1) {
                            onDeleteSession(session.id);
                          }
                        }}
                        disabled={sessions.length <= 1}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <LayoutDashboard className="h-10 w-10 mb-2 opacity-40" />
              {searchQuery ? "No matching conversations found" : "No conversations yet"}
              <p className="text-xs mt-1 text-center max-w-[200px]">
                {searchQuery ? "Try a different search term" : "Start a new conversation to get help"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
          Dialoggy v1.0 • AI Assistant
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
