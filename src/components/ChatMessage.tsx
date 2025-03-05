import { useState, useEffect, useRef } from "react";
import { MessageSquare, User, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CompanyTable } from "./CompanyTable";
import { JobsTable } from "./JobsTable";
import { InvestorsTable } from "./InvestorsTable";

interface ChatMessageProps {
  message: Message;
  isLastMessage?: boolean;
  isLoading?: boolean;
  onFindJobs?: (companyName: string) => void;
  onFindInvestors?: (companyName: string) => void;
}

const ChatMessage = ({ 
  message, 
  isLastMessage = false,
  isLoading = false,
  onFindJobs,
  onFindInvestors
}: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isUser = message.role === "user";

  useEffect(() => {
    setIsVisible(false);
    
    const animationFrame = requestAnimationFrame(() => {
      if (messageRef.current) {
        messageRef.current.offsetHeight;
        
        setIsVisible(true);
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [message.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast({
      description: "Message copied to clipboard",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "group flex",
        isUser ? "justify-end" : "justify-start",
        "transition-all duration-500 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
    >
      <div 
        className={cn(
          "flex max-w-3xl rounded-xl shadow-sm transition-all hover:shadow",
          isUser 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-12" 
            : "bg-gradient-to-r from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 ml-10 mr-12",
          isLoading && "opacity-70"
        )}
      >
        <div className={cn(
          "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full mt-4 ml-4 shadow",
          isUser 
            ? "bg-blue-500 text-white" 
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        )}>
          {isUser ? <User className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0 p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium flex items-center">
              {isUser ? "You" : (
                <span className="flex items-center gap-1">
                  <span className="text-purple-500 dark:text-purple-400">AI</span> Assistant
                </span>
              )}
            </div>
            <div className="text-xs opacity-70">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center bg-background/10 rounded-lg p-3 animate-pulse">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Generating response...</span>
              </div>
            ) : (
              <>
                <div className={cn(
                  "prose max-w-full",
                  isUser ? "prose-invert" : "dark:prose-invert"
                )}>
                  <Markdown
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || "");
                        return match ? (
                          <SyntaxHighlighter
                            language={match[1]}
                            style={atomDark}
                            PreTag="div"
                            className="rounded-md mt-2 mb-2 shadow-md"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={cn(
                              "bg-muted/30 rounded px-1 py-0.5", 
                              isUser ? "bg-blue-700/50" : "bg-gray-200 dark:bg-gray-800"
                            )} {...rest}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
                
                {!isUser && message.companies && message.companies.length > 0 && (
                  <div className="mt-4 bg-white dark:bg-slate-950 rounded-lg shadow-md p-2">
                    <CompanyTable 
                      companies={message.companies} 
                      onFindJobs={onFindJobs}
                      onFindInvestors={onFindInvestors}
                    />
                  </div>
                )}

                {!isUser && message.jobs && message.jobs.length > 0 && (
                  <div className="mt-4 bg-white dark:bg-slate-950 rounded-lg shadow-md p-2">
                    <JobsTable 
                      jobs={message.jobs} 
                      companyLogo={message.selectedCompany?.logoUrl} 
                      companyName={message.jobs[0]?.companyName || ""}
                    />
                  </div>
                )}

                {!isUser && message.investors && message.investors.length > 0 && (
                  <div className="mt-4 bg-white dark:bg-slate-950 rounded-lg shadow-md p-2">
                    <InvestorsTable 
                      investors={message.investors} 
                      companyLogo={message.selectedCompany?.logoUrl}
                      companyName={message.investors[0]?.companyName || ""}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          {!isUser && !isLoading && (
            <div className="flex justify-end mt-2">
              <Button
                variant={isUser ? "ghost" : "outline"}
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs rounded-full transition-all",
                  isUser ? "text-white hover:bg-white/20" : "hover:shadow",
                )}
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <Copy className="h-3.5 w-3.5 mr-1" />
                )}
                {isCopied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
