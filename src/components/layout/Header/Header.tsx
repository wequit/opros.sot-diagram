"use client";

import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import HeaderLogo from "./parts/HeaderLogo";
import HeaderActions from "./parts/HeaderActions";
import SidebarOverlay from "./parts/SidebarOverlay";
import { useHeaderLogic } from "@/hooks/useHeaderLogic";
import dynamic from "next/dynamic";

const HeaderNav = dynamic(() => import("./parts/HeaderNav"), { ssr: false });

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const printMenuRef = useRef<HTMLDivElement>(null);

  const {
    isSticky,
    isSidebarOpen,
    windowWidth,
    userCourt,
    toggleSidebar,
  } = useHeaderLogic();

  if (!isAuthenticated || pathname === "/login") {
    return null;
  }

  return (
    <>
      <header
        className={`${
          isSticky
            ? "fixed top-0 left-0 right-0 z-40 backdrop-blur-lg bg-white/40 border-b border-gray-200 shadow-md"
            : "fixed top-0 left-0 right-0 bg-white w-full"
        } HeaderHeight h-[4.5rem] flex items-center justify-between px-6 transition-all duration-500 ${
          isSidebarOpen ? "backdrop-blur-lg" : ""
        }`}
      >
        <HeaderLogo windowWidth={windowWidth} toggleSidebar={toggleSidebar} />
        <HeaderNav windowWidth={windowWidth} userCourt={userCourt} />
        <HeaderActions printMenuRef={printMenuRef} />
      </header>
      <SidebarOverlay
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </>
  );
};

export default Header;