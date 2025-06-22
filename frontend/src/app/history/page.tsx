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
  video: {
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
  };
  watchedAt: string;
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
      (acc: { [key: string]: HistoryVideoType[] }, entry: HistoryVideoType) => {
        const watchedDate = parseISO(entry.watchedAt);
        let dateKey: string;

        if (isToday(watchedDate)) {
          dateKey = "Today";
        } else if (isYesterday(watchedDate)) {
          dateKey = "Yesterday";
        } else {
          dateKey = format(watchedDate, "MMMM d, yyyy");
        }

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].push(entry);
        return acc;
      },
      {}
    );
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="mx-auto w-fit">
      <Text fontSize={"4xl"} fontWeight={"bold"} color={textColor} mb={8}>
        Watch history
      </Text>

      {Object.keys(groupedHistory).map((date) => (
        <Box key={date} mb={8}>
          <Text fontSize={"2xl"} fontWeight={"bold"} color={secondaryTextColor} mb={4}>
            {date}
          </Text>

          {groupedHistory[date].map((entry:HistoryVideoType) => (
            <HistoryVideo
              key={entry.video._id}
              videoId={entry.video._id}
              title={entry.video.title}
              thumbnail={entry.video.thumbnail}
              description={entry.video.description}
              duration={entry.video.duration}
              fullName={entry.video.owner.fullName}
              views={entry.video.views}
             
            />
          ))}
        </Box>
      ))}
    </div>
  );
};

export default History;
