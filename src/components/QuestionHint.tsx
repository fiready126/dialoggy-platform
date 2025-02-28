
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, Search, DownloadCloud, Building, User, Sparkles } from "lucide-react";

interface QuestionHintProps {
  onSelectQuestion: (question: string) => void;
}

export const QuestionHint = ({ onSelectQuestion }: QuestionHintProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sampleQuestions = [
    {
      icon: <Search className="h-4 w-4" />,
      text: "Find Companies",
      description: "Search for companies in the database",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      icon: <User className="h-4 w-4" />,
      text: "Find CEOs",
      description: "Get a list of prominent CEOs",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      icon: <DownloadCloud className="h-4 w-4" />,
      text: "Download list",
      description: "Export the last displayed list as Excel",
      color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Tell me about TechVision",
      description: "Get detailed information about a company",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
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
          className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-shadow"
          aria-label="Question hints"
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-xl shadow-lg" align="end">
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-t-xl border-b">
          <h3 className="font-semibold text-lg">Suggested Questions</h3>
          <p className="text-sm text-muted-foreground">
            Click on any suggestion to get an instant answer
          </p>
        </div>
        <div className="p-3">
          <div className="space-y-2">
            {sampleQuestions.map((question) => (
              <button
                key={question.text}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-start gap-3 group"
                onClick={() => handleSelectQuestion(question.text)}
              >
                <div className={`p-2 rounded-lg ${question.color} shrink-0 mt-1 transition-transform group-hover:scale-110`}>
                  {question.icon}
                </div>
                <div>
                  <p className="font-medium">{question.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {question.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
