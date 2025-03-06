
import React, { ReactNode, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Search, Plus, Building, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Contact, Thread } from "@/types/inbox";
import { ScrollArea } from "../ui/scroll-area";
import { CompanyModal } from "@/components/CompanyModal";
import { CompanyData } from "@/types/chat";

// Sample company data
const SAMPLE_COMPANY: CompanyData = {
  id: "c1",
  name: "TechVision Inc.",
  industry: "Technology",
  location: "San Francisco, CA",
  website: "https://techvision.example.com",
  ceo: "Sarah Johnson",
  workEmail: "sarah.johnson@techvision.example.com",
  salesEmail: "sales@techvision.example.com",
  description: "A leading technology company focused on AI and machine learning solutions for enterprise customers.",
  leadScores: {
    engagement: 85,
    firmographicFit: 90,
    conversion: 78,
    rank: 84
  }
};

interface InboxLayoutProps {
  title: string;
  children: ReactNode;
  contacts: Contact[];
  threads: Thread[];
  selectedContactId: string | null;
  selectedThreadId: string | null;
  onSelectContact: (contactId: string) => void;
  onSelectThread: (threadId: string) => void;
  onNewMessage: () => void;
  onAddContact?: (company: CompanyData) => void;
  jobsContent?: ReactNode;
  investorsContent?: ReactNode;
}

export const InboxLayout: React.FC<InboxLayoutProps> = ({
  title,
  children,
  contacts,
  threads,
  selectedContactId,
  selectedThreadId,
  onSelectContact,
  onSelectThread,
  onNewMessage,
  onAddContact,
  jobsContent,
  investorsContent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarTab, setSidebarTab] = useState<"contacts" | "companies">("contacts");
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCompanyModal = (company: CompanyData) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleCloseCompanyModal = () => {
    setIsCompanyModalOpen(false);
    setSelectedCompany(null);
  };

  const handleAddContact = (platform: 'email' | 'linkedin' | 'twitter') => {
    if (selectedCompany && onAddContact) {
      onAddContact(selectedCompany);
      setIsCompanyModalOpen(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="contacts" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 px-4 pt-2">
            <TabsTrigger 
              value="contacts" 
              onClick={() => setSidebarTab("contacts")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Users className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger 
              value="companies" 
              onClick={() => setSidebarTab("companies")}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
            >
              <Building className="h-4 w-4 mr-2" />
              Companies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="flex-1 overflow-hidden mt-0 p-0">
            <ScrollArea className="flex-1 h-full">
              <div className="space-y-1 p-2">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No contacts found</p>
                    <p className="text-sm mt-1">Try adjusting your search</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedContactId === contact.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => onSelectContact(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                            {contact.avatar ? (
                              <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              contact.name.charAt(0)
                            )}
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{contact.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {contact.company && `${contact.position} at ${contact.company}`}
                          </p>
                        </div>
                        {threads.some((t) => t.contactId === contact.id && !t.isRead) && (
                          <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                            !
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="companies" className="flex-1 overflow-hidden mt-0 p-0">
            <ScrollArea className="flex-1 h-full">
              <div className="space-y-1 p-2">
                <div
                  className="p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                  onClick={() => handleOpenCompanyModal(SAMPLE_COMPANY)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{SAMPLE_COMPANY.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {SAMPLE_COMPANY.industry}
                      </p>
                    </div>
                  </div>
                </div>
                {/* More sample companies could be added here */}
              </div>
            </ScrollArea>
          </TabsContent>

          <div className="p-3 border-t">
            <Button 
              onClick={onNewMessage} 
              className="w-full"
              disabled={!selectedContactId}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </div>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Info panel */}
        {selectedContactId && (
          <div className="border-t bg-muted/30">
            <Tabs defaultValue="jobs">
              <TabsList className="w-full bg-transparent border-b">
                <TabsTrigger value="jobs" className="flex-1">
                  Jobs
                </TabsTrigger>
                <TabsTrigger value="investors" className="flex-1">
                  Investors
                </TabsTrigger>
              </TabsList>
              <TabsContent value="jobs" className="max-h-48 overflow-y-auto p-2">
                {jobsContent || (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No job listings available</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="investors" className="max-h-48 overflow-y-auto p-2">
                {investorsContent || (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No investor information available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Company Modal */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          isOpen={isCompanyModalOpen}
          onClose={handleCloseCompanyModal}
          onAddContact={handleAddContact}
        />
      )}
    </div>
  );
};
