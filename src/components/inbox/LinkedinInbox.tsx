import React, { useState } from "react";
import { InboxLayout } from "./InboxLayout";
import { MessageThread } from "./MessageThread";
import { EmptyState } from "./EmptyState";
import { Contact, Thread, Message } from "@/types/inbox";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Sample data for LinkedIn contacts
const LINKEDIN_CONTACTS: Contact[] = [
  {
    id: "l1",
    name: "Sarah Johnson",
    handle: "sarahjohnson",
    company: "TechVision Inc.",
    position: "CEO",
    isFollowing: true,
    lastContactDate: "2023-05-12",
    platform: "linkedin",
  },
  {
    id: "l2",
    name: "Michael Chen",
    handle: "michaelchen",
    company: "Green Energy Solutions",
    position: "Founder",
    isFollowing: false,
    lastContactDate: "2023-05-08",
    platform: "linkedin",
  },
  {
    id: "l3",
    name: "Emily Rodriguez",
    handle: "emilyrodriguez",
    company: "HealthPlus",
    position: "President",
    isFollowing: true,
    lastContactDate: "2023-05-03",
    platform: "linkedin",
  },
  {
    id: "l4",
    name: "Robert Kiyosaki",
    handle: "robertkiyosaki",
    company: "Global Finance Group",
    position: "Managing Director",
    isFollowing: false,
    lastContactDate: "2023-04-25",
    platform: "linkedin",
  },
];

// Sample data for LinkedIn threads
const LINKEDIN_THREADS: Thread[] = [
  {
    id: "lt1",
    contactId: "l1",
    lastMessageTimestamp: "2023-06-03T14:45:00Z",
    isRead: true,
    messages: [
      {
        id: "lm1",
        contactId: "l1",
        content: "Hello, I saw your profile and was impressed by your work in the technology sector.",
        timestamp: "2023-06-03T14:30:00Z",
        isRead: true,
        isIncoming: true,
      },
      {
        id: "lm2",
        contactId: "l1",
        content: "Thank you! I've been following your company's growth and would love to learn more about your innovation approach.",
        timestamp: "2023-06-03T14:45:00Z",
        isRead: true,
        isIncoming: false,
      },
    ],
  },
  {
    id: "lt2",
    contactId: "l3",
    lastMessageTimestamp: "2023-06-02T10:15:00Z",
    isRead: false,
    messages: [
      {
        id: "lm3",
        contactId: "l3",
        content: "I'm organizing a conference on healthcare innovation next month. Would you be interested in speaking?",
        timestamp: "2023-06-02T10:00:00Z",
        isRead: false,
        isIncoming: true,
      },
      {
        id: "lm4",
        contactId: "l3",
        content: "That sounds interesting. Can you share more details about the event and what topic you'd like me to cover?",
        timestamp: "2023-06-02T10:15:00Z",
        isRead: false,
        isIncoming: false,
      },
    ],
  },
];

export const LinkedinInbox: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(LINKEDIN_CONTACTS);
  const [threads, setThreads] = useState<Thread[]>(LINKEDIN_THREADS);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
    
    // Find threads for this contact
    const contactThreads = threads.filter(thread => thread.contactId === contactId);
    if (contactThreads.length > 0) {
      setSelectedThreadId(contactThreads[0].id);
    } else {
      setSelectedThreadId(null);
    }
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    
    // Mark the thread as read
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === threadId 
          ? { ...thread, isRead: true, messages: thread.messages.map(msg => ({ ...msg, isRead: true })) } 
          : thread
      )
    );
    
    // Update the selected contact
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setSelectedContactId(thread.contactId);
    }
  };

  const handleNewMessage = () => {
    if (!selectedContactId) {
      toast({
        description: "Please select a contact first",
        variant: "destructive",
      });
      return;
    }
    
    // Check if there's already a thread with this contact
    const existingThreadIndex = threads.findIndex(t => t.contactId === selectedContactId);
    
    if (existingThreadIndex === -1) {
      // Create a new thread
      const newThread: Thread = {
        id: `lt${threads.length + 1}`,
        contactId: selectedContactId,
        lastMessageTimestamp: new Date().toISOString(),
        isRead: true,
        messages: [],
      };
      
      setThreads([newThread, ...threads]);
      setSelectedThreadId(newThread.id);
    } else {
      // Select the existing thread
      setSelectedThreadId(threads[existingThreadIndex].id);
    }
  };

  const handleSendMessage = (threadId: string, content: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;
    
    const newMessage: Message = {
      id: `lm${Date.now()}`,
      contactId: thread.contactId,
      content,
      timestamp: new Date().toISOString(),
      isRead: true,
      isIncoming: false,
    };
    
    setThreads(prevThreads => 
      prevThreads.map(t => 
        t.id === threadId 
          ? { 
              ...t, 
              messages: [...t.messages, newMessage],
              lastMessageTimestamp: newMessage.timestamp,
            } 
          : t
      )
    );
    
    toast({
      description: "Message sent successfully",
    });
  };

  const handleToggleFollow = (contactId: string) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFollowing: !contact.isFollowing } 
          : contact
      )
    );
    
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      toast({
        description: contact.isFollowing 
          ? `Unfollowed ${contact.name}` 
          : `Now following ${contact.name}`,
      });
    }
  };

  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null;
  const selectedContact = selectedContactId ? contacts.find(c => c.id === selectedContactId) : null;

  return (
    <InboxLayout
      title="LinkedIn Messages"
      contacts={contacts}
      threads={selectedContactId ? threads.filter(t => t.contactId === selectedContactId) : []}
      selectedContactId={selectedContactId}
      selectedThreadId={selectedThreadId}
      onSelectContact={handleSelectContact}
      onSelectThread={handleSelectThread}
      onNewMessage={handleNewMessage}
    >
      {selectedThread && selectedContact ? (
        <>
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {selectedContact.avatar ? (
                  <img src={selectedContact.avatar} alt={selectedContact.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  selectedContact.name.charAt(0)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{selectedContact.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full"
                    onClick={() => handleToggleFollow(selectedContact.id)}
                  >
                    {selectedContact.isFollowing ? (
                      <>
                        <UserCheck className="h-3 w-3 mr-1" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-3 w-3 mr-1" /> Follow
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedContact.position} at {selectedContact.company}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {selectedThread.messages.map((message) => (
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
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message..."
                className="min-h-24 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    handleSendMessage(selectedThread.id, target.value);
                    target.value = "";
                  }
                }}
              />
              <Button
                variant="default"
                size="icon"
                className="rounded-full self-end"
                onClick={(e) => {
                  const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                  if (textarea && textarea.value.trim()) {
                    handleSendMessage(selectedThread.id, textarea.value);
                    textarea.value = "";
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : selectedContact ? (
        <EmptyState type="thread" platform="linkedin" />
      ) : (
        <EmptyState type="contact" platform="linkedin" />
      )}
    </InboxLayout>
  );
};
