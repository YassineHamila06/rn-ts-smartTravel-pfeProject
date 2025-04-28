import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Award,
  ClipboardList,
  MessageSquare,
  Heart,
  Image as ImageIcon,
  Send,
  Camera,
  ThumbsUp,
  X,
  AlertCircle,
} from "lucide-react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { blurHashCode } from "@/utils/utils";
import FormsSection from "./forms";
import {
  useGetCommunityPostsQuery,
  useLikePostMutation,
  useGetPostCommentsQuery,
  useAddCommentMutation,
  useAddPostMutation,
  Post,
  Comment,
} from "@/services/API";
import { formatDistanceToNow } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function LoyaltyProgramScreen() {
  const [activeTab, setActiveTab] = useState("forms");
  const [commentText, setCommentText] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<
    string | null
  >(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [likingPostIds, setLikingPostIds] = useState<Record<string, boolean>>(
    {}
  );
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState<
    Record<string, boolean>
  >({});
  const [sendingComment, setSendingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Fetch posts from API
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useGetCommunityPostsQuery();
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [addPost] = useAddPostMutation();

  // Hook for fetching comments for a specific post
  const { data: postComments } = useGetPostCommentsQuery(
    expandedCommentPostId || "",
    {
      skip: !expandedCommentPostId,
    }
  );

  // Hook for adding a new comment
  const [addComment] = useAddCommentMutation();

  // Get user ID from AsyncStorage for like check
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          setUserId(parsedData._id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserId();
  }, []);

  console.log("Posts fetched:", posts);
  console.log("Loading:", isLoading, "Error:", error);

  // Handle like/unlike
  const handleLikePost = async (postId: string) => {
    try {
      // Set optimistic UI update
      setLikingPostIds((prev) => ({ ...prev, [postId]: true }));

      // Call the like API
      const response = await likePost(postId).unwrap();

      // API call succeeded, update is handled by RTK Query cache invalidation
      // Log success
      console.log("Like action successful:", response);
    } catch (error) {
      // Show error alert if the API call fails
      Alert.alert("Error", "Failed to update like status. Please try again.", [
        { text: "OK" },
      ]);
      console.error("Like error:", error);
    } finally {
      // Clear loading state
      setLikingPostIds((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Check if a post is liked by the current user
  const isPostLikedByUser = (post: Post) => {
    return userId && post.likes.includes(userId);
  };

  const pickImage = async () => {
    try {
      // Ask for permission to access the media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleShareIdea = async () => {
    // UI validation
    if (postText.trim() === "") return;

    try {
      setIsSubmittingPost(true);

      // Create a FormData object
      const formData = new FormData();

      // Add text to FormData
      formData.append("text", postText.trim());

      // Add image to FormData if available
      if (selectedImage) {
        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(selectedImage);

        // Get file name from path
        const fileName =
          selectedImage.split("/").pop() || `image_${Date.now()}.jpg`;

        // Create file object for FormData
        const file = {
          uri: selectedImage,
          name: fileName,
          type: `image/${fileName.split(".").pop() === "png" ? "png" : "jpeg"}`,
        } as any;

        formData.append("image", file);
      }

      // Send the request to the API
      const response = await addPost(formData).unwrap();

      console.log("Post created successfully:", response);

      // Show success message
      Alert.alert("Success", "Your travel idea has been shared!");

      // Reset form and close modal
      setPostText("");
      setSelectedImage(null);
      setShareModalVisible(false);

      // Refresh the posts list
      refetch();
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert(
        "Error",
        "Failed to share your travel idea. Please try again."
      );
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Toggle comments visibility and fetch comments when needed
  const toggleComments = async (postId: string) => {
    if (expandedCommentPostId === postId) {
      setExpandedCommentPostId(null);
    } else {
      setExpandedCommentPostId(postId);
      setCommentPostId(postId);
      setCommentsLoading((prev) => ({ ...prev, [postId]: true }));

      try {
        // The actual API call is handled by the useGetPostCommentsQuery hook
        setCommentError(null);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setCommentError("Failed to load comments. Please try again.");
      } finally {
        setCommentsLoading((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  // Handle sending a new comment
  const handleSendComment = async (postId: string) => {
    // Validation
    if (!commentText.trim()) return;

    try {
      setSendingComment(true);
      setCommentError(null);

      // Call the API to add a comment
      await addComment({
        postId,
        text: commentText.trim(),
      }).unwrap();

      // Reset the comment input field
      setCommentText("");
    } catch (error) {
      console.error("Error sending comment:", error);
      setCommentError("Failed to send comment. Please try again.");
    } finally {
      setSendingComment(false);
    }
  };

  // Function to render comments
  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{
          uri:
            item.user.profileImage ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2076&auto=format&fit=crop",
        }}
        style={styles.commentItemAvatar}
      />
      <View style={styles.commentItemContent}>
        <View style={styles.commentItemHeader}>
          <Text style={styles.commentItemName}>{item.user.name || "User"}</Text>
          <Text style={styles.commentItemTime}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>
        <Text style={styles.commentItemText}>{item.text}</Text>
      </View>
    </View>
  );

  // Function to render each post in the list
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.profileImage }} style={styles.avatar} />
        <View style={styles.postHeaderText}>
          <Text style={styles.userName}>{item.user.name}</Text>
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

      {expandedCommentPostId === item._id && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments</Text>

          {commentsLoading[item._id] ? (
            <View style={styles.commentsLoadingContainer}>
              <ActivityIndicator size="small" color="#46A996" />
              <Text style={styles.loadingText}>Loading comments...</Text>
            </View>
          ) : commentError ? (
            <Text style={styles.errorText}>{commentError}</Text>
          ) : postComments && postComments.length > 0 ? (
            <FlatList
              data={postComments}
              renderItem={renderComment}
              keyExtractor={(comment) => comment._id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noCommentsText}>No comments yet</Text>
          )}
        </View>
      )}

      <View style={styles.commentSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2076&auto=format&fit=crop",
          }}
          style={styles.commentAvatar}
        />
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity
            onPress={() => handleSendComment(item._id)}
            disabled={sendingComment || !commentText.trim()}
            style={[
              styles.sendButton,
              (!commentText.trim() || sendingComment) &&
                styles.disabledSendButton,
            ]}
          >
            {sendingComment ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Send
                size={18}
                color={!commentText.trim() ? "#A0A0A0" : "#FFFFFF"}
              />
            )}
          </TouchableOpacity>
        </View>
        {commentError && (
          <Text style={styles.commentErrorText}>{commentError}</Text>
        )}
      </View>
    </View>
  );

  // Function to render community content with loading, error and empty states
  const renderCommunityContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#46A996" />
          <Text style={styles.emptyStateText}>Loading...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <AlertCircle size={48} color="#FF4949" />
          <Text style={styles.emptyStateText}>
            Error loading posts. Please try again.
          </Text>
        </View>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <MessageSquare size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No posts yet.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Loyalty Program</Text>
        <View style={styles.pointsContainer}>
          <Award size={18} color="#FFD700" />
          <Text style={styles.pointsText}>1,840 Points</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "forms" && styles.activeTab]}
          onPress={() => setActiveTab("forms")}
        >
          <ClipboardList
            size={18}
            color={activeTab === "forms" ? "#46A996" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "forms" && styles.activeTabText,
            ]}
          >
            Forms
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "community" && styles.activeTab]}
          onPress={() => setActiveTab("community")}
        >
          <MessageSquare
            size={18}
            color={activeTab === "community" ? "#46A996" : "#666"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "community" && styles.activeTabText,
            ]}
          >
            Community
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "forms" ? (
        <FormsSection />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.createPostContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2076&auto=format&fit=crop",
              }}
              style={styles.commentAvatar}
            />
            <TouchableOpacity
              style={styles.createPostButton}
              onPress={() => setShareModalVisible(true)}
            >
              <Text style={styles.createPostText}>
                Share your travel ideas...
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShareModalVisible(true)}
            >
              <Camera size={20} color="#46A996" />
            </TouchableOpacity>
          </View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Posts</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Latest</Text>
            </TouchableOpacity>
          </View>

          {renderCommunityContent()}

          {/* Share Ideas Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={shareModalVisible}
            onRequestClose={() => setShareModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Share Travel Idea</Text>
                  <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                    <X size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <TextInput
                    style={styles.ideaInput}
                    placeholder="Share your travel experience or idea..."
                    placeholderTextColor="#999"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                  />

                  {selectedImage && (
                    <View style={styles.selectedImageContainer}>
                      <Image
                        source={{ uri: selectedImage }}
                        style={styles.selectedImage}
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => setSelectedImage(null)}
                      >
                        <X size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.imagePickerRow}>
                    <TouchableOpacity
                      style={styles.imagePickerButton}
                      onPress={pickImage}
                    >
                      <ImageIcon size={20} color="#46A996" />
                      <Text style={styles.imagePickerText}>
                        {selectedImage ? "Change Photo" : "Add Photo"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[
                      styles.shareButton,
                      (!postText.trim() || isSubmittingPost) &&
                        styles.shareButtonDisabled,
                    ]}
                    onPress={handleShareIdea}
                    disabled={!postText.trim() || isSubmittingPost}
                  >
                    {isSubmittingPost ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.shareButtonText}>Share</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontFamily: "Exo2",
    fontSize: 24,
    color: "#333",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#46A996",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  activeTabText: {
    color: "#46A996",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
  },
  viewAll: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#46A996",
  },
  listContainer: {
    padding: 16,
  },
  createPostContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  createPostButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft: 10,
    marginRight: 10,
  },
  createPostText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#888",
  },
  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
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
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
  },
  commentInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
  commentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  commentsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  commentItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentItemContent: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 10,
  },
  commentItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentItemName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
    color: "#333",
  },
  commentItemTime: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#888",
  },
  commentItemText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
  noCommentsText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  emptyStateText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: "50%",
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  modalTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
  },
  modalBody: {
    padding: 16,
  },
  ideaInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  selectedImageContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  imagePickerText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#46A996",
    marginLeft: 5,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  shareButton: {
    backgroundColor: "#46A996",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
  },
  shareButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  shareButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  // Additional styles for comments functionality
  commentsLoadingContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF4949",
    padding: 16,
    textAlign: "center",
  },
  commentErrorText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#FF4949",
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: "#46A996",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: "#E0E0E0",
  },
});
