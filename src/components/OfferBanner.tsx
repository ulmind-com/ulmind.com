/* ──────────────────────────────────────────────────────────────
   ULMiND — Public Offer Display
   - No image  → compact gradient strip hanging BELOW the navbar
   - Has image → centered popup modal on first load, dismissable
   ────────────────────────────────────────────────────────────── */

import React, { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface OfferData {
  _id: string;
  title: string;
  description: string;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  image: { url: string; public_id: string } | null;
}

const API_URL = "https://ulmind-backend.onrender.com/api/v1/offers/active";

/** Compact strip that hangs below the navbar (rendered INSIDE the nav container) */
export const OfferStrip: React.FC = () => {
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = sessionStorage.getItem("ulmind_dismissed_banners");
    if (saved) setDismissed(new Set(JSON.parse(saved)));

    fetch(API_URL)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOffers(data); })
      .catch(console.error);
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    sessionStorage.setItem("ulmind_dismissed_banners", JSON.stringify([...next]));
  };

  const bannerOffers = offers.filter(o => !o.image && !dismissed.has(o._id));

  if (bannerOffers.length === 0) return null;

  const offer = bannerOffers[0]; // Show one at a time

  return (
    <AnimatePresence>
      <motion.div
        key={offer._id}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="offer-strip-container"
      >
        <div className="offer-strip-shimmer" />

        <div className="offer-strip-content">
          <Tag size={13} color="#fff" style={{ flexShrink: 0 }} />
          <span className="offer-strip-title">
            {offer.title}
          </span>
          {offer.description && (
            <span className="offer-strip-desc">
              {offer.description}
            </span>
          )}
        </div>

        <button
          onClick={() => dismiss(offer._id)}
          className="offer-strip-close"
          aria-label="Dismiss"
        >
          <X size={12} />
        </button>

        <style>{`
          .offer-strip-container {
            background: linear-gradient(135deg, #7c3aed 0%, #e11d48 50%, #f59e0b 100%);
            padding: 8px 40px 8px 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
          }
          .offer-strip-shimmer {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
            animation: shimmer 3s ease-in-out infinite;
          }
          .offer-strip-content {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: center;
            position: relative;
            z-index: 1;
            text-align: center;
          }
          .offer-strip-title {
            color: #fff;
            font-weight: 700;
            font-size: 12px;
          }
          .offer-strip-desc {
            color: rgba(255,255,255,0.85);
            font-size: 11px;
            font-weight: 400;
          }
          .offer-strip-close {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            background: rgba(255,255,255,0.15);
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #fff;
            flex-shrink: 0;
            transition: background 0.2s;
          }
          .offer-strip-close:hover {
            background: rgba(255,255,255,0.3);
          }
          @media (min-width: 768px) {
            .offer-strip-container {
              padding: 10px 48px 10px 20px;
            }
            .offer-strip-title {
              font-size: 14px;
            }
            .offer-strip-desc {
              font-size: 13px;
            }
            .offer-strip-close {
              right: 14px;
              width: 22px;
              height: 22px;
            }
          }
          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};


/** Popup modal for image-based offers — rendered once at page load */
export const OfferPopup: React.FC = () => {
  const [offers, setOffers] = useState<OfferData[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = sessionStorage.getItem("ulmind_dismissed_popups");
    if (saved) setDismissed(new Set(JSON.parse(saved)));

    fetch(API_URL)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOffers(data); })
      .catch(console.error);
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    sessionStorage.setItem("ulmind_dismissed_popups", JSON.stringify([...next]));
  };

  const popupOffers = offers.filter(o => o.image && !dismissed.has(o._id));
  if (popupOffers.length === 0) return null;

  const offer = popupOffers[0];

  return (
    <AnimatePresence>
      <motion.div
        key="offer-popup-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={() => dismiss(offer._id)}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, cursor: "pointer",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            position: "relative", maxWidth: 520, width: "100%",
            borderRadius: 16, overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)", cursor: "default",
            background: "#111",
          }}
        >
          <button
            onClick={() => dismiss(offer._id)}
            style={{
              position: "absolute", top: 12, right: 12, zIndex: 10,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff",
            }}
          >
            <X size={16} />
          </button>

          <img
            src={offer.image!.url}
            alt={offer.title}
            style={{ width: "100%", display: "block" }}
          />

          {(offer.title || offer.description) && (
            <div style={{ padding: "16px 20px", background: "#111" }}>
              {offer.title && (
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {offer.title}
                </h3>
              )}
              {offer.description && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                  {offer.description}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfferStrip;
