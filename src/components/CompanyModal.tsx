import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CompanyData } from "@/types/chat";
import { useToast } from "@/components/ui/use-toast";
import {
  Building,
  User,
  Globe,
  MapPin,
  Mail,
  BarChart3,
  Percent,
  Star,
  TrendingUp,
  Award,
  Send,
  X,
  Check,
  Briefcase,
  DollarSign
} from "lucide-react";

interface CompanyModalProps {
  company: CompanyData;
  isOpen: boolean;
  onClose: () => void;
  onFindJobs?: (companyName: string) => void;
  onFindInvestors?: (companyName: string) => void;
}

export const CompanyModal = ({
  company,
  isOpen,
  onClose,
  onFindJobs,
  onFindInvestors
}: CompanyModalProps) => {
  const [ceoEmailModalOpen, setCeoEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(`Regarding ${company.name}`);
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleCeoClick = () => {
    setCeoEmailModalOpen(true);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setEmailMessage(suggestion);
  };

  const emailSuggestionTriggers = {
    "hello": `Hello ${company.ceo.split(' ')[0]}, I came across ${company.name} and wanted to connect.`,
    "intro": `I'm reaching out regarding ${company.name}'s innovative work in the ${company.industry} sector.`,
    "meeting": `Would you be available for a 15-minute call next week to discuss how ${company.name} and our company could collaborate?`,
    "follow": `I'm following up on our previous conversation about ${company.name}'s products.`,
    "partner": `I'd like to explore potential partnership opportunities between our organizations in the ${company.industry} market.`,
    "interest": `I'm particularly interested in your approach to ${company.industry} and would love to learn more.`,
  };

  const handleSendEmail = async () => {
    if (!emailMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would integrate with an email service here
      // For demo purposes, we'll just show a success toast
      
      toast({
        title: "Email sent successfully",
        description: `Your message has been sent to ${company.ceo}`,
        variant: "default",
      });
      
      setEmailMessage("");
      setCeoEmailModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFindJobs = () => {
    onClose(); // Close the modal first
    if (onFindJobs) {
      onFindJobs(company.name);
    }
  };

  const handleFindInvestors = () => {
    onClose(); // Close the modal first
    if (onFindInvestors) {
      onFindInvestors(company.name);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building className="h-5 w-5" />
              {company.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {company.industry} • {company.location}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div 
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={handleCeoClick}
                  >
                    <User className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">CEO:</span> {company.ceo}
                    <Mail className="h-4 w-4 text-blue-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Website:</span>{" "}
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company.website.replace(/(^\w+:|^)\/\//, "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Location:</span>{" "}
                    {company.location}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {company.workEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Work Email:</span>{" "}
                      {company.workEmail}
                    </div>
                  )}
                  {company.salesEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Sales Email:</span>{" "}
                      {company.salesEmail}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleFindJobs}
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  Find Jobs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={handleFindInvestors}
                >
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Find Investors
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Lead Scores
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Engagement Score</span>
                    </div>
                    <span className={`${scoreColor(company.leadScores.engagement)} font-medium`}>
                      {company.leadScores.engagement}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={company.leadScores.engagement >= 80 ? "bg-green-500 h-2 rounded-full" : 
                                company.leadScores.engagement >= 60 ? "bg-yellow-500 h-2 rounded-full" : 
                                "bg-red-500 h-2 rounded-full"}
                      style={{ width: `${company.leadScores.engagement}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Firmographic Fit</span>
                    </div>
                    <span className={`${scoreColor(company.leadScores.firmographicFit)} font-medium`}>
                      {company.leadScores.firmographicFit}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={company.leadScores.firmographicFit >= 80 ? "bg-green-500 h-2 rounded-full" : 
                                company.leadScores.firmographicFit >= 60 ? "bg-yellow-500 h-2 rounded-full" : 
                                "bg-red-500 h-2 rounded-full"}
                      style={{ width: `${company.leadScores.firmographicFit}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Conversion Score</span>
                    </div>
                    <span className={`${scoreColor(company.leadScores.conversion)} font-medium`}>
                      {company.leadScores.conversion}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={company.leadScores.conversion >= 80 ? "bg-green-500 h-2 rounded-full" : 
                                company.leadScores.conversion >= 60 ? "bg-yellow-500 h-2 rounded-full" : 
                                "bg-red-500 h-2 rounded-full"}
                      style={{ width: `${company.leadScores.conversion}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Rank Score</span>
                    </div>
                    <span className={`${scoreColor(company.leadScores.rank)} font-medium`}>
                      {company.leadScores.rank}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={company.leadScores.rank >= 80 ? "bg-green-500 h-2 rounded-full" : 
                                company.leadScores.rank >= 60 ? "bg-yellow-500 h-2 rounded-full" : 
                                "bg-red-500 h-2 rounded-full"}
                      style={{ width: `${company.leadScores.rank}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {company.description && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm">{company.description}</p>
            </div>
          )}

          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ceoEmailModalOpen} onOpenChange={(open) => setCeoEmailModalOpen(open)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {company.ceo.split(' ').map(name => name[0]).join('')}
              </div>
              <div>
                <div className="text-xl">{company.ceo}</div>
                <div className="text-sm text-muted-foreground">CEO at {company.name}</div>
              </div>
            </DialogTitle>
            <DialogDescription className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {company.workEmail || `${company.ceo.split(' ')[0].toLowerCase()}@${company.website.replace(/(^\w+:|^)\/\//, "").split('/')[0]}`}
                </span>
              </div>
              <div className="text-sm mt-2">
                Send a direct message to {company.ceo.split(' ')[0]}
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Email subject"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder={`Write a message to ${company.ceo.split(' ')[0]}...`}
                className="min-h-[120px]"
                suggestionTriggers={emailSuggestionTriggers}
                onSuggestionSelect={handleSuggestionSelect}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Type "hello", "intro", "meeting", "partner" or other keywords for template suggestions
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCeoEmailModalOpen(false)}
              disabled={isSending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSending || !emailMessage.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSending ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
