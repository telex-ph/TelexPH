import { Link } from "react-router-dom";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

/**
 * Big highlight card used by the Blogs and Case Studies pages. Every item's image is stacked and
 * cross-faded (with a slow zoom) when `index` changes; the caption card fades up.
 * items: [{ id, image, title, date, href }]
 */
export default function FeaturedHighlight({ items, index, onSelect, onHover, label, fallbackImg, imagePosition = "center" }) {
  const current = items[index];
  if (!current) return null;
  return <div className="lg:col-span-8 relative group mb-20 lg:mb-0" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <div className="relative h-[220px] sm:h-[300px] md:h-[380px] lg:h-[450px] w-full overflow-hidden rounded-lg shadow-[0_35px_70px_-15px_rgba(0,0,0,0.3)] bg-gray-100">
        {items.map((item, k) => <img
    key={item.id}
    src={item.image}
    alt={k === index ? item.title : ""}
    aria-hidden={k !== index}
    onError={(e) => {
      if (fallbackImg && e.target.src !== fallbackImg) e.target.src = fallbackImg;
    }}
    className="absolute inset-0 w-full h-full object-cover"
    style={{
      objectPosition: imagePosition,
      opacity: k === index ? 1 : 0,
      transform: k === index ? "scale(1.06)" : "scale(1)",
      transition: "opacity 0.9s ease, transform 7s ease-out"
    }}
  />)}
        {items.length > 1 && <div className="absolute top-3 right-3 flex gap-1.5">
            {items.map((item, k) => <button
    key={item.id}
    aria-label={`Show highlight ${k + 1}`}
    onClick={() => onSelect(k)}
    className={`h-1.5 rounded-full transition-all duration-500 ${k === index ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white"}`}
  />)}
          </div>}
      </div>
      <div key={current.id} className="animate-fade-in-up absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 bg-white px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] sm:w-[85%] max-w-[600px] border border-gray-50 flex items-center justify-between gap-3 sm:gap-6">
        <div className="flex-grow min-w-0">
          <span className="text-[#800000] font-normal text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1 sm:mb-2 block">{label}</span>
          <h1 className="text-sm sm:text-base lg:text-lg font-bold leading-tight text-gray-900 line-clamp-2"><Link to={current.href}>{current.title}</Link></h1>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <p className="text-[11px] text-gray-400 font-normal whitespace-nowrap hidden sm:block">{current.date}</p>
          <Link to={current.href} aria-label="Read" className="w-8 h-8 sm:w-10 sm:h-10 bg-[#800000] rounded-full flex items-center justify-center text-white hover:rotate-45 transition-all shadow-lg flex-shrink-0">
            <HiOutlineArrowUpRight className="text-sm sm:text-base" />
          </Link>
        </div>
      </div>
    </div>;
}
