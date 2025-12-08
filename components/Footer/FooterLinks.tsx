import React from "react";

const FooterLinks = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-poppins-black mb-2 text-white">Need Help?</h3>
        <div className="w-12 h-1 bg-[#a10000]"></div>
      </div>
      
      <p className="text-sm text-gray-300 mb-2">
        Call Us Directly?<br /><span className="text-base font-medium">+63 (044) 331-5040</span> 
      </p>
      <p className="text-sm text-gray-300 mb-2">
        For Support?<br /><span className="text-base font-medium">partnerships@telexph.com</span>
      </p>
      <p className="text-sm text-gray-300">
        Our Location<br /><span className="text-base font-medium">Guimba, Nueva Ecija, Philippines</span>
      </p>
    </div>
  );
};

export default FooterLinks;