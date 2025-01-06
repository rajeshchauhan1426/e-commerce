"use client";

import Usermenu from "./Usermenu";
import React, { useState, useEffect } from "react";
import { SafeUser } from "@/app/types";
import { MainNav } from "./main-nav";
import StoreSwither from "../store-switcher";
import { usePathname } from "next/navigation";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== prevPath) {
      setIsLoading(true);
      setPrevPath(pathname);
      // Simulate loading time or tie it to actual data fetching
      const timer = setTimeout(() => setIsLoading(false), 800); // 800ms for slower loading effect
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  return (
    <div className="border-b bg-white relative">
      {/* Loading Line */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-[4px] bg-blue-600 animate-slow-pulse"></div>
      )}

      <div className="flex flex-row items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <StoreSwither />
          <MainNav className="x-6" />
        </div>

        <Usermenu currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Navbar;
