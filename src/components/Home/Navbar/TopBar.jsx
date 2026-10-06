import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";
import Container from "@/components/Container/Container";
const EMAILS = [
  { address: "business@telexph.com", note: "for business partnership" },
  { address: "careers@telexph.com", note: "for employment and recruitment inquiries" }
];
const EmailLinks = ({ stacked = false, size = "", icon = "w-4 h-4" }) => (
  <span className={`flex ${stacked ? "flex-col gap-1 items-start" : "items-center gap-5"} ${size}`}>
    {EMAILS.map(({ address, note }) => (
      <a key={address} href={`mailto:${address}`} title={note} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Mail className={`${icon} shrink-0`} />
        <span className={stacked ? "" : "whitespace-nowrap"}>
          {address}
          <span className="ml-1 text-[0.85em] opacity-80">({note})</span>
        </span>
      </a>
    ))}
  </span>
);
const TopBar = () => {
  const facebookLink = "https://www.facebook.com/telexphilippines?mibextid=wwXIfr&rdid=dnj2588eSOaWfMgW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BvrjZDJZq%2F%3Fmibextid%3DwwXIfr#";
  return <>
      <div
    className="hidden lg:block text-white"
    style={{ backgroundColor: "#a10000" }}
  >
        <Container>
          <div className="flex items-center h-10 text-sm">
            <div className="flex items-center gap-6 flex-1">
              <EmailLinks />
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">0443252836</span>
              </span>
            </div>
            <div className="flex items-center gap-6 flex-1 justify-end">
              <Link
    href="/location"
    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
  >
                <MapPin className="w-4 h-4" />
                <span className="whitespace-nowrap underline underline-offset-2">
                  Guimba, Nueva Ecija, Philippines
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

      <div
    className="hidden md:block lg:hidden text-white"
    style={{ backgroundColor: "#a10000" }}
  >
        <Container>
          <div className="flex flex-col py-2 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <EmailLinks stacked />
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="whitespace-nowrap">0443252836</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Link
    href="/location"
    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
  >
                <MapPin className="w-4 h-4" />
                <span className="text-xs sm:text-sm underline underline-offset-2">
                  Guimba, Nueva Ecija
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

      <div
    className="hidden sm:block md:hidden text-white"
    style={{ backgroundColor: "#a10000" }}
  >
        <Container>
          <div className="px-2 py-2 text-sm space-y-1 flex flex-col items-center">
            <div className="flex flex-col items-start gap-1 w-full">
              <EmailLinks stacked size="text-xs" icon="w-3.5 h-3.5" />
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-xs whitespace-nowrap">
                    0443252836
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <Link
    href="/location"
    className="flex items-center gap-1 hover:opacity-80 transition-opacity text-center"
  >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs underline underline-offset-2 whitespace-nowrap">
                  Guimba, Nueva Ecija
                </span>
              </Link>
              <div className="flex items-center gap-2">
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
      <div
    className="block sm:hidden text-white"
    style={{ backgroundColor: "#a10000" }}
  >
        <Container>
          <div className="px-1 py-1.5 text-xs space-y-1 flex flex-col items-center">
            <div className="flex flex-col items-start gap-1 w-full">
              <EmailLinks stacked size="text-[10px]" icon="w-3 h-3" />
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="text-[10px] whitespace-nowrap">
                    0443252836
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <Link
    href="/location"
    className="flex items-center gap-1 hover:opacity-80 transition-opacity text-center"
  >
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="text-[10px] underline underline-offset-2 whitespace-nowrap">
                  Guimba, Nueva Ecija
                </span>
              </Link>
              <div className="flex items-center gap-1.5">
                <a
    href={facebookLink}
    target="_blank"
    rel="noopener noreferrer"
  >
                  <Facebook className="w-3 h-3 cursor-pointer hover:opacity-80 transition-opacity" />
                </a>
                <Twitter className="w-3 h-3 cursor-pointer hover:opacity-80 transition-opacity" />
                <Instagram className="w-3 h-3 cursor-pointer hover:opacity-80 transition-opacity" />
                <Youtube className="w-3 h-3 cursor-pointer hover:opacity-80 transition-opacity" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>;
};
var stdin_default = TopBar;
export {
  stdin_default as default
};
