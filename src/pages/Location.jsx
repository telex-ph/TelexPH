
import LocationHero from "./Location/LocationHero";
import LocationMap from "./Location/LocationMap";
import Footer from "@/components/Footer/Footer";
import { COLORS, FONTS } from "@/constant/styles";
const LocationPage = () => {
  return <div
    className="min-h-screen"
    style={{
      backgroundColor: COLORS.white,
      fontFamily: FONTS.rubik
    }}
  >
      {
    /* Hero Section */
  }
      <LocationHero />

      {
    /* Map Section - Full Width Bottom */
  }
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <LocationMap />
        </div>
      </section>

      {
    /* Footer */
  }
      <Footer />
    </div>;
};
var stdin_default = LocationPage;
export {
  stdin_default as default
};
