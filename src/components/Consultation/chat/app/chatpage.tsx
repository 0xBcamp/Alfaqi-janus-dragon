import { ChatLayout } from "../chat-layout";
import { useLayout } from '../../../layoutContext'


export default function Chat() {
  const { layout } = useLayout();

  return (
    <main className="flex h-screen flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
      <div className="flex justify-between max-w-5xl w-full items-center">
        <p className="text-4xl font-bold text-gradient">BlockMedSecure Consultation Chat</p>
      </div>

      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ChatLayout defaultLayout={layout} navCollapsedSize={8} />
      </div>

      <div className="flex justify-between max-w-5xl w-full items-start text-xs md:text-sm text-muted-foreground ">
      <p className="max-w-[150px] sm:max-w-lg">Your messages here are safe.<a className="font-semibold"> You are on a decentralized enviroment.</a></p>
      <p className="max-w-[150px] sm:max-w-lg">UI forked from @shadcn-chat</p>
      </div>
    </main>
  );
}
