import Hero from "./Hero/Hero";
import Choose from "@/components/Choose/Choose";
import Footer from "@/components/Footer/Footer";
import Partners from "../Partners/Partners";
import AboutUs from "../AboutUs/AboutUs";
import PartnerLogos from "../PartnerLogos/PartnerLogos";
import ServicesGrid from "../Services/Services";
import ContactSupport from "../ContactSupport/ContactSupport";
import Process from "../Process/Process";
import PageViewsAnalyticsSection from "../PageViewsAnalytics/PageViewsAnalytics";
const Home = () => {
  return <div className="overflow-hidden">
      
      {
    /* 1. Hero Section - ID: home */
  }
      <div id="home">
        <Hero />
      </div>

      {
    /* 2. Partners Section - ID: partners */
  }
      <div id="partners">
        <Partners />
      </div>
      
      {
    /* 3. About Section - ID: about */
  }
      <div id="about">
        <AboutUs />
      </div>

      {
    /* 4. Choose Section - ID: choose */
  }
      <div id="choose">
        <Choose />
      </div>

      {
    /* 5. PartnerLogos Section - ID: partnerlogos */
  }
      <div id="partnerlogos">
        <PartnerLogos />
      </div>

      {
    /* 6. Page views analytics (above Services) */
  }
      <PageViewsAnalyticsSection />

      {
    /* 7. Services Section - ID: services */
  }
      <div id="services">
        <ServicesGrid />
      </div>
      
      {
    /* 8. ContactSupport Section - ID: contactsupport */
  }
      <div id="contactsupport">
        <ContactSupport />
      </div>

      {
    /* 9. Process Section - ID: process */
  }
      <div id="process">
        <Process />
      </div>

      <Footer />
    </div>;
};
var stdin_default = Home;
export {
  stdin_default as default
};
