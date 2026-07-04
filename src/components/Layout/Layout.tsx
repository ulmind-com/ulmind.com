import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { OfferStrip } from "../OfferBanner";
import { ReactLenis } from "@studio-freight/react-lenis";

const Layout = () => {
  return (
    <ReactLenis root>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <OfferStrip />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </ReactLenis>
  );
};

export default Layout;
