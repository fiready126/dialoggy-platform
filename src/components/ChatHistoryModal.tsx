
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChatSession } from "@/types/chat";
import { MessageSquare, Trash2, Check, CalendarDays, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface ChatHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const ChatHistoryModal = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSwitchSession,
  onDeleteSession,
}: ChatHistoryModalProps) => {
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  
  const handleCheckboxChange = (sessionId: string) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleDeleteSelected = () => {
    // Only delete if we have multiple sessions
    if (sessions.length <= selectedSessions.length) {
      return;
    }
    
    for (const sessionId of selectedSessions) {
      onDeleteSession(sessionId);
    }
    setSelectedSessions([]);
  };

  const handleSwitchSession = (sessionId: string) => {
    onSwitchSession(sessionId);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border shadow-lg">
        <DialogHeader className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <DialogTitle className="text-2xl font-bold">Your Conversations</DialogTitle>
          <p className="text-sm text-muted-foreground">Manage your chat history and pick up where you left off</p>
        </DialogHeader>

        <div className="px-6 pt-4 pb-2 border-b flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
          <div className="text-sm font-medium flex items-center">
            <MessageCircle className="h-4 w-4 mr-2 text-primary" />
            {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
          </div>
          {selectedSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 transition-all shadow-sm hover:shadow"
              disabled={sessions.length <= selectedSessions.length}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedSessions.length})
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] px-6">
          <div className="space-y-3 py-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-start p-4 rounded-lg transition-all hover:shadow-md ${
                  session.id === activeSessionId 
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800" 
                    : "hover:bg-accent/50 border border-transparent hover:border-border"
                }`}
              >
                <div className="flex-shrink-0 mr-3 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedSessions.includes(session.id)}
                    onChange={() => handleCheckboxChange(session.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleSwitchSession(session.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full bg-primary/10 ${session.id === activeSessionId ? "text-primary" : "text-muted-foreground"}`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className={`font-medium text-lg ${session.id === activeSessionId ? "text-primary" : ""}`}>
                      {session.title}
                    </span>
                    {session.id === activeSessionId && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="ml-10 flex items-center text-xs text-muted-foreground mt-2">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {formatDate(session.createdAt)}
                    <span className="mx-2">•</span>
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <Button
                  variant={session.id === activeSessionId ? "destructive" : "ghost"}
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Only allow deletion if there are multiple sessions
                    if (sessions.length > 1) {
                      onDeleteSession(session.id);
                    }
                  }}
                  className={`h-8 w-8 ml-2 transition-all ${sessions.length <= 1 ? 'opacity-30' : 'opacity-100 hover:scale-110'}`}
                  aria-label="Delete chat"
                  disabled={sessions.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
