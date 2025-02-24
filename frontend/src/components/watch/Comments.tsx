"use client";
import { useState } from "react";
import {
  Box, Text, Input, Button, Avatar, VStack, HStack, Collapse, Divider, Flex,
  useColorMode
} from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  IconMessageCircle, IconThumbUp, IconThumbDown
} from "@tabler/icons-react";

// Define comment type
interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  replies: Comment[];
}

const commentsData: Comment[] = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://i.pravatar.cc/46",
    text: "This is an amazing video! Thanks for sharing.",
    time: "2 hours ago",
    replies: [],
  },
  {
    id: 2,
    user: "Alice Brown",
    avatar: "https://i.pravatar.cc/42",
    text: "Can someone explain this part?",
    time: "3 hours ago",
    replies: [
      {
        id: 5,
        user: "John Doe",
        avatar: "https://i.pravatar.cc/46",
        text: "Sure! What part do you need help with?",
        time: "2 hours ago",
        replies: [{
          id: 7,
          user: "Alice Brown",
          avatar: "https://i.pravatar.cc/42",
          text: "Can someone explain this part?",
          time: "3 hours ago",
          replies: [
            {
              id:9,
              user: "John Doe",
              avatar: "https://i.pravatar.cc/46",
              text: "Sure! What part do you need help with?",
              time: "2 hours ago",
              replies: [],
            },
          ],
        },],
      },
    ],
  },
];

const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const { textColor, secondaryTextColor } = useThemeColors();
  const {colorMode} = useColorMode()
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    console.log("Replying to Comment ID:", comment.id);
    console.log("Reply Text:", replyText);
    setReplyText(""); // Clear input after submission
    setShowReplyInput(false); // Hide input after submitting
  };

  return (
    <Box w="full" pl={depth * 6}>
      <HStack align="start" spacing={3}>
        <Avatar src={comment.avatar} size="sm" />
        <Box>
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" color={textColor}>{comment.user}</Text>
            <Text fontSize="xs" color={secondaryTextColor}>{comment.time}</Text>
          </Flex>
          <Text mt={1} color={textColor}>{comment.text}</Text>
          <HStack mt={2} spacing={4}>
            <IconThumbUp size={16} cursor="pointer" color={colorMode == "light"?"black":"white"} />
            <IconThumbDown color={colorMode == "light"?"black":"white"} size={16} cursor="pointer" />
            <Text color={textColor} fontSize="sm" cursor="pointer" onClick={() => setShowReplyInput(!showReplyInput)}>
              Reply
            </Text>
            {comment.replies.length > 0 && (
              <Text fontSize="sm" cursor="pointer" color={textColor} onClick={() => setShowReplies(!showReplies)}>
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
              />
              <Button size="sm" colorScheme="blue" onClick={handleReplySubmit}>Post</Button>
            </HStack>
          )}

          {/* Nested Replies */}
          <Collapse in={showReplies} animateOpacity>
            <VStack mt={3} pl={6} align="start" spacing={3} w="full">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </VStack>
          </Collapse>
        </Box>
      </HStack>
    </Box>
  );
};

const Comments = () => {
  const { textColor, secondaryTextColor } = useThemeColors();
  return (
    <Box py={4}>
      <Text fontSize="2xl" fontWeight="semibold" color={textColor}>Comments</Text>
      {/* User's Comment Input */}
      <HStack mt={4} spacing={3}>
        <Avatar src="https://i.pravatar.cc/40" size={'sm'} />
        <Input placeholder="Add a comment..." variant="filled" borderRadius={"full"} />
        <Button colorScheme="blue" borderRadius={"full"}>
          <IconMessageCircle size={18} />
        </Button>
      </HStack>

      <Divider pt={4} />
      <VStack align="start" mt={5} spacing={4} w="full">
        {commentsData.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </VStack>
    </Box>
  );
};

export default Comments;