
import { COLORS, FONTS, getColorWithOpacity } from "@/constant/styles";
const CaseStudies = () => {
  return <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col gap-10">
        <div className="transition-all duration-300">
          <div
    className="font-bold text-xs uppercase tracking-[0.2em] mb-4"
    style={{ color: COLORS.primary, fontFamily: FONTS.openSans }}
  >
          </div>
          <h2
    className="text-2xl font-bold uppercase mb-6 hover:text-[#a10000] transition-colors"
    style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
  >
          </h2>
          <p
    className="leading-relaxed mb-8"
    style={{
      fontFamily: FONTS.rubik,
      color: getColorWithOpacity("dark", 0.7)
    }}
  >
          </p>
        </div>

        <div className="transition-all duration-300">
          <div
    className="font-bold text-xs uppercase tracking-[0.2em] mb-4"
    style={{ color: COLORS.primary, fontFamily: FONTS.openSans }}
  >
          </div>
          <h2
    className="text-2xl font-bold uppercase mb-6 hover:text-[#a10000] transition-colors"
    style={{ fontFamily: FONTS.poppins, color: COLORS.black }}
  >
          </h2>
          <p
    className="leading-relaxed mb-8"
    style={{
      fontFamily: FONTS.rubik,
      color: getColorWithOpacity("dark", 0.7)
    }}
  >
          </p>
        </div>
      </div>
    </div>;
};
var stdin_default = CaseStudies;
export {
  stdin_default as default
};
