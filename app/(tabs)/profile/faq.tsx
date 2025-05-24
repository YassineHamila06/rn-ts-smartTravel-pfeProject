import React, { useState, useCallback } from "react";
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
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function FAQScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate a refresh - in a real app, you might re-fetch FAQ data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const sections = [
    {
      title: "💡 About the Platform",
      questions: [
        {
          id: 1,
          question: "What makes this travel platform different?",
          answer:
            "Our platform leverages data intelligence to personalize your travel experience based on your preferences, while automatically adjusting prices to ensure the best available deals.",
        },
        {
          id: 2,
          question: "How are the suggested destinations selected?",
          answer:
            "Destinations are recommended based on your preferences, trending travel data, and real-time price analysis across different providers.",
        },
        {
          id: 3,
          question: "Can I customize my travel package?",
          answer:
            "Yes! You can express your preferences through our travel preferences in profile page (e.g., preferred climate, budget limits), and our system will suggest packages tailored to you.",
        },
      ],
    },
    {
      title: "🛎️ Bookings & Reservations",
      questions: [
        {
          id: 5,
          question: "How do I book a trip?",
          answer:
            "You can browse available trips, check details (accommodation, itinerary, activities), and make reservations directly through the mobile app.",
        },
        {
          id: 6,
          question: "Can I track my booking status?",
          answer:
            "Absolutely. Your personal space lets you follow your booking in real time, receive confirmations, and get updates on any changes or cancellations.",
        },
        {
          id: 7,
          question: "Will I get notifications about my trip?",
          answer:
            "Yes, you'll receive notifications for confirmations, cancellations, and schedule changes. You can also sync everything with your calendar.",
        },
      ],
    },
    {
      title: "🔒 Security & Support",
      questions: [
        {
          id: 8,
          question: "Is my payment information secure?",
          answer:
            "Yes. We use secure payment gateways to protect your financial information during transactions.",
        },
        {
          id: 9,
          question: "What if I need help during my trip?",
          answer:
            "Our integrated chat allows you to contact support at any time for assistance or urgent requests during your journey.",
        },
        {
          id: 10,
          question: "Who can I contact if I have a problem with my booking?",
          answer:
            "You can reach out through the in-app chat or our support section for real-time help from our team.",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>❓ Frequently Asked Questions</Text>
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
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.questions.map((item) => (
              <View key={item.id} style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{item.id}.</Text>
                  <Text style={styles.questionText}>{item.question}</Text>
                </View>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.spacer} />
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
    fontFamily: "Playfair-Bold",
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  placeholder: {
    width: 34, // Same width as back button for balance
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 15,
  },
  questionContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  questionNumber: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0066FF",
    marginRight: 6,
  },
  questionText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  answerText: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  spacer: {
    height: 40,
  },
});
