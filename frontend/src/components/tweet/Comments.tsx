"use client";
import { useState } from "react";
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
import {  IconSend, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import myQuery from "@/api/commentQueries";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { formatPostTime } from "@/utils/relativeTime";

// Define comment type
interface Comment {
  _id: string;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

interface Reply extends Comment {
  comments: Comment;
}

// Define the structure for tweet comments data
interface TweetCommentsData {
  comments: Comment[];
  totalComments: number;
}

// Define the structure for add comment response
interface AddCommentResponse {
  comment: Comment;
}

// Placeholder data
// Placeholder data with deeply nested comment structure

const CommentItem = ({
  comment,
  depth = 0,
  tweetId,
}: {
  comment: Comment;
  depth?: number;
  tweetId: string;
}) => {
  const { colorMode } = useColorMode();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const token = useSelector((state: RootState) => state.token);
  const userId = useSelector((state: RootState) => state.user._id);
  const queryClient = useQueryClient();

  const textColor = colorMode === "light" ? "gray.800" : "gray.100";
  const secondaryTextColor = colorMode === "light" ? "gray.500" : "gray.400";

  const addReplyMutation = useMutation({
    mutationFn: (reply: string) =>
      myQuery.addTweetComment(token, tweetId, reply, comment._id),
    onSuccess: (data: Reply) => {
      queryClient.setQueryData(
        ["tweet-comments", tweetId],
        (old: TweetCommentsData | undefined) => {
          if (!old) return old;

          const updateCommentReplies = (comments: Comment[]): Comment[] => {
            return comments.map((c: Comment) => {
              if (c._id === comment._id) {
                return {
                  ...c,
                  replies: [data.comments, ...c.replies],
                };
              }

              if (c.replies && c.replies.length > 0) {
                return {
                  ...c,
                  replies: updateCommentReplies(c.replies),
                };
              }
              return c;
            });
          };

          return {
            ...old,
            comments: updateCommentReplies(old.comments),
          };
        }
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => myQuery.deleteComment(token, commentId),
    onSuccess: () => {
      queryClient.setQueryData(["tweet-comments", tweetId], (old: TweetCommentsData | undefined) => {
        if (!old) return old;
        
        // Helper function to recursively remove comment from nested structure
        const removeCommentRecursively = (comments: Comment[], targetId: string): Comment[] => {
          return comments
            .filter((c: Comment) => c._id !== targetId)
            .map((c: Comment) => ({
              ...c,
              replies: c.replies ? removeCommentRecursively(c.replies, targetId) : []
            }));
        };

        const updatedComments = removeCommentRecursively(old.comments, comment._id);
        
        return {
          ...old,
          comments: updatedComments,
          totalComments: Math.max(0, old.totalComments - 1),
        };
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleReply = () => {
 
    addReplyMutation.mutate(replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <Box w="full" pl={depth * 4} mb={4}>
      <HStack align="start" spacing={3}>
        <Avatar src={comment?.owner?.avatar} size="sm" />
        <Box w="full">
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" color={textColor}>
              {comment?.owner?.username}
            </Text>
            <Text fontSize="xs" color={secondaryTextColor}>
              {formatPostTime(comment?.createdAt)}
            </Text>
          </Flex>
          <Text mt={1} color={textColor}>
            {comment?.content}
          </Text>
          <HStack mt={2} spacing={4}>
            

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
                {showReplies
                  ? "Hide Replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "Reply" : "Replies"
                    }`}
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
              <Button size="sm" colorScheme="blue" onClick={handleReply}>
                Reply
              </Button>
            </HStack>
          )}

          {/* Nested Replies */}
          <Collapse in={showReplies} animateOpacity>
            <VStack mt={3} align="start" spacing={3} w="full">
              {comment?.replies?.map((reply) => (
                <CommentItem
                  key={reply?._id}
                  comment={reply}
                  depth={depth + 1}
                  tweetId={tweetId}
                />
              ))}
            </VStack>
          </Collapse>
        </Box>

        {userId === comment?.owner?._id && (
          <IconTrash
            size={16}
            cursor="pointer"
            color={"red"}
            onClick={() => {
          
              deleteCommentMutation.mutate(comment._id);
            }}
          />
        )}
      </HStack>
    </Box>
  );
};

const Comments = ({ tweetId }: { tweetId: string }) => {
  const { colorMode } = useColorMode();
  const [commentText, setCommentText] = useState("");
  const token = useSelector((state: RootState) => state.token);
  const avatar = useSelector((state: RootState) => state.user.avatarImage);
  const textColor = colorMode === "light" ? "gray.800" : "gray.100";
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tweet-comments", tweetId],
    queryFn: () => myQuery.getTweetComments(token, tweetId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (comment: string) =>
      myQuery.addTweetComment(token, tweetId, comment, null),
    onSuccess: (data: AddCommentResponse) => {
      queryClient.setQueryData(
        ["tweet-comments", tweetId],
        (old: TweetCommentsData | undefined) => {
          if (!old) return old;
          return {
            ...old,
            totalComments: old.totalComments + 1,
            comments: [data.comment, ...old.comments],
          };
        }
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isLoading) {
    return <div className="text-red-500">Loading...</div>;
  }

  const handleComment = () => {

    addCommentMutation.mutate(commentText);
    setCommentText("");
  };

  return (
    <Box w="full" py={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
        Comments ({data?.comments?.length || 0})
      </Text>

      {/* Add comment input */}
      <HStack mb={6}>
        <Avatar size="sm" src={avatar} />
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          color={textColor}
        />
        <Button
          leftIcon={<IconSend size={16} />}
          colorScheme="blue"
          isDisabled={!commentText.trim()}
          onClick={handleComment}
          isLoading={addCommentMutation.isPending}
        >
          Post
        </Button>
      </HStack>

      <Divider mb={4} />

      {/* Comments list */}
      <VStack spacing={4} align="start" w="full">
        {data?.comments?.length > 0 ? (
          data?.comments?.map((comment: Comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              tweetId={tweetId}
            />
          ))
        ) : (
          <Text color={textColor}>No comments yet.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Comments;
