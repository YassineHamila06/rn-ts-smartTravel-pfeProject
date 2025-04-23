import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { blurHashCode } from "@/utils/utils";
import { getSavedTripIds } from "@/utils/savedTripsManager";
import SaveTripButton from "@/components/shared/SaveTripButton";
import { useGetTripsQuery } from "@/services/API";

// Define trip interface
interface Trip {
  _id: string;
  destination: string;
  image: string;
  [key: string]: any; // For any other properties
}

const SavedTripsScreen = () => {
  const router = useRouter();
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get all trips
  const { data: allTrips, isLoading: isTripsLoading } = useGetTripsQuery();

  // Refresh the saved trips list whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedTrips();
    }, [allTrips])
  );

  // Load saved trips from AsyncStorage
  const loadSavedTrips = async () => {
    try {
      setIsLoading(true);
      const savedTripIds = await getSavedTripIds();

      if (allTrips && savedTripIds.length > 0) {
        // Filter trips to only include saved ones
        const savedTripsData = allTrips.filter((trip) =>
          savedTripIds.includes(trip._id)
        );
        setSavedTrips(savedTripsData);
      } else {
        setSavedTrips([]);
      }
    } catch (error) {
      console.error("Failed to load saved trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate to trip details
  const navigateToTripDetails = (trip: Trip) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id: trip._id, trip: JSON.stringify(trip) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Trips</Text>
      </View>

      {isLoading || isTripsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading saved trips...</Text>
        </View>
      ) : savedTrips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved trips yet</Text>
          <Text style={styles.emptySubtext}>
            Add trips to your favorites by tapping the heart icon
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedTrips}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigateToTripDetails(item)}
              style={styles.tripCard}
            >
              <Image
                placeholder={{ blurhash: blurHashCode }}
                source={{ uri: item.image }}
                style={styles.tripImage}
              />
              <View style={styles.tripOverlay}>
                <View style={styles.tripHeader}>
                  <Text style={styles.tripName}>{item.destination}</Text>
                  <SaveTripButton
                    tripId={item._id}
                    style={styles.heartButton}
                  />
                </View>
                <TouchableOpacity
                  style={styles.discoverButton}
                  onPress={() => navigateToTripDetails(item)}
                >
                  <Text style={styles.discoverButtonText}>Discover more</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedTripsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontFamily: "Exo2",
    fontSize: 24,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  tripCard: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
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
  tripImage: {
    width: "100%",
    height: "100%",
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
    justifyContent: "space-between",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tripName: {
    fontFamily: "Playfair-Bold",
    fontSize: 28,
    color: "#fff",
    textTransform: "capitalize",
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    marginTop: 5,
  },
  discoverButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
});
