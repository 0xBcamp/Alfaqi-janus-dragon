import DoctorDashboard from "../../components/Doctor/dashboard";
import Image from "next/image";
import bgImage from "../../public/bg1.svg";

export default () => {
  return (
    <div className="p-4">
      <Image 
        src={bgImage}
        alt="background"
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
          zIndex: -1
        }}
      />
      <DoctorDashboard />
    </div>
  );
};
