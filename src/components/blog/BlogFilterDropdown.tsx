import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, X } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
  icon: React.ElementType;
  desc?: string;
}

interface BlogFilterDropdownProps {
  title: string;
  icon: React.ElementType;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  accentColor?: "amber" | "orange" | "red";
  align?: "left" | "right";
}

export const BlogFilterDropdown: React.FC<BlogFilterDropdownProps> = ({
  title,
  icon: TriggerIcon,
  options,
  selectedValue,
  onSelect,
  accentColor = "amber",
  align = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isFiltered =
    selectedValue !== "All" &&
    selectedValue !== "All Industries" &&
    selectedValue !== "All Services";

  const selectedOption = options.find((opt) => opt.value === selectedValue) || options[0];
  const SelectedIcon = selectedOption?.icon || TriggerIcon;

  return (
    <div
      ref={dropdownRef}
      data-lenis-prevent
      data-lenis-prevent-wheel="true"
      data-lenis-prevent-touch="true"
      className={`relative select-none flex-1 sm:flex-initial transition-all ${
        isOpen ? "z-[100]" : "z-20"
      }`}
    >
      {/* ── Ultra Pro Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group relative h-14 px-4 sm:px-5 rounded-2xl flex items-center justify-between gap-3.5 transition-all duration-300 w-full sm:w-auto sm:min-w-[210px] md:min-w-[230px] font-medium text-sm
          ${
            isOpen
              ? "bg-white dark:bg-zinc-900 border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/25"
              : isFiltered
              ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/50 shadow-sm text-foreground"
              : "bg-white dark:bg-zinc-900/90 border-zinc-200/90 dark:border-zinc-800/90 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-sm hover:shadow-md text-foreground"
          }
          border backdrop-blur-xl
        `}
      >
        {/* Left Icon with soft gradient container */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
              isFiltered || isOpen
                ? "bg-amber-500/15 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10"
            }`}
          >
            <SelectedIcon size={16} />
          </div>

          {/* Current Label */}
          <div className="text-left min-w-0">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 leading-none mb-1">
              {title}
            </span>
            <span className="block text-xs sm:text-sm font-semibold truncate text-foreground leading-tight">
              {selectedOption.label}
            </span>
          </div>
        </div>

        {/* Right Arrow / Clear indicator */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {isFiltered && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelect(options[0].value);
              }}
              title="Reset filter"
              className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-white text-zinc-600 dark:text-zinc-400 flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={11} />
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground group-hover:text-foreground"
          >
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </button>

      {/* ── Animated Dropdown Popover (Guaranteed z-[100] & Clean Placement) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className={`absolute top-[calc(100%+8px)] ${
              align === "right" ? "right-0" : "left-0"
            } w-[285px] sm:w-[305px] flex flex-col rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] z-[100] max-h-[350px] overflow-hidden`}
          >
            {/* Popover Header (Sticky / Fixed) */}
            <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/60 select-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Filter by {title}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-muted-foreground">
                {options.length} options
              </span>
            </div>

            {/* Options List (Scrollable with Lenis prevention + Wheel StopPropagation) */}
            <div
              data-lenis-prevent
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-1 review-scroll"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
              }}
            >
              {options.map((opt) => {
                const Icon = opt.icon;
                const isSelected = opt.value === selectedValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelect(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between gap-3 transition-all duration-150 group
                      ${
                        isSelected
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-foreground"
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <span className="block truncate">{opt.label}</span>
                        {opt.desc && (
                          <span className="block text-[10px] text-muted-foreground truncate">
                            {opt.desc}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogFilterDropdown;
