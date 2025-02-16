"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/Sidebar";
import {
    IconHistory,
    IconLibraryPlus,
    IconHome,
    IconLogout,
    IconStack3
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import logo from "../../public/assets/logo.png";
import Navbar from "@/components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/slices/authSlice";
import { RootState } from "@/lib/store";
import { Avatar, Box, Text, useColorMode } from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";

export function SidebarDemo({ children }: { children: ReactNode }) {

    
    const username = useSelector((state: RootState) => state.user.username);
    const fullName = useSelector((state: RootState) => state.user.fullName);
    const avatar: string | StaticImageData | any = useSelector((state: RootState) => state.user.avatarImage);
    const dispatch = useDispatch();
    const { bgColor } = useThemeColors();
    const {colorMode} = useColorMode()


    
    const handleLogout = () => {
        dispatch(logout());
    };
    
    const links = [
        {
            label: "Home",
            href: "/",
            icon: <IconHome className="h-5 w-5 flex-shrink-0" color={colorMode == "dark"?"#EDEDED":"#1A202C"} />,
        },
        {
            label: "Subscriptions",
            href: "/subscriptions",
            icon: <IconLibraryPlus className="h-5 w-5 flex-shrink-0" color={colorMode == "dark"?"#EDEDED":"#1A202C"} />,
        },
        {
            label: "History",
            href: "/history",
            icon: <IconHistory className="h-5 w-5 flex-shrink-0" color={colorMode == "dark"?"#EDEDED":"#1A202C"} />,
        },
        {
            label: "Playlists",
            href: "/playlists",
            icon: <IconStack3 className="h-5 w-5 flex-shrink-0" color={colorMode == "dark"?"#EDEDED":"#1A202C"} />,
        },
        {
            label: "Logout",
            href: "#",
            onclick: handleLogout,
            icon: <IconLogout className="h-5 w-5 flex-shrink-0" color={colorMode == "dark"?"#EDEDED":"#1A202C"} />,
        }
    ];
    
    const [open, setOpen] = useState(false);
    
    return (
        <Box className={cn("rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border border-neutral-200 overflow-hidden", "h-[100vh]")} bg={bgColor}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: fullName,
                                href: `/profile/${username}`,
                                icon: (
                                    <Avatar src={avatar} className="!h-8 !w-8 flex-shrink-0 rounded-full" name={fullName} />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard>
                {children}
            </Dashboard>
        </Box>
    );
}

export const Logo = () => {
    const {textColor} = useThemeColors()
    
    return (
        <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black relative z-20">
            <Image src={logo} alt="" width={1000} className="w-6 " />
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`font-medium  whitespace-pre`}>
                <Text color={textColor}>YouTube</Text>
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black relative z-20">
            <Image src={logo} alt="" width={1000} className="w-6 " />
        </Link>
    );
};

const Dashboard = ({ children }: { children: ReactNode }) => {
    const { bgColor } = useThemeColors();
    return (
        <Box className="text-black w-full overflow-y-scroll" bg={bgColor}>
            <Navbar />
            <Box>{children}</Box>
        </Box>
    );
};

export default SidebarDemo;
