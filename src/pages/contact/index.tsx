import ContactForm from "../../components/Contact/contactForm";
import Image from "next/image";
import bgImage from "../../public/bg1.svg";

export default () => {
  return (
    <div className="p-4">
      <Image         
      src={bgImage}
      fill
      sizes="100vw"
      style={{
          objectFit: 'cover',
          zIndex: -1
      }}
      />
    <ContactForm />
    </div>
  );
};
