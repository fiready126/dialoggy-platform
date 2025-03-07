
import React, { ReactNode } from "react";
import { Contact, Thread } from "@/types/inbox";
import { Search, Plus, MoreVertical, Briefcase, TrendingUp, MessageCircle, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InboxLayoutProps {
  title: string;
  contacts: Contact[];
  threads: Thread[];
  selectedContactId: string | null;
  selectedThreadId: string | null;
  onSelectContact: (contactId: string) => void;
  onSelectThread: (threadId: string) => void;
  onNewMessage: () => void;
  onRemoveContact?: (contactId: string) => void;
  children: React.ReactNode;
  platformTabs?: ReactNode;
  jobsContent?: ReactNode;
  investorsContent?: ReactNode;
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
  onRemoveContact,
  children,
  platformTabs,
  jobsContent,
  investorsContent,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {platformTabs}
      
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left Sidebar - Contacts */}
        <div className="col-span-3 border rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col">
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
            {contacts.length > 0 ? (
              contacts.map(contact => (
                <div
                  key={contact.id}
                  className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-muted ${
                    selectedContactId === contact.id ? "bg-muted" : ""
                  }`}
                >
                  <div 
                    className="flex-1 flex items-center gap-3" 
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
                  {onRemoveContact && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveContact(contact.id)}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p className="text-sm">No contacts found</p>
                <p className="text-xs mt-1">
                  Add contacts from the company directory
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Middle - Content Tabs */}
        <div className="col-span-9 border rounded-lg bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col">
          {selectedContactId ? (
            <Tabs defaultValue="messages" className="w-full h-full flex flex-col">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="messages" className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    Jobs
                  </TabsTrigger>
                  <TabsTrigger value="investors" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Investors
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="messages" className="flex flex-col flex-1 overflow-hidden m-0 p-0 border-none">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium text-sm">Messages</h3>
                  <Button 
                    onClick={onNewMessage} 
                    variant="ghost" 
                    size="sm" 
                    className="h-8"
                  >
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
                            {thread.subject || (thread.messages.length > 0 ? thread.messages[thread.messages.length - 1].content.substring(0, 30) + "..." : "New conversation")}
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
                
                {children}
              </TabsContent>
              
              <TabsContent value="jobs" className="flex-1 overflow-y-auto m-0 p-4 border-none">
                {jobsContent || (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No job listings available for this contact</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="investors" className="flex-1 overflow-y-auto m-0 p-4 border-none">
                {investorsContent || (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No investor information available for this contact</p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p>Select a contact to view messages, jobs and investors</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
