
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  MessageSquare, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  PanelLeft,
  Trash,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "@/components/ChatMessage";
import SidePanel from "@/components/SidePanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatSession, Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DEFAULT_SYSTEM_MESSAGE = "You are a helpful, creative, and concise assistant.";

const Index = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeSession, setActiveSession] = useState<ChatSession>({
    id: "default-session",
    title: "New Chat",
    messages: [],
    systemMessage: DEFAULT_SYSTEM_MESSAGE,
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
  });
  const [sessions, setSessions] = useState<ChatSession[]>([activeSession]);
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
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. In a real application, you would connect to an API like OpenAI here to get a proper response.",
        timestamp: new Date().toISOString(),
      };
      
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
                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-1">Creative Writing</h3>
                  <p className="text-sm text-muted-foreground">
                    "Write a short story about a robot discovering emotions"
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-1">Technical Help</h3>
                  <p className="text-sm text-muted-foreground">
                    "Explain the difference between REST and GraphQL"
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-1">Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    "Teach me about quantum computing for beginners"
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <h3 className="font-medium mb-1">Problem Solving</h3>
                  <p className="text-sm text-muted-foreground">
                    "Help me debug this JavaScript function..."
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
                    className="min-h-[80px] resize-none pr-12 bg-background rounded-md border-muted-foreground/20"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    className={cn(
                      "absolute right-2 bottom-2 h-8 w-8 rounded-md transition-opacity",
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
    </div>
  );
};

export default Index;
