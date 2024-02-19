import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { buttonVariants } from "./ui/button";
import { cn } from "./lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "./app/data";
import { Textarea } from "./ui/textarea";
import { EmojiPicker } from "./emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useUserData } from "../../userDataContext";
import { useXMTP } from "./xmtpContext";
import { sendMessage, newConversation } from './xmtp';


// Assuming sendMessages prop is for UI updates, renamed for clarity
interface ChatBottombarProps {
  updateMessagesUI: (newMessage: Message) => void;
  selectedUserAddress: string;
  isMobile: boolean;
}

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar({
  updateMessagesUI, selectedUserAddress, isMobile,
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { userData } = useUserData();
  const { client } = useXMTP();

  const handleSend = async () => {
    if (message.trim()) {
      // Check if there's an existing conversation or create a new one
      let conversation = await client.conversations.getConversation(selectedUserAddress);
      if (!conversation) {
        conversation = await newConversation(client, selectedUserAddress);
      }

      // Send the message through XMTP
      const sentMessage = await sendMessage(conversation, message.trim());
      // Assuming updateMessagesUI is a method to update the UI with the new message
      updateMessagesUI(sentMessage);
      
      setMessage("");
      inputRef.current?.focus(); // Refocus on input
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleThumbsUp = async () => {
    const newMessage: Message = {
      id: message.length + 1,
      name: userData.alias,
      message: "👍",
      senderAddress: userData.address,
    };
    let conversation = await client.conversations.getConversation(selectedUserAddress);
    if (!conversation) {
      conversation = await newConversation(client, selectedUserAddress);
    }
    // Send the message through XMTP
    const sentMessage = await sendMessage(conversation, newMessage);
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <div className="flex">
          <Popover>
            <PopoverTrigger asChild>
            <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          )}
        >
          <PlusCircle size={20} className="text-muted-foreground" />
        </Link>
            </PopoverTrigger>
            <PopoverContent 
            side="top"
            className="w-full p-2">
             {message.trim() || isMobile ? (
               <div className="flex gap-2">
                <Link 
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
              >
                <Mic size={20} className="text-muted-foreground" />
              </Link>
               {BottombarIcons.map((icon, index) => (
                 <Link
                   key={index}
                   href="#"
                   className={cn(
                     buttonVariants({ variant: "ghost", size: "icon" }),
                     "h-9 w-9",
                     "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                   )}
                 >
                   <icon.icon size={20} className="text-muted-foreground" />
                 </Link>
               ))}
             </div>
             ) : (
              <Link 
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
              >
                <Mic size={20} className="text-muted-foreground" />
              </Link>
             )}
            </PopoverContent>
          </Popover>
        {!message.trim() && !isMobile && (
          <div className="flex">
            {BottombarIcons.map((icon, index) => (
              <Link
                key={index}
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9",
                  "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                )}
              >
                <icon.icon size={20} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Aa"
            className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
          ></Textarea>
          <div className="absolute right-2 bottom-0.5  ">
            <EmojiPicker onChange={(value) => {
              setMessage(message + value)
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }} />
          </div>
        </motion.div>

        {message.trim() ? (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}
