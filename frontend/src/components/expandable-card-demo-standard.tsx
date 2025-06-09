"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof data)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.thumbnail}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href="#"
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    Play
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    <div className="space-y-2">
                      <p><strong>Duration:</strong> {Math.floor(active.duration / 60)}:{Math.floor(active.duration % 60).toString().padStart(2, '0')}</p>
                      <p><strong>Views:</strong> {active.views.toLocaleString()}</p>
                      <p><strong>Owner:</strong> {active.owner.username}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <img 
                          src={active.owner.avatar} 
                          alt={active.owner.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium">{active.owner.username}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="max-w-4xl mx-auto w-full space-y-2">
        {data.map((video, index) => (
          <motion.div
            layoutId={`card-${video.title}-${id}`}
            key={`card-${video.title}-${index}`}
            onClick={() => setActive(video)}
            className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-all duration-200 border border-transparent"
          >
            <div className="flex items-center gap-4">
              {/* Video Index */}
              <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium min-w-[24px] text-center">
                {index + 1}
              </div>

              {/* Video Thumbnail */}
              <div className="relative w-32 h-18 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden flex-shrink-0">
                <motion.div layoutId={`image-${video.title}-${id}`}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white px-2 py-0.5 rounded-sm text-xs font-medium">
                  {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <motion.h3
                  layoutId={`title-${video.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-md line-clamp-2 leading-snug"
                >
                  {video.title}
                </motion.h3>

                {video.description && (
                  <motion.p
                    layoutId={`description-${video.description}-${id}`}
                    className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 leading-snug"
                  >
                    {video.description}
                  </motion.p>
                )}

                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <motion.button
                layoutId={`button-${video.title}-${id}`}
                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black transition-colors duration-200 flex-shrink-0"
              >
                Play
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const data = [
  {
    _id: "683f2c58dc3ae25a4309231c",
    thumbnail: "https://res.cloudinary.com/dqvqvvwc8/video/upload/v1748970582/ibfny4ogia9dgiqh75rq.jpg?so=1",
    title: "Warriyo - Mortals (feat. Laura Brehm)  Future Trap  NCS - Copyright Free Music - NoCopyrightSounds (720p, h264)",
    description: "Subscribe to NoCopyrightSounds  👉 http://ncs.lnk.to/SubscribeYouTube\r\nNCS/NoCopyrightSounds: Empowering Creators through No Copyright & Royalty Free Music\r\nFollow on Spotify: https://ncs.lnk.to/ncsreleasesid\r\n",
    duration: 230.033537,
    views: 4,
    owner: {
      _id: "679dd326edbaea33ea412def",
      username: "kunalbhai",
      avatar: "https://res.cloudinary.com/dqvqvvwc8/image/upload/v1749469493/iaa6foq2m5lslbkaruxu.png"
    }
  },
];