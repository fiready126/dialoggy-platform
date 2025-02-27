
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  MessageSquare, 
  User, 
  Settings, 
  RefreshCw,
  PanelLeft,
  Trash,
  History,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "@/components/ChatMessage";
import SidePanel from "@/components/SidePanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSession, Message, CompanyData } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuestionHint } from "@/components/QuestionHint";
import { ChatHistoryModal } from "@/components/ChatHistoryModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import * as XLSX from 'xlsx';

const DEFAULT_SYSTEM_MESSAGE = "You are a helpful, creative, and concise assistant. When asked about companies or CEOs, provide detailed information in a structured format.";

// Sample company data for demonstration
const SAMPLE_COMPANIES: CompanyData[] = [
  {
    id: "1",
    name: "TechVision Inc.",
    position: "CEO",
    ceo: "Sarah Johnson",
    website: "https://techvision.example.com",
    industry: "Technology",
    location: "San Francisco, CA",
    workEmail: "info@techvision.example.com",
    salesEmail: "sales@techvision.example.com",
    leadScores: { engagement: 85, firmographicFit: 90, conversion: 75, rank: 83 },
    description: "TechVision is a leading provider of AI-powered business solutions, helping companies transform their operations through innovative technology."
  },
  {
    id: "2",
    name: "Green Energy Solutions",
    position: "Founder",
    ceo: "Michael Chen",
    website: "https://greenenergy.example.com",
    industry: "Renewable Energy",
    location: "Austin, TX",
    workEmail: "contact@greenenergy.example.com",
    salesEmail: "partnerships@greenenergy.example.com",
    leadScores: { engagement: 72, firmographicFit: 65, conversion: 68, rank: 70 },
    description: "Green Energy Solutions develops sustainable energy systems for residential and commercial applications."
  },
  {
    id: "3",
    name: "HealthPlus",
    position: "President",
    ceo: "Emily Rodriguez",
    website: "https://healthplus.example.com",
    industry: "Healthcare",
    location: "Boston, MA",
    workEmail: "info@healthplus.example.com",
    salesEmail: "business@healthplus.example.com",
    leadScores: { engagement: 93, firmographicFit: 87, conversion: 90, rank: 91 },
    description: "HealthPlus is revolutionizing patient care through digital health platforms and telemedicine solutions."
  },
  {
    id: "4",
    name: "Global Finance Group",
    position: "Managing Director",
    ceo: "Robert Kiyosaki",
    website: "https://globalfinance.example.com",
    industry: "Financial Services",
    location: "New York, NY",
    workEmail: "contact@globalfinance.example.com",
    salesEmail: "clients@globalfinance.example.com",
    leadScores: { engagement: 65, firmographicFit: 80, conversion: 62, rank: 68 },
    description: "Global Finance Group provides comprehensive financial services to individuals and businesses worldwide."
  },
  {
    id: "5",
    name: "OceanBlue Logistics",
    position: "COO",
    ceo: "James Wilson",
    website: "https://oceanblue.example.com",
    industry: "Logistics & Transportation",
    location: "Miami, FL",
    workEmail: "info@oceanblue.example.com",
    salesEmail: "services@oceanblue.example.com",
    leadScores: { engagement: 78, firmographicFit: 73, conversion: 81, rank: 76 },
    description: "OceanBlue Logistics offers global shipping and supply chain management solutions for businesses of all sizes."
  }
];

const Index = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isChatHistoryModalOpen, setIsChatHistoryModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<ChatSession>({
    id: "default-session",
    title: "New Chat",
    messages: [],
    systemMessage: DEFAULT_SYSTEM_MESSAGE,
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
  });
  const [sessions, setSessions] = useState<ChatSession[]>([activeSession]);
  const [lastCompanyList, setLastCompanyList] = useState<CompanyData[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    if (isMobile) {
      setIsSidePanelOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [activeSession.messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionSelect = (question: string) => {
    setInput(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    // Update the active session with the new message
    const updatedSession = {
      ...activeSession,
      messages: [...activeSession.messages, userMessage],
    };
    
    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let aiResponse: Message;
      
      // Check if this is a special command
      const lowerCaseInput = input.trim().toLowerCase();
      
      if (lowerCaseInput.includes("find companies") || lowerCaseInput.includes("search companies")) {
        // For demo purposes, return sample companies
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the companies matching your search criteria:",
          timestamp: new Date().toISOString(),
          companies: SAMPLE_COMPANIES
        };
        setLastCompanyList(SAMPLE_COMPANIES);
      } else if (lowerCaseInput.includes("find ceos")) {
        const ceoList = SAMPLE_COMPANIES.map(company => ({
          id: company.id,
          name: company.ceo,
          position: "CEO",
          ceo: "N/A",
          website: company.website,
          industry: company.industry,
          location: company.location,
          leadScores: company.leadScores
        }));
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the CEOs you requested:",
          timestamp: new Date().toISOString(),
          companies: ceoList
        };
        setLastCompanyList(ceoList);
      } else if (lowerCaseInput.includes("download list")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm preparing the Excel file for download...",
          timestamp: new Date().toISOString(),
        };
        
        // Trigger download
        if (lastCompanyList.length > 0) {
          setTimeout(() => {
            downloadExcel(lastCompanyList);
          }, 500);
        } else {
          aiResponse.content = "I don't have any list data to download. Please search for companies or CEOs first.";
        }
      } else {
        // Regular response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. In a real application, you would connect to an API like OpenAI here to get a proper response.",
          timestamp: new Date().toISOString(),
        };
      }
      
      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        title: updatedSession.messages.length === 0 ? getSessionTitle(input) : updatedSession.title,
      };
      
      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const downloadExcel = (data: CompanyData[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");
    XLSX.writeFile(workbook, "company-list.xlsx");
    
    toast({
      title: "Download complete",
      description: "The Excel file has been downloaded successfully.",
    });
  };

  const getSessionTitle = (message: string) => {
    // Create a simple title from the first user message
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  const updateSessionInList = (updatedSession: ChatSession) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === updatedSession.id ? updatedSession : session
      )
    );
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      systemMessage: DEFAULT_SYSTEM_MESSAGE,
      model: activeSession.model,
      createdAt: new Date().toISOString(),
    };
    
    setSessions([...sessions, newSession]);
    setActiveSession(newSession);
  };

  const switchSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession(session);
      if (isMobile) {
        setIsSidePanelOpen(false);
      }
    }
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    
    setSessions(updatedSessions);
    
    if (sessionId === activeSession.id) {
      if (updatedSessions.length > 0) {
        setActiveSession(updatedSessions[updatedSessions.length - 1]);
      } else {
        createNewSession();
      }
    }
  };

  const clearSession = () => {
    const clearedSession = {
      ...activeSession,
      messages: [],
      title: "New Chat",
    };
    
    setActiveSession(clearedSession);
    updateSessionInList(clearedSession);
    
    toast({
      title: "Chat cleared",
      description: "The conversation has been cleared.",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Side Panel */}
      <SidePanel 
        isOpen={isSidePanelOpen}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidePanel}
              className="mr-2"
              aria-label={isSidePanelOpen ? "Close sidebar" : "Open sidebar"}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium">{activeSession.title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearSession}
                    disabled={activeSession.messages.length === 0}
                    aria-label="Clear chat"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsChatHistoryModalOpen(true)}
                    aria-label="Chat history"
                  >
                    <History className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage chat history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ThemeToggle />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {}}
                    aria-label="Settings"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Messages Container */}
        <div 
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-6"
        >
          {activeSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-2xl font-medium mb-2">Start a conversation</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask a question or type a message to start chatting with the AI assistant.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Companies in the technology sector")}
                >
                  <h3 className="font-medium mb-1">Find Companies</h3>
                  <p className="text-sm text-muted-foreground">
                    "Find Companies in the technology sector"
                  </p>
                </div>
                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleQuestionSelect("Find CEOs of healthcare companies")}
                >
                  <h3 className="font-medium mb-1">Find CEOs</h3>
                  <p className="text-sm text-muted-foreground">
                    "Find CEOs of healthcare companies"
                  </p>
                </div>
                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleQuestionSelect("Download list")}
                >
                  <h3 className="font-medium mb-1">Download List</h3>
                  <p className="text-sm text-muted-foreground">
                    "Download the last company list as Excel"
                  </p>
                </div>
                <div 
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleQuestionSelect("Tell me about Green Energy Solutions")}
                >
                  <h3 className="font-medium mb-1">Company Research</h3>
                  <p className="text-sm text-muted-foreground">
                    "Tell me about Green Energy Solutions"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            activeSession.messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                isLastMessage={message.id === activeSession.messages[activeSession.messages.length - 1].id}
                isLoading={isLoading && message.id === activeSession.messages[activeSession.messages.length - 1].id}
              />
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="chat" className="w-full">
              <div className="flex items-center justify-between mb-2">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
                <div className="text-xs text-muted-foreground">
                  <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs">
                    {activeSession.model}
                  </span>
                </div>
              </div>
              
              <TabsContent value="chat" className="mt-0">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="min-h-[80px] resize-none pr-24 bg-background rounded-md border-muted-foreground/20"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <QuestionHint onSelectQuestion={handleQuestionSelect} />
                    <Button
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-md transition-opacity",
                        input.trim() ? "opacity-100" : "opacity-0"
                      )}
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  AI may produce inaccurate information about people, places, or facts.
                </p>
              </TabsContent>
              
              <TabsContent value="system" className="mt-0">
                <Textarea
                  value={activeSession.systemMessage}
                  onChange={(e) => {
                    const updatedSession = {
                      ...activeSession,
                      systemMessage: e.target.value,
                    };
                    setActiveSession(updatedSession);
                    updateSessionInList(updatedSession);
                  }}
                  placeholder="System message..."
                  className="min-h-[80px] resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  The system message helps set the behavior of the assistant.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Chat History Modal */}
      <ChatHistoryModal
        isOpen={isChatHistoryModalOpen}
        onClose={() => setIsChatHistoryModalOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />
    </div>
  );
};

export default Index;
