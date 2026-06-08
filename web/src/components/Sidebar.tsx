import { useEffect, useRef } from "react";
import type { SidebarProps } from "../types/sidebar";
import { useTranslation } from "react-i18next";

const Sidebar = ({
  navItems,
  activeIndex,
  onAction,
  onHover,
}: SidebarProps) => {
  const { t } = useTranslation();
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < navItems.length) {
      buttonsRef.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, navItems.length]);

  return (
    <div className='relative w-full max-w-105 3xl:max-w-120 2k:max-w-135 4k:max-w-155'>
      <div className='mb-6.5 px-2 sm:px-0'>
        <div className='text-4xl sm:text-[54px] 3xl:text-[64px] 2k:text-[72px] 4k:text-[84px] text-left font-extrabold uppercase tracking-[1px] leading-none drop-shadow-md sidebar-title-color'>
          {t("pauseMenu")}
        </div>
      </div>

      <div className='mt-2.5 w-full flex flex-col gap-2.5 3xl:gap-3'>
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              className={`
                group w-full flex items-center gap-4 px-5 py-4 3xl:px-6 3xl:py-5 2k:px-7 2k:py-6 4k:px-8 4k:py-7
                border-none cursor-pointer rounded-lg font-semibold text-base 3xl:text-lg 2k:text-xl 4k:text-2xl tracking-wide
                transition-all duration-300 ease-out relative overflow-hidden outline-none
                active:scale-[0.98]
                ${isActive ? "sidebar-btn-active" : "sidebar-btn-inactive"}
              `}
              onClick={() => {
                if (item.action) onAction(item.action);
              }}
              onMouseEnter={() => onHover(index)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`text-xl 3xl:text-2xl 2k:text-3xl 4k:text-4xl transition-all duration-300 ${
                  isActive
                    ? "scale-110 sidebar-icon-active"
                    : "sidebar-icon-inactive group-hover:scale-110"
                }`}
              >
                {item.icon}
              </span>
              <span className='relative z-10'>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
