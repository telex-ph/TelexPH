
import Footer from "@/components/Footer/Footer";
import ContactHero from "./Contact/ContactHero";
import ContactInfo from "./Contact/ContactInfo";
import ContactForm from "./Contact/ContactForm";
import ContactSection from "./Contact/ContactSection";
import OfficeLocationHeader from "./Contact/OfficeLocationHeader";
const COLORS = {
  white: "#ffffff"
};
const FONTS = {
  rubik: "system-ui, -apple-system, sans-serif"
};
const ContactPage = () => {
  return <div
    className="min-h-screen"
    style={{
      backgroundColor: COLORS.white,
      fontFamily: FONTS.rubik
    }}
  >
      <ContactHero />

      <ContactSection />

      <section className="py-16" style={{ backgroundColor: "#f9fafb" }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfo />

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ backgroundColor: COLORS.white }}>
        <OfficeLocationHeader />
      </section>
      
      <Footer />
    </div>;
};
var stdin_default = ContactPage;
export {
  stdin_default as default
};
