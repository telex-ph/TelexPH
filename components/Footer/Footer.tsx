import React from "react";
import FooterLogo from "./FooterLogo";
import FooterPosts from "./FooterPosts";
import FooterLinks from "./FooterLinks";
import FooterSubscribe from "./FooterSubscribe";
import FooterBottom from "./FooterBottom";
import FooterCTA from "./FooterCTA";

const Footer = () => {
  return (
    <footer className="relative bg-[#20252b] text-white pt-20 mt-30">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl px-6 lg:px-12 z-20">
        <FooterCTA />
      </div>

      {/* Main Footer Content Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10 relative z-10">
        {/* Logo + About (Lamo) */}
        <FooterLogo />

        {/* Popular Posts (2x2 Grid) */}
        <FooterPosts />

        {/* Need Help (Updated Contact) */}
        <FooterLinks />

        {/* Subscribe */}
        <FooterSubscribe />
      </div>

      {/* Bottom Bar */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
