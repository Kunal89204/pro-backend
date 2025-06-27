import { Flex, Text, IconButton } from "@chakra-ui/react";
import {
  IconHeart,
  IconEye,
  IconMessageCircle,
  IconShare,
} from "@tabler/icons-react";
import { useColorMode } from "@chakra-ui/react";

const Engagement = ({_id, userId, likes, comments, views }: { _id: string | undefined; userId: string | undefined; likes: number; comments: number; views: number }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex justifyContent="space-between" mt="auto">
      <Flex alignItems="center">
        <IconButton
          aria-label="Like"
          icon={<IconHeart size={18} />}
          variant="ghost"
          size="sm"
          _hover={{ color: "red.500" }}
          onClick={() => {
            console.log("like", _id, userId);
          }}
        />
        <Text
          fontSize="xs"
          mr={1}
          color={colorMode == "light" ? "black" : "white"}
        >
          {likes}
        </Text>
      </Flex>

      <Flex alignItems="center">
        <IconButton
          aria-label="Comment"
          icon={<IconEye size={18} />}
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
        <Text
          fontSize="xs"
          mr={1}
          color={colorMode == "light" ? "black" : "white"}
        >
          {views}
        </Text>
      </Flex>

      <Flex alignItems="center">
        <IconButton
          aria-label="Comment"
          icon={<IconMessageCircle size={18} />}
          variant="ghost"
          size="sm"
          _hover={{ color: "blue.500" }}
        />
        <Text
          fontSize="xs"
          mr={1}
          color={colorMode == "light" ? "black" : "white"}
        >
          {comments}
        </Text>
      </Flex>

      <IconButton
        aria-label="Share"
        icon={<IconShare size={18} />}
        variant="ghost"
        size="sm"
        _hover={{ color: "blue.500" }}
      />
    </Flex>
  );
};

export default Engagement;
