import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
} from "react-native";
import { Gift, ChevronRight, HelpCircle } from "lucide-react-native";
import { useRouter } from "expo-router";

// Define types for our data
type Reward = {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  image: string;
};

// Mock data for rewards
const REWARDS: Reward[] = [
  {
    id: "1",
    title: "10% Discount Voucher",
    description: "Get 10% off your next booking",
    pointsCost: 500,
    category: "Discounts",
    image:
      "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Free Airport Transfer",
    description: "Complimentary airport transfer on your next trip",
    pointsCost: 1200,
    category: "Services",
    image:
      "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=2068&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Hotel Room Upgrade",
    description: "Upgrade to next room category on your next stay",
    pointsCost: 2000,
    category: "Upgrades",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Premium Lounge Access",
    description: "One-time access to airport premium lounge",
    pointsCost: 1500,
    category: "Services",
    image:
      "https://images.unsplash.com/photo-1631196191062-21a891a2ae43?q=80&w=2072&auto=format&fit=crop",
  },
];

export default function RewardsSection() {
  const router = useRouter();

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
            <Text style={styles.pointsCost}>{item.pointsCost} Points</Text>
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
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push("/(tabs)/loyalty-program/rewards-info")}
        >
          <HelpCircle size={20} color="#46A996" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={REWARDS}
        renderItem={renderReward}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
});
