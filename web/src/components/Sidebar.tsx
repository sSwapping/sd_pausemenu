import { useEffect, useRef } from "react";
import type { SidebarProps } from "../types/sidebar";
import { useTranslation } from "react-i18next";
import "./sidebar.css";

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
    <div className='relative w-full sidebar-container'>
      <div className='mb-6.5 px-2 sm:px-0'>
        <div className='text-left font-extrabold uppercase tracking-[1px] leading-none drop-shadow-md sidebar-title-color sidebar-title'>
          {t("pauseMenu")}
        </div>
      </div>

      <div className='mt-2.5 w-full flex flex-col sidebar-nav'>
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={index}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              className={`
                group w-full flex items-center border-none cursor-pointer rounded-lg font-semibold tracking-wide
                transition-all duration-300 ease-out relative overflow-hidden outline-none sidebar-btn
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
                className={`transition-all duration-300 sidebar-icon ${
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
