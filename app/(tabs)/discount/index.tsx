import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  RefreshControl,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { blurHashCode } from "@/utils/utils";
import { useGetTripsQuery } from "@/services/API";
import SaveTripButton from "@/components/shared/SaveTripButton";
import TripPriceDisplay from "@/components/shared/TripPriceDisplay";

// Define trip interface
interface Trip {
  _id: string;
  destination: string;
  image: string;
  price: number | string;
  reduction?: number | string;
  tripType?: string;
  [key: string]: any; // For any other properties
}

export default function DiscountScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [discountedTrips, setDiscountedTrips] = useState<Trip[]>([]);

  const {
    data: trips,
    isLoading,
    isError,
    refetch: refetchTrips,
  } = useGetTripsQuery();

  // Filter trips to only include those with discounts
  useEffect(() => {
    if (trips) {
      const tripsWithDiscount = trips.filter(
        (trip) => trip.reduction && parseFloat(String(trip.reduction)) > 0
      );
      setDiscountedTrips(tripsWithDiscount);
    }
  }, [trips]);

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetchTrips().finally(() => {
      setRefreshing(false);
    });
  }, [refetchTrips]);

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
        <Text style={styles.title}>Discount Deals</Text>
        <Text style={styles.subtitle}>
          Explore our special offers and save on your next adventure
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetchTrips}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={discountedTrips}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No discounted trips available at the moment.
              </Text>
              <Text style={styles.emptySubtext}>
                Check back later for new deals!
              </Text>
            </View>
          )}
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

                <View style={styles.priceAndButtonContainer}>
                  <TripPriceDisplay
                    price={item.price}
                    reduction={item.reduction}
                    tripType={item.tripType}
                  />

                  <TouchableOpacity
                    style={styles.discoverButton}
                    onPress={() => navigateToTripDetails(item)}
                  >
                    <Text style={styles.discoverButtonText}>View Deal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontFamily: "Exo2",
    fontSize: 28,
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
  priceAndButtonContainer: {
    gap: 8,
  },
  discoverButton: {
    backgroundColor: "#FF4949",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
