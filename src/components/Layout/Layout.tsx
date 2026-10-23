import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { OfferStrip } from "../OfferBanner";
import { ReactLenis } from "@studio-freight/react-lenis";

const Layout = () => {
  const location = useLocation();
  const isMerchandise = location.pathname === "/merchandise";

  return (
    <ReactLenis root>
      <Navbar />
      <div className={isMerchandise ? "" : "pt-24 md:pt-28"}>
        {!isMerchandise && <OfferStrip />}
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </ReactLenis>
  );
};

export default Layout;
