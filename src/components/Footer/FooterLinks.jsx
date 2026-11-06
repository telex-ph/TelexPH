import Link from "next/link";
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
        For Support?<br />
        <a href="mailto:business@telexph.com" className="text-sm sm:text-base font-medium hover:text-white transition-colors">business@telexph.com</a>
      </p>
      <a
        href="https://intl.telexph.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-3 px-4 py-2 rounded-md bg-[#a10000] hover:bg-[#850000] text-white text-sm font-semibold transition-colors"
      >
        Book a 15-minute call
      </a>
      <p className="text-xs sm:text-sm text-gray-300 mb-2">
        Have Questions?<br /><Link href="/faq" className="text-sm sm:text-base font-medium hover:text-white transition-colors">Frequently Asked Questions</Link>
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
