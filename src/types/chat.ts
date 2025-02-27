
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  companies?: CompanyData[]; // For company list results
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  systemMessage: string;
  model: string;
  createdAt: string;
}

export interface CompanyData {
  id: string;
  name: string;
  position?: string;
  ceo: string;
  website: string;
  industry: string;
  location: string;
  workEmail?: string;
  salesEmail?: string;
  leadScores: {
    engagement: number;
    firmographicFit: number;
    conversion: number;
    rank: number;
  };
  logo?: string;
  description?: string;
}
