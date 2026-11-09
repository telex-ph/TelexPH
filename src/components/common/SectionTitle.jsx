// Shared homepage section heading: red eyebrow with side lines, Poppins Black
// title in dark gray, and a gradient underline bar. Match "How We Start".
const SectionTitle = ({ eyebrow, subtitle, children, align = "center", className = "" }) => {
  const center = align === "center";
  const right = align === "right";
  const lines = center || right;
  return <div className={`${center ? "text-center" : right ? "text-right" : "text-left"} ${className}`}>
      {eyebrow && <p
    className={`font-open-sans-bold relative inline-block text-[#a10000] uppercase text-sm tracking-widest ${lines ? "before:content-[''] before:absolute before:top-1/2 before:-left-8 before:w-6 before:h-px before:bg-[#a10000] after:content-[''] after:absolute after:top-1/2 after:-right-8 after:w-6 after:h-px after:bg-[#a10000]" : "pl-0"} ${right ? "mr-8" : ""}`}
  >
          {eyebrow}
        </p>}
      <h2 className="font-poppins-black mt-2 text-4xl md:text-5xl leading-tight tracking-tight text-gray-900">
        {children}
      </h2>
      <span className={`mt-4 block h-1 w-20 rounded-full bg-gradient-to-r from-[#c40000] to-[#6f0000] ${center ? "mx-auto" : right ? "ml-auto" : ""}`} />
      {subtitle && <p className={`mt-5 max-w-2xl text-xs md:text-sm leading-relaxed text-gray-500 ${center ? "mx-auto" : right ? "ml-auto" : ""}`}>
          {subtitle}
        </p>}
    </div>;
};
export default SectionTitle;
