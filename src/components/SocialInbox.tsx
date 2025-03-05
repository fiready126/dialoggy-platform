
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Linkedin, Twitter } from "lucide-react";
import { EmailInbox } from "./inbox/EmailInbox";
import { LinkedinInbox } from "./inbox/LinkedinInbox";
import { TwitterInbox } from "./inbox/TwitterInbox";

export const SocialInbox = () => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="w-full h-full bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Social Inbox</h1>
        
        <Tabs defaultValue="email" onValueChange={setActiveTab} className="w-full">
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
          
          <TabsContent value="email">
            <EmailInbox />
          </TabsContent>
          
          <TabsContent value="linkedin">
            <LinkedinInbox />
          </TabsContent>
          
          <TabsContent value="twitter">
            <TwitterInbox />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
