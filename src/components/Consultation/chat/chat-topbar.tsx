import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { UserData } from './app/mockData';
import { Info, Video } from 'lucide-react';
import { cn } from './lib/utils';
import { buttonVariants } from './ui/button';
import { startStream, playStream, terminateStream } from '../../livepeer';
import sendMessage from './chat-bottombar';
import { Message } from './app/mockData';
import { userAccountData } from '../../LoginPage';

interface ChatTopbarProps {
  selectedUser: UserData;
}

export const TopbarIcons = [{ icon: Video }, { icon: Info }];

export default function ChatTopbar({ selectedUser }: ChatTopbarProps) {
  const handleVideoCall = async () => { // Mark this function as async
    try {
      console.log("Starting stream");
      const stream = await startStream("testStream", false);

      if (stream) {
        console.log("Playing stream");
        const streamPlayer = await playStream('TestStream', stream.playbackId); // And here as well
        // Sends a link that calls the playStream function with the playbackId to the other user on the chat
        const message = `Hey, let's start a video call! Click here to join: https://livepeer.studio/api/playback/${stream.playbackId}`;
        const newMessage: Message = {
          id: Date.now(), // Updated ID generation to use timestamp
          name: userAccountData.alias,
          message: message.trim(),
          senderAddress: userAccountData.address,
        };
        // Assuming sendMessage function correctly sends a message via XMTP or another messaging service
        // sendMessage(newMessage); // This call might need adjustment based on actual implementation
      } else {
        console.error("Error starting stream");
      }
    } catch (error) {
      console.error("Error in video call setup:", error);
    }
  };

  // Function to render each icon with appropriate event handling
  const renderIcon = (IconComponent, index) => {
    const handleClick = IconComponent === Video ? handleVideoCall : () => {};
    return (
      <button
        key={index}
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "h-9 w-9",
          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
        )}
      >
        <IconComponent size={20} className="text-muted-foreground" />
      </button>
    );
  };

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            alt={selectedUser.name}
            width={6}
            height={6}
            className="w-10 h-10"
          />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{selectedUser.name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div>
        {TopbarIcons.map(({ icon }, index) => renderIcon(icon, index))}
      </div>
    </div>
  );
}
