/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NavItem } from "../types/sidebar";
import {
  FaClipboardList,
  FaDiscord,
  FaPlay,
  FaPowerOff,
} from "react-icons/fa6";
import { FaCog, FaMapMarkedAlt } from "react-icons/fa";
import { isEnvBrowser } from "../lib/isEnvBrowser";
import type { appData } from "../types/pausemenu";
import { useNuiEvent } from "../lib/useNuiEvent";
import { fetchNui } from "../lib/fetchNui";
import Sidebar from "./Sidebar";

const PauseMenu = () => {
  const [visible, setVisible] = useState<boolean>(isEnvBrowser());
  const [navIndex, setNavIndex] = useState<number>(0);
  const [restartTime, setRestartTime] = useState<appData>({
    restartIn: "00:00:00",
    discord: "https://discord.gg/YCTFN87sAj",
  });

  const { t } = useTranslation();
  const navItems: NavItem[] = [
    {
      label: t("backToGame"),
      icon: <FaPlay className='text-sm' />,
      action: "backtogame",
    },
    {
      label: t("map"),
      icon: <FaMapMarkedAlt className='text-sm' />,
      action: "map",
    },
    {
      label: t("settings"),
      icon: <FaCog className='text-sm' />,
      action: "settings",
    },
    {
      label: t("report"),
      icon: <FaClipboardList className='text-sm' />,
      action: "report",
    },
    {
      label: t("disconnect"),
      icon: <FaPowerOff className='text-sm' />,
      action: "disconnect",
    },
  ];

  useNuiEvent<{ visible: boolean }>(
    "sd_pausemenu:nui:setVisible",
    (payload) => {
      setVisible(payload.visible);
    },
  );

  useNuiEvent<appData>("sd_pausemenu:nui:setRestartTime", (payload) => {
    setRestartTime(payload);
  });

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case "backtogame":
        fetchNui("sd_pausemenu:nui:backToGame");
        break;
      case "map":
        fetchNui("sd_pausemenu:nui:openMap");
        break;
      case "report":
        fetchNui("sd_pausemenu:nui:report");
        break;
      case "settings":
        fetchNui("sd_pausemenu:nui:openSettings");
        break;
      case "disconnect":
        fetchNui("sd_pausemenu:nui:disconnect");
        break;
      default:
        break;
    }
  }, []);

  const handleDisordClick = () => {
    if (isEnvBrowser()) {
      window.open(restartTime.discord, "_blank");
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).invokeNative("openUrl", restartTime.discord);
      } catch {
        window.open(restartTime.discord, "_blank");
      }
    }
  };

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        fetchNui("sd_pausemenu:nui:close");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setNavIndex((prev) => Math.min(prev + 1, navItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setNavIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = navItems[navIndex];
        if (item?.action) {
          handleAction(item.action);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, navIndex, handleAction, navItems]);

  if (!visible) return null;

  return (
    <div className='absolute select-none inset-0 flex items-center px-17.5 pr-22.5 pausemenu-overlay'>
      <Sidebar
        navItems={navItems}
        activeIndex={navIndex}
        onAction={handleAction}
        onHover={setNavIndex}
      />

      <div className='flex absolute top-10 left-1/2 flex-col items-center -translate-x-1/2'>
        <img
          src='logo.png'
          alt='Server Logo'
          className='object-contain w-32 h-32 drop-shadow-xl transition-transform duration-500 hover:scale-105'
        />
        <p className='mt-3 text-xl font-extrabold tracking-wider uppercase pausemenu-restart-text'>
          {t("restart", { time: restartTime.restartIn })}
        </p>
      </div>

      <div className='absolute right-10 bottom-10'>
        <FaDiscord
          className='text-3xl transition-all duration-300 cursor-pointer pausemenu-discord-icon'
          onClick={handleDisordClick}
        />
      </div>
    </div>
  );
};

export default PauseMenu;
