// Making this a client component
"use client";

import React from "react";
import { usePathname } from "next/navigation"; // Corrected hook for App Router
import SidebarDemo from "@/components/SideBarWrapper";

export default function LayoutWithRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login" && pathname !== "/register";

  return showSidebar ? <SidebarDemo>{children}</SidebarDemo> : <>{children}</>;
}
