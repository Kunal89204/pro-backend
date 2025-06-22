import Tweets from "@/components/Tweets";
import Videos from "@/components/Videos";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";

const Home: React.FC = () => {
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
    "Other"
  ];
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
      <Videos />
      <Tweets />
    </div>
  );
};

export default Home;
