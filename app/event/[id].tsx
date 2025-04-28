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
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react-native";
import { blurHashCode } from "@/utils/utils";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function EventDetailScreen() {
  const router = useRouter();
  const { event } = useLocalSearchParams();

  // Parse event data from params
  const eventData = typeof event === "string" ? JSON.parse(event) : event;

  // Format date for display
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
            source={{ uri: eventData.image }}
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
            <Text style={styles.title}>{eventData.title}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#666" />
              <View>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(eventData.date)}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Clock size={20} color="#666" />
              <View>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>{eventData.time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationSection}>
            <MapPin size={20} color="#666" />
            <Text style={styles.locationText}>{eventData.location}</Text>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{eventData.description}</Text>
          </View>

          {eventData.isActive && (
            <TouchableOpacity style={styles.attendButton}>
              <Text style={styles.attendButtonText}>Register to Attend</Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 20,
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 28,
    color: "#333",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    width: "48%",
  },
  infoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
  },
  infoValue: {
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
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  descriptionSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  description: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  attendButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  attendButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
