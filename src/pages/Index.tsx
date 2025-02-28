
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
  Download,
  BrainCircuit,
  Plus,
  ChevronLeft,
  Menu
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
    // Don't need to set input since we're sending immediately
    // Just call handleSendMessage directly with the question
    sendMessage(question);
  };

  // New function to handle sending messages with optional content parameter
  const sendMessage = async (content?: string) => {
    const messageContent = content || input;
    
    if ((!messageContent.trim() && !content) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
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
      const lowerCaseInput = messageContent.trim().toLowerCase();
      
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
      
      // Update the session title based on the first user message
      const shouldUpdateTitle = updatedSession.messages.length === 1 && updatedSession.title === "New Chat";
      
      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        title: shouldUpdateTitle ? getSessionTitle(messageContent) : updatedSession.title,
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

  // Maintain original handleSendMessage but delegate to the new function
  const handleSendMessage = () => {
    sendMessage();
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
    // Don't do anything if this is the last session
    if (sessions.length <= 1) {
      return;
    }
    
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    
    setSessions(updatedSessions);
    
    if (sessionId === activeSession.id) {
      setActiveSession(updatedSessions[updatedSessions.length - 1]);
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
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-slate-900">
      {/* Side Panel */}
      {isSidePanelOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={toggleSidePanel} />
      )}
      
      <SidePanel 
        isOpen={isSidePanelOpen}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onNewSession={createNewSession}
        onSwitchSession={switchSession}
        onDeleteSession={deleteSession}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
        {/* Floating New Chat Button - Mobile */}
        {!isSidePanelOpen && (
          <div className="fixed top-20 left-4 z-20 md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSidePanel}
              className="rounded-full shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10 shadow-sm">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidePanel}
              className="mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex"
              aria-label={isSidePanelOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidePanelOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center">
              <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                {activeSession.title}
              </h1>
              <div className="ml-3 px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                {activeSession.model}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={createNewSession}
              className="hidden md:flex items-center gap-1 rounded-full px-4 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearSession}
                    disabled={activeSession.messages.length === 0}
                    aria-label="Clear chat"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
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
                    variant="outline"
                    size="icon"
                    onClick={() => setIsChatHistoryModalOpen(true)}
                    aria-label="Chat history"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
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
                    variant="outline"
                    size="icon"
                    onClick={() => {}}
                    aria-label="Settings"
                    className="rounded-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
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
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-slate-900"
        >
          {activeSession.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg animate-pulse">
                <BrainCircuit className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                Interactive AI Assistant
              </h2>
              
              <p className="text-muted-foreground max-w-md mb-10 text-lg">
                Ask a question or explore one of our suggestions to start your conversation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
                <div 
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-blue-200 dark:hover:border-blue-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Companies in the technology sector")}
                >
                  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg w-fit">
                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find Companies</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover tech companies and explore their details
                  </p>
                </div>
                
                <div 
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-purple-200 dark:hover:border-purple-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find CEOs of healthcare companies")}
                >
                  <div className="mb-3 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg w-fit">
                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find CEOs</h3>
                  <p className="text-sm text-muted-foreground">
                    List prominent CEOs and their company information
                  </p>
                </div>
                
                <div 
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-green-200 dark:hover:border-green-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Download list")}
                >
                  <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg w-fit">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Download List</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your last search results to Excel
                  </p>
                </div>
                
                <div 
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-amber-200 dark:hover:border-amber-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Tell me about Green Energy Solutions")}
                >
                  <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg w-fit">
                    <Building className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Company Research</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed reports on specific companies
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
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto relative">
            <Tabs defaultValue="chat" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="grid w-[240px] grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <TabsTrigger value="chat" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all">Chat</TabsTrigger>
                  <TabsTrigger value="system" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm transition-all">System</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="mt-0">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="min-h-[80px] resize-none pr-24 bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <QuestionHint onSelectQuestion={handleQuestionSelect} />
                    
                    <Button
                      className={cn(
                        "h-9 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all",
                        (!input.trim() || isLoading) && "opacity-70"
                      )}
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <p className="text-xs text-center text-muted-foreground mt-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                    AI may produce inaccurate information about people, places, or facts.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="mt-0">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg mb-3">
                  <h3 className="text-sm font-medium mb-2">System Message</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    This message helps set the behavior and capabilities of the AI assistant.
                  </p>
                </div>
                
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
                  className="min-h-[120px] resize-none bg-white dark:bg-gray-800 rounded-xl border-gray-200 dark:border-gray-700 shadow-sm focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                />
                
                <div className="flex justify-center">
                  <p className="text-xs text-center text-muted-foreground mt-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full">
                    Changes to the system message will affect the assistant's behavior in future interactions.
                  </p>
                </div>
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
