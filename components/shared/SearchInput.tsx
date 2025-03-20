import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Search } from "lucide-react-native";

const SearchInput = () => {
  return (
    <View style={styles.searchSection}>
      <Text style={styles.whereToText}>Where to?</Text>
      <View style={styles.searchInputContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places to go..."
          placeholderTextColor="#666"
        />
      </View>
    </View>
    
  );
};

export default SearchInput;

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
    fontFamily: "Playfair-Bold",
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
    marginBottom: 30,
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
    backgroundColor: "#0066FF",
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
