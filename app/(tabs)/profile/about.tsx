import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { ArrowLeft, Info } from "lucide-react-native";

export default function AboutScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh - in a real app, you might re-fetch data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#46A996" 
            colors={["#46A996"]} 
          />
        }
      >
        <View style={styles.aboutContainer}>
          <View style={styles.iconContainer}>
            <Info size={40} color="#46A996" />
          </View>

          <Text style={styles.appName}>SmartTravel</Text>

          <View style={styles.infoSection}>
            <Text style={styles.infoText}>
              SmartTravel helps travelers book and manage trips easily.
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version:</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developed by:</Text>
              <Text style={styles.infoValue}>Satisfy Insight Team</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact:</Text>
              <Text style={styles.infoValue}>support@SatisyInsight.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.additionalInfo}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.sectionText}>
              At SmartTravel, we're committed to making travel planning seamless
              and enjoyable. Our platform helps you discover new destinations,
              book with confidence, and create unforgettable memories.
            </Text>

            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>
                  Easy booking and trip management
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>
                  Curated travel experiences
                </Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>Loyalty rewards program</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>24/7 customer support</Text>
              </View>
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  aboutContainer: {
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontFamily: "Playfair-Bold",
    fontSize: 28,
    color: "#333",
    marginBottom: 20,
  },
  infoSection: {
    width: "100%",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#555",
  },
  infoValue: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#EEEEEE",
    marginVertical: 10,
  },
  additionalInfo: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  sectionText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    marginBottom: 16,
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#46A996",
    marginRight: 12,
  },
  featureText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#555",
  },
});
