import ResponsiveNav from "@/components/Home/Navbar/ResponsiveNav";
import Home from "@/components/Home/Home";
import ExitIntentPopup from "./ExitIntent/ExitIntentPopup";

const HomePage = () => {
  return (
    <div>
      <ResponsiveNav />
      <Home />
      <ExitIntentPopup />
    </div>
  );
};

export default HomePage;
