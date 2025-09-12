"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { IconMessageCircle, IconTrash } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { myQuery } from "@/api/query";
import { useMutation } from "@tanstack/react-query";
import { formatPostTime } from "@/utils/relativeTime";
import commentQueries from "@/api/commentQueries";


// Define comment type
interface Comment {
  _id: string;
  owner: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
  };

  content: string;
  createdAt: string;
  replies: Comment[];
}

const CommentItem = ({
  comment,
  depth = 0,
  videoId,
  refetch,
  isLoading,
}: {
  comment: Comment;
  depth?: number;
  videoId: string;
  refetch: () => void;
  isLoading: boolean;
}) => {
  const { textColor, secondaryTextColor } = useThemeColors();

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const token = useSelector((state: RootState) => state?.token);
  const userId = useSelector((state: RootState) => state.user._id);

  const { mutate: addReply, isPending } = useMutation({
    mutationFn: () => myQuery.addReply(token, videoId, comment._id, replyText),
    onSuccess: () => {
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

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) =>
      commentQueries.deleteComment(token, commentId),
    onSuccess: () => {
    //  queryClient.invalidateQueries({ queryKey: ["commentsData", videoId] });
     refetch();
    },
  });

  return (
    <Box w="full" pl={depth * 6}>
      <HStack align="start" spacing={3} pr={2}>
        <Avatar src={comment.owner.avatar} size="sm" />
        <Box w="full">
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold" color={textColor}>
              {comment.owner.fullName}
            </Text>
            <Text fontSize="xs" color={secondaryTextColor}>
              {formatPostTime(comment.createdAt)}
            </Text>
          </Flex>
          <Text mt={1} color={textColor}>
            {comment.content}
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
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleReplySubmit}
                isLoading={isPending}
              >
                Post
              </Button>
            </HStack>
          )}

          {/* Nested Replies */}
          <Collapse in={showReplies} animateOpacity>
            <VStack mt={3} pl={6} align="start" spacing={3} w="full">
              {comment?.replies?.reverse()?.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  depth={depth + 1}
                  videoId={videoId}
                  refetch={refetch}
                  isLoading={isLoading}
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

const Comments = ({
  comments,
  videoId,
  refetch,
  isLoading,
  page,

  setPage,

  totalComments,
}: {
  comments: Comment[];
  videoId: string;
  refetch: () => void;
  isLoading: boolean;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  totalComments: number;
}) => {
  const toast = useToast();
  const { textColor } = useThemeColors();
  const { user } = useSelector((state: RootState) => state);
  const { avatarImage } = user;
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const token = useSelector((state: RootState) => state?.token);

  // Update allComments when comments prop changes
  useEffect(() => {
    if (comments && page === 1) {
      setAllComments(comments);
    } else if (comments && page > 1) {
      setAllComments(prev => [...prev, ...comments]);
    }
  }, [comments, page]);

  // Check if there are more comments to load
  useEffect(() => {
    if (allComments.length >= totalComments) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [allComments.length, totalComments]);

  const loadMoreComments = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    setPage(page + 1);
    
    try {
      await refetch();
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, setPage, refetch, isLoadingMore, hasMore]);

  const lastCommentElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreComments();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, loadMoreComments]);

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: () => myQuery.addComment(token, videoId, commentText),
    onSuccess: () => {
      setCommentText("");
      // Reset to first page and reload comments
      setPage(1);
      setAllComments([]);
      refetch();
    },
    onError: () => {
      console.log("Error adding comment");
      toast({
        title: "Error adding comment",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      addComment();
    }
  };

  return (
    <Box py={4}>
      <Text fontSize="2xl" fontWeight="semibold" color={textColor}>
        {totalComments} Comments
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
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleCommentSubmit();
            }
          }}
        />
        <Button
          colorScheme="blue"
          borderRadius={"full"}
          onClick={handleCommentSubmit}
          isLoading={isPending}
          disabled={!commentText.trim()}
        >
          <IconMessageCircle size={18} />
        </Button>
      </HStack>

      <Divider pt={4} />
      <VStack align="start" mt={5} spacing={4} w="full">
        {allComments?.map((comment: Comment, i: number) => (
          <Box
            key={comment._id}
            w="full"
            ref={i === allComments.length - 1 ? lastCommentElementRef : null}
          >
            <CommentItem
              comment={comment}
              videoId={videoId}
              refetch={() => {
                setPage(1);
                setAllComments([]);
                refetch();
              }}
              isLoading={isLoading}
            />
          </Box>
        ))}
        
        {/* Loading indicator for infinite scroll */}
        {isLoadingMore && (
          <Center w="full" py={4}>
            <Spinner size="md" color="blue.500" />
          </Center>
        )}
        
        {/* End of comments indicator */}
        {!hasMore && allComments.length > 0 && (
          <Center w="full" py={4}>
            <Text fontSize="sm" color={textColor} opacity={0.7}>
              No more comments to load
            </Text>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default Comments;
