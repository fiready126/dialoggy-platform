
import { useState } from "react";
import { MessageSquare, User, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CompanyTable } from "./CompanyTable";

interface ChatMessageProps {
  message: Message;
  isLastMessage: boolean;
  isLoading?: boolean;
}

const ChatMessage = ({ message, isLastMessage, isLoading = false }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const isUser = message.role === "user";

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
      className={cn(
        "group flex animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "flex max-w-3xl rounded-lg p-4",
          isUser 
            ? "bg-primary text-primary-foreground ml-12" 
            : "bg-muted ml-10 mr-12",
          isLoading && "opacity-70"
        )}
      >
        <div className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser 
            ? "bg-primary-foreground text-primary mr-2" 
            : "bg-background text-foreground mr-2"
        )}>
          {isUser ? <User className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="font-medium">
              {isUser ? "You" : "AI Assistant"}
            </div>
            <div className="text-xs opacity-70">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
          
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Generating response...</span>
              </div>
            ) : (
              <>
                <div className="prose dark:prose-invert max-w-full">
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
                            className="rounded-md mt-2 mb-2"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-muted/30 rounded px-1 py-0.5" {...rest}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>
                
                {/* Render company table if message has companies */}
                {!isUser && message.companies && message.companies.length > 0 && (
                  <CompanyTable companies={message.companies} />
                )}
              </>
            )}
          </div>
          
          {!isUser && !isLoading && (
            <div className="flex justify-end mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
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
