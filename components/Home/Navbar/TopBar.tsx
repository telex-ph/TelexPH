import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Container from "@/components/Container/Container";

const TopBar = () => {
  const facebookLink =
    "https://www.facebook.com/telexphilippines?mibextid=wwXIfr&rdid=dnj2588eSOaWfMgW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BvrjZDJZq%2F%3Fmibextid%3DwwXIfr#";

  return (
    <>
      {/* Desktop / Tablet - Large screens (lg and up) - No changes */}
      <div
        className="hidden lg:block text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
          <div className="flex items-center h-10 text-sm">
            {/* Left Info */}
            <div className="flex items-center gap-6 flex-1">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  partnerships@telexph.com
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">+63 (44) 331 - 5040</span>
              </span>
            </div>

            {/* Right Info */}
            <div className="flex items-center gap-6 flex-1 justify-end">
              <Link
                href="/location"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-4 h-4" />
                <span className="whitespace-nowrap underline underline-offset-2">
                  Cawayan Bugtong, Guimba, Nueva Ecija
                </span>
              </Link>
              {/* Social Icons - Visible on LG and up */}
              <div className="flex items-center gap-3">
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                </a>
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Tablet - Medium screens (md to lg) - Social Icons Still Visible here */}
      <div
        className="hidden md:block lg:hidden text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
          <div className="flex flex-col py-2 text-sm space-y-2">
            {/* First Row */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  partnerships@telexph.com
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">+63 (44) 331 - 5040</span>
              </span>
            </div>

            {/* Second Row */}
            <div className="flex items-center justify-between">
              <Link
                href="/location"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-xs sm:text-sm underline underline-offset-2">
                  Cawayan Bugtong, Guimba, Nueva Ecija
                </span>
              </Link>
              {/* Social Icons - Still visible on MD */}
              <div className="flex items-center gap-3">
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                </a>
                <Twitter className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-4 h-4 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* MOBILE - Small screens (sm to md) - SOCIAL ICONS HIDDEN */}
      <div
        className="hidden sm:block md:hidden text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
          {/* Mas mababang py-2, space-y-1 */}
          <div className="px-2 py-2 text-sm space-y-1 flex flex-col items-center">
            
            {/* 1st Line: Email at Phone - Single line, centered, mas maliit na gap */}
            <div className="flex items-center justify-center gap-4"> 
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span className="text-xs whitespace-nowrap">
                    partnerships@telexph.com
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-xs whitespace-nowrap">
                    +63 (44) 331 - 5040
                </span>
              </span>
            </div>

            {/* 2nd Line: Address - Centered */}
            <Link
              href="/location"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity text-center"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs underline underline-offset-2 whitespace-nowrap">
                Cawayan Bugtong, Guimba, Nueva Ecija
              </span>
            </Link>
            
            {/* Social Icons - COMPLETELY REMOVED IN THIS VIEW */}
          </div>
        </Container>
      </div>

      {/* EXTRA SMALL MOBILE - Below 640px - SOCIAL ICONS HIDDEN */}
      <div
        className="block sm:hidden text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
           {/* Mas mababang py-1.5, space-y-1 */}
          <div className="px-1 py-1.5 text-xs space-y-1 flex flex-col items-center">
            
            {/* 1st Line: Email at Phone - Single line, centered, mas maliit na gap */}
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span className="text-[10px] whitespace-nowrap">
                    partnerships@telexph.com
                </span>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="text-[10px] whitespace-nowrap">
                    +63 (44) 331 - 5040
                </span>
              </span>
            </div>

            {/* 2nd Line: Address - Centered */}
            <Link
              href="/location"
              className="flex items-center justify-center gap-1 hover:opacity-80 transition-opacity text-center"
            >
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-[10px] underline underline-offset-2 whitespace-nowrap">
                Cawayan Bugtong, Guimba, Nueva Ecija
              </span>
            </Link>

            {/* Social Icons - COMPLETELY REMOVED IN THIS VIEW */}
          </div>
        </Container>
      </div>
    </>
  );
};

export default TopBar;