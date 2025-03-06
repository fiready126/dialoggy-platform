import React, { useState, useEffect } from "react";
import { InboxLayout } from "./InboxLayout";
import { MessageThread } from "./MessageThread";
import { EmptyState } from "./EmptyState";
import { Contact, Thread, Message } from "@/types/inbox";
import { useToast } from "@/components/ui/use-toast";
import { JobsTable } from "@/components/JobsTable";
import { InvestorsTable } from "@/components/InvestorsTable";
import { JobData } from "@/types/chat";
import { InvestorData } from "@/types/chat";
import { CompanyModal } from "@/components/CompanyModal";
import { CompanyData } from "@/types/chat";

// Sample data for email contacts
const EMAIL_CONTACTS: Contact[] = [
  {
    id: "e1",
    name: "Sarah Johnson",
    email: "sarah.johnson@techvision.example.com",
    company: "TechVision Inc.",
    position: "CEO",
    lastContactDate: "2023-05-15",
    platform: "email",
  },
  {
    id: "e2",
    name: "Michael Chen",
    email: "michael.chen@greenenergy.example.com",
    company: "Green Energy Solutions",
    position: "Founder",
    lastContactDate: "2023-05-10",
    platform: "email",
  },
  {
    id: "e3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@healthplus.example.com",
    company: "HealthPlus",
    position: "President",
    lastContactDate: "2023-05-05",
    platform: "email",
  },
];

// Sample data for email threads
const EMAIL_THREADS: Thread[] = [
  {
    id: "et1",
    contactId: "e1",
    subject: "Partnership Opportunity",
    lastMessageTimestamp: "2023-06-05T15:30:00Z",
    isRead: true,
    messages: [
      {
        id: "em1",
        contactId: "e1",
        content: "Hi, I'd like to discuss a potential partnership between our companies.",
        timestamp: "2023-06-05T15:00:00Z",
        isRead: true,
        isIncoming: true,
      },
      {
        id: "em2",
        contactId: "e1",
        content: "Thanks for reaching out! I'd be happy to discuss. What specifically did you have in mind?",
        timestamp: "2023-06-05T15:30:00Z",
        isRead: true,
        isIncoming: false,
      },
    ],
  },
  {
    id: "et2",
    contactId: "e2",
    subject: "Product Demo Request",
    lastMessageTimestamp: "2023-06-04T11:15:00Z",
    isRead: false,
    messages: [
      {
        id: "em3",
        contactId: "e2",
        content: "I'm interested in a demo of your latest sustainable energy solution.",
        timestamp: "2023-06-04T11:00:00Z",
        isRead: false,
        isIncoming: true,
      },
      {
        id: "em4",
        contactId: "e2",
        content: "We'd be delighted to show you our new products. What's your availability next week?",
        timestamp: "2023-06-04T11:15:00Z",
        isRead: false,
        isIncoming: false,
      },
    ],
  },
];

// Sample job data for contacts
const CONTACT_JOBS: Record<string, JobData[]> = {
  "e1": [
    {
      id: "j1",
      title: "Senior Software Engineer",
      companyName: "TechVision Inc.",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$150,000 - $180,000"
    },
    {
      id: "j2",
      title: "Product Manager",
      companyName: "TechVision Inc.",
      type: "Full-time",
      location: "San Francisco, CA",
      salary: "$130,000 - $160,000"
    }
  ],
  "e2": [
    {
      id: "j3",
      title: "Energy Solutions Architect",
      companyName: "Green Energy Solutions",
      type: "Full-time",
      location: "Austin, TX",
      salary: "$120,000 - $150,000"
    }
  ],
  "e3": [
    {
      id: "j4",
      title: "Healthcare Data Analyst",
      companyName: "HealthPlus",
      type: "Full-time",
      location: "Boston, MA",
      salary: "$110,000 - $130,000"
    },
    {
      id: "j5",
      title: "Medical Research Associate",
      companyName: "HealthPlus",
      type: "Contract",
      location: "Remote",
      salary: "$90,000 - $110,000"
    }
  ]
};

// Sample investor data for contacts
const CONTACT_INVESTORS: Record<string, InvestorData[]> = {
  "e1": [
    {
      id: "i1",
      name: "Sequoia Capital",
      companyName: "TechVision Inc.",
      country: "USA",
      funding: "$25M Series A"
    },
    {
      id: "i2",
      name: "Andreessen Horowitz",
      companyName: "TechVision Inc.",
      country: "USA",
      funding: "$15M Seed"
    }
  ],
  "e2": [
    {
      id: "i3",
      name: "Climate Fund",
      companyName: "Green Energy Solutions",
      country: "Germany",
      funding: "$18M Series B"
    }
  ],
  "e4": [
    {
      id: "i4",
      name: "Global Finance Partners",
      companyName: "Global Finance Group",
      country: "UK",
      funding: "$30M Series C"
    }
  ]
};

export const EmailInbox: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(EMAIL_CONTACTS);
  const [threads, setThreads] = useState<Thread[]>(EMAIL_THREADS);
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
        id: `et${threads.length + 1}`,
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
      id: `em${Date.now()}`,
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

  const handleAddContact = (company: CompanyData) => {
    // Check if CEO already exists in contacts
    const existingContact = contacts.find(
      contact => contact.name.toLowerCase() === company.ceo.toLowerCase()
    );

    if (existingContact) {
      toast({
        description: `${company.ceo} is already in your contacts`,
        variant: "default",
      });
      return;
    }

    // Create new contact from company CEO
    const newContact: Contact = {
      id: `e${Date.now()}`,
      name: company.ceo,
      email: company.workEmail || `${company.ceo.split(' ')[0].toLowerCase()}@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
      company: company.name,
      position: "CEO",
      lastContactDate: new Date().toISOString().split('T')[0],
      platform: "email",
    };

    setContacts(prev => [newContact, ...prev]);
    
    toast({
      description: `${company.ceo} has been added to your contacts`,
    });
  };

  const selectedThread = selectedThreadId ? threads.find(t => t.id === selectedThreadId) : null;
  const selectedContact = selectedContactId ? contacts.find(c => c.id === selectedContactId) : null;
  
  const contactJobs = selectedContactId ? CONTACT_JOBS[selectedContactId] || [] : [];
  const contactInvestors = selectedContactId ? CONTACT_INVESTORS[selectedContactId] || [] : [];

  return (
    <InboxLayout
      title="Email Inbox"
      contacts={contacts}
      threads={selectedContactId ? threads.filter(t => t.contactId === selectedContactId) : []}
      selectedContactId={selectedContactId}
      selectedThreadId={selectedThreadId}
      onSelectContact={handleSelectContact}
      onSelectThread={handleSelectThread}
      onNewMessage={handleNewMessage}
      onAddContact={(company) => handleAddContact(company)}
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
        <MessageThread 
          thread={selectedThread}
          contact={selectedContact}
          onSendMessage={handleSendMessage}
        />
      ) : selectedContact ? (
        <EmptyState type="thread" platform="email" />
      ) : (
        <EmptyState type="contact" platform="email" />
      )}
    </InboxLayout>
  );
};
