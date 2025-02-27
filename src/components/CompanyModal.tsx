
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CompanyData } from "@/types/chat";
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
} from "lucide-react";

interface CompanyModalProps {
  company: CompanyData;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyModal = ({
  company,
  isOpen,
  onClose,
}: CompanyModalProps) => {
  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
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
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">CEO:</span> {company.ceo}
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
  );
};
