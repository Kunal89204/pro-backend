"use client";
import {
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { myQuery } from "@/api/query";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Video from "@/components/Video";
import Tweet from "@/components/Tweet";
import { logout } from "@/lib/slices/authSlice";
import { useRouter } from "next/navigation";

type Video = {
  createdAt: string | number;
  views: number;
  _id: string;
  title: string;
  thumbnail: string;
  duration: number;
  owner: {
    fullName: string | undefined;
    _id: string;
    username: string;
    avatar: string;
  };
};

type Tweet = {
  commentsCount: number | undefined;
  createdAt: string | undefined;
  viewsCount: number | undefined;
  _id: string|undefined;
  content: string;
  image?: string;
  owner: {
    fullName: string;
    _id: string;
    username: string;
    avatar: string;
  };
  likesCount: number;
};

const Home: React.FC = () => {
  const token = useSelector((state: RootState) => state.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const arr = [
    "All",
    "Music",
    "Sports",
    "Gaming",
    "News",
    "Education",
    "Science",
    "Technology",
    "Movies",
    "Comedy",
    "Travel",
    "Food",
    "Fashion",
    "Beauty",
    "Health",
    "Fitness",
    "Vlogs",
    "DIY",
    "Art",
    "Animation",
    "Documentary",
    "Nature",
    "History",
    "Politics",
    "Finance",
    "Business",
    "Automotive",
    "Pets",
    "Kids",
    "Lifestyle",
    "Photography",
    "Programming",
    "Podcasts",
    "Reviews",
    "How-to",
    "Shorts",
    "Live",
    "Trailers",
    "Spirituality",
    "Books",
    "Culture",
    "Dance",
    "Relationships",
    "Memes",
    "ASMR",
    "Unboxing",
    "Science & Tech",
    "Environment",
    "Crafts",
    "Architecture",
    "Languages",
    "Motivation",
    "Investing",
    "Real Estate",
    "Gardening",
    "Parenting",
    "Animals",
    "Cars",
    "Motorcycles",
    "Wilderness",
    "Events",
    "Interviews",
    "Tutorials",
    "Shopping",
    "Gadgets",
    "Startup",
    "Space",
    "Weather",
    "Martial Arts",
    "Board Games",
    "Card Games",
    "Esports",
    "Music Videos",
    "Instrumental",
    "Covers",
    "Originals",
    "Parody",
    "Behind the Scenes",
    "Trailers",
    "Teasers",
    "Fan Edits",
    "Challenges",
    "Pranks",
    "Experiments",
    "Debates",
    "Talk Shows",
    "Q&A",
    "Productivity",
    "Minimalism",
    "Sustainability",
    "Urban Exploration",
    "Wildlife",
    "Hiking",
    "Camping",
    "Fishing",
    "Hunting",
    "Surfing",
    "Skateboarding",
    "Snowboarding",
    "Cycling",
    "Running",
    "Yoga",
    "Meditation",
    "Self-Improvement",
    "Career",
    "Scholarships",
    "Coding",
    "Web Development",
    "Mobile Development",
    "AI",
    "Machine Learning",
    "Data Science",
    "Blockchain",
    "Crypto",
    "3D Printing",
    "Robotics",
    "Electronics",
    "Home Improvement",
    "Interior Design",
    "Cooking",
    "Baking",
    "Grilling",
    "Vegan",
    "Vegetarian",
    "Keto",
    "Paleo",
    "Gluten-Free",
    "Wine",
    "Beer",
    "Cocktails",
    "Tea",
    "Coffee",
    "Pets & Animals",
    "Birds",
    "Reptiles",
    "Aquariums",
    "Horses",
    "Dogs",
    "Cats",
    "Ferrets",
    "Hamsters",
    "Rabbits",
    "Guinea Pigs",
    "Other",
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["home-feed"],
    queryFn: () => myQuery.getHomeFeed(token),
  });

  if (error) {
    console.log("I am error", error?.message);
    if (error?.message == "Request failed with status code 401") {
      dispatch(logout());
      router.push("/login");
    }
  }

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return (
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 3xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i}>
            <Skeleton
              height="200px"
              width="100%"
              borderRadius={"14px"}
              isLoaded={!isLoading}
            />
            <Flex py={2} gap={4}>
              <SkeletonCircle size="10" isLoaded={!isLoading} />
              <SkeletonText
                height="20px"
                width="250px"
                noOfLines={3}
                isLoaded={!isLoading}
              />
            </Flex>
          </Box>
        ))}
      </Box>
    );
  }
  return (
    <div>
      <Flex
        gap={2}
        overflowX="auto"
        pl={4}
        my={4}
        style={{
          scrollbarWidth: "none",
          scrollbarColor: "#888 #e0e0e0",
          WebkitOverflowScrolling: "touch",
        }}
        className="hide-scrollbar"
      >
        {arr.map((item, i) => (
          <Button
            key={i}
            variant="solid"
            fontSize="sm"
            px={3}
            py={2}
            h="fit"
            minW="max-content"
            whiteSpace="nowrap"
          >
            {item}
          </Button>
        ))}
      </Flex>

      {data?.feed?.map(
        (item: { videos: Video[]; tweets: Tweet[] }, i: number) => {
          if (item.hasOwnProperty("videos")) {
            return (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4 3xl:grid-cols-5 mx-auto"
                key={i}
              >
                {item.videos.map((video: Video, i: number) => (
                  <Video
                    key={i}
                    title={video.title}
                    thumbnail={video.thumbnail}
                    logo={video.owner.avatar}
                    channelName={video.owner.fullName}
                    uploadTime={video.createdAt}
                    views={video.views}
                    duration={video.duration}
                    videoId={video._id}
                    isProfile={false}
                    username={video.owner.username}
                  />
                ))}
              </div>
            );
          } else if (item.hasOwnProperty("tweets")) {
            return (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 p-4 3xl:grid-cols-5 mx-auto  "
                key={i}
              >
                {item.tweets.map((tweet: Tweet, i: number) => (
                  <Tweet
                    key={i}
                    author={{
                      name: tweet.owner.fullName,
                      username: tweet.owner.username,
                      avatar: tweet.owner.avatar,
                      _id: tweet.owner._id,
                    }}
                    content={tweet.content}
                    timestamp={tweet.createdAt}
                    viewsCount={tweet.viewsCount}
                    image={tweet.image}
                    id={tweet._id}
                    likesCount={tweet?.likesCount}
                    commentsCount={tweet?.commentsCount}
                  />
                ))}
              </div>
            );
          }
        }
      )}
    </div>
  );
};

export default Home;
