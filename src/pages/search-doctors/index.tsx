import SearchDoctorsPage from "../../components/SearchDoctors/searchDoctors";
import Image from "next/image";
import bgImage from "../../public/bg1.svg";

require('events').EventEmitter.setMaxListeners = 30;


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
      <SearchDoctorsPage />
    </div>
  );
};
