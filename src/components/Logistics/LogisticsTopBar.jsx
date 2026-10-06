import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Container from "@/components/Container/Container";

const FACEBOOK = "https://www.facebook.com/telexphilippines?mibextid=wwXIfr&rdid=dnj2588eSOaWfMgW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BvrjZDJZq%2F%3Fmibextid%3DwwXIfr#";

const Item = ({ href, Icon, children }) => {
  const body = (
    <>
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white group-hover:text-[#a10000] group-hover:scale-110">
        <Icon className="w-3.5 h-3.5" />
      </span>
      <span className="whitespace-nowrap">{children}</span>
    </>
  );
  return href ? (
    <a href={href} className="group flex items-center gap-2 transition-opacity hover:opacity-90">{body}</a>
  ) : (
    <span className="group flex items-center gap-2">{body}</span>
  );
};

const Social = ({ href, Icon, label }) => {
  const cls = "flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 hover:bg-white hover:text-[#a10000] hover:-translate-y-0.5";
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}><Icon className="w-3.5 h-3.5" /></a>
  ) : (
    <span aria-hidden className={`${cls} cursor-pointer`}><Icon className="w-3.5 h-3.5" /></span>
  );
};

/* Top contact bar for the logistics pages: same details as the Telex bar, one responsive layout,
   tappable phone/email. */
const LogisticsTopBar = () => {
  const reduce = useReducedMotion();
  return (
    <div className="relative overflow-hidden text-white" style={{ backgroundColor: "#a10000" }}>
      {/* soft light drifting across the bar */}
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          initial={{ left: "-30%" }}
          animate={{ left: "130%" }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        />
      )}

      <Container>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-6 py-1.5 sm:py-0 sm:h-10 text-[11px] sm:text-sm">
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-6">
            <Item Icon={Mail} href="mailto:business@telexph.com">business@telexph.com</Item>
            <Item Icon={Mail} href="mailto:careers@telexph.com">careers@telexph.com</Item>
            <Item Icon={Phone} href="tel:0443252836">0443252836</Item>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6">
            <Link href="/location" className="group flex items-center gap-2 transition-opacity hover:opacity-90">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/15 transition-all duration-300 group-hover:bg-white group-hover:text-[#a10000] group-hover:scale-110">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <span className="whitespace-nowrap underline underline-offset-2">
                <span className="hidden sm:inline">Guimba, Nueva Ecija, Philippines</span>
                <span className="sm:hidden">Guimba, Nueva Ecija</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Social href={FACEBOOK} Icon={Facebook} label="Facebook" />
              <Social Icon={Twitter} />
              <Social Icon={Instagram} />
              <Social Icon={Youtube} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LogisticsTopBar;
