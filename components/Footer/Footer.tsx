import React from "react";
import FooterLogo from "./FooterLogo";
import FooterPosts from "./FooterPosts";
import FooterLinks from "./FooterLinks";
import FooterSubscribe from "./FooterSubscribe";
import FooterBottom from "./FooterBottom";
import FooterCTA from "./FooterCTA";

// Layout constants
const DEFAULT_MAX_WIDTH_CLASS =
  "w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8";

const Footer = () => {
  return (
    <footer className="relative bg-[#20252b] text-white pt-10 sm:pt-16 md:pt-20 mt-16 sm:mt-20">
      {/* CTA Section positioned above footer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-20">
        <div className={DEFAULT_MAX_WIDTH_CLASS}>
          <FooterCTA />
        </div>
      </div>

      {/* Main Footer Content Grid */}
      <div
        className={`${DEFAULT_MAX_WIDTH_CLASS} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-20 relative z-10`}
      >
        {/* Logo + About */}
        <FooterLogo />

        {/* Popular Posts */}
        <FooterPosts />

        {/* Need Help / Contact */}
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
