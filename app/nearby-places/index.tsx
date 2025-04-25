import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Filter,
  Coffee,
  Hotel,
  Building,
  Tent,
  Trees,
} from "lucide-react-native";
import * as Location from "expo-location";
import { Image } from "expo-image";
import {
  heightPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Define the types for the place data
interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  distance?: number;
  address?: string;
}

// Define categories for the places
const PLACE_CATEGORIES = {
  restaurant: "Restaurants",
  hotel: "Hotels",
  museum: "Museums",
  attraction: "Tourist Attractions",
  park: "Parks",
  all: "All Places",
};

const CATEGORY_ICONS = {
  restaurant: <Coffee size={18} color="#0066FF" />,
  hotel: <Hotel size={18} color="#0066FF" />,
  museum: <Building size={18} color="#0066FF" />,
  attraction: <Tent size={18} color="#0066FF" />,
  park: <Trees size={18} color="#0066FF" />,
};

const CATEGORY_EMOJIS = {
  restaurant: "🍽️",
  hotel: "🏨",
  museum: "🖼️",
  attraction: "🗿",
  park: "🌳",
};

// Type for the grouped places
type GroupedPlaces = {
  [key: string]: Place[];
};

export default function NearbyPlacesScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [groupedPlaces, setGroupedPlaces] = useState<GroupedPlaces>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Function to get the user's location and fetch nearby places
  const loadNearbyPlaces = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setIsLoading(false);
        return;
      }

      // Get the user's current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);

      // Fetch nearby places using OpenStreetMap Overpass API
      await fetchNearbyPlaces(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error) {
      console.error("Error fetching location or places:", error);
      setErrorMsg("Could not fetch nearby places. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch nearby places from the Overpass API
  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      // Create the Overpass API query for nearby places
      const radius = 1500; // 1.5km radius
      const query = `
        [out:json];
        (
          node(around:${radius},${latitude},${longitude})[amenity=restaurant];
          node(around:${radius},${latitude},${longitude})[tourism=hotel];
          node(around:${radius},${latitude},${longitude})[tourism=museum];
          node(around:${radius},${latitude},${longitude})[tourism=attraction];
          node(around:${radius},${latitude},${longitude})[leisure=park];
        );
        out body;
      `;

      // Fetch data from the Overpass API
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();

      // Process the response data
      if (data && data.elements && data.elements.length > 0) {
        const processedPlaces: Place[] = data.elements.map((element: any) => {
          // Determine the type of place
          let type = "unknown";
          if (element.tags.amenity === "restaurant") type = "restaurant";
          else if (element.tags.tourism === "hotel") type = "hotel";
          else if (element.tags.tourism === "museum") type = "museum";
          else if (element.tags.tourism === "attraction") type = "attraction";
          else if (element.tags.leisure === "park") type = "park";

          // Calculate distance (in meters)
          const distance = calculateDistance(
            latitude,
            longitude,
            element.lat,
            element.lon
          );

          // Get address information if available
          const address =
            element.tags.address ||
            element.tags["addr:street"] ||
            element.tags.vicinity ||
            (element.tags.city
              ? `${element.tags.city}, ${element.tags.country || ""}`
              : "");

          return {
            id: element.id.toString(),
            name: element.tags.name || `Unnamed ${type}`,
            type,
            coordinates: {
              lat: element.lat,
              lon: element.lon,
            },
            distance: Math.round(distance),
            address: address,
          };
        });

        // Sort places by distance
        processedPlaces.sort((a, b) => {
          return (a.distance || 0) - (b.distance || 0);
        });

        setPlaces(processedPlaces);

        // Group places by type
        const grouped: GroupedPlaces = {};
        processedPlaces.forEach((place) => {
          if (!grouped[place.type]) {
            grouped[place.type] = [];
          }
          grouped[place.type].push(place);
        });

        setGroupedPlaces(grouped);
      } else {
        setPlaces([]);
        setGroupedPlaces({});
      }
    } catch (error) {
      console.error("Error fetching from Overpass API:", error);
      throw error;
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d * 1000; // Convert to meters
  };

  // Convert degrees to radians
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNearbyPlaces().finally(() => {
      setRefreshing(false);
    });
  }, []);

  // Initial data loading
  useEffect(() => {
    loadNearbyPlaces();
  }, []);

  // Function to open maps app with the location
  const openInMaps = (place: Place) => {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = `${scheme}0,0?q=${place.coordinates.lat},${
      place.coordinates.lon
    }(${encodeURIComponent(place.name)})`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          "Cannot Open Maps",
          "Your device doesn't support opening this location in maps.",
          [{ text: "OK" }]
        );
      }
    });
  };

  // Render filter chip
  const renderFilterChip = (category: string) => {
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          activeFilter === category && styles.activeFilterChip,
        ]}
        onPress={() => setActiveFilter(category)}
      >
        {category !== "all" && (
          <View style={styles.chipIconContainer}>
            {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
          </View>
        )}
        <Text
          style={[
            styles.filterChipText,
            activeFilter === category && styles.activeFilterChipText,
          ]}
        >
          {PLACE_CATEGORIES[category as keyof typeof PLACE_CATEGORIES]}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render each place card
  const renderPlaceCard = (place: Place) => {
    return (
      <TouchableOpacity
        key={place.id}
        style={styles.placeCard}
        onPress={() => openInMaps(place)}
      >
        <View style={styles.cardIconContainer}>
          {CATEGORY_ICONS[place.type as keyof typeof CATEGORY_ICONS]}
        </View>
        <View style={styles.placeInfo}>
          <View style={styles.placeNameRow}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.emojiTag}>
              {CATEGORY_EMOJIS[place.type as keyof typeof CATEGORY_EMOJIS]}
            </Text>
          </View>

          <View style={styles.placeDetails}>
            <MapPin size={14} color="#0066FF" />
            <Text style={styles.placeType}>
              {place.distance ? `${place.distance}m • ` : ""}
              {PLACE_CATEGORIES[place.type as keyof typeof PLACE_CATEGORIES] ||
                "Place"}
            </Text>
          </View>

          {place.address && (
            <Text style={styles.placeAddress}>{place.address}</Text>
          )}

          <Text style={styles.coordinates}>
            {place.coordinates.lat.toFixed(6)},{" "}
            {place.coordinates.lon.toFixed(6)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Get filtered categories based on active filter
  const getFilteredCategories = () => {
    if (activeFilter === "all") {
      return Object.keys(groupedPlaces);
    } else {
      return [activeFilter];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Nearby Places</Text>
        <View style={styles.placeholder} />
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
        {/* Filter chips */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[
              "all",
              ...Object.keys(PLACE_CATEGORIES).filter((key) => key !== "all"),
            ]}
            renderItem={({ item }) => renderFilterChip(item)}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filtersList}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066FF" />
            <Text style={styles.loadingText}>Finding places nearby...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadNearbyPlaces}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : places.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.noResultsImage}
              placeholder={{ blurhash: "L5H2EC=PM+yV0g-mq.wG9c010J}I" }}
            />
            <Text style={styles.noResultsText}>No places found nearby</Text>
            <Text style={styles.noResultsSubtext}>
              Try expanding your search radius or check a different location
            </Text>
          </View>
        ) : (
          // Render each category of places
          getFilteredCategories().map((category) => {
            // Skip categories with no places
            if (
              !groupedPlaces[category] ||
              groupedPlaces[category].length === 0
            )
              return null;

            return (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeaderContainer}>
                  {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                  <Text style={styles.categoryTitle}>
                    {PLACE_CATEGORIES[
                      category as keyof typeof PLACE_CATEGORIES
                    ] || "Other Places"}
                  </Text>
                  <Text style={styles.placesCount}>
                    {groupedPlaces[category].length} found
                  </Text>
                </View>
                {groupedPlaces[category].map(renderPlaceCard)}
              </View>
            );
          })
        )}
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
    fontFamily: "Exo2",
    fontSize: 24,
    color: "#333",
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  filtersList: {
    paddingHorizontal: 15,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: "#0066FF",
  },
  filterChipText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: "#666",
  },
  activeFilterChipText: {
    color: "#ffffff",
  },
  chipIconContainer: {
    marginRight: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#ff4d4d",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  noResultsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noResultsText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  categorySection: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  categoryHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  categoryTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
    marginLeft: 10,
  },
  placesCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: "auto",
  },
  placeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
    }),
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: "#f0f7ff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
    flex: 1,
  },
  emojiTag: {
    fontSize: 16,
    marginLeft: 8,
  },
  placeDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  placeType: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  placeAddress: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  coordinates: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#999",
  },
});
