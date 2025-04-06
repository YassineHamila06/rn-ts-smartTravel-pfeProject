import React, { useState } from "react";
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
  ChevronRight,
  X,
  MapPin,
} from "lucide-react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { blurHashCode } from "@/utils/utils";

// Define types for our data
type Form = {
  id: string;
  title: string;
  description: string;
  questions: number;
  completed: boolean;
  dueDate: string;
};

type User = {
  name: string;
  avatar: string;
};

type Comment = {
  id: string;
  user: User;
  text: string;
  time: string;
};

type Post = {
  id: string;
  user: User;
  content: string;
  image: string | null;
  likes: number;
  comments: number;
  time: string;
  commentsList: Comment[];
};

// Mock data for forms
const FORMS: Form[] = [
  {
    id: "1",
    title: "Next Trip Survey",
    description: "Help us decide the next group destination",
    questions: 5,
    completed: false,
    dueDate: "May 15, 2024",
  },
  {
    id: "2",
    title: "Travel Preferences Update",
    description: "Update your travel style and preferences",
    questions: 8,
    completed: true,
    dueDate: "Apr 30, 2024",
  },
];

// Mock data for social posts
const POSTS: Post[] = [
  {
    id: "1",
    user: {
      name: "Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop",
    },
    content:
      "Just got back from Bali and it was amazing! Highly recommend for our next group trip! 🌴☀️",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop",
    likes: 24,
    comments: 5,
    time: "2h ago",
    commentsList: [
      {
        id: "1",
        user: {
          name: "Sarah Johnson",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        },
        text: "Looks incredible! Did you go to Ubud?",
        time: "1h ago",
      },
      {
        id: "2",
        user: {
          name: "David Lee",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
        },
        text: "What was your favorite part of the trip?",
        time: "1h ago",
      },
      {
        id: "3",
        user: {
          name: "Sophia Ahmed",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        },
        text: "I'm definitely adding this to my bucket list!",
        time: "2h ago",
      },
      {
        id: "4",
        user: {
          name: "Michael Chen",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
        },
        text: "Did you try that restaurant I recommended?",
        time: "2h ago",
      },
      {
        id: "5",
        user: {
          name: "Alex Morgan",
          avatar:
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop",
        },
        text: "How was the weather in April?",
        time: "2h ago",
      },
    ],
  },
  {
    id: "2",
    user: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
    },
    content:
      "Has anyone tried the food tour in Barcelona? Planning to go next month!",
    image: null,
    likes: 12,
    comments: 8,
    time: "1d ago",
    commentsList: [
      {
        id: "1",
        user: {
          name: "Elena Rodriguez",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
        },
        text: "Yes! The Gothic Quarter has amazing tapas tours.",
        time: "22h ago",
      },
      {
        id: "2",
        user: {
          name: "John Smith",
          avatar:
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop",
        },
        text: "Try the food market at La Boqueria too!",
        time: "23h ago",
      },
      {
        id: "3",
        user: {
          name: "Marie Dubois",
          avatar:
            "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?q=80&w=1776&auto=format&fit=crop",
        },
        text: "I can send you the name of the tour I took last summer.",
        time: "1d ago",
      },
    ],
  },
  {
    id: "3",
    user: {
      name: "Sophia Ahmed",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    },
    content:
      "Check out this amazing view from my hotel room in Santorini! We should definitely plan a group trip here.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1954&auto=format&fit=crop",
    likes: 47,
    comments: 15,
    time: "3d ago",
    commentsList: [
      {
        id: "1",
        user: {
          name: "Emma Wilson",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop",
        },
        text: "That view is absolutely breathtaking! 😍",
        time: "2d ago",
      },
      {
        id: "2",
        user: {
          name: "Jake Williams",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
        },
        text: "Which hotel is this? I'm planning to go in July.",
        time: "2d ago",
      },
      {
        id: "3",
        user: {
          name: "Lisa Thompson",
          avatar:
            "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?q=80&w=1853&auto=format&fit=crop",
        },
        text: "I'm in! When are you thinking of planning this group trip?",
        time: "3d ago",
      },
    ],
  },
];

// Sample destination suggestions
const DESTINATIONS = [
  "Bali, Indonesia",
  "Santorini, Greece",
  "Tokyo, Japan",
  "Barcelona, Spain",
  "Marrakech, Morocco",
  "Reykjavik, Iceland",
];

export default function LoyaltyProgramScreen() {
  const [activeTab, setActiveTab] = useState("forms");
  const [commentText, setCommentText] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<
    string | null
  >(null);

  const handleShareIdea = () => {
    // Here you would normally send the post to your backend
    if (postText.trim() === "") return;

    console.log("Sharing idea:", {
      text: postText,
      destination: selectedDestination,
    });

    // Reset form and close modal
    setPostText("");
    setSelectedDestination("");
    setShareModalVisible(false);
  };

  const toggleComments = (postId: string) => {
    if (expandedCommentPostId === postId) {
      setExpandedCommentPostId(null);
    } else {
      setExpandedCommentPostId(postId);
    }
  };

  const renderForm = ({ item }: { item: Form }) => (
    <TouchableOpacity style={styles.formCard}>
      <View style={styles.formHeader}>
        <ClipboardList size={20} color="#46A996" />
        <Text style={styles.formTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.completed ? "#E3F2E6" : "#FFF4E5" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.completed ? "#2D8A39" : "#B25E09" },
            ]}
          >
            {item.completed ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>
      <Text style={styles.formDescription}>{item.description}</Text>
      <View style={styles.formFooter}>
        <Text style={styles.formInfo}>{item.questions} questions</Text>
        <Text style={styles.formInfo}>Due: {item.dueDate}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.formButton,
          { backgroundColor: item.completed ? "#f5f5f5" : "#46A996" },
        ]}
      >
        <Text
          style={[
            styles.formButtonText,
            { color: item.completed ? "#666" : "#fff" },
          ]}
        >
          {item.completed ? "View Responses" : "Fill Out Form"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <Image
        source={{ uri: item.user.avatar }}
        style={styles.commentItemAvatar}
      />
      <View style={styles.commentItemContent}>
        <View style={styles.commentItemHeader}>
          <Text style={styles.commentItemName}>{item.user.name}</Text>
          <Text style={styles.commentItemTime}>{item.time}</Text>
        </View>
        <Text style={styles.commentItemText}>{item.text}</Text>
      </View>
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.postHeaderText}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.postTime}>{item.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <ThumbsUp size={18} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleComments(item.id)}
        >
          <MessageSquare
            size={18}
            color={expandedCommentPostId === item.id ? "#46A996" : "#666"}
          />
          <Text
            style={[
              styles.actionText,
              expandedCommentPostId === item.id && { color: "#46A996" },
            ]}
          >
            {item.comments}
          </Text>
        </TouchableOpacity>
      </View>

      {expandedCommentPostId === item.id && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <FlatList
            data={item.commentsList}
            renderItem={renderComment}
            keyExtractor={(comment) => comment.id}
            scrollEnabled={false}
          />
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
          <TouchableOpacity>
            <Send size={18} color="#46A996" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDestination = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.destinationItem}
      onPress={() => {
        setSelectedDestination(item);
        setShowDestinations(false);
      }}
    >
      <MapPin size={16} color="#46A996" />
      <Text style={styles.destinationText}>{item}</Text>
    </TouchableOpacity>
  );

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
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Admin Forms</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View History</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={FORMS}
            renderItem={renderForm}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
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
          <FlatList
            data={POSTS}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />

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
                  <TouchableOpacity
                    style={styles.destinationSelector}
                    onPress={() => setShowDestinations(!showDestinations)}
                  >
                    <MapPin size={20} color="#46A996" />
                    <Text
                      style={
                        selectedDestination
                          ? styles.selectedDestination
                          : styles.destinationPlaceholder
                      }
                    >
                      {selectedDestination || "Tag a destination"}
                    </Text>
                    <ChevronRight
                      size={20}
                      color="#666"
                      style={{
                        transform: [
                          { rotate: showDestinations ? "90deg" : "0deg" },
                        ],
                      }}
                    />
                  </TouchableOpacity>

                  {showDestinations && (
                    <FlatList
                      data={DESTINATIONS}
                      renderItem={renderDestination}
                      keyExtractor={(item) => item}
                      style={styles.destinationsList}
                    />
                  )}

                  <TextInput
                    style={styles.ideaInput}
                    placeholder="Share your travel experience or idea..."
                    placeholderTextColor="#999"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                  />

                  <View style={styles.imagePickerRow}>
                    <TouchableOpacity style={styles.imagePickerButton}>
                      <ImageIcon size={20} color="#46A996" />
                      <Text style={styles.imagePickerText}>Add Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[
                      styles.shareButton,
                      !postText.trim() && styles.shareButtonDisabled,
                    ]}
                    onPress={handleShareIdea}
                    disabled={!postText.trim()}
                  >
                    <Text style={styles.shareButtonText}>Share</Text>
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
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  formTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
  formDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#888",
  },
  formButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  formButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
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
    fontSize: 14,
    color: "#333",
  },
  postTime: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#888",
  },
  postContent: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
    lineHeight: 20,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    paddingTop: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 10,
  },
  commentInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 30 : 0,
    maxHeight: "80%",
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
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
  },
  modalBody: {
    padding: 16,
  },
  destinationSelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  destinationPlaceholder: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#888",
    flex: 1,
    marginLeft: 8,
  },
  selectedDestination: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  destinationsList: {
    maxHeight: 150,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  destinationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  destinationText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
  },
  ideaInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 16,
  },
  imagePickerRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imagePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  imagePickerText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#46A996",
    marginLeft: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  shareButton: {
    backgroundColor: "#46A996",
    padding: 16,
    borderRadius: 8,
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
  commentsContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  commentsTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentItemContent: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
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
    fontSize: 14,
    color: "#333",
    lineHeight: 18,
  },
});
