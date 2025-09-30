import React from "react";
import Image from "next/image"; 
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa"; 

const FooterLogo = () => {
  return (
    <div>
      <div className="flex items-center space-x-1 mb-1">
        <Image 
          src="/images/aa.png" 
          alt="Lamo Logo" 
          width={40} 
          height={40} 
          className="text-red-600"
        /> 
        <div>
           <h2 className="text-3xl font-bold">TELEXPH</h2> 
           <p className="text-red-600 text-xs uppercase tracking-widest mt-0">Business Support Services</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm my-4">
        We are providing high-quality solar for about ten years.
      </p>
      <div className="flex space-x-3 text-gray-400"> 
        <FaFacebookF className="hover:text-white cursor-pointer" />
        <FaInstagram className="hover:text-white cursor-pointer" />
        <FaLinkedinIn className="hover:text-white cursor-pointer" />
        <FaTwitter className="hover:text-white cursor-pointer" />
      </div>
    </div>
  );
};

export default FooterLogo;