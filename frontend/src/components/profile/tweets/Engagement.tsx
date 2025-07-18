"use client";
import { Flex, Text, IconButton } from "@chakra-ui/react";
import {
  IconHeart,
  IconEye,
  IconMessageCircle,
  IconShare,
  IconHeartFilled,
} from "@tabler/icons-react";
import { useColorMode } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect, useState } from "react";
import { myQuery } from "@/api/query";
import { useMutation, useQuery } from "@tanstack/react-query";

const Engagement = ({
  _id,
  likes,
  comments,
  views,
}: {
  _id: string | undefined;
  likes: number | undefined;
  comments: number | undefined;
  views: number;
}) => {
  const { colorMode } = useColorMode();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const token = useSelector((state: RootState) => state.token);

  const likeMutation = useMutation({
    mutationFn: () => myQuery.toggleLikeTweet(token, _id),
    onSuccess: () => {
 
    },
    onError: () => {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? (likesCount ?? 0) - 1 : (likesCount ?? 0) + 1);
    },
  });

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", _id],
    queryFn: () => myQuery.likeStatus(token, _id),
    enabled: !!_id,
  });

  useEffect(() => {
    if (likeStatus) {
      setIsLiked(likeStatus.data.isLiked);
    }
  }, [likeStatus]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? (likesCount ?? 0) - 1 : (likesCount ?? 0) + 1);
    likeMutation.mutate();
  };

  return (
    <Flex justifyContent="space-between" mt="auto">
      <Flex alignItems="center">
        <IconButton
          aria-label="Like"
          icon={
            isLiked ? (
              <IconHeartFilled size={18} color="red" />
            ) : (
              <IconHeart size={18} />
            )
          }
          variant="ghost"
          size="sm"
          _hover={{ color: "red.500" }}
          onClick={handleLike}
        />
        <Text
          fontSize="xs"
          mr={1}
          color={colorMode == "light" ? "black" : "white"}
        >
          {likesCount}
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
