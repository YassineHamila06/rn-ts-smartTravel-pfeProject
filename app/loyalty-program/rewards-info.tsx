import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import { ChevronLeft, Award } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function RewardsInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Rewards Program</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <Award size={22} color="#FFD700" />
            <Text style={styles.sectionTitle}>
              How to Earn Points & Get Rewards
            </Text>
          </View>

          <Text style={styles.paragraph}>
            You can earn loyalty points by doing the following:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Book a trip</Text> → +500 points per
              reservation
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Post in the Community</Text> → +100
              points per post
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Fill out a loyalty form</Text> → +200
              points per form
            </Text>
          </View>

          <View style={styles.example}>
            <Text style={styles.exampleHeader}>🟡 Example:</Text>
            <Text style={styles.exampleText}>
              If you book 2 trips (2 × 500 = 1000 points) and make 1 post
              (+100), you'll have 1,100 points total.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Once you have enough points for a reward, just press the "Redeem"
            button next to it. The required points are listed on each reward
            card (e.g. 500 points for 10% discount).
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoHeader}>🔐 Milestone Rewards</Text>
            <Text style={styles.infoText}>
              Some rewards will unlock only when you reach specific point
              milestones (e.g. 5,000 points = free travel accessory).
            </Text>
          </View>

          <Text style={styles.conclusion}>
            Keep participating to unlock bigger and better rewards!
          </Text>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
    marginLeft: 8,
  },
  paragraph: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 8,
  },
  bullet: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#46A996",
    marginRight: 8,
  },
  bulletText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    flex: 1,
  },
  bold: {
    fontFamily: "Inter-SemiBold",
  },
  example: {
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  exampleHeader: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  exampleText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: "#E6F7F3",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  infoHeader: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  conclusion: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#46A996",
    textAlign: "center",
    marginTop: 16,
  },
});
