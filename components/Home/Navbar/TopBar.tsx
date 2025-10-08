import React from "react";
import {
  Clock,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Container from "@/components/Container/Container";

const TopBar = () => {
  return (
    <>
      {/* Desktop / Tablet - Large screens (lg and up) */}
      <div className="hidden lg:block text-white" style={{ backgroundColor: "#a10000" }}>
        <Container>
          <div className="flex items-center h-10 text-sm">
            {/* Left Info */}
            <div className="flex items-center gap-6 flex-1">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="whitespace-nowrap">Mon - Fri ( 9AM - 6PM )</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">+63 (44) 331 - 5040</span>
              </span>
            </div>

            {/* Right Info */}
            <div className="flex items-center gap-6 flex-1 justify-end">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  Cawayan Bugtong, Guimba, Nueva Ecija
                </span>
              </span>
              <div className="flex items-center gap-3">
                <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Tablet - Medium screens (md to lg) */}
      <div className="hidden md:block lg:hidden text-white" style={{ backgroundColor: "#a10000" }}>
        <Container>
          <div className="flex flex-col py-2 text-sm space-y-2">
            {/* First Row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="whitespace-nowrap">Sun - Fri (7:00 - 18:00)</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">+0044 9922299</span>
              </span>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs sm:text-sm">
                  22 Sterling Close, Winchester, M23 4FD
                </span>
              </span>
              <div className="flex items-center gap-3">
                <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mobile - Small screens (sm to md) */}
      <div className="hidden sm:block md:hidden text-white" style={{ backgroundColor: "#a10000" }}>
        <Container>
          <div className="px-4 py-2.5 text-sm space-y-2">
            {/* Time + Phone */}
            <div className="flex items-center justify-center gap-6">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Sun - Fri (7:00 - 18:00)</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs">+0044 9922299</span>
              </span>
            </div>

            {/* Address + Social */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 flex-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs">22 Sterling Close, Winchester, M23 4FD</span>
              </span>
              <div className="flex items-center gap-3 ml-4">
                <Facebook className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                <Twitter className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Extra Small Mobile - Below 640px */}
      <div className="block sm:hidden text-white" style={{ backgroundColor: "#a10000" }}>
        <Container>
          <div className="px-3 py-3 text-xs space-y-2.5">
            {/* Time + Phone */}
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Sun - Fri (7:00 - 18:00)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>+0044 9922299</span>
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-center gap-1.5 text-center">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>22 Sterling Close, Winchester, M23 4FD</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              <Instagram className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default TopBar;
