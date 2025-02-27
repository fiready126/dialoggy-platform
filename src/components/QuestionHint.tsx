
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface QuestionHintProps {
  onSelectQuestion: (question: string) => void;
}

export const QuestionHint = ({ onSelectQuestion }: QuestionHintProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sampleQuestions = [
    {
      text: "Find Companies",
      description: "Search for companies in the database",
    },
    {
      text: "Find CEOs",
      description: "Get a list of prominent CEOs",
    },
    {
      text: "Download list",
      description: "Export the last displayed list as Excel",
    },
  ];

  const handleSelectQuestion = (question: string) => {
    onSelectQuestion(question);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          aria-label="Question hints"
        >
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-2">
          <h3 className="font-medium">Sample Questions</h3>
          <p className="text-sm text-muted-foreground">
            Click on any question to use it
          </p>
          <div className="pt-2 space-y-2">
            {sampleQuestions.map((question) => (
              <button
                key={question.text}
                className="w-full p-2 text-left rounded-md hover:bg-accent transition-colors"
                onClick={() => handleSelectQuestion(question.text)}
              >
                <p className="font-medium">{question.text}</p>
                <p className="text-xs text-muted-foreground">
                  {question.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
