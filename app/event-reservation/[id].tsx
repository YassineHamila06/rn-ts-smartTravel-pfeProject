import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_TRAVEL } from "@/services/API";
import Toast from "@/components/ui/Toast";
import { ArrowLeft, Users, CreditCard, ScrollText } from "lucide-react-native";
import Config from "@/Config";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { blurHashCode } from "@/utils/utils";

const { width } = Dimensions.get("window");

export default function EventReservationForm() {
  const router = useRouter();
  const { id, eventData: eventDataParam } = useLocalSearchParams();
  const eventId = Array.isArray(id) ? id[0] : id;

  // Parse event data from params if available
  const parsedEventData = eventDataParam
    ? typeof eventDataParam === "string"
      ? JSON.parse(eventDataParam)
      : eventDataParam
    : null;

  const [event, setEvent] = useState<any>(parsedEventData);
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [loading, setLoading] = useState(parsedEventData ? false : true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  // Fetch event details only if not already provided in params
  useEffect(() => {
    const fetchEvent = async () => {
      // Skip API call if we already have event data from params
      if (parsedEventData) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${Config.EXPO_PUBLIC_API_TRAVEL}/events/${eventId}`
        );

        // Log response info for debugging
        console.log("Response status:", response.status);
        console.log("Response type:", response.headers.get("content-type"));

        // Check if response is OK
        if (!response.ok) {
          const text = await response.text();
          console.log("Error response:", text);
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        if (data && data.data) {
          setEvent(data.data);
        } else {
          console.log("Unexpected data structure:", data);
          showToast("Invalid data received from server", "error");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        showToast("Failed to load event details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, parsedEventData]);

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const validateForm = () => {
    if (!numberOfPeople || parseInt(numberOfPeople) < 1) {
      showToast("Please enter a valid number of people", "error");
      return false;
    }
    if (!paymentMethod) {
      showToast("Please select a payment method", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      let userId = await AsyncStorage.getItem("userId");

      // If userId is not found in AsyncStorage, try to extract it from the token
      if (!userId) {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          try {
            // Extract user ID from JWT token
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));
            userId = decoded.id;

            // Save it for future use
            if (userId) {
              await AsyncStorage.setItem("userId", userId);
            }
          } catch (error) {
            console.error("Error extracting userId from token:", error);
          }
        }
      }

      if (!userId) {
        showToast("You must be logged in to make a reservation", "error");
        return;
      }

      const totalPrice = event?.price
        ? parseInt(event.price) * parseInt(numberOfPeople)
        : 0;

      const reservationData = {
        eventId,
        userId,
        numberOfPeople: parseInt(numberOfPeople),
        totalPrice,
        notes,
        paymentMethod,
      };

      const response = await fetch(
        `${Config.EXPO_PUBLIC_API_TRAVEL}/event-reservations/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
          },
          body: JSON.stringify(reservationData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Event reservation confirmed!", "success");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        showToast(
          data.message || "Failed to create event reservation",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting event reservation:", error);
      showToast("An error occurred while processing your reservation", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Reservation</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#46A996" />
            <Text style={styles.loadingText}>Loading event details...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            {event && (
              <View style={styles.eventInfoContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: event.image }}
                    style={styles.image}
                    placeholder={{ blurhash: blurHashCode }}
                    contentFit="cover"
                    transition={300}
                  />
                  <LinearGradient
                    colors={["rgba(0,0,0,0.6)", "transparent"]}
                    style={styles.imageGradient}
                  />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Price per person</Text>
                    <Text style={styles.eventPrice}>
                      {formatCurrency(Number(event.price))}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Reservation Details</Text>

              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <Users size={20} color="#46A996" />
                  <Text style={styles.label}>Number of People</Text>
                  <Text style={styles.requiredStar}>*</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={numberOfPeople}
                    onChangeText={setNumberOfPeople}
                    placeholder="Enter number of people"
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <CreditCard size={20} color="#46A996" />
                  <Text style={styles.label}>Payment Method</Text>
                  <Text style={styles.requiredStar}>*</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(itemValue: string) =>
                      setPaymentMethod(itemValue)
                    }
                    style={styles.picker}
                    dropdownIconColor="#46A996"
                  >
                    <Picker.Item label="PayPal" value="paypal" />
                    <Picker.Item label="Credit Card" value="credit_card" />
                    <Picker.Item label="Bank Transfer" value="bank_transfer" />
                    <Picker.Item label="Konnect" value="konnect" />
                    <Picker.Item label="Cash" value="cash" />
                    <Picker.Item label="Other" value="other" />
                  </Picker>
                </View>
              </View>

              <View style={styles.formGroup}>
                <View style={styles.labelContainer}>
                  <ScrollText size={20} color="#46A996" />
                  <Text style={styles.label}>Notes (Optional)</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add any special requests or notes"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>

              {event && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Event</Text>
                    <Text style={styles.summaryValue}>{event.title}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date</Text>
                    <Text style={styles.summaryValue}>
                      {new Date(event.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Time</Text>
                    <Text style={styles.summaryValue}>{event.time}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price per person</Text>
                    <Text style={styles.summaryValue}>
                      {formatCurrency(Number(event.price))}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Number of people</Text>
                    <Text style={styles.summaryValue}>{numberOfPeople}</Text>
                  </View>
                  <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>
                      {formatCurrency(
                        parseInt(event.price) * parseInt(numberOfPeople || "1")
                      )}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Confirm Reservation
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 15,
    backgroundColor: "#0066FF", // Changed color to match event color scheme
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  eventInfoContainer: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  eventInfo: {
    padding: 16,
  },
  eventTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: "#333",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  eventPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#0066FF",
  },
  formContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 20,
    gap: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  formGroup: {
    gap: 10,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
  requiredStar: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#e74c3c",
    marginLeft: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  input: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    padding: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    color: "#333",
  },
  summaryContainer: {
    marginVertical: 10,
    backgroundColor: "#f0f6ff", // Changed to match event color scheme
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#333",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontFamily: "Inter-Bold",
    fontSize: 18,
    color: "#333",
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: "#0066FF", // Changed to match event color scheme
  },
  submitButton: {
    backgroundColor: "#0066FF", // Changed to match event color scheme
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#a0c1f7", // Changed to match event color scheme
  },
  submitButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
