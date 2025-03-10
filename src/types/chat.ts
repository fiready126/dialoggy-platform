
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  companies?: CompanyData[]; // For company list results
  jobs?: JobData[]; // For job listings
  investors?: InvestorData[]; // For investor listings
  selectedCompany?: CompanyData; // For the selected company in job or investor listings
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
  logoUrl?: string; // Added for company logo URL
}

export interface JobData {
  id: string;
  title: string;
  companyName: string;
  salary: string;
  type: string;
  location: string;
  description?: string;
  postedDate?: string;
}

export interface InvestorData {
  id: string;
  name: string;
  companyName: string;
  country: string;
  funding: string;
  investmentStage?: string;
  portfolio?: string;
  description?: string;
}
