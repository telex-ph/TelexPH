import React from "react";
import Link from "next/link";
import { navLinks } from "@/constant/constant";
import { CgClose } from "react-icons/cg";

type Props = {
  showNav: boolean;
  closeNav: () => void;
};

const MobileNav = ({ showNav, closeNav }: Props) => {
  return (
    <div className="lg:hidden">
      {/* Overlay */}
      {showNav && (
        <div
          className="fixed inset-0 bg-black opacity-70 w-full h-screen z-[1000] transition-opacity duration-300"
          onClick={closeNav}
        ></div>
      )}

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 left-0 flex flex-col justify-center h-full w-[80%] sm:w-[60%] bg-red-800 space-y-8 p-8 z-[1050] transform transition-transform duration-500 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CgClose
          onClick={closeNav}
          className="absolute top-4 right-4 sm:w-8 sm:h-8 w-7 h-7 cursor-pointer text-white hover:text-red-300 transition-colors z-[1100]"
        />

        {navLinks.map((link) => (
          <Link key={link.id} href={link.url} onClick={closeNav}>
            <p className="text-white text-2xl sm:text-3xl font-semibold ml-8 hover:text-red-300 transition-colors cursor-pointer">
              {link.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
