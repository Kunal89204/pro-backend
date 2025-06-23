"use client";
import {  useState } from "react";


import {
  Box,
  Text,
  Input,
  Button,
  Avatar,
  VStack,
  HStack,
  Collapse,
  Divider,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  IconMessageCircle,
  IconThumbUp,
  IconThumbDown,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { myQuery } from "@/api/query";
import { useMutation } from "@tanstack/react-query";

// Define comment type
interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  replies: Comment[];
}

const CommentItem = ({
  comment,
  depth = 0,
  videoId,
  refetch,
  isLoading
}: {
  comment: Comment;
  depth?: number;
  videoId: string;
  refetch: () => void;
  isLoading: boolean;
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const { colorMode } = useColorMode();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
 
  const token = useSelector((state: RootState) => state?.token);


  const { mutate: addReply, isPending } = useMutation({
    mutationFn: () => myQuery.addReply(token, videoId, comment.id, replyText),
    onSuccess: () => {
      console.log("Reply added successfully");
      refetch();
    },
    onError: () => {
      console.log("Error adding reply");
    },
  });

  const handleReplySubmit = () => {
    addReply();
    setShowReplyInput(false); // Hide input after submitting
  };

 

  return (
    <Box w="full" pl={depth * 6}>
      <HStack align="start" spacing={3}>
        <Avatar src={comment.avatar} size="sm" />
        <Box>
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" color={textColor}>
              {comment.user}
            </Text>
            <Text fontSize="xs" color={secondaryTextColor}>
              {comment.time}
            </Text>
          </Flex>
          <Text mt={1} color={textColor}>
            {comment.text}
          </Text>
          <HStack mt={2} spacing={4}>
            <IconThumbUp
              size={16}
              cursor="pointer"
              color={colorMode == "light" ? "black" : "white"}
            />
            <IconThumbDown
              color={colorMode == "light" ? "black" : "white"}
              size={16}
              cursor="pointer"
            />
            <Text
              color={textColor}
              fontSize="sm"
              cursor="pointer"
              onClick={() => setShowReplyInput(!showReplyInput)}
            >
              Reply
            </Text>
            {comment?.replies?.length > 0 && (
              <Text
                fontSize="sm"
                cursor="pointer"
                color={textColor}
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "Hide Replies" : "View Replies"}
              </Text>
            )}
          </HStack>

          {/* Reply Input Field */}
          {showReplyInput && (
            <HStack mt={2} spacing={2}>
              <Input
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                size="sm"
                color={textColor}
              />
              <Button size="sm" colorScheme="blue" onClick={handleReplySubmit} isLoading={isPending}>
                Post
              </Button>
            </HStack>
          )}

          {/* Nested Replies */}
          <Collapse in={showReplies} animateOpacity>
            <VStack mt={3} pl={6} align="start" spacing={3} w="full">
              {comment?.replies?.reverse()?.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} videoId={videoId} refetch={refetch} isLoading={isLoading} />
              ))}
            </VStack>
          </Collapse>
        </Box>
      </HStack>
    </Box>
  );
};

































const Comments = ({ comments, videoId, refetch, isLoading }: { comments: Comment[], videoId: string, refetch: () => void, isLoading: boolean }) => {
  const { textColor } = useThemeColors();
  const { user } = useSelector((state: RootState) => state);
  const { avatarImage } = user;
  const [commentText, setCommentText] = useState("");
  const token = useSelector((state: RootState) => state?.token);
  const { mutate: addComment, isPending } = useMutation({
    mutationFn: () => myQuery.addComment(token, videoId, commentText),
    onSuccess: () => {
      console.log("Comment added successfully");
      refetch();
    },
    onError: () => {
      console.log("Error adding comment");
      refetch();
    },
  });
  const handleCommentSubmit = () => {
    addComment();
    // console.log("I am here", commentText);
    // setCommentText(""); // Clear input after submission
  };

  return (
    <Box py={4}>
      <Text fontSize="2xl" fontWeight="semibold" color={textColor}>
      {comments?.length}  Comments 
      </Text>
      {/* User's Comment Input */}
      <HStack mt={4} spacing={3}>
        <Avatar src={avatarImage} size={"sm"} />
        <Input
          placeholder="Add a comment..."
          variant="filled"
          borderRadius={"full"}
          value={commentText}
          color={textColor}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          colorScheme="blue"
          borderRadius={"full"}
          onClick={handleCommentSubmit}
          isLoading={isPending}
        >
          <IconMessageCircle size={18} />
        </Button>
      </HStack>

      <Divider pt={4} />
      <VStack align="start" mt={5} spacing={4} w="full">
        {comments?.map((comment: Comment, i: number) => (
          <CommentItem key={i} comment={comment} videoId={videoId} refetch={refetch} isLoading={isLoading} />
        ))}
      </VStack>
    </Box>
  );
};

export default Comments;
