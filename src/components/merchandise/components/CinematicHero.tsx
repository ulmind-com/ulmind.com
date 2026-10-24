import React, { useEffect, useRef, useState, useCallback } from "react";
import "../cinematic-hero.css";

const BRANCHES = {
  scene:    { fwd: "v2f", rev: "v2r", label: "Scene",    idx: 1 },
  light:    { fwd: "v3f", rev: "v3r", label: "Lighting", idx: 2 },
  colorway: { fwd: "v1f", rev: "v1r", label: "Clothing", idx: 3 },
  fullLook: { fwd: "v4f", rev: "v4r", label: "Cast",     idx: 4 }
} as const;

type BranchKey = keyof typeof BRANCHES;

const CAP_POS = [
  { left: "-5px",  width: "calc(20% + 5px)" },
  { left: "20%",   width: "20%" },
  { left: "40%",   width: "20%" },
  { left: "60%",   width: "20%" },
  { left: "80%",   width: "calc(20% + 5px)" }
];

const HOLD_DEFAULT = 0.08;
const HOLD_SCENE_REV = 0.18;
const FIRST_FRAME_TIMEOUT = 12000;

export default function CinematicHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelCellRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const btnRefs = useRef<{ [key in BranchKey]?: HTMLButtonElement | null }>({});

  const [sceneState, setSceneState] = useState<"base" | BranchKey>("base");
  const [locked, setLocked] = useState(false);
  const [readyButtons, setReadyButtons] = useState<{ [key in BranchKey]: boolean }>({
    scene: false,
    light: false,
    colorway: false,
    fullLook: false
  });
  const [titleHidden, setTitleHidden] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const tokenRef = useRef(0);
  const stateRef = useRef({
    scene: "base" as "base" | BranchKey,
    locked: false,
    visibleVideo: null as HTMLVideoElement | null,
    hadFocus: false
  });

  const announce = useCallback((msg: string) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "";
      setTimeout(() => {
        if (liveRegionRef.current) liveRegionRef.current.textContent = msg;
      }, 60);
    }
  }, []);

  const showVideo = useCallback((vid: HTMLVideoElement) => {
    if (stateRef.current.visibleVideo && stateRef.current.visibleVideo !== vid) {
      stateRef.current.visibleVideo.classList.remove("media-visible");
    }
    vid.classList.add("media-visible");
    stateRef.current.visibleVideo = vid;
  }, []);

  const setCapsulePos = useCallback((idx: number) => {
    if (!controllerRef.current) return;
    controllerRef.current.style.setProperty("--cap-left", CAP_POS[idx].left);
    controllerRef.current.style.setProperty("--cap-width", CAP_POS[idx].width);
  }, []);

  // Update hover and focus
  const hoverIdxRef = useRef(-1);
  const kbFocusIdxRef = useRef(-1);

  const updateCapsuleFromHover = useCallback(() => {
    if (stateRef.current.scene !== "base" || stateRef.current.locked) return;
    const isMobile = window.innerWidth <= 700;
    if (isMobile) return;

    const idx = kbFocusIdxRef.current > 0 ? kbFocusIdxRef.current : hoverIdxRef.current;
    if (idx > 0) {
      setCapsulePos(idx);
      labelCellRef.current?.classList.add("cinematic-label-dimmed");
    } else {
      setCapsulePos(0);
      labelCellRef.current?.classList.remove("cinematic-label-dimmed");
    }
  }, [setCapsulePos]);

  // Video hold time calculation
  const getHoldTime = useCallback((vid: HTMLVideoElement, branch: BranchKey, dir: "forward" | "reverse") => {
    const dur = vid.duration || 2.08;
    if (branch === "scene" && dir === "reverse") return dur - HOLD_SCENE_REV;
    return dur - HOLD_DEFAULT;
  }, []);

  // Wait for the first visible frame of video
  const waitFirstFrame = useCallback((vid: HTMLVideoElement, token: number) => {
    return new Promise<void>((resolve, reject) => {
      let done = false;
      let timer: ReturnType<typeof setTimeout> | null = null;
      let cbId: number | null = null;
      let rafId: number | null = null;

      const cleanup = () => {
        done = true;
        if (timer) clearTimeout(timer);
        if (cbId && (vid as any).cancelVideoFrameCallback) {
          (vid as any).cancelVideoFrameCallback(cbId);
        }
        if (rafId) cancelAnimationFrame(rafId);
      };

      const fail = (reason: string) => {
        if (done) return;
        cleanup();
        reject(reason);
      };

      const succeed = () => {
        if (done) return;
        cleanup();
        resolve();
      };

      timer = setTimeout(() => {
        fail("timeout");
      }, FIRST_FRAME_TIMEOUT);

      if ("requestVideoFrameCallback" in HTMLVideoElement.prototype) {
        const rvfcCheck = (_now: number, meta: any) => {
          if (done) return;
          if (tokenRef.current !== token) { fail("stale"); return; }
          if (meta.mediaTime <= 0.5 && vid.readyState >= 2) {
            succeed();
          } else {
            cbId = (vid as any).requestVideoFrameCallback(rvfcCheck);
          }
        };
        cbId = (vid as any).requestVideoFrameCallback(rvfcCheck);
      } else {
        const check = () => {
          if (done) return;
          if (tokenRef.current !== token) { fail("stale"); return; }
          if (vid.readyState >= 2 && !vid.paused) {
            rafId = requestAnimationFrame(() => {
              rafId = requestAnimationFrame(() => {
                if (!done) succeed();
              });
            });
          } else {
            rafId = requestAnimationFrame(check);
          }
        };
        vid.addEventListener("playing", () => {
          rafId = requestAnimationFrame(check);
        }, { once: true });
        rafId = requestAnimationFrame(check);
      }
    });
  }, []);

  // Monitor playback until hold time
  const monitorHold = useCallback((vid: HTMLVideoElement, holdTime: number, token: number) => {
    return new Promise<void>((resolve) => {
      let done = false;
      const cleanup = () => { done = true; };

      const endHandler = () => {
        if (done || tokenRef.current !== token) return;
        cleanup();
        try { vid.pause(); } catch {}
        resolve();
      };
      vid.addEventListener("ended", endHandler, { once: true });

      const tick = () => {
        if (done || tokenRef.current !== token) return;
        if (vid.currentTime >= holdTime) {
          vid.removeEventListener("ended", endHandler);
          cleanup();
          try { vid.pause(); } catch {}
          resolve();
          return;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, []);

  // Forward transition
  const playForward = useCallback(async (branchKey: BranchKey) => {
    if (stateRef.current.locked || stateRef.current.scene !== "base") return;

    stateRef.current.locked = true;
    setLocked(true);
    tokenRef.current++;
    const token = tokenRef.current;

    setNotice(null);
    announce(`Loading ${BRANCHES[branchKey].label} transition…`);

    const branch = BRANCHES[branchKey];
    const vid = videoRefs.current[branch.fwd];
    const btn = btnRefs.current[branchKey];
    if (!vid || !btn || !controllerRef.current) return;

    const hadFocus = document.activeElement === btn;
    stateRef.current.hadFocus = hadFocus;

    // Collapse controller UI
    const ctrlRect = controllerRef.current.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const dx = (ctrlRect.left + ctrlRect.width / 2) - (btnRect.left + btnRect.width / 2);
    const dy = (ctrlRect.top + ctrlRect.height / 2) - (btnRect.top + btnRect.height / 2);

    labelCellRef.current?.classList.add("cinematic-cell-hidden");
    (Object.keys(BRANCHES) as BranchKey[]).forEach((k) => {
      if (k !== branchKey) btnRefs.current[k]?.classList.add("cinematic-cell-hidden");
    });

    btn.classList.add("cinematic-cell-active");
    btn.style.transform = `translate(${dx}px, ${dy}px)`;

    controllerRef.current.classList.add("collapsed");
    trackRef.current?.classList.add("track-fade");

    const titleDelay = Math.min((vid.duration || 2.08) * 0.12, 0.9) * 1000;
    const titleTimer = setTimeout(() => {
      if (tokenRef.current === token) setTitleHidden(true);
    }, titleDelay);

    try {
      vid.currentTime = 0;
      await new Promise<void>((res) => {
        if (vid.currentTime < 0.001 && vid.readyState >= 2) res();
        else vid.addEventListener("seeked", () => res(), { once: true });
      });

      let playPromise = vid.play();
      if (!playPromise || typeof playPromise.then !== "function") playPromise = Promise.resolve();

      await Promise.all([playPromise, waitFirstFrame(vid, token)]);
      if (tokenRef.current !== token) return;

      showVideo(vid);

      const holdTime = getHoldTime(vid, branchKey, "forward");
      await monitorHold(vid, holdTime, token);
      if (tokenRef.current !== token) return;

      // Settle into selected state
      stateRef.current.locked = false;
      setLocked(false);
      stateRef.current.scene = branchKey;
      setSceneState(branchKey);

      btn.textContent = "Reset";
      btn.classList.remove("cinematic-cell-active");
      btn.classList.add("cinematic-cell-reset");
      btn.style.transform = "";
      btn.disabled = false;
      btn.setAttribute("data-role", "reset");

      controllerRef.current.classList.add("selected");
      if (hadFocus) btn.focus({ preventScroll: true });

      announce(`${BRANCHES[branchKey].label} selected. Press Reset to return.`);
    } catch (err) {
      if (tokenRef.current !== token) return;
      clearTimeout(titleTimer);
      console.error("Transition error:", branchKey, err);
      setNotice("Transition failed");
      announce("Transition failed. Please try again.");

      // Restore to base
      controllerRef.current?.classList.remove("collapsed", "selected");
      trackRef.current?.classList.remove("track-fade");
      labelCellRef.current?.classList.remove("cinematic-cell-hidden");
      (Object.keys(BRANCHES) as BranchKey[]).forEach((k) => {
        const b = btnRefs.current[k];
        if (b) {
          b.classList.remove("cinematic-cell-hidden", "cinematic-cell-active");
          b.style.transform = "";
        }
      });
      setTitleHidden(false);
      stateRef.current.locked = false;
      setLocked(false);
      stateRef.current.scene = "base";
      setSceneState("base");
      setCapsulePos(0);
    }
  }, [announce, getHoldTime, monitorHold, setCapsulePos, showVideo, waitFirstFrame]);

  // Reverse transition
  const playReverse = useCallback(async (branchKey: BranchKey) => {
    if (stateRef.current.locked || stateRef.current.scene !== branchKey) return;

    stateRef.current.locked = true;
    setLocked(true);
    tokenRef.current++;
    const token = tokenRef.current;

    setNotice(null);
    announce("Returning to base scene…");

    const branch = BRANCHES[branchKey];
    const vid = videoRefs.current[branch.rev];
    const btn = btnRefs.current[branchKey];
    const baseVid = videoRefs.current["v1f"];
    if (!vid || !btn || !controllerRef.current || !baseVid) return;

    const hadFocus = document.activeElement === btn;

    btn.disabled = true;
    btn.textContent = branch.label;
    btn.classList.remove("cinematic-cell-reset");
    btn.removeAttribute("data-role");

    controllerRef.current.classList.remove("collapsed", "selected");
    controllerRef.current.classList.add("expanding");
    trackRef.current?.classList.remove("track-fade");
    trackRef.current?.classList.add("expanding");

    labelCellRef.current?.classList.remove("cinematic-cell-hidden");
    labelCellRef.current?.classList.add("cinematic-cell-restoring");

    (Object.keys(BRANCHES) as BranchKey[]).forEach((k) => {
      const b = btnRefs.current[k];
      if (b) {
        b.classList.remove("cinematic-cell-hidden");
        b.classList.add("cinematic-cell-restoring");
      }
    });

    setCapsulePos(0);
    labelCellRef.current?.classList.remove("cinematic-label-dimmed");

    try {
      vid.currentTime = 0;
      await new Promise<void>((res) => {
        if (vid.currentTime < 0.001 && vid.readyState >= 2) res();
        else vid.addEventListener("seeked", () => res(), { once: true });
      });

      let playPromise = vid.play();
      if (!playPromise || typeof playPromise.then !== "function") playPromise = Promise.resolve();

      await Promise.all([playPromise, waitFirstFrame(vid, token)]);
      if (tokenRef.current !== token) return;

      showVideo(vid);

      const holdTime = getHoldTime(vid, branchKey, "reverse");
      await monitorHold(vid, holdTime, token);
      if (tokenRef.current !== token) return;

      // Base video frame 0
      baseVid.currentTime = 0;
      showVideo(baseVid);

      // Finalize base
      controllerRef.current.classList.remove("expanding");
      trackRef.current?.classList.remove("expanding");
      labelCellRef.current?.classList.remove("cinematic-cell-restoring");

      (Object.keys(BRANCHES) as BranchKey[]).forEach((k) => {
        const b = btnRefs.current[k];
        if (b) {
          b.classList.remove("cinematic-cell-restoring", "cinematic-cell-hidden", "cinematic-cell-active");
          b.style.transform = "";
          b.disabled = false;
        }
      });

      stateRef.current.scene = "base";
      setSceneState("base");
      stateRef.current.locked = false;
      setLocked(false);

      setTitleHidden(false);
      announce("Returned to base scene.");

      if (hadFocus && btn) btn.focus({ preventScroll: true });
    } catch (err) {
      if (tokenRef.current !== token) return;
      console.error("Reverse error:", branchKey, err);
      setNotice("Return transition failed");
    }
  }, [announce, getHoldTime, monitorHold, setCapsulePos, showVideo, waitFirstFrame]);

  // Video readiness tracking & initial frame load
  useEffect(() => {
    const baseVid = videoRefs.current["v1f"];
    if (!baseVid) return;

    let shown = false;
    const tryShow = () => {
      if (shown) return;
      if (baseVid.readyState >= 2) {
        shown = true;
        showVideo(baseVid);
      }
    };

    baseVid.currentTime = 0;
    tryShow();
    if (!shown) {
      baseVid.addEventListener("loadeddata", tryShow);
      baseVid.addEventListener("canplay", tryShow);
      const poll = setInterval(() => {
        tryShow();
        if (shown) clearInterval(poll);
      }, 200);
      return () => {
        clearInterval(poll);
        baseVid.removeEventListener("loadeddata", tryShow);
        baseVid.removeEventListener("canplay", tryShow);
      };
    }
  }, [showVideo]);

  // Track readiness of all videos
  useEffect(() => {
    const checkAll = () => {
      const next: { [key in BranchKey]: boolean } = { ...readyButtons };
      (Object.keys(BRANCHES) as BranchKey[]).forEach((k) => {
        const b = BRANCHES[k];
        const fwd = videoRefs.current[b.fwd];
        const rev = videoRefs.current[b.rev];
        if (fwd && rev && fwd.readyState >= 2 && rev.readyState >= 2) {
          next[k] = true;
        }
      });
      setReadyButtons(next);
    };

    const listeners: Array<[HTMLVideoElement, string, () => void]> = [];
    Object.values(videoRefs.current).forEach((v) => {
      if (!v) return;
      const h = () => checkAll();
      v.addEventListener("loadeddata", h);
      v.addEventListener("canplay", h);
      listeners.push([v, "loadeddata", h], [v, "canplay", h]);
    });

    checkAll();
    const interval = setInterval(checkAll, 500);

    return () => {
      clearInterval(interval);
      listeners.forEach(([v, evt, h]) => v.removeEventListener(evt, h));
    };
  }, []);

  // Pointer movement for glass highlight
  useEffect(() => {
    const ctrl = controllerRef.current;
    if (!ctrl) return;

    const onPointerMove = (e: PointerEvent) => {
      const rect = ctrl.getBoundingClientRect();
      const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      ctrl.style.setProperty("--glass-x", `${x}%`);
      ctrl.style.setProperty("--glass-y", `${y}%`);
    };

    ctrl.addEventListener("pointermove", onPointerMove);
    return () => ctrl.removeEventListener("pointermove", onPointerMove);
  }, []);

  // Keyboard Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sceneState !== "base" && !locked) {
        playReverse(sceneState);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sceneState, locked, playReverse]);

  // Smooth scroll to #hero
  const scrollToCollection = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector("#hero");
    if (target) {
      const lenis = (window as any).__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      ref={stageRef}
      id="cinematic-hero"
      data-nav="dark"
      className={`cinematic-stage ${titleHidden ? "title-hidden" : ""}`}
      aria-label="Cinematic Fashion Hero"
    >
      {/* ═══ 8 VIDEO LAYERS ═══ */}
      <video
        ref={(el) => (videoRefs.current["v1f"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-1.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v1r"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-1-reverse.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v2f"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-2.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v2r"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-2-reverse.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v3f"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-3.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v3r"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-3-reverse.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v4f"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-4.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={(el) => (videoRefs.current["v4r"] = el)}
        className="cinematic-media"
        src="https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/designs/video-4-reverse.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* ═══ HERO COPY ═══ */}
      <div className="cinematic-copy">
        <h1 className="cinematic-title">
          <span>The</span> <span>world</span> <span>model</span>
        </h1>
        <p className="cinematic-subtitle">
          LTX builds open world models that give you full control, from production-grade video to systems that understand and operate in the physical world.
        </p>
      </div>

      {/* ═══ CONTROLLER ═══ */}
      <div
        ref={controllerRef}
        className="cinematic-controller"
        role="group"
        aria-label="Scene state controller"
        onPointerLeave={() => {
          hoverIdxRef.current = -1;
          updateCapsuleFromHover();
        }}
      >
        <div ref={trackRef} className="cinematic-track cinematic-glass" />
        <div ref={capsuleRef} className="cinematic-capsule cinematic-glass" />
        <div className="cinematic-cells">
          <div ref={labelCellRef} className="cinematic-cell cinematic-label-cell">
            Select state →
          </div>

          {(Object.keys(BRANCHES) as BranchKey[]).map((key) => {
            const b = BRANCHES[key];
            const isReady = readyButtons[key];
            return (
              <button
                key={key}
                ref={(el) => (btnRefs.current[key] = el)}
                className={`cinematic-cell cinematic-cell-btn ${!isReady ? "is-loading" : ""}`}
                data-branch={key}
                data-index={b.idx}
                disabled={!isReady || locked}
                onPointerEnter={() => {
                  hoverIdxRef.current = b.idx;
                  updateCapsuleFromHover();
                }}
                onFocus={() => {
                  kbFocusIdxRef.current = b.idx;
                  updateCapsuleFromHover();
                }}
                onBlur={() => {
                  if (kbFocusIdxRef.current === b.idx) kbFocusIdxRef.current = -1;
                  updateCapsuleFromHover();
                }}
                onClick={(e) => {
                  const target = e.currentTarget;
                  if (target.getAttribute("data-role") === "reset") {
                    playReverse(key);
                  } else {
                    playForward(key);
                  }
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ SCROLL EXPLORE PILL ═══ */}
      <a
        href="#hero"
        onClick={scrollToCollection}
        className="cinematic-scroll-pill"
        aria-label="Scroll down to Drop 07 Hoodie collection"
      >
        <span>Explore Collection</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>

      {/* ═══ ACCESSIBILITY ═══ */}
      <div ref={liveRegionRef} className="cinematic-sr-only" role="status" aria-live="polite" />

      {/* ═══ ERROR NOTICE ═══ */}
      {notice && (
        <div className="cinematic-notice notice-visible" role="alert">
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              if (sceneState !== "base") playReverse(sceneState);
            }}
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}
