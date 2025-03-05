
import React from "react";
import { Contact, Thread } from "@/types/inbox";
import { Search, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface InboxLayoutProps {
  title: string;
  contacts: Contact[];
  threads: Thread[];
  selectedContactId: string | null;
  selectedThreadId: string | null;
  onSelectContact: (contactId: string) => void;
  onSelectThread: (threadId: string) => void;
  onNewMessage: () => void;
  children: React.ReactNode;
}

export const InboxLayout: React.FC<InboxLayoutProps> = ({
  title,
  contacts,
  threads,
  selectedContactId,
  selectedThreadId,
  onSelectContact,
  onSelectThread,
  onNewMessage,
  children,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
      {/* Left Sidebar - Contacts */}
      <div className="col-span-3 border rounded-lg bg-background overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium text-sm">Contacts</h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-muted ${
                selectedContactId === contact.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectContact(contact.id)}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  contact.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{contact.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {contact.company || (contact.handle ? `@${contact.handle}` : contact.email)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Middle - Threads List */}
      <div className="col-span-3 border rounded-lg bg-background overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-medium text-sm">Messages</h3>
          <Button onClick={onNewMessage} variant="ghost" size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" /> New
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {threads.length > 0 ? (
            threads.map(thread => {
              const contact = contacts.find(c => c.id === thread.contactId);
              return (
                <div
                  key={thread.id}
                  className={`p-3 cursor-pointer border-b hover:bg-muted ${
                    selectedThreadId === thread.id ? "bg-muted" : ""
                  } ${!thread.isRead ? "border-l-4 border-l-primary" : ""}`}
                  onClick={() => onSelectThread(thread.id)}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{contact?.name || "Unknown"}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(thread.lastMessageTimestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {thread.subject || thread.messages[thread.messages.length - 1].content.substring(0, 30) + "..."}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No messages to display
            </div>
          )}
        </div>
      </div>
      
      {/* Right - Content */}
      <div className="col-span-6 border rounded-lg bg-background overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
};
