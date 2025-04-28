import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronLeft, Search } from "lucide-react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { blurHashCode } from "@/utils/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import SaveEventButton from "@/components/shared/SaveEventButton";
import { useGetEventsQuery } from "@/services/API";

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

export default function AllEventsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events data
  const { data: events, isLoading, isError, refetch } = useGetEventsQuery();

  // Filter events based on search query
  const filteredEvents = events
    ? events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Navigate to event details
  const navigateToEventDetails = (event: Event) => {
    router.push(`/event/${event._id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>All Events</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading
                ? "Loading events..."
                : isError
                ? "Failed to load events"
                : "No events found"}
            </Text>
          </View>
        )}
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
            <View style={styles.eventContent}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{item.title}</Text>
                <SaveEventButton
                  eventId={item._id}
                  size={24}
                  style={styles.heartButton}
                />
              </View>
              <Text style={styles.eventDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
              <Text style={styles.eventLocation}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    paddingTop: Platform.OS === "android" ? 10 : 0,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 24,
    color: "#333",
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#666",
  },
  eventCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 200,
  },
  eventContent: {
    padding: 15,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  eventName: {
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    marginTop: 5,
  },
  eventDate: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#0066FF",
    marginBottom: 5,
  },
  eventLocation: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
});
