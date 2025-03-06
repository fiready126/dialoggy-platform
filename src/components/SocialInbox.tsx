
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Linkedin, Twitter, ArrowLeft, Home } from "lucide-react";
import { EmailInbox } from "./inbox/EmailInbox";
import { LinkedinInbox } from "./inbox/LinkedinInbox";
import { TwitterInbox } from "./inbox/TwitterInbox";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const SocialInbox = () => {
  const [activeTab, setActiveTab] = useState("email");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if a specific tab is requested via query params
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["email", "linkedin", "twitter"].includes(tab)) {
      setActiveTab(tab);
      
      toast({
        title: `Switched to ${tab.charAt(0).toUpperCase() + tab.slice(1)} Inbox`,
        description: `You are now viewing your ${tab} messages.`,
      });
    }
  }, [location.search, toast]);

  return (
    <div className="w-full h-full bg-[#F7F8FB] dark:from-gray-950 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full shadow-sm hover:shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Social Inbox</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 rounded-full px-4 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          navigate(`/inbox?tab=${value}`);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <TabsContent value="email" className="m-0">
              <EmailInbox />
            </TabsContent>
            
            <TabsContent value="linkedin" className="m-0">
              <LinkedinInbox />
            </TabsContent>
            
            <TabsContent value="twitter" className="m-0">
              <TwitterInbox />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
