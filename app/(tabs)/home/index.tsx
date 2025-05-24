import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import { Bell, ChevronRight, Search, Star, User } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import { useGetEventsQuery, useGetTripsQuery } from "@/services/API";
import SearchInput from "@/components/shared/SearchInput";
import SaveTripButton from "@/components/shared/SaveTripButton";
import SaveEventButton from "@/components/shared/SaveEventButton";
import TripPriceDisplay from "@/components/shared/TripPriceDisplay";
import { FlatList } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurHashCode } from "@/utils/utils";
import React, { useState } from "react";

export default function DiscoverScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: trips,
    isLoading,
    isError,
    refetch: refetchTrips,
  } = useGetTripsQuery();

  const {
    data: events,
    isLoading: eventsLoading,
    isError: eventsError,
    refetch: refetchEvents,
  } = useGetEventsQuery();

  const sortedEvents = events
    ?.slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // refrech
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Promise.all([refetchTrips(), refetchEvents()]).finally(() => {
      setRefreshing(false);
    });
  }, [refetchTrips, refetchEvents]);

  // tmchi ll trip details
  const navigateToTripDetails = (trip: any) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id: trip._id, trip: JSON.stringify(trip) },
    });
  };

  // event details
  const navigateToEventDetails = (event: any) => {
    router.push({
      pathname: "/event/[id]",
      params: { id: event._id, event: JSON.stringify(event) },
    });
  };

  //all trips
  const navigateToAllTrips = () => {
    router.push({
      pathname: "/trip/all-trips",
      params: { trips: JSON.stringify(trips) },
    });
  };

  //all events
  const navigateToAllEvents = () => {
    router.push("/event/all-events");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bell size={24} color="#333" />
        <Text style={styles.title}>Discover</Text>
        <User size={24} color="#333" />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0066FF" // Match the app's accent color
            colors={["#0066FF"]} // For Android
          />
        }
      >
        <SearchInput />
        <TouchableOpacity
          style={styles.nearbyCard}
          onPress={() => router.push("/nearby-places")}
        >
          <Image
            placeholder={{ blurhash: "L5H2EC=PM+yV0g-mq.wG9c010J}I" }}
            source={require("../../../assets/images/map.png")}
            style={styles.nearbyImage}
          />
          <View style={styles.nearbyContent}>
            <Text style={styles.nearbyTitle}>
              Looking for something nearby?
            </Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>Sousse, Tunisia</Text>
              <ChevronRight size={20} color="#0066FF" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tours</Text>
          <TouchableOpacity onPress={navigateToAllTrips}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>
            Loading trips...
          </Text>
        ) : isError ? (
          <Text
            style={{ textAlign: "center", marginVertical: 20, color: "red" }}
          >
            Failed to load trips
          </Text>
        ) : (
          <FlatList
            horizontal
            contentContainerStyle={styles.toursContent}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={{ width: wp("2%") }} />}
            style={styles.toursContainer}
            data={trips}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigateToTripDetails(item)}
                style={styles.tourCard}
              >
                <Image
                  placeholder={{ blurhash: blurHashCode }}
                  source={{ uri: item.image }}
                  style={styles.tourImage}
                />
                <View style={styles.tourOverlay}>
                  <View style={styles.tourHeader}>
                    <Text style={styles.tourName}>{item.destination}</Text>
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
                      <Text style={styles.discoverButtonText}>
                        Discover more
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>World Wide Events</Text>
          <TouchableOpacity onPress={navigateToAllEvents}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {eventsLoading ? (
          <Text style={{ textAlign: "center", marginVertical: 20 }}>
            Loading events...
          </Text>
        ) : eventsError ? (
          <Text
            style={{ textAlign: "center", marginVertical: 20, color: "red" }}
          >
            Failed to load events
          </Text>
        ) : (
          <FlatList
            horizontal
            data={sortedEvents}
            contentContainerStyle={styles.eventsContent}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={{ width: wp("2%") }} />}
            style={styles.eventsContainer}
            renderItem={({ item: event }) => (
              <TouchableOpacity
                key={event._id}
                style={styles.eventCard}
                onPress={() => navigateToEventDetails(event)}
              >
                <Image
                  placeholder={{
                    blurhash: blurHashCode,
                  }}
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventName}>{event.title}</Text>
                    <SaveEventButton
                      eventId={event._id}
                      size={20}
                      style={styles.eventHeartButton}
                    />
                  </View>
                  <Text style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString()}
                  </Text>
                  <View style={styles.eventFooter}>
                    <Text style={styles.eventLocation}>{event.location}</Text>
                    <Text style={styles.eventPrice}>
                      {event.price ? `$${event.price.toFixed(2)}` : "Free"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>
            Explore More Destinations
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  title: {
    fontFamily: "Exo2",
    fontSize: 24,
    color: "#333",
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  whereToText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    padding: 15,
  },
  nearbyCard: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  nearbyImage: {
    width: "100%",
    height: 150,
  },
  nearbyContent: {
    padding: 15,
  },
  nearbyTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#0066FF",
    marginRight: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
  },
  viewAll: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#0066FF",
  },
  toursContainer: {
    marginBottom: 30,
  },
  toursContent: {
    paddingHorizontal: 15,
  },
  tourCard: {
    width: 280,
    height: 350,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: "hidden",
  },
  tourImage: {
    width: "100%",
    height: "100%",
  },
  tourOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 15,
    justifyContent: "space-between",
  },
  tourHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tourName: {
    fontFamily: "Playfair-Bold",
    fontSize: 24,
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    marginTop: 5,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  ratingText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#333",
    marginLeft: 4,
  },
  discoverButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  discoverButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
  eventsContainer: {
    paddingBottom: heightPercentageToDP("2%"),
  },
  eventsContent: {
    paddingHorizontal: 15,
  },
  eventCard: {
    width: 280,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
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
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventContent: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  eventHeartButton: {
    marginLeft: 5,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  eventName: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  eventDate: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  eventLocation: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#0066FF",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  exploreButton: {
    backgroundColor: "#46A996",
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  exploreButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  priceAndButtonContainer: {
    gap: 8,
  },
});
