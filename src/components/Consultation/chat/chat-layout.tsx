"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { cn } from "./lib/utils";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat";
import { fetchConversations } from "./xmtp";
import { useXMTP } from "./xmtpContext";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState([]); // New state to hold conversations
  const xmtpClient = useXMTP(); // Use XMTP client from context

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  useEffect(() => {
    // Function to fetch conversations
    const fetchUserConversations = async () => {
      if (!xmtpClient) return;
      const convs = await fetchConversations(xmtpClient);
      setConversations(convs);
      // Optionally, set the first conversation as selected by default
      if (convs.length > 0) {
        setSelectedUser(convs[0].peerAddress); // Assuming you can derive user data from peerAddress
      };
    }
    fetchUserConversations();
  }, [xmtpClient]);
 

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => setIsCollapsed(true)}
        onExpand={() => setIsCollapsed(false)}
        className={cn(isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out")}
      >
        <Sidebar
          isCollapsed={isCollapsed || isMobile}
          conversations={conversations} 
          onSelectConversation={(peerAddress) => setSelectedUser(peerAddress)}
          selectedUser={selectedUser}
          isMobile={isMobile}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {selectedUser && (
          <Chat
            messages={[]} // Pass messages here
            selectedUser={selectedUser}
            isMobile={isMobile}
          />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}