import Hero from "./Hero/Hero";
import { lazy, Suspense } from "react";
// Below-the-fold sections load in separate chunks so the hero paints first.
const WhatWeOffer = lazy(() => import("@/components/About/WhatWeOffer"));
const Footer = lazy(() => import("@/components/Footer/Footer"));
const Partners = lazy(() => import("../Partners/Partners"));
const AboutUs = lazy(() => import("../AboutUs/AboutUs"));
const PartnerLogos = lazy(() => import("../PartnerLogos/PartnerLogos"));
const ServicesGrid = lazy(() => import("../Services/Services"));
const Industries = lazy(() => import("../Industries/Industries"));
const ContactSupport = lazy(() => import("../ContactSupport/ContactSupport"));
const Process = lazy(() => import("../Process/Process"));
const PageViewsAnalyticsSection = lazy(() => import("../PageViewsAnalytics/PageViewsAnalytics"));
const Home = () => {
  return <div className="overflow-hidden">
      
      {
    /* 1. Hero Section - ID: home */
  }
      <div id="home">
        <Hero />
      </div>

      <Suspense fallback={null}>
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
    /* 5. PartnerLogos Section - ID: partnerlogos */
  }
      <div id="partnerlogos">
        <PartnerLogos />
      </div>

      {
    /* 4. Choose Section - ID: choose */
  }
      <div id="choose">
        <WhatWeOffer />
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
      
      <Industries />

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
      </Suspense>
    </div>;
};
var stdin_default = Home;
export {
  stdin_default as default
};
