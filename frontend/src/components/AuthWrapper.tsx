"use client";
import { RootState } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";

const AuthWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.isAuthenticated
  );

  // Redirect to /login if not authenticated and not on /login or /register
  useEffect(() => {
    if (
      !isAuthenticated &&
      pathname !== "/login" &&
      pathname !== "/register" &&
      !pathname.startsWith("/embed/video/") &&
      !pathname.startsWith("/embed/tweet/")
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, pathname, router]);

  // Redirect authenticated users away from /login and /register
  useEffect(() => {
    if (
      isAuthenticated &&
      (pathname === "/login" || pathname === "/register")
    ) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Allow rendering of /login and /register pages even if not authenticated
  if (!isAuthenticated && (pathname === "/login" || pathname === "/register" || pathname.startsWith("/embed/video/"))) {
    return children;
  }

  // Prevent rendering content before redirection
  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default AuthWrapper;
