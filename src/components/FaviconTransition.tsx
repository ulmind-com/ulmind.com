import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const FaviconTransition = () => {
  const location = useLocation();
  const originalFavicons = useRef([]);
  const animationInterval = useRef(null);
  const restoreTimeout = useRef(null);

  useEffect(() => {
    // সার্ভার-সাইড রেন্ডারিং (SSR) এড়ানোর জন্য চেক
    if (typeof document === "undefined") return;

    // HTML থেকে সমস্ত আইকন ট্যাগ খুঁজে বের করা
    const links = Array.from(
      document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']")
    );

    if (links.length === 0) return;

    // ওয়েবসাইটের আসল আইকনগুলোর ডাটা প্রথমবার সেভ করা
    if (originalFavicons.current.length === 0) {
      originalFavicons.current = links.map((link) => ({
        el: link,
        href: link.getAttribute("href") || "/favicon.ico",
      }));
    }

    // আগের কোনো অ্যানিমেশন বা টাইমার চললে সেটা বন্ধ করা (দ্রুত ক্লিক করলে যাতে সমস্যা না হয়)
    clearInterval(animationInterval.current);
    clearTimeout(restoreTimeout.current);

    let angle = 0;

    // ফেভিকন ঘোরানোর ফাংশন (প্রতিবার এঙ্গেল পরিবর্তন করবে)
    const rotateFavicon = () => {
      angle = (angle + 30) % 360; // প্রতিবার ৩০ ডিগ্রি করে ঘুরবে

      // ডাইনামিক SVG যেখানে রঙ সাদা করা হয়েছে
      // `stroke='%23ffffff'` অংশটি রঙ পরিবর্তন করে। `%23` হলো `#` এর URL-encoded রূপ।
      const spinnerSvg = `data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='16' cy='16' r='12' fill='none' stroke='%23ffffff' stroke-width='5' stroke-dasharray='50' stroke-linecap='round' transform='rotate(${angle} 16 16)' /%3E%3C/svg%3E`;

      originalFavicons.current.forEach(({ el }) => {
        el.setAttribute("href", spinnerSvg);
      });
    };

    // প্রতি 50 মিলি-সেকেন্ড পরপর আইকন আপডেট করে অ্যানিমেশন তৈরি করা
    animationInterval.current = setInterval(rotateFavicon, 50);

    // 700 মিলি-সেকেন্ড (0.7s) পর অ্যানিমেশন থামিয়ে আসল আইকনে ফিরিয়ে আনা
    restoreTimeout.current = setTimeout(() => {
      clearInterval(animationInterval.current); // ঘোরানো বন্ধ
      originalFavicons.current.forEach(({ el, href }) => {
        el.setAttribute("href", href); // আসল আইকন সেট
      });
    }, 700);

    // ক্লিনআপ ফাংশন
    return () => {
      clearInterval(animationInterval.current);
      clearTimeout(restoreTimeout.current);
      // কেউ যদি খুব দ্রুত এক পেজ থেকে অন্য পেজে যায়, তখন আসল আইকন যেন হারিয়ে না যায়
      originalFavicons.current.forEach(({ el, href }) => {
        el.setAttribute("href", href);
      });
    };
  }, [location.pathname, location.search]); // যখনই URL-এর পাথ বা সার্চ কোয়েরি পরিবর্তন হবে, এটি কাজ করবে

  return null; // এই কম্পোনেন্টটি UI-তে কিছু দেখাবে না, ব্যাকগ্রাউন্ডে কাজ করবে
};