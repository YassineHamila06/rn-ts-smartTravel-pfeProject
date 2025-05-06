import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import React from "react";
import {
  Settings,
  MapPin,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  CircleHelp as HelpCircle,
  LogOut,
  MessageCircle,
  Gift,
  Ticket,
  History,
  Heart,
  User,
  Info,
  Eye,
} from "lucide-react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchUserProfileQuery, useGetUsersQuery } from "@/services/API";
import { blurHashCode, decodeJWT } from "@/utils/utils";
import {
  useGetReservationsByUserQuery,
  useGetEventReservationsByUserQuery,
  useGetUserPointsQuery,
} from "@/services/API";

const UPCOMING_BOOKINGS = [
  {
    id: "1",
    destination: "Paris, France",
    dates: "Mar 15 - Mar 22, 2024",
    status: "confirmed",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
  },
  {
    id: "2",
    destination: "Rome, Italy",
    dates: "Apr 10 - Apr 17, 2024",
    status: "pending",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2096&auto=format&fit=crop",
  },
];

const PREFERENCES = [
  { id: "1", name: "Beach Destinations", selected: true },
  { id: "2", name: "Cultural Tours", selected: true },
  { id: "3", name: "Adventure Travel", selected: false },
  { id: "4", name: "Luxury Hotels", selected: true },
  { id: "5", name: "Budget-Friendly", selected: false },
];

export default function ProfileScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: users, refetch: refetchUsers } = useGetUsersQuery();
  const userId = decodedToken?.id || decodedToken?._id;

  const { data: userPointsData, refetch: refetchUserPoints } =
    useGetUserPointsQuery(userId, {
      skip: !userId,
    });
  const userPoints = userPointsData?.points ?? 0;

  const {
    data: reservations = [],
    isLoading: loadingReservations,
    refetch: refetchReservations,
  } = useGetReservationsByUserQuery(userId, {
    skip: !userId,
  });

  const {
    data: eventReservations = [],
    isLoading: loadingEventReservations,
    refetch: refetchEventReservations,
  } = useGetEventReservationsByUserQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);

      if (storedToken) {
        const decoded = decodeJWT(storedToken);
        setDecodedToken(decoded);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (userId) {
      refetchReservations();
      refetchEventReservations();
    }
  }, [userId, refetchReservations, refetchEventReservations]);

  const handleLogout = async () => {
    try {
      // Clear all user-related data from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");

      // Any other user data that might be stored
      // await AsyncStorage.removeItem("other_user_data");

      // Redirect to login screen
      router.replace("/auth/Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const {
    data: userProfileData,
    isLoading,
    isError,
    refetch: refetchUserProfile,
  } = useFetchUserProfileQuery(undefined, {
    skip: !token,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refetch user profile data and any other data needed
    Promise.all([
      refetchUserProfile(),
      refetchUsers(),
      refetchReservations(),
      refetchEventReservations(),
      refetchUserPoints(),
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [
    refetchUserProfile,
    refetchUsers,
    refetchReservations,
    refetchEventReservations,
    refetchUserPoints,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/profile/user-posts")}>
          <Eye size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5C67DE" // Match the app's primary color
            colors={["#5C67DE"]} // For Android
          />
        }
      >
        <View style={styles.profileSection}>
          <Image
            placeholder={{ blurhash: blurHashCode }}
            source={
              users?.find((user: any) => user?._id === userProfileData?.id)
                ?.profileImage
            }
            style={styles.profileImage}
          />

          <View style={styles.profileInfo}>
            {isLoading ? (
              <Text style={styles.profileName}>Loading...</Text>
            ) : isError ? (
              <Text style={styles.profileName}>Could not load profile</Text>
            ) : userProfileData ? (
              <>
                <Text
                  style={styles.profileName}
                >{`${userProfileData.name} ${userProfileData.lastname}`}</Text>
                <Text style={styles.profileEmail}>{userProfileData.email}</Text>
              </>
            ) : (
              <>
                <Text style={styles.profileName}>Guest User</Text>
                <Text style={styles.profileEmail}>Not logged in</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push("/profile/edit-profile")}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {userPointsData ? userPoints : "—"}
          </Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bookingsContainer}
          >
            {loadingReservations ? (
              <Text>Loading...</Text>
            ) : reservations.filter(
                (r) =>
                  r.tripId &&
                  r.tripId.debutDate &&
                  new Date(r.tripId.debutDate) >= new Date()
              ).length === 0 ? (
              <Text>No upcoming trips.</Text>
            ) : (
              <>
                {reservations
                  .filter(
                    (r) =>
                      r.tripId &&
                      r.tripId.debutDate &&
                      new Date(r.tripId.debutDate) >= new Date()
                  )
                  .map((res) => (
                    <TouchableOpacity key={res._id} style={styles.bookingCard}>
                      <Image
                        source={{ uri: res.tripId?.image }}
                        style={styles.bookingImage}
                      />
                      <View style={styles.bookingContent}>
                        <Text style={styles.bookingDestination}>
                          {res.tripId?.destination}
                        </Text>
                        <Text style={styles.bookingDates}>
                          {res.tripId && res.tripId.debutDate
                            ? new Date(
                                res.tripId.debutDate
                              ).toLocaleDateString()
                            : "N/A"}{" "}
                          -{" "}
                          {res.tripId && res.tripId.endDate
                            ? new Date(res.tripId.endDate).toLocaleDateString()
                            : "N/A"}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                res.status === "confirmed"
                                  ? "#E3F2E6"
                                  : "#FFF4E5",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  res.status === "confirmed"
                                    ? "#2D8A39"
                                    : "#B25E09",
                              },
                            ]}
                          >
                            {res.status
                              ? res.status.charAt(0).toUpperCase() +
                                res.status.slice(1)
                              : "Unknown"}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
              </>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.pastTripsContainer}
          >
            {loadingEventReservations ? (
              <Text>Loading...</Text>
            ) : eventReservations.length === 0 ? (
              <Text>No upcoming events.</Text>
            ) : (
              <>
                {eventReservations.map((res) => (
                  <TouchableOpacity key={res._id} style={styles.tripCard}>
                    <Image
                      source={{ uri: res.eventId?.image }}
                      style={styles.tripImage}
                    />
                    <View style={styles.tripContent}>
                      <Text style={styles.tripDestination}>
                        {res.eventId?.title}
                      </Text>
                      <Text style={styles.tripDates}>
                        {res.eventId && res.eventId.date
                          ? new Date(res.eventId.date).toLocaleDateString()
                          : "N/A"}{" "}
                        {res.eventId?.time}
                      </Text>
                      <Text style={styles.tripCost}>${res.totalPrice}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              res.status === "confirmed"
                                ? "#E3F2E6"
                                : "#FFF4E5",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                res.status === "confirmed"
                                  ? "#2D8A39"
                                  : "#B25E09",
                            },
                          ]}
                        >
                          {res.status
                            ? res.status.charAt(0).toUpperCase() +
                              res.status.slice(1)
                            : "Unknown"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Preferences</Text>
          <View style={styles.preferencesContainer}>
            {PREFERENCES.map((pref) => (
              <TouchableOpacity
                key={pref.id}
                style={[
                  styles.preferenceTag,
                  pref.selected && styles.preferenceTagSelected,
                ]}
              >
                <Text
                  style={[
                    styles.preferenceText,
                    pref.selected && styles.preferenceTextSelected,
                  ]}
                >
                  {pref.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/faq")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#8A6FDF" }]}>
              <HelpCircle size={20} color="#fff" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>FAQ</Text>
              <Text style={styles.menuSubtitle}>
                Find answers to common questions
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/about")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#45B7D1" }]}>
              <Info size={20} color="#fff" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>About</Text>
              <Text style={styles.menuSubtitle}>
                Learn more about SmartTravel
              </Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* @ts-ignore */}
          <Link href={"/loyalty-program"} asChild>
            <TouchableOpacity style={styles.loyaltyProgramButton}>
              <Gift size={22} color="#46A996" />
              <Text style={styles.loyaltyProgramTitle}>Loyalty Program</Text>
              <View style={styles.loyaltyStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <View
                    key={star}
                    style={[styles.star, { opacity: star <= 3 ? 1 : 0.3 }]}
                  />
                ))}
              </View>
              <Text style={styles.loyaltyLevel}>Gold Member</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FF4949" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
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
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  profilePhone: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#f1f1f1",
  },
  statNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 15,
  },
  bookingsContainer: {
    marginHorizontal: -20,
  },
  bookingCard: {
    width: 280,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  bookingImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bookingContent: {
    padding: 15,
  },
  bookingDestination: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  bookingDates: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
  },
  pastTripsContainer: {
    marginHorizontal: -20,
  },
  tripCard: {
    width: 280,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  tripImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tripContent: {
    padding: 15,
  },
  tripDestination: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  tripDates: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tripCost: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0066FF",
    marginBottom: 8,
  },
  rebookButton: {
    backgroundColor: "#E3F2FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  rebookButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#0066FF",
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  preferenceTag: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  preferenceTagSelected: {
    backgroundColor: "#E3F2FF",
  },
  preferenceText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  preferenceTextSelected: {
    color: "#0066FF",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  menuArrow: {
    fontFamily: "Inter-Regular",
    fontSize: 24,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 40,
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#FFF2F2",
  },
  logoutText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#FF4949",
    marginLeft: 10,
  },
  loyaltyProgramButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F0D080",
    ...Platform.select({
      web: {
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  loyaltyProgramTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#46A996",
    marginLeft: 10,
    flex: 1,
  },
  loyaltyStars: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  star: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#46A996",
    marginRight: 3,
  },
  loyaltyLevel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: "#46A996",
    marginRight: 10,
  },
});
