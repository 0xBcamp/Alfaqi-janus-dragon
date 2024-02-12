"use client";

import React from "react";
import Link from "next/link";
import { MoreHorizontal, SquarePen } from "lucide-react";
import { cn } from "./lib/utils";
import { buttonVariants } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";

// Assuming ConversationType matches the structure you get from XMTP or your application's state management
interface ConversationType {
  peerAddress: string; // Unique identifier for the conversation
  lastMessage?: string; // Last message text for preview (optional)
}

interface SidebarProps {
  isCollapsed: boolean;
  conversations: ConversationType[];
  onSelectConversation: (peerAddress: string) => void; // Function to handle selecting a conversation
  selectedPeerAddress?: string; // Currently selected conversation's peer address for highlighting
  isMobile: boolean;
}

export function Sidebar({
  conversations,
  isCollapsed,
  onSelectConversation,
  selectedPeerAddress,
  isMobile,
}: SidebarProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
    >
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({conversations.length})</span>
          </div>

          <div>
            <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")}>
              <MoreHorizontal size={20} />
            </Link>
            <Link href="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9")}>
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {conversations.map((conversation, index) => (
          <Link key={index} href="#" onClick={() => onSelectConversation(conversation.peerAddress)}
                className={cn(
                  buttonVariants({ variant: selectedPeerAddress === conversation.peerAddress ? "grey" : "ghost", size: "xl" }),
                  "flex items-center gap-4 p-2 cursor-pointer",
                  selectedPeerAddress === conversation.peerAddress && "bg-gray-200 dark:bg-gray-700"
                )}
          >
            <div className="flex flex-col">
              <span className="font-medium truncate">{conversation.peerAddress}</span>
              {conversation.lastMessage && (
                <span className="text-zinc-300 text-xs truncate">{conversation.lastMessage}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
