"use client";
import { myQuery } from "@/api/query";
import HistoryVideo from "@/components/history/HistoryVideo";
import { useThemeColors } from "@/hooks/useThemeColors";
import { RootState } from "@/lib/store";
import { Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSelector } from "react-redux";

const History = () => {
  const token = useSelector((state: RootState) => state.token);
  const { textColor, secondaryTextColor } = useThemeColors();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["history"],
    queryFn: () => myQuery.getHistory(token),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  console.log(data);

  return (
    <div className="mx-auto w-fit">
      <Text fontSize={"4xl"} fontWeight={"bold"} color={textColor}>
        Watch history
      </Text>
      <Text fontSize={"2xl"} fontWeight={"bold"} color={secondaryTextColor}>
        Today
      </Text>
      {data?.data?.map(
        (
          vdo: {
            description: string;
            duration: number;
            thumbnail: string;
            title: string;
            _id: string;
            owner: {
              fullName: string;
            };
            views: number;
          },
          i: number
        ) => (
          <HistoryVideo
            key={i}
            description={vdo.description}
            duration={vdo.duration}
            thumbnail={vdo.thumbnail}
            title={vdo.title}
            videoId={vdo._id}
            fullName={vdo.owner.fullName}
            views={vdo.views}
          />
        )
      )}
    </div>
  );
};

export default History;
