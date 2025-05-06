import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  RefreshControl,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import { Gift, HelpCircle, RotateCcw } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useGetRewardsQuery } from "@/services/API";
import { ActivityIndicator } from "react-native";

// Define types for our data
type Reward = {
  _id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  image: string;
};

// Define the style types
type StyleProps = {
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  headerButtons: ViewStyle;
  refreshButton: ViewStyle;
  helpButton: ViewStyle;
  listContainer: ViewStyle;
  rewardCard: ViewStyle;
  rewardImage: ImageStyle;
  rewardContent: ViewStyle;
  rewardHeader: ViewStyle;
  rewardTitle: TextStyle;
  categoryBadge: ViewStyle;
  categoryText: TextStyle;
  rewardDescription: TextStyle;
  rewardFooter: ViewStyle;
  pointsCostContainer: ViewStyle;
  pointsCost: TextStyle;
  redeemButton: ViewStyle;
  redeemButtonText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  retryButton: ViewStyle;
  retryButtonText: TextStyle;
};

export default function RewardsSection() {
  const router = useRouter();
  const {
    data: rewards = [],
    isLoading,
    error,
    refetch,
  } = useGetRewardsQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderReward = ({ item }: { item: Reward }) => (
    <TouchableOpacity style={styles.rewardCard}>
      <Image
        source={{ uri: item.image }}
        style={styles.rewardImage}
        resizeMode="cover"
      />
      <View style={styles.rewardContent}>
        <View style={styles.rewardHeader}>
          <Text style={styles.rewardTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <View style={styles.rewardFooter}>
          <View style={styles.pointsCostContainer}>
            <Gift size={16} color="#FFD700" />
            <Text style={styles.pointsCost}>{item.pointsRequired} Points</Text>
          </View>
          <TouchableOpacity style={styles.redeemButton}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <RotateCcw size={18} color="#46A996" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => router.push("/(tabs)/loyalty-program/rewards-info")}
          >
            <HelpCircle size={20} color="#46A996" />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#46A996"
          style={{ marginTop: 20 }}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load rewards.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rewards}
          renderItem={renderReward}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#46A996"]}
              tintColor="#46A996"
            />
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create<StyleProps>({
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  refreshButton: {
    padding: 8,
    marginRight: 4,
  },
  helpButton: {
    marginRight: 12,
    padding: 4,
  },
  listContainer: {
    padding: 16,
  },
  rewardCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
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
  rewardImage: {
    width: "100%",
    height: 120,
  },
  rewardContent: {
    padding: 16,
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rewardTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#E6F7F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: "#46A996",
  },
  rewardDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsCostContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsCost: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
    marginLeft: 6,
  },
  redeemButton: {
    backgroundColor: "#46A996",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  redeemButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#46A996",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
