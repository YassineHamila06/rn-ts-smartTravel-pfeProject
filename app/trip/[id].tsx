import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, Calendar, MapPin } from "lucide-react-native";
import { blurHashCode } from "@/utils/utils";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useState } from "react";

export default function TripDetailScreen() {
  const router = useRouter();
  const { trip } = useLocalSearchParams();

  // Parse trip data from params
  const tripData = typeof trip === "string" ? JSON.parse(trip) : trip;

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            placeholder={{ blurhash: blurHashCode }}
            source={{ uri: tripData.image }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.destination}>{tripData.destination}</Text>
            <Text style={styles.price}>${tripData.price}</Text>
          </View>

          {/* Trip Type Display - Only shown on detail page */}
          {tripData.tripType && (
            <View style={styles.tripTypeContainer}>
              <Text style={styles.tripType}>
                Trip type: {tripData.tripType}
              </Text>
            </View>
          )}

          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <Calendar size={20} color="#666" />
              <View>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tripData.debutDate)}
                </Text>
              </View>
            </View>
            <View style={styles.dateItem}>
              <Calendar size={20} color="#666" />
              <View>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(tripData.endDate)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.locationSection}>
            <MapPin size={20} color="#666" />
            <Text style={styles.locationText}>{tripData.destination}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this trip</Text>
            <Text style={styles.description}>{tripData.description}</Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Text style={styles.reservationNote}>
               Reservations must be made before{" "}
              {formatDate(
                new Date(
                  new Date(tripData.debutDate).getTime() -
                    7 * 24 * 60 * 60 * 1000
                ).toISOString()
              )}
            </Text>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                router.push({
                  pathname: "/reservation/[id]",
                  params: {
                    id: tripData._id,
                    tripData: JSON.stringify(tripData),
                  },
                })
              }
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: hp("40%"),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  destination: {
    fontFamily: "Playfair-Bold",
    fontSize: 28,
    color: "#333",
    flex: 1,
    textTransform: "capitalize",
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0066FF",
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    width: "48%",
  },
  dateLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
  },
  dateValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  locationText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  tripTypeContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f8ff",
  },
  tripType: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#0066FF",
  },
  descriptionSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  bookButton: {
    backgroundColor: "#46A996",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  bookButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  reservationNote: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#FF4444",
    marginBottom: 12,
    textAlign: "center",
  },
});
