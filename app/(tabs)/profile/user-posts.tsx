import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Send,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useGetCommunityPostsQuery,
  useLikePostMutation,
  useGetPostCommentsQuery,
  useAddCommentMutation,
  Post,
  Comment,
} from "@/services/API";
import { decodeJWT } from "@/utils/utils";

export default function UserPostsScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [likingPostIds, setLikingPostIds] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<
    string | null
  >(null);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState<
    Record<string, boolean>
  >({});
  const [sendingComment, setSendingComment] = useState(false);

  // Fetch posts and user data
  const {
    data: allPosts = [],
    isLoading,
    error,
    refetch,
  } = useGetCommunityPostsQuery();

  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);

  // Get comments for the expanded post
  const { data: postComments = [] } = useGetPostCommentsQuery(
    expandedCommentPostId || "",
    {
      skip: !expandedCommentPostId,
    }
  );

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (storedToken) {
        const decoded = decodeJWT(storedToken);
        setDecodedToken(decoded);
        setUserId(decoded?.id || decoded?._id);
      }
    };
    fetchToken();
  }, []);

  // Filter posts to show only the current user's posts
  const userPosts = allPosts.filter((post) => post.user._id === userId);

  // Toggle comments visibility
  const toggleComments = (postId: string) => {
    if (expandedCommentPostId === postId) {
      setExpandedCommentPostId(null);
    } else {
      setExpandedCommentPostId(postId);
      setCommentsLoading((prev) => ({ ...prev, [postId]: true }));

      // Simulate loading completion
      setTimeout(() => {
        setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
      }, 500);
    }
  };

  // Handle like/unlike post
  const handleLikePost = async (postId: string) => {
    try {
      setLikingPostIds((prev) => ({ ...prev, [postId]: true }));
      await likePost(postId).unwrap();
    } catch (error) {
      Alert.alert("Error", "Failed to update like status. Please try again.");
      console.error("Like error:", error);
    } finally {
      setLikingPostIds((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Handle sending a new comment
  const handleAddComment = async () => {
    if (!commentText.trim() || !expandedCommentPostId || !userId) return;

    try {
      setSendingComment(true);
      await addComment({
        postId: expandedCommentPostId,
        text: commentText,
      }).unwrap();
      setCommentText("");
    } catch (error) {
      Alert.alert("Error", "Failed to add comment. Please try again.");
      console.error("Comment error:", error);
    } finally {
      setSendingComment(false);
    }
  };

  // Check if a post is liked by the current user
  const isPostLikedByUser = (post: Post) => {
    return userId && post.likes.includes(userId);
  };

  // Render each comment
  const renderComment = (comment: Comment) => (
    <View key={comment._id} style={styles.commentItem}>
      <Image
        source={{
          uri: comment.user?.profileImage || "https://via.placeholder.com/40",
        }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUserName}>
          {comment.user?.name || "User"}
        </Text>
        <Text style={styles.commentText}>{comment.text}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </Text>
      </View>
    </View>
  );

  // Render each post
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{
            uri: item.user?.profileImage || "https://via.placeholder.com/40",
          }}
          style={styles.avatar}
        />
        <View style={styles.postHeaderText}>
          <Text style={styles.userName}>{item.user?.name || "Anonymous"}</Text>
          <Text style={styles.postTime}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.text}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLikePost(item._id)}
          disabled={likingPostIds[item._id]}
        >
          <ThumbsUp
            size={18}
            color={isPostLikedByUser(item) ? "#46A996" : "#666"}
          />
          <Text
            style={[
              styles.actionText,
              isPostLikedByUser(item) && { color: "#46A996" },
            ]}
          >
            {likingPostIds[item._id] ? "..." : item.likes.length}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleComments(item._id)}
        >
          <MessageSquare
            size={18}
            color={expandedCommentPostId === item._id ? "#46A996" : "#666"}
          />
          <Text
            style={[
              styles.actionText,
              expandedCommentPostId === item._id && { color: "#46A996" },
            ]}
          >
            {item.comments.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments section */}
      {expandedCommentPostId === item._id && (
        <View style={styles.commentsSection}>
          <View style={styles.commentsDivider} />

          {commentsLoading[item._id] ? (
            <ActivityIndicator
              size="small"
              color="#46A996"
              style={styles.commentsLoading}
            />
          ) : postComments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          ) : (
            <View style={styles.commentsList}>
              {postComments.map((comment) => renderComment(comment))}
            </View>
          )}

          {/* Add comment input */}
          <View style={styles.addCommentContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!commentText.trim() || sendingComment) &&
                  styles.disabledSendButton,
              ]}
              onPress={handleAddComment}
              disabled={!commentText.trim() || sendingComment}
            >
              <Send
                size={20}
                color={
                  !commentText.trim() || sendingComment ? "#ccc" : "#46A996"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>My Posts</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#46A996" />
          <Text style={styles.emptyStateText}>Loading...</Text>
        </View>
      ) : error ? (
        <View style={styles.centeredContainer}>
          <AlertCircle size={48} color="#FF4949" />
          <Text style={styles.emptyStateText}>
            Error loading posts. Please try again.
          </Text>
        </View>
      ) : userPosts.length === 0 ? (
        <View style={styles.centeredContainer}>
          <MessageSquare size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>
            You haven't posted anything yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={userPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 24,
    color: "#333",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  listContainer: {
    padding: 16,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      default: {
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postHeaderText: {
    marginLeft: 10,
  },
  userName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    color: "#333",
  },
  postTime: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#888",
  },
  postContent: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  actionText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
  },
  // Comments styles
  commentsSection: {
    marginTop: 12,
  },
  commentsDivider: {
    height: 1,
    backgroundColor: "#f1f1f1",
    marginBottom: 12,
  },
  commentsLoading: {
    marginVertical: 10,
  },
  noCommentsText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
  commentsList: {
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 12,
  },
  commentUserName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#333",
    marginBottom: 2,
  },
  commentText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  commentTime: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#888",
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
});
