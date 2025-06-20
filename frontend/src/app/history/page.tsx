"use client";
import { myQuery } from "@/api/query";
import HistoryVideo from "@/components/history/HistoryVideo";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RootState } from "@/lib/store";
import { Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface HistoryVideoType {
  description: string;
  duration: number;
  thumbnail: string;
  title: string;
  _id: string;
  owner: {
    fullName: string;
  };
  views: number;
  createdAt: string;
}

const History = () => {
  const token = useSelector((state: RootState) => state.token);
  const { textColor, secondaryTextColor } = useThemeColors();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["history"],
    queryFn: () => myQuery.getHistory(token),
  });

  const groupedHistory = useMemo(() => {
    if (!data?.data) return {};

    return data.data.reduce(
      (acc: { [key: string]: HistoryVideoType[] }, video: HistoryVideoType) => {
        const videoDate = parseISO(video.createdAt);
        let dateKey: string;

        if (isToday(videoDate)) {
          dateKey = "Today";
        } else if (isYesterday(videoDate)) {
          dateKey = "Yesterday";
        } else {
          dateKey = format(videoDate, "MMMM d, yyyy");
        }

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(video);
        return acc;
      },
      {}
    );
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="mx-auto w-fit">
      <Text fontSize={"4xl"} fontWeight={"bold"} color={textColor} mb={8}>
        Watch history
      </Text>

      {Object.keys(groupedHistory).map((date) => (
        <Box key={date} mb={8}>
          <Text
            fontSize={"2xl"}
            fontWeight={"bold"}
            color={secondaryTextColor}
            mb={4}
          >
            {date}
          </Text>
          {(groupedHistory[date] as HistoryVideoType[]).map((vdo: HistoryVideoType) => (
            <HistoryVideo
              key={vdo._id}
              description={vdo.description}
              duration={vdo.duration}
              thumbnail={vdo.thumbnail}
              title={vdo.title}
              videoId={vdo._id}
              fullName={vdo.owner.fullName}
              views={vdo.views}
            />
          ))}
        </Box>
      ))}
    </div>
  );
};

export default History;
