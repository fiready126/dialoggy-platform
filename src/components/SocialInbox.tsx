
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Linkedin, Twitter } from "lucide-react";

export const SocialInbox = () => {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="email" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
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
        <TabsContent value="email" className="p-4">
          <div className="flex flex-col h-[500px] items-center justify-center text-muted-foreground">
            <Mail className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">Email Integration Coming Soon</h3>
            <p className="text-sm max-w-md text-center mt-2">
              Connect your email account to manage contacts, send messages, and track communications directly from this interface.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="linkedin" className="p-4">
          <div className="flex flex-col h-[500px] items-center justify-center text-muted-foreground">
            <Linkedin className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">LinkedIn Integration Coming Soon</h3>
            <p className="text-sm max-w-md text-center mt-2">
              Connect your LinkedIn account to follow connections, send messages, and track professional networking directly from this interface.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="twitter" className="p-4">
          <div className="flex flex-col h-[500px] items-center justify-center text-muted-foreground">
            <Twitter className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">Twitter Integration Coming Soon</h3>
            <p className="text-sm max-w-md text-center mt-2">
              Connect your Twitter account to follow, message, and interact with other Twitter users directly from this interface.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
