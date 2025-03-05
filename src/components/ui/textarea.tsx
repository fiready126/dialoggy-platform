
import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  suggestionTriggers?: Record<string, string>;
  onSuggestionSelect?: (suggestion: string) => void;
  onGenerateAI?: () => void;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows, suggestionTriggers = {}, onSuggestionSelect, onGenerateAI, ...props }, ref) => {
    const [suggestion, setSuggestion] = useState<string>("");
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const combinedRef = (node: HTMLTextAreaElement) => {
      // Update both refs
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
      internalRef.current = node;
    };

    useEffect(() => {
      if (!props.value || typeof props.value !== 'string') {
        setSuggestion("");
        return;
      }

      const value = props.value.toString().toLowerCase().trim();
      
      // Only show suggestions if input is at least 2 characters
      if (value.length < 2) {
        setSuggestion("");
        return;
      }

      // Check for trigger words
      for (const trigger in suggestionTriggers) {
        if (value.includes(trigger.toLowerCase())) {
          setSuggestion(suggestionTriggers[trigger]);
          return;
        }
      }

      // If no specific trigger, check for context-based suggestions
      if (value.includes("thank")) {
        setSuggestion("Thank you for your time and consideration.");
      } else if (value.includes("interest")) {
        setSuggestion("I'm interested in discussing potential partnership opportunities.");
      } else if (value.includes("meet") || value.includes("call")) {
        setSuggestion("Would you be available for a brief call next week to discuss this further?");
      } else if (value.includes("question")) {
        setSuggestion("I have a few questions regarding your company's services.");
      } else if (value.includes("intro")) {
        setSuggestion("I wanted to introduce myself and learn more about your company.");
      } else {
        setSuggestion("");
      }
    }, [props.value, suggestionTriggers]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab key completes the suggestion
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        
        if (internalRef.current && onSuggestionSelect) {
          onSuggestionSelect(suggestion);
        }
      }
      
      // Original onKeyDown handler if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={maxRows ? { maxHeight: `${maxRows * 1.5}rem` } : undefined}
          ref={combinedRef}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {suggestion && (
          <div className="absolute top-0 px-3 py-2 text-sm pointer-events-none w-full">
            <span className="invisible">{props.value}</span>
            <span className="text-muted-foreground opacity-50">
              {suggestion.substring((props.value?.toString() || "").length)}
            </span>
          </div>
        )}
        {suggestion && (
          <div className="absolute right-3 bottom-2 text-xs text-muted-foreground bg-background px-1">
            Press Tab to complete
          </div>
        )}
        {onGenerateAI && (
          <div className="absolute right-3 top-2 z-10">
            <button
              type="button"
              onClick={onGenerateAI}
              className="text-xs flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <span className="h-3 w-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 2v4l3 3-3 3v4l7-7-7-7z"></path>
                  <path d="M21 22v-4l-3-3 3-3v-4l-7 7 7 7z"></path>
                </svg>
              </span>
              AI
            </button>
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
