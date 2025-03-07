import React, { useState } from "react";
import { InboxLayout } from "./InboxLayout";
import { MessageThread } from "./MessageThread";
import { EmptyState } from "./EmptyState";
import { Contact, Thread, Message } from "@/types/inbox";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Send, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobsTable } from "@/components/JobsTable";
import { InvestorsTable } from "@/components/InvestorsTable";
import { JobData } from "@/types/chat";
import { InvestorData } from "@/types/chat";

// Sample data for Twitter threads
const TWITTER_THREADS: Thread[] = [
  {
    id: "tt1",
    contactId: "t1",
    lastMessageTimestamp: "2023-06-01T18:30:00Z",
    isRead: true,
    messages: [
      {
        id: "tm1",
        contactId: "t1",
        content: "Hey there! Just saw your post about AI innovations. Fascinating stuff!",
        timestamp: "2023-06-01T18:15:00Z",
        isRead: true,
        isIncoming: true,
      },
      {
        id: "tm2",
        contactId: "t1",
        content: "Thanks! We're working on some exciting new developments. Would love to share more details with you.",
        timestamp: "2023-06-01T18:30:00Z",
        isRead: true,
        isIncoming: false,
      },
    ],
  },
  {
    id: "tt2",
    contactId: "t3",
    lastMessageTimestamp: "2023-05-30T09:45:00Z",
    isRead: false,
    messages: [
      {
        id: "tm3",
        contactId: "t3",
        content: "Your thoughts on the latest healthcare tech trends? Working on a report and would love your insights.",
        timestamp: "2023-05-30T09:30:00Z",
        isRead: false,
        isIncoming: true,
      },
      {
        id: "tm4",
        contactId: "t3",
        content: "I believe AI diagnostics and telemedicine will continue to grow. Happy to discuss further if you'd like?",
        timestamp: "2023-05-30T09:45:00Z",
        isRead: false,
        isIncoming: false,
      },
    ],
  },
];

// Sample job data for contacts
const CONTACT_JOBS: Record<string, JobData[]> = {
  "t1": [
    {
      id: "tj1",
      title: "Social Media Manager",
      companyName: "TechVision Inc.",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$90,000 - $110,000"
    }
  ],
  "t2": [
    {
      id: "tj2",
      title: "Community Manager",
      companyName: "Green Energy Solutions",
      type: "Part-time",
      location: "Remote",
      salary: "$60,000 - $75,000"
    }
  ],
  "t4": [
    {
      id: "tj3",
      title: "Financial Analyst",
      companyName: "Global Finance Group",
      type: "Full-time",
      location: "New York, NY",
      salary: "$120,000 - $140,000"
    },
    {
      id: "tj4",
      title: "Investment Associate",
      companyName: "Global Finance Group",
      type: "Full-time",
      location: "London, UK",
      salary: "£80,000 - £100,000"
    }
  ]
};

// Sample investor data for contacts
const CONTACT_INVESTORS: Record<string, InvestorData[]> = {
  "t1": [
    {
      id: "ti1",
      name: "Digital Ventures",
      companyName: "TechVision Inc.",
      country: "USA",
      funding: "$10M Seed"
    }
  ],
  "t4": [
    {
      id: "ti2",
      name: "Global Capital",
      companyName: "Global Finance Group",
      country: "UK",
      funding: "$50M Series D"
    },
    {
      id: "ti3",
      name: "European Investment Fund",
      companyName: "Global Finance Group",
      country: "EU",
      funding: "€30M Growth"
    }
  ]
};

interface TwitterInboxProps {
  contacts?: Contact[];
}

export const TwitterInbox: React.FC<TwitterInboxProps> = ({ contacts: propContacts }) => {
  // Use provided contacts or fallback to sample data
  const [contacts, setContacts] = useState<Contact[]>(propContacts || []);
  const [threads, setThreads] = useState<Thread[]>(TWITTER_THREADS);
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
        id: `tt${threads.length + 1}`,
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
      id: `tm${Date.now()}`,
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
      description: "Tweet sent successfully",
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
          ? `Unfollowed @${contact.handle}` 
          : `Now following @${contact.handle}`,
      });
    }
  };

  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null;
  const selectedContact = selectedContactId ? contacts.find(c => c.id === selectedContactId) : null;
  
  const contactJobs = selectedContactId ? CONTACT_JOBS[selectedContactId] || [] : [];
  const contactInvestors = selectedContactId ? CONTACT_INVESTORS[selectedContactId] || [] : [];

  return (
    <InboxLayout
      title="Twitter Messages"
      contacts={contacts}
      threads={selectedContactId ? threads.filter(t => t.contactId === selectedContactId) : []}
      selectedContactId={selectedContactId}
      selectedThreadId={selectedThreadId}
      onSelectContact={handleSelectContact}
      onSelectThread={handleSelectThread}
      onNewMessage={handleNewMessage}
      jobsContent={selectedContact && (
        <JobsTable 
          jobs={contactJobs} 
          companyName={selectedContact.company || selectedContact.name}
        />
      )}
      investorsContent={selectedContact && (
        <InvestorsTable 
          investors={contactInvestors} 
          companyName={selectedContact.company || selectedContact.name}
        />
      )}
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
                  <span className="text-sm text-muted-foreground">@{selectedContact.handle}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
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
        <EmptyState type="thread" platform="twitter" />
      ) : (
        <EmptyState type="contact" platform="twitter" />
      )}
    </InboxLayout>
  );
};
