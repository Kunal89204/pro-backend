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
import { IconThumbUp, IconSend } from "@tabler/icons-react";

// Define comment type
interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  replies: Comment[];
}

// Placeholder data
// Placeholder data with deeply nested comment structure
const placeholderComments: Comment[] = [
    {
      id: "1",
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      text: "This is such an insightful tweet! I completely agree with your perspective on modern technology and its impact on society.",
      time: "6 hours ago",
      likes: 45,
      replies: [
        {
          id: "1-1",
          user: "Sam Wilson",
          avatar: "https://i.pravatar.cc/150?img=2",
          text: "I had the same thought. Great minds think alike! But what about the privacy concerns?",
          time: "5 hours ago",
          likes: 23,
          replies: [
            {
              id: "1-1-1",
              user: "Maya Chen",
              avatar: "https://i.pravatar.cc/150?img=3",
              text: "Privacy is definitely a major issue. We need better regulations.",
              time: "4 hours ago",
              likes: 15,
              replies: [
                {
                  id: "1-1-1-1",
                  user: "David Kim",
                  avatar: "https://i.pravatar.cc/150?img=4",
                  text: "But over-regulation could stifle innovation. It's a delicate balance.",
                  time: "3 hours ago",
                  likes: 8,
                  replies: [
                    {
                      id: "1-1-1-1-1",
                      user: "Lisa Rodriguez",
                      avatar: "https://i.pravatar.cc/150?img=6",
                      text: "True, but without proper safeguards, we're heading towards a surveillance state.",
                      time: "2 hours ago",
                      likes: 12,
                      replies: [
                        {
                          id: "1-1-1-1-1-1",
                          user: "Mike Thompson",
                          avatar: "https://i.pravatar.cc/150?img=7",
                          text: "I think we're already there. Look at how much data companies collect about us daily.",
                          time: "1 hour ago",
                          likes: 6,
                          replies: []
                        }
                      ]
                    },
                    {
                      id: "1-1-1-1-2",
                      user: "Emma Watson",
                      avatar: "https://i.pravatar.cc/150?img=8",
                      text: "What if we had user-controlled privacy settings that actually worked?",
                      time: "2 hours ago",
                      likes: 9,
                      replies: [
                        {
                          id: "1-1-1-1-2-1",
                          user: "Ryan Foster",
                          avatar: "https://i.pravatar.cc/150?img=9",
                          text: "That would be ideal, but most users don't understand the technical implications.",
                          time: "1 hour ago",
                          likes: 4,
                          replies: []
                        }
                      ]
                    }
                  ]
                },
                {
                  id: "1-1-1-2",
                  user: "James Parker",
                  avatar: "https://i.pravatar.cc/150?img=10",
                  text: "The EU's GDPR was a good start, but we need global standards.",
                  time: "3 hours ago",
                  likes: 11,
                  replies: [
                    {
                      id: "1-1-1-2-1",
                      user: "Sophie Miller",
                      avatar: "https://i.pravatar.cc/150?img=11",
                      text: "Agreed! But getting all countries to agree on standards is nearly impossible.",
                      time: "2 hours ago",
                      likes: 7,
                      replies: []
                    }
                  ]
                }
              ]
            },
            {
              id: "1-1-2",
              user: "Carlos Mendez",
              avatar: "https://i.pravatar.cc/150?img=12",
              text: "Privacy aside, the accessibility improvements have been incredible.",
              time: "4 hours ago",
              likes: 18,
              replies: [
                {
                  id: "1-1-2-1",
                  user: "Anna Lee",
                  avatar: "https://i.pravatar.cc/150?img=13",
                  text: "Absolutely! My grandmother can now video call us effortlessly.",
                  time: "3 hours ago",
                  likes: 14,
                  replies: [
                    {
                      id: "1-1-2-1-1",
                      user: "Tom Bradley",
                      avatar: "https://i.pravatar.cc/150?img=14",
                      text: "That's heartwarming! Technology bridging generations is beautiful.",
                      time: "2 hours ago",
                      likes: 8,
                      replies: []
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "1-2",
          user: "Jordan Smith",
          avatar: "https://i.pravatar.cc/150?img=15",
          text: "While I appreciate the benefits, I'm concerned about the digital divide.",
          time: "5 hours ago",
          likes: 31,
          replies: [
            {
              id: "1-2-1",
              user: "Rachel Green",
              avatar: "https://i.pravatar.cc/150?img=16",
              text: "Exactly! Not everyone has equal access to these technologies.",
              time: "4 hours ago",
              likes: 22,
              replies: [
                {
                  id: "1-2-1-1",
                  user: "Kevin O'Connor",
                  avatar: "https://i.pravatar.cc/150?img=17",
                  text: "This is especially true in rural areas and developing countries.",
                  time: "3 hours ago",
                  likes: 16,
                  replies: [
                    {
                      id: "1-2-1-1-1",
                      user: "Priya Patel",
                      avatar: "https://i.pravatar.cc/150?img=18",
                      text: "We need more initiatives to bridge this gap. Education is key.",
                      time: "2 hours ago",
                      likes: 13,
                      replies: [
                        {
                          id: "1-2-1-1-1-1",
                          user: "Mark Stevens",
                          avatar: "https://i.pravatar.cc/150?img=19",
                          text: "Some NGOs are doing great work in this space, but more funding is needed.",
                          time: "1 hour ago",
                          likes: 9,
                          replies: []
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "2",
      user: "Taylor Adams",
      avatar: "https://i.pravatar.cc/150?img=5",
      text: "Interesting take on this topic. I'd love to discuss the environmental impact of all this technology.",
      time: "7 hours ago",
      likes: 67,
      replies: [
        {
          id: "2-1",
          user: "Elena Vasquez",
          avatar: "https://i.pravatar.cc/150?img=20",
          text: "Great point! The carbon footprint of data centers is enormous.",
          time: "6 hours ago",
          likes: 43,
          replies: [
            {
              id: "2-1-1",
              user: "Nathan Clark",
              avatar: "https://i.pravatar.cc/150?img=21",
              text: "But many companies are transitioning to renewable energy sources.",
              time: "5 hours ago",
              likes: 28,
              replies: [
                {
                  id: "2-1-1-1",
                  user: "Olivia Turner",
                  avatar: "https://i.pravatar.cc/150?img=22",
                  text: "That's true, though the transition isn't happening fast enough.",
                  time: "4 hours ago",
                  likes: 19,
                  replies: [
                    {
                      id: "2-1-1-1-1",
                      user: "Ben Martinez",
                      avatar: "https://i.pravatar.cc/150?img=23",
                      text: "We also need to consider the lifecycle of devices - mining, manufacturing, disposal.",
                      time: "3 hours ago",
                      likes: 15,
                      replies: [
                        {
                          id: "2-1-1-1-1-1",
                          user: "Zoe Campbell",
                          avatar: "https://i.pravatar.cc/150?img=24",
                          text: "Right-to-repair movements are addressing some of these issues.",
                          time: "2 hours ago",
                          likes: 11,
                          replies: [
                            {
                              id: "2-1-1-1-1-1-1",
                              user: "Alex Rivera",
                              avatar: "https://i.pravatar.cc/150?img=25",
                              text: "But companies often make devices harder to repair to increase sales.",
                              time: "1 hour ago",
                              likes: 8,
                              replies: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: "2-1-2",
              user: "Grace Wong",
              avatar: "https://i.pravatar.cc/150?img=26",
              text: "Don't forget about e-waste! It's one of the fastest-growing waste streams.",
              time: "5 hours ago",
              likes: 35,
              replies: [
                {
                  id: "2-1-2-1",
                  user: "Daniel Cooper",
                  avatar: "https://i.pravatar.cc/150?img=27",
                  text: "Recycling programs exist, but they're not widely accessible or well-publicized.",
                  time: "4 hours ago",
                  likes: 21,
                  replies: [
                    {
                      id: "2-1-2-1-1",
                      user: "Sarah Johnson",
                      avatar: "https://i.pravatar.cc/150?img=28",
                      text: "My city just started an e-waste collection program. It's a start!",
                      time: "3 hours ago",
                      likes: 12,
                      replies: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "3",
      user: "Chris Anderson",
      avatar: "https://i.pravatar.cc/150?img=29",
      text: "Has anyone considered the psychological effects of constant connectivity?",
      time: "8 hours ago",
      likes: 89,
      replies: [
        {
          id: "3-1",
          user: "Dr. Jennifer Hayes",
          avatar: "https://i.pravatar.cc/150?img=30",
          text: "As a psychologist, I see increasing rates of anxiety and depression, especially in teens.",
          time: "7 hours ago",
          likes: 72,
          replies: [
            {
              id: "3-1-1",
              user: "Marcus Williams",
              avatar: "https://i.pravatar.cc/150?img=31",
              text: "Social media comparison culture is toxic. Everyone's comparing their behind-the-scenes to others' highlight reels.",
              time: "6 hours ago",
              likes: 56,
              replies: [
                {
                  id: "3-1-1-1",
                  user: "Isabella Garcia",
                  avatar: "https://i.pravatar.cc/150?img=32",
                  text: "The FOMO (fear of missing out) is real. I've started digital detox weekends.",
                  time: "5 hours ago",
                  likes: 41,
                  replies: [
                    {
                      id: "3-1-1-1-1",
                      user: "Logan Phillips",
                      avatar: "https://i.pravatar.cc/150?img=33",
                      text: "How do you manage that with work demands for constant availability?",
                      time: "4 hours ago",
                      likes: 27,
                      replies: [
                        {
                          id: "3-1-1-1-1-1",
                          user: "Maya Thompson",
                          avatar: "https://i.pravatar.cc/150?img=34",
                          text: "Setting boundaries is crucial. I use 'Do Not Disturb' modes and auto-replies.",
                          time: "3 hours ago",
                          likes: 18,
                          replies: [
                            {
                              id: "3-1-1-1-1-1-1",
                              user: "Tyler Brooks",
                              avatar: "https://i.pravatar.cc/150?img=35",
                              text: "My company implemented 'no email after 6 PM' policy. Game changer!",
                              time: "2 hours ago",
                              likes: 14,
                              replies: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
  const { colorMode } = useColorMode();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const textColor = colorMode === "light" ? "gray.800" : "gray.100";
  const secondaryTextColor = colorMode === "light" ? "gray.500" : "gray.400";

  return (
    <Box w="full" pl={depth * 4} mb={4}>
      <HStack align="start" spacing={3}>
        <Avatar src={comment.avatar} size="sm" />
        <Box w="full">
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
            <Flex alignItems="center">
              <IconThumbUp
                size={16}
                cursor="pointer"
                color={colorMode === "light" ? "black" : "white"}
              />
              <Text ml={1} fontSize="xs">{comment.likes}</Text>
            </Flex>
           
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
                {showReplies ? "Hide Replies" : `View ${comment.replies.length} ${comment.replies.length === 1 ? "Reply" : "Replies"}`}
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
              <Button size="sm" colorScheme="blue">
                Reply
              </Button>
            </HStack>
          )}

          {/* Nested Replies */}
          <Collapse in={showReplies} animateOpacity>
            <VStack mt={3} align="start" spacing={3} w="full">
              {comment?.replies?.map((reply) => (
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
  const { colorMode } = useColorMode();
  const [commentText, setCommentText] = useState("");
  
  const textColor = colorMode === "light" ? "gray.800" : "gray.100";

  return (
    <Box w="full" py={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color={textColor}>
        Comments ({placeholderComments.length})
      </Text>
      
      {/* Add comment input */}
      <HStack mb={6}>
        <Avatar size="sm" src="https://i.pravatar.cc/150?img=8" />
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
        >
          Post
        </Button>
      </HStack>
      
      <Divider mb={4} />
      
      {/* Comments list */}
      <VStack spacing={4} align="start" w="full">
        {placeholderComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </VStack>
    </Box>
  );
};

export default Comments;
