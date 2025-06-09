import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

import Video from "../Video";




export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    _id: string;
    title: string;
    thumbnail: string;
    duration: number;
    ownerDetails: {
      avatar: string;
      fullName: string;
    };
    createdAt: string;
    views: number;
    description: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 3xl:grid-cols-5",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?._id}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gray-700/50 dark:bg-gray-300/50 block rounded-2xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.5 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.5, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Video duration={item.duration} thumbnail={item.thumbnail} title={item.title} videoId={item._id} uploadTime={item.createdAt} views={item.views} channelName={item.ownerDetails.fullName} logo={item.ownerDetails.avatar} isProfile={false} />
        </div>
      ))}
    </div>
  );
};

