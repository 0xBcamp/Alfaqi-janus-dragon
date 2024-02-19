import Chat from "../../components/Consultation/chat/app/chatpage";
import PatientRecords from "../../components/Consultation/patientRecords";
import Image from "next/image";
import bgImage from "../../public/bg1.svg";
import { Card } from '@tremor/react';

export default () => {
  return (
    <div className="flex flex-row min-h-screen p-4">
      <Image
        src={bgImage}
        alt="background"
        fill
        objectFit="cover"
        className="z-[-1]"
      />
      <div className="flex-1">
          <Chat />
      </div>
      <div className="flex-none w-1/2 ">
        <PatientRecords />
      </div>
    </div>
  );
};
