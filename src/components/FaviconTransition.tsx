import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// প্রতিটা পেজের জন্য আলাদা title
const PAGE_TITLES: Record<string, string> = {
  "/": "ULMIND | Digital Solutions & IT Services Company",
  "/about": "About Us | ULMIND",
  "/team": "Our Team | ULMIND",
  "/methodology": "Methodology | ULMIND",
  "/projects": "Projects | ULMIND",
  "/merchandise": "Shop | ULMIND",
  "/career": "Careers | ULMIND",
  "/contact": "Contact Us | ULMIND",
  "/privacy-policy": "Privacy Policy | ULMIND",
  "/terms-of-service": "Terms of Service | ULMIND",
};

export const FaviconTransition = () => {
  const location = useLocation();
  const originalFavicons = useRef([]);

  // পেজ পরিবর্তন হলে title আপডেট করা
  useEffect(() => {
    if (typeof document === "undefined") return;
    const title =
      PAGE_TITLES[location.pathname] ??
      "ULMIND | Digital Solutions & IT Services Company";
    document.title = title;
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const links = Array.from(
      document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']")
    );
    if (links.length === 0) return;

    // আসল favicon hrefs একবারই save করা হয়
    if (originalFavicons.current.length === 0) {
      originalFavicons.current = links.map((link) => ({
        el: link,
        href: link.getAttribute("href") || "/favicon.ico",
      }));
    }

    let angle = 0;

    // ✅ FIX: local variables — প্রতিটা effect নিজের interval/timeout ID রাখে
    // আগে shared ref ছিল, তাই নতুন effect পুরনো ID overwrite করত
    // ফলে cleanup ভুল ID cancel করত এবং spinner stuck হয়ে যেত
    const interval = setInterval(() => {
      angle = (angle + 30) % 360;
      const spinnerSvg = `data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='%23ffffff' stroke-width='5' stroke-dasharray='50' stroke-linecap='round' transform='rotate(${angle} 16 16)' /%3E%3C/svg%3E`;
      originalFavicons.current.forEach(({ el }) => {
        el.setAttribute("href", spinnerSvg);
      });
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval); // নিজের interval বন্ধ করে
      originalFavicons.current.forEach(({ el, href }) => {
        el.setAttribute("href", href); // আসল favicon ফেরত দেয়
      });
    }, 700);

    // cleanup: এই effect-এর নিজস্ব interval/timeout cancel করে
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      // দ্রুত navigate করলেও আসল favicon restore হবে
      originalFavicons.current.forEach(({ el, href }) => {
        el.setAttribute("href", href);
      });
    };
  }, [location.pathname, location.search]); // যখনই URL-এর পাথ বা সার্চ কোয়েরি পরিবর্তন হবে, এটি কাজ করবে

  return null; // এই কম্পোনেন্টটি UI-তে কিছু দেখাবে না, ব্যাকগ্রাউন্ডে কাজ করবে
};