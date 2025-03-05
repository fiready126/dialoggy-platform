
import React from "react";
import { Mail, MessageSquare } from "lucide-react";

interface EmptyStateProps {
  type: "contact" | "thread";
  platform: "email" | "linkedin" | "twitter";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, platform }) => {
  const icons = {
    email: <Mail className="h-12 w-12 mb-4 opacity-20" />,
    linkedin: <MessageSquare className="h-12 w-12 mb-4 opacity-20" />,
    twitter: <MessageSquare className="h-12 w-12 mb-4 opacity-20" />,
  };

  const messages = {
    contact: {
      email: "Select a contact to view email conversations",
      linkedin: "Select a contact to view LinkedIn messages",
      twitter: "Select a contact to view Twitter conversations",
    },
    thread: {
      email: "Select or start a new email conversation",
      linkedin: "Select or start a new LinkedIn message",
      twitter: "Select or start a new Twitter conversation",
    },
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      {icons[platform]}
      <p className="text-lg font-medium">{messages[type][platform]}</p>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        {type === "contact"
          ? "Choose a contact from the list on the left to view your conversation history."
          : "Select a thread from the middle panel or create a new message to get started."}
      </p>
    </div>
  );
};
