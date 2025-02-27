
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChatSession } from "@/types/chat";
import { MessageSquare, Trash2, Check } from "lucide-react";
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Manage Chat History</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">
            {sessions.length} conversations
          </div>
          {selectedSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedSessions.length})
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-start p-3 rounded-md hover:bg-accent/50 ${
                  session.id === activeSessionId ? "bg-accent" : ""
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  <input
                    type="checkbox"
                    checked={selectedSessions.includes(session.id)}
                    onChange={() => handleCheckboxChange(session.id)}
                    className="h-4 w-4 mt-1"
                  />
                </div>
                
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => handleSwitchSession(session.id)}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{session.title}</span>
                    {session.id === activeSessionId && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(session.createdAt)} • {session.messages.length} messages
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteSession(session.id)}
                  className="h-8 w-8 ml-2"
                  aria-label="Delete chat"
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
