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
  Menu,
  Search,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "@/components/ChatMessage";
import SidePanel from "@/components/SidePanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSession, Message, CompanyData, JobData, InvestorData } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuestionHint } from "@/components/QuestionHint";
import { ChatHistoryModal } from "@/components/ChatHistoryModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import * as XLSX from 'xlsx';

const DEFAULT_SYSTEM_MESSAGE = "You are a helpful, creative, and concise assistant. When asked about companies or CEOs, provide detailed information in a structured format.";

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

const SAMPLE_JOBS: JobData[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    companyName: "TechVision Inc.",
    salary: "$120,000 - $150,000",
    type: "Full-time",
    location: "San Francisco, CA",
    description: "We're looking for an experienced Frontend Developer to join our team.",
    postedDate: "2023-05-15"
  },
  {
    id: "2",
    title: "Product Manager",
    companyName: "TechVision Inc.",
    salary: "$130,000 - $160,000",
    type: "Full-time",
    location: "Remote",
    description: "Lead product development and strategy.",
    postedDate: "2023-05-10"
  },
  {
    id: "3",
    title: "UI/UX Designer",
    companyName: "Green Energy Solutions",
    salary: "$90,000 - $110,000",
    type: "Full-time",
    location: "Austin, TX",
    description: "Create beautiful and intuitive user experiences.",
    postedDate: "2023-05-05"
  },
  {
    id: "4",
    title: "DevOps Engineer",
    companyName: "HealthPlus",
    salary: "$115,000 - $140,000",
    type: "Full-time",
    location: "Boston, MA",
    description: "Manage and optimize our cloud infrastructure.",
    postedDate: "2023-05-01"
  },
  {
    id: "5",
    title: "Financial Analyst",
    companyName: "Global Finance Group",
    salary: "$85,000 - $105,000",
    type: "Full-time",
    location: "New York, NY",
    description: "Analyze financial data and create reports.",
    postedDate: "2023-04-28"
  }
];

const SAMPLE_INVESTORS: InvestorData[] = [
  {
    id: "1",
    name: "Sequoia Capital",
    companyName: "TechVision Inc.",
    country: "United States",
    funding: "$25M Series A",
    investmentStage: "Series A",
    portfolio: "Airbnb, Dropbox, Google",
    description: "Leading venture capital firm focused on technology investments."
  },
  {
    id: "2",
    name: "Andreessen Horowitz",
    companyName: "TechVision Inc.",
    country: "United States",
    funding: "$15M Seed",
    investmentStage: "Seed",
    portfolio: "Facebook, Twitter, GitHub",
    description: "Major venture capital firm specializing in technology startups."
  },
  {
    id: "3",
    name: "Kleiner Perkins",
    companyName: "Green Energy Solutions",
    country: "United States",
    funding: "$20M Series B",
    investmentStage: "Series B",
    portfolio: "Amazon, Google, Spotify",
    description: "Venture capital firm focusing on early-stage investments."
  },
  {
    id: "4",
    name: "Accel Partners",
    companyName: "HealthPlus",
    country: "United Kingdom",
    funding: "$30M Series C",
    investmentStage: "Series C",
    portfolio: "Facebook, Slack, Dropbox",
    description: "Global venture capital firm that invests in startups."
  },
  {
    id: "5",
    name: "SoftBank Vision Fund",
    companyName: "Global Finance Group",
    country: "Japan",
    funding: "$50M Late Stage",
    investmentStage: "Late Stage",
    portfolio: "Uber, WeWork, DoorDash",
    description: "Largest technology-focused investment fund."
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
  const [lastJobList, setLastJobList] = useState<JobData[]>([]);
  const [lastInvestorList, setLastInvestorList] = useState<InvestorData[]>([]);
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
    sendMessage(question);
  };

  const findJobs = (companyName: string) => {
    const filteredMessages = activeSession.messages.filter(message => {
      const isJobSearch = message.role === "user" && 
        (message.content.toLowerCase().includes("find jobs") || 
         message.content.toLowerCase().includes("search jobs"));
      const isJobResult = message.role === "assistant" && message.jobs;
      return !(isJobSearch || isJobResult);
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Find Jobs in ${companyName}`,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...filteredMessages, userMessage],
    };
    
    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setIsLoading(true);

    const filteredJobs = SAMPLE_JOBS.filter(job => 
      job.companyName.toLowerCase().includes(companyName.toLowerCase())
    );
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here are the job listings for ${companyName}:`,
        timestamp: new Date().toISOString(),
        jobs: filteredJobs
      };
      
      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };
      
      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
      setLastJobList(filteredJobs);
      setIsLoading(false);
    }, 1000);
  };

  const findInvestors = (companyName: string) => {
    const filteredMessages = activeSession.messages.filter(message => {
      const isInvestorSearch = message.role === "user" && 
        (message.content.toLowerCase().includes("find investors") || 
         message.content.toLowerCase().includes("search investors"));
      const isInvestorResult = message.role === "assistant" && message.investors;
      return !(isInvestorSearch || isInvestorResult);
    });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Find Investors in ${companyName}`,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...activeSession,
      messages: [...filteredMessages, userMessage],
    };
    
    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setIsLoading(true);

    const filteredInvestors = SAMPLE_INVESTORS.filter(investor => 
      investor.companyName.toLowerCase().includes(companyName.toLowerCase())
    );
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Here are the investors for ${companyName}:`,
        timestamp: new Date().toISOString(),
        investors: filteredInvestors
      };
      
      const finalUpdatedSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
      };
      
      setActiveSession(finalUpdatedSession);
      updateSessionInList(finalUpdatedSession);
      setLastInvestorList(filteredInvestors);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    sendMessage();
  };

  const sendMessage = async (content?: string) => {
    const messageContent = content || input;
    
    if ((!messageContent.trim() && !content) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date().toISOString(),
    };

    let updatedMessages = [...activeSession.messages];
    const lowerCaseInput = messageContent.trim().toLowerCase();
    
    if (lowerCaseInput.includes("find jobs") || lowerCaseInput.includes("search jobs")) {
      updatedMessages = updatedMessages.filter(message => {
        const isJobSearch = message.role === "user" && 
          (message.content.toLowerCase().includes("find jobs") || 
           message.content.toLowerCase().includes("search jobs"));
        const isJobResult = message.role === "assistant" && message.jobs;
        return !(isJobSearch || isJobResult);
      });
    } else if (lowerCaseInput.includes("find investors") || lowerCaseInput.includes("search investors")) {
      updatedMessages = updatedMessages.filter(message => {
        const isInvestorSearch = message.role === "user" && 
          (message.content.toLowerCase().includes("find investors") || 
           message.content.toLowerCase().includes("search investors"));
        const isInvestorResult = message.role === "assistant" && message.investors;
        return !(isInvestorSearch || isInvestorResult);
      });
    }

    const updatedSession = {
      ...activeSession,
      messages: [...updatedMessages, userMessage],
    };
    
    setActiveSession(updatedSession);
    updateSessionInList(updatedSession);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let aiResponse: Message;
      
      const lowerCaseInput = messageContent.trim().toLowerCase();
      
      if (lowerCaseInput.includes("find companies") || lowerCaseInput.includes("search companies")) {
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
      } else if (lowerCaseInput.includes("find jobs") || lowerCaseInput.includes("search jobs")) {
        let companyNameMatch = messageContent.match(/find jobs in (.*)/i) || messageContent.match(/search jobs in (.*)/i);
        let filteredJobs = SAMPLE_JOBS;
        
        if (companyNameMatch && companyNameMatch[1]) {
          const companyName = companyNameMatch[1].trim();
          filteredJobs = SAMPLE_JOBS.filter(job => 
            job.companyName.toLowerCase().includes(companyName.toLowerCase())
          );
        }
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the job listings matching your search criteria:",
          timestamp: new Date().toISOString(),
          jobs: filteredJobs
        };
        setLastJobList(filteredJobs);
      } else if (lowerCaseInput.includes("find investors") || lowerCaseInput.includes("search investors")) {
        let companyNameMatch = messageContent.match(/find investors in (.*)/i) || messageContent.match(/search investors in (.*)/i);
        let filteredInvestors = SAMPLE_INVESTORS;
        
        if (companyNameMatch && companyNameMatch[1]) {
          const companyName = companyNameMatch[1].trim();
          filteredInvestors = SAMPLE_INVESTORS.filter(investor => 
            investor.companyName.toLowerCase().includes(companyName.toLowerCase())
          );
        }
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here are the investors matching your search criteria:",
          timestamp: new Date().toISOString(),
          investors: filteredInvestors
        };
        setLastInvestorList(filteredInvestors);
      } else if (lowerCaseInput.includes("download list")) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm preparing the Excel file for download...",
          timestamp: new Date().toISOString(),
        };
        
        if (lastCompanyList.length > 0) {
          setTimeout(() => {
            downloadExcel(lastCompanyList);
          }, 500);
        } else if (lastJobList.length > 0) {
          setTimeout(() => {
            const worksheet = XLSX.utils.json_to_sheet(lastJobList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
            XLSX.writeFile(workbook, "job-list.xlsx");
            
            toast({
              title: "Download complete",
              description: "The Jobs Excel file has been downloaded successfully.",
            });
          }, 500);
        } else if (lastInvestorList.length > 0) {
          setTimeout(() => {
            const worksheet = XLSX.utils.json_to_sheet(lastInvestorList);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Investors");
            XLSX.writeFile(workbook, "investor-list.xlsx");
            
            toast({
              title: "Download complete",
              description: "The Investors Excel file has been downloaded successfully.",
            });
          }, 500);
        } else {
          aiResponse.content = "I don't have any list data to download. Please search for companies, jobs, or investors first.";
        }
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. In a real application, you would connect to an API like OpenAI here to get a proper response.",
          timestamp: new Date().toISOString(),
        };
      }
      
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

      <div className="flex flex-col flex-1 h-full overflow-hidden relative">
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
                  <h3 className="font-semibold text-lg mb-2">Download Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export data into a downloadable Excel file
                  </p>
                </div>
                
                <div 
                  className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] hover:border-orange-200 dark:hover:border-orange-800 cursor-pointer"
                  onClick={() => handleQuestionSelect("Find Jobs in TechVision Inc.")}
                >
                  <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg w-fit">
                    <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Find Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for job opportunities in specific companies
                  </p>
                </div>
              </div>
            </div>
          ) : (
            activeSession.messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message}
                isLastMessage={index === activeSession.messages.length - 1}
                onFindJobs={findJobs}
                onFindInvestors={findInvestors}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-muted-foreground">Thinking...</span>
            </div>
          )}
        </div>

        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex flex-col">
            <ChatHistoryModal 
              isOpen={isChatHistoryModalOpen} 
              onClose={() => setIsChatHistoryModalOpen(false)}
              sessions={sessions}
              activeSessionId={activeSession.id}
              onSwitchSession={switchSession}
              onDeleteSession={deleteSession}
            />
            
            <div className="flex w-full items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="min-h-[60px] w-full resize-none rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 focus-visible:ring-purple-500 dark:focus-visible:ring-purple-400 shadow-sm"
                disabled={isLoading}
              />
              
              <Button
                disabled={isLoading || input.trim() === ""}
                onClick={handleSendMessage}
                className={cn(
                  "rounded-full h-10 w-10 p-0 shrink-0 bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Send message"
                type="submit"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
