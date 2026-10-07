const FooterLinks = () => {
  return <div>
      <div className="mb-4">
        <h3 className="font-poppins-black mb-2 text-base text-white">Need Help?</h3>
        <div className="w-12 h-1 bg-[#a10000]" />
      </div>

      <p className="text-xs sm:text-sm text-gray-300 mb-2">
        Call Us Directly?<br /><span className="text-sm sm:text-base font-medium">0443252836</span>
      </p>
      <p className="text-xs sm:text-sm text-gray-300 mb-2">
        PH Mobile Number<br /><a href="tel:+639563869812" className="text-sm sm:text-base font-medium hover:text-white transition-colors">+63 956 386 9812</a>
      </p>
      <p className="text-xs sm:text-sm text-gray-300 mb-2">
        NZ Number<br /><a href="tel:+642902665485" className="text-sm sm:text-base font-medium hover:text-white transition-colors">+64 29 02665485</a>
      </p>
      <p className="text-xs sm:text-sm text-gray-300 mb-2">
        For Support?<br />
        <a href="mailto:business@telexph.com" className="text-sm sm:text-base font-medium hover:text-white transition-colors">business@telexph.com</a><br />
        <a href="mailto:careers@telexph.com" className="text-sm sm:text-base font-medium hover:text-white transition-colors">careers@telexph.com</a>
      </p>
      <p className="text-xs sm:text-sm text-gray-300">
        Our Location<br /><span className="text-sm sm:text-base font-medium">Guimba, Nueva Ecija, Philippines</span>
      </p>
    </div>;
};
var stdin_default = FooterLinks;
export {
  stdin_default as default
};
