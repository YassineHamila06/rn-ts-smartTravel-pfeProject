import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { useRouter, useFocusEffect } from "expo-router";
import { blurHashCode } from "@/utils/utils";
import { getSavedTripIds } from "@/utils/savedTripsManager";
import { getSavedEventIds } from "@/utils/savedEventsManager";
import SaveTripButton from "@/components/shared/SaveTripButton";
import SaveEventButton from "@/components/shared/SaveEventButton";
import { useGetTripsQuery, useGetEventsQuery } from "@/services/API";
import TripPriceDisplay from "@/components/shared/TripPriceDisplay";

// Define trip interface
interface Trip {
  _id: string;
  destination: string;
  image: string;
  [key: string]: any; // For any other properties
}

// Define event interface
interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  date: string;
  time: string;
  isActive: boolean;
}

const SavedScreen = () => {
  const router = useRouter();
  const [savedTrips, setSavedTrips] = useState<Trip[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"trips" | "events">("trips");

  // Get all trips
  const {
    data: allTrips,
    isLoading: isTripsLoading,
    refetch: refetchAllTrips,
  } = useGetTripsQuery();

  // Get all events
  const {
    data: allEvents,
    isLoading: isEventsLoading,
    refetch: refetchAllEvents,
  } = useGetEventsQuery();

  // Refresh the saved trips and events list whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedItems();
    }, [allTrips, allEvents])
  );

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      refetchAllTrips(),
      refetchAllEvents(),
      loadSavedItems(),
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchAllTrips, refetchAllEvents]);

  // Load saved items (trips and events) from AsyncStorage
  const loadSavedItems = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadSavedTrips(), loadSavedEvents()]);
    } catch (error) {
      console.error("Failed to load saved items:", error);
    } finally {
      setIsLoading(false);
    }

    return Promise.resolve(); // Return a promise for the onRefresh function
  };

  // Load saved trips from AsyncStorage
  const loadSavedTrips = async () => {
    try {
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
    }
  };

  // Load saved events from AsyncStorage
  const loadSavedEvents = async () => {
    try {
      const savedEventIds = await getSavedEventIds();

      if (allEvents && savedEventIds.length > 0) {
        // Filter events to only include saved ones
        const savedEventsData = allEvents.filter((event) =>
          savedEventIds.includes(event._id)
        );
        setSavedEvents(savedEventsData);
      } else {
        setSavedEvents([]);
      }
    } catch (error) {
      console.error("Failed to load saved events:", error);
    }
  };

  // Function to navigate to trip details
  const navigateToTripDetails = (trip: Trip) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id: trip._id, trip: JSON.stringify(trip) },
    });
  };

  // Function to navigate to event details
  const navigateToEventDetails = (event: Event) => {
    router.push({
      pathname: "/event/[id]",
      params: { id: event._id, event: JSON.stringify(event) },
    });
  };

  // Render the tabs UI
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "trips" && styles.activeTab]}
        onPress={() => setActiveTab("trips")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "trips" && styles.activeTabText,
          ]}
        >
          Trips
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "events" && styles.activeTab]}
        onPress={() => setActiveTab("events")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "events" && styles.activeTabText,
          ]}
        >
          Events
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render the saved trips list
  const renderTrips = () => {
    if (isLoading || isTripsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading saved trips...</Text>
        </View>
      );
    }

    if (savedTrips.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved trips yet</Text>
          <Text style={styles.emptySubtext}>
            Add trips to your favorites by tapping the heart icon
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={savedTrips}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066FF"
            colors={["#0066FF"]}
          />
        }
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
                <SaveTripButton tripId={item._id} style={styles.heartButton} />
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
                  <Text style={styles.discoverButtonText}>Discover more</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  // Render the saved events list
  const renderEvents = () => {
    if (isLoading || isEventsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingText}>Loading saved events...</Text>
        </View>
      );
    }

    if (savedEvents.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved events yet</Text>
          <Text style={styles.emptySubtext}>
            Add events to your favorites by tapping the heart icon
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066FF"
            colors={["#0066FF"]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigateToEventDetails(item)}
            style={styles.eventCard}
          >
            <Image
              placeholder={{ blurhash: blurHashCode }}
              source={{ uri: item.image }}
              style={styles.eventImage}
            />
            <View style={styles.eventOverlay}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{item.title}</Text>
                <SaveEventButton
                  eventId={item._id}
                  style={styles.heartButton}
                />
              </View>

              <View style={styles.eventDetailsContainer}>
                <Text style={styles.eventLocation}>{item.location}</Text>
                <Text style={styles.eventDate}>
                  {item.date} • {item.time}
                </Text>

                <TouchableOpacity
                  style={styles.discoverButton}
                  onPress={() => navigateToEventDetails(item)}
                >
                  <Text style={styles.discoverButtonText}>View event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Items</Text>
      </View>

      {renderTabs()}

      <View style={styles.contentContainer}>
        {activeTab === "trips" ? renderTrips() : renderEvents()}
      </View>
    </SafeAreaView>
  );
};

export default SavedScreen;

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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#0066FF",
  },
  tabText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#0066FF",
    fontFamily: "Inter-SemiBold",
  },
  contentContainer: {
    flex: 1,
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
  eventCard: {
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
  eventImage: {
    width: "100%",
    height: "100%",
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
    justifyContent: "space-between",
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
    justifyContent: "space-between",
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 20,
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  priceAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventDetailsContainer: {
    justifyContent: "flex-end",
  },
  eventLocation: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  eventDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
    opacity: 0.9,
  },
  discoverButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#fff",
  },
});
