import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Bell, ChevronRight, Search, Star, User } from "lucide-react-native";
import { Link } from "expo-router";
import { events, tours } from "@/components/staticData/data";
import SearchInput from "@/components/shared/SearchInput";
import { FlatList } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurHashCode } from "@/utils/utils";

export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bell size={24} color="#333" />
        <Text style={styles.title}>Discover</Text>
        <User size={24} color="#333" />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SearchInput />
        <TouchableOpacity style={styles.nearbyCard}>
          <Image
            placeholder={{ blurhash: "L5H2EC=PM+yV0g-mq.wG9c010J}I" }}
            source={{
              uri: "https://images.unsplash.com/photo-1565689876697-e467b6c54da2?q=80&w=2070&auto=format&fit=crop",
            }}
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
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          contentContainerStyle={styles.toursContent}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ width: wp("2%") }} />}
          style={styles.toursContainer}
          data={tours}
          renderItem={({
            item,
          }: {
            item: {
              id: string;
              name: string;
              image: string;
              rating: number;
            };
          }) => (
            <TouchableOpacity
              onPress={() => console.log(item?.name)}
              style={styles.tourCard}
            >
              <Image
                placeholder={{
                  blurhash: blurHashCode,
                }}
                source={{ uri: item?.image }}
                style={styles.tourImage}
              />
              <View style={styles.tourOverlay}>
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{item?.rating}</Text>
                </View>
                <Text style={styles.tourName}>{item?.name}</Text>
                <TouchableOpacity style={styles.discoverButton}>
                  <Text style={styles.discoverButtonText}>Discover more</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>World Wide Events</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal //scroll hor
          data={events} //data
          contentContainerStyle={styles.eventsContent} //margin start and end
          showsHorizontalScrollIndicator={false} //scroll indicator
          keyExtractor={(item) => item.id} //each item whith its id
          ItemSeparatorComponent={() => <View style={{ width: wp("2%") }} />} // gap between each item
          style={styles.eventsContainer}
          renderItem={({ item: event }) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <Image
                placeholder={{
                  blurhash: blurHashCode,
                }}
                source={{ uri: event.image }}
                style={styles.eventImage}
              />
              <View style={styles.eventContent}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
  tourName: {
    fontFamily: "Playfair-Bold",
    fontSize: 32,
    color: "#fff",
    textTransform: "capitalize",
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
});
