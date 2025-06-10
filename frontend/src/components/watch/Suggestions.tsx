import { useThemeColors } from "@/hooks/useThemeColors";
import { Box,  Text, useColorMode } from "@chakra-ui/react";
import { IconDotsVertical } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Suggestions = () => {
  const {  textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();
  return (
    <Box className=" p-2 rounded-lg flex gap-2 justify-between relative hover:bg-[#202020] transition-all duration-300">
     
      <Box className="flex gap-2 w-full ">
        <Link href={"/watch/6840426746f14d9fac997954 "} className="w-2/5">
          <Image
            src={
              "https://res.cloudinary.com/dqvqvvwc8/video/upload/v1749041765/v8qfcsf55nq7pjmfyrcu.jpg?so=1"
            }
            alt="test"
            width={100}
            height={100}
            className="rounded-lg w-full"
          />
        </Link>

        <Box className=" ">
          <Link href={"/watch/6840426746f14d9fac997954"}>
            <Text className="h-fit" color={textColor} fontSize={"18px"}>
              Video title
            </Text>
          </Link>
          <Box className="">
            <Link href={"/watch/6840426746f14d9fac997954"}>
              <Text
                className="h-fit"
                color={secondaryTextColor}
                fontSize={"xs"}
              >
                Channel Name
              </Text>
            </Link>
            <Text className="h-fit" color={secondaryTextColor} fontSize={"xs"}>
              1000 views
            </Text>
          </Box>
        </Box>
      </Box>

      <Box>
        <IconDotsVertical
          style={{ color: colorMode === "dark" ? "white" : "black" }}
        />
      </Box>
    </Box>
  );
};

export default Suggestions;
