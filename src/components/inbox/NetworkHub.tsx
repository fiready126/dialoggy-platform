
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailInbox } from "./EmailInbox";
import { LinkedinInbox } from "./LinkedinInbox";
import { TwitterInbox } from "./TwitterInbox";
import { Mail, Linkedin, Twitter } from "lucide-react";

export const NetworkHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("email");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Network Hub</h1>
        <p className="text-muted-foreground">
          Manage your professional communications, job leads, and investment opportunities in one place
        </p>
      </div>
      
      <Tabs 
        defaultValue="email" 
        className="w-full" 
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="border-b">
          <TabsList className="h-14 w-full justify-start bg-transparent p-0">
            <TabsTrigger 
              value="email"
              className="data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent px-6 rounded-none h-14"
            >
              <Mail className="h-5 w-5 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger 
              value="linkedin"
              className="data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent px-6 rounded-none h-14"
            >
              <Linkedin className="h-5 w-5 mr-2" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger 
              value="twitter"
              className="data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:shadow-none border-b-2 border-transparent px-6 rounded-none h-14"
            >
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="email" className="mt-6 p-0 border-none">
          <EmailInbox />
        </TabsContent>
        
        <TabsContent value="linkedin" className="mt-6 p-0 border-none">
          <LinkedinInbox />
        </TabsContent>
        
        <TabsContent value="twitter" className="mt-6 p-0 border-none">
          <TwitterInbox />
        </TabsContent>
      </Tabs>
    </div>
  );
};
