
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import TopBar from "./TopBar";
import { navLinks } from "@/constant/constant";
import { SERVICE_PAGES } from "@/data/service-pages";
import { Poppins, Open_Sans } from "next/font/google";
import { HiBars3BottomRight, HiChevronRight } from "react-icons/hi2";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap"
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-open-sans",
  display: "swap"
});
const Nav = ({ openNav }) => {
  const [navBg, setNavBg] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeServicesTab, setActiveServicesTab] = useState("offer");
  const [activeAboutTab, setActiveAboutTab] = useState("company");
  const [activeResourcesTab, setActiveResourcesTab] = useState("learning");
  const [activeCareersTab, setActiveCareersTab] = useState("va-overview");
  const router = useRouter();
  const pathname = usePathname();
  const handleMouseEnter = (id) => setOpenDropdownId(id);
  const handleMouseLeave = () => setOpenDropdownId(null);
  const handleScrollClick = (e, url) => {
    if (url.includes("#")) {
      const [path, hash] = url.split("#");
      if (pathname === path || path === "" && pathname === "/") {
        e.preventDefault();
        scrollToSection(`#${hash}`);
      }
    }
  };
  const scrollToSection = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };
  useEffect(() => {
    // Fires on every scroll event, so keep it cheap: only touch state when the
    // boolean actually flips, otherwise React re-renders the whole nav (and its
    // mega-menus) on each frame. `passive` also lets the browser scroll without
    // waiting on this handler.
    const handleScroll = () => {
      const next = window.scrollY > 50;
      setNavBg((prev) => (prev === next ? prev : next));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const servicesMegaData = [
    {
      id: "offer",
      label: "What We Offer",
      items: [
        { label: "Our Services", url: "/services#our-services" },
        { label: "Contact Us", url: "/services#contact" },
        { label: "Our Works", url: "/services#our-works" },
        { label: "Testimonials", url: "/services#testimonials" }
      ]
    },
    {
      id: "specialized",
      label: "Specialized Services",
      items: SERVICE_PAGES.map((p) => ({ label: p.h1, url: p.path }))
    }
  ];
  const aboutMegaData = [
    {
      id: "company",
      label: "Company",
      items: [
        { label: "Company Overview", url: "/about#overview" },
        { label: "Mission, Vision & Values", url: "/about#mission-vision" },
        { label: "Why Choose Us", url: "/about#choose-us" },
        { label: "Our Team", url: "/about#our-team" }
      ]
    },
    {
      id: "platforms",
      label: "Expertise",
      items: [
        { label: "Expertise Overview", url: "/platform" }
      ]
    }
  ];
  const resourcesMegaData = [
    { id: "learning", label: "Resource Center", items: ["Case Studies"] },
    {
      id: "news",
      label: "Industry Use Cases",
      items: [
        { label: "Industry Overview", url: "/resources/industryusecase#overview" },
        { label: "Challenges & Pain Points", url: "/resources/industryusecase#challenges" },
        { label: "Solutions Applied", url: "/resources/industryusecase#solutions" },
        { label: "Scenarios", url: "/resources/industryusecase#scenarios" },
        { label: "Benefits & Results", url: "/resources/industryusecase#results" },
        { label: "Tools & Technology", url: "/resources/industryusecase#tools" },
        { label: "Why Telex", url: "/resources/industryusecase#why-telex" }
      ]
    },
    {
      id: "blogs",
      label: "Blogs",
      items: [{ label: "Blogs Overview", url: "/resources/blogs" }]
    }
  ];
  const careersMegaData = [
    {
      id: "va-overview",
      label: "VA Center",
      items: [
        { label: "Virtual Assistant Home", url: "/careers" }
      ]
    },
    {
      id: "va-details",
      label: "Virtual Assistant Details",
      items: [
        { label: "Become a VA", url: "/careers/job-details" },
        { label: "Hire a VA", url: "/careers/job-details" }
      ]
    }
  ];
  const getMegaConfig = (label) => {
    if (label === "Services") return { data: servicesMegaData, active: activeServicesTab, setter: setActiveServicesTab, path: "/services" };
    if (label === "About") return { data: aboutMegaData, active: activeAboutTab, setter: setActiveAboutTab, path: "/about" };
    if (label === "Resources") return { data: resourcesMegaData, active: activeResourcesTab, setter: setActiveResourcesTab, path: "/resources" };
    if (label === "Virtual Assistant" || label === "Careers") return { data: careersMegaData, active: activeCareersTab, setter: setActiveCareersTab, path: "/virtual-assistant" };
    return null;
  };
  return <nav className={`fixed w-full z-[1000] top-0 ${poppins.variable} ${openSans.variable}`}>
      <TopBar />
      <div className={`relative bg-white transition-all duration-300 ${navBg ? "shadow-md" : ""}`}>
        <div className="relative h-[60px] lg:h-[80px] flex items-stretch">
          <div className="bg-gray-800 flex items-center justify-center h-full relative z-10 pl-3 pr-8 sm:pl-6 sm:pr-12 lg:pl-8 lg:pr-20 w-auto lg:w-[350px]">
            <Image src="/images/Weblogo.webp" alt="Logo" width={250} height={50} className="object-contain w-[140px] sm:w-[180px] lg:w-[250px] h-auto" priority />
          </div>
          <div className="h-full z-30 w-[40px] lg:w-[60px] -ml-[20px] lg:-ml-[30px] relative block">
            <div className="absolute top-0 left-0 w-full h-full bg-[#a10000]" style={{ clipPath: "polygon(50% 0, 100% 0, 50% 100%, 0 100%)" }} />
          </div>
          <div className="flex flex-grow items-center justify-end h-full pl-4 pr-4 sm:pl-6 sm:pr-8">
            <div className="hidden lg:flex items-center space-x-6 h-full">
              {navLinks.map((link) => {
    const megaConfig = getMegaConfig(link.label);
    return <div key={link.id} className="relative h-full flex items-center" onMouseEnter={() => handleMouseEnter(link.id)} onMouseLeave={handleMouseLeave}>
                    <Link href={link.url} onClick={(e) => handleScrollClick(e, link.url)} className="relative py-[30px] flex items-center group">
                      <span className="text-gray-700 font-open-sans-bold text-sm uppercase tracking-wide transition-colors hover:text-[#a10000]">
                        {link.label === "Careers" ? "Virtual Assistant" : link.label}
                      </span>
                    </Link>
                    {megaConfig && openDropdownId === link.id && <div className="absolute top-full left-0 mt-[-2px] bg-white border-t-2 border-[#a10000] shadow-xl min-w-[550px] z-20 rounded-b-lg flex overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="w-[40%] bg-[#f8fafc] px-6 py-6 border-r border-gray-200 flex flex-col font-poppins">
                          <h3 className="text-[#a10000] font-bold text-[11px] uppercase tracking-widest border-b border-[#a10000]/20 pb-2 mb-4">
                            Explore {link.label === "Careers" ? "VA" : link.label}
                          </h3>
                          <div className="flex flex-col space-y-2">
                            {megaConfig.data.map((cat) => <div key={cat.id} onMouseEnter={() => megaConfig.setter(cat.id)} className={`cursor-pointer transition-all duration-200 text-[13px] flex items-center justify-between py-1.5 px-2 rounded ${megaConfig.active === cat.id ? "text-[#a10000] bg-white shadow-sm font-medium" : "text-gray-500 hover:text-[#a10000]"}`}>
                                <span>{cat.label}</span>
                                <HiChevronRight className={`w-3.5 h-3.5 transition-transform ${megaConfig.active === cat.id ? "translate-x-1" : "opacity-0"}`} />
                              </div>)}
                          </div>
                        </div>
                        <div className="w-[60%] px-8 py-6 bg-white flex flex-col font-poppins">
                          <h3 className="text-[#a10000] font-bold text-[11px] uppercase tracking-widest border-b border-[#a10000]/20 pb-2">
                            {megaConfig.data.find((c) => c.id === megaConfig.active)?.label}
                          </h3>
                          <div className="flex flex-col space-y-3 mt-4">
                            {megaConfig.data.find((c) => c.id === megaConfig.active)?.items.map((item, i) => {
      const label = typeof item === "string" ? item : item.label;
      const url = typeof item === "string" ? megaConfig.path : item.url;
      return <Link key={i} href={url} onClick={(e) => handleScrollClick(e, url)} className="text-[13px] transition-colors py-0.5 w-fit text-gray-500 hover:text-[#a10000] font-normal">
                                  {label}
                                </Link>;
    })}
                          </div>
                        </div>
                      </div>}
                  </div>;
  })}
            </div>
            <div className="flex items-center space-x-8 ml-auto">
              <button onClick={() => router.push("/contact")} className="hidden lg:block bg-[#a10000] hover:bg-red-700 text-white px-6 py-2.5 text-sm font-open-sans-bold transition-colors rounded">
                CONTACT US
              </button>
              <button onClick={openNav} className="lg:hidden text-gray-700 p-2"><HiBars3BottomRight className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
    </nav>;
};
var stdin_default = Nav;
export {
  stdin_default as default
};
