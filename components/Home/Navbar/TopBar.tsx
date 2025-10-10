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
      {/* Desktop / Tablet - Large screens (lg and up) */}
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

      {/* Tablet - Medium screens (md to lg) */}
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

      {/* Mobile - Small screens (sm to md) */}
      <div
        className="hidden sm:block md:hidden text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
          <div className="px-4 py-2.5 text-sm space-y-2">
            {/* Email + Phone */}
            <div className="flex items-center justify-center gap-6">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-xs">partnerships@telexph.com</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="text-xs">+63 (44) 331 - 5040</span>
              </span>
            </div>

            {/* Address + Social */}
            <div className="flex items-center justify-between">
              <Link
                href="/location"
                className="flex items-center gap-2 flex-1 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs underline underline-offset-2">
                  Cawayan Bugtong, Guimba, Nueva Ecija
                </span>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                </a>
                <Twitter className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-3.5 h-3.5 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Extra Small Mobile - Below 640px */}
      <div
        className="block sm:hidden text-white"
        style={{ backgroundColor: "#a10000" }}
      >
        <Container>
          <div className="px-3 py-3 text-xs space-y-2.5">
            {/* Email + Phone */}
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>partnerships@telexph.com</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>+63 (44) 331 - 5040</span>
              </span>
            </div>

            {/* Address */}
            <Link
              href="/location"
              className="flex items-center justify-center gap-1.5 text-center hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="underline underline-offset-2">
                Cawayan Bugtong, Guimba, Nueva Ecija
              </span>
            </Link>

            {/* Social Icons */}
            <div className="flex items-center justify-center gap-4 pt-1">
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
        </Container>
      </div>
    </>
  );
};

export default TopBar;
