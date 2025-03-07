
import React, { useState, useRef, useEffect } from "react";
import { Contact, Thread, Message } from "@/types/inbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MessageThreadProps {
  thread: Thread;
  contact: Contact;
  onSendMessage: (threadId: string, content: string) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  thread,
  contact,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [thread.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(thread.id, newMessage);
      setNewMessage("");
    } else {
      toast({
        description: "Please enter a message",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              contact.name.charAt(0)
            )}
          </div>
          <div>
            <p className="font-medium">{contact.name}</p>
            <p className="text-xs text-muted-foreground">
              {contact.email || (contact.handle ? `@${contact.handle}` : "")}
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {thread.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isIncoming ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isIncoming
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="relative w-full">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-24 resize-none pr-20"
          />
          <div className="absolute right-3 bottom-3 flex flex-row gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-full"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              type="button"
              className="h-8 w-8 rounded-full"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
