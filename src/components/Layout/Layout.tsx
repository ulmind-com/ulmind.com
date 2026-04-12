import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import {Footer } from "./Footer";
import { OfferStrip } from "../OfferBanner";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <OfferStrip />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
