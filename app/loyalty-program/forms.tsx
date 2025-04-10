import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { ClipboardList } from "lucide-react-native";

// Define types for our data
type Form = {
  id: string;
  title: string;
  description: string;
  questions: number;
  completed: boolean;
  dueDate: string;
};

// Mock data for forms
const FORMS: Form[] = [
  {
    id: "1",
    title: "Next Trip Survey",
    description: "Help us decide the next group destination",
    questions: 5,
    completed: false,
    dueDate: "May 15, 2024",
  },
  {
    id: "2",
    title: "Travel Preferences Update",
    description: "Update your travel style and preferences",
    questions: 8,
    completed: true,
    dueDate: "Apr 30, 2024",
  },
];

export default function FormsSection() {
  const renderForm = ({ item }: { item: Form }) => (
    <TouchableOpacity style={styles.formCard}>
      <View style={styles.formHeader}>
        <ClipboardList size={20} color="#46A996" />
        <Text style={styles.formTitle}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.completed ? "#E3F2E6" : "#FFF4E5" },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: item.completed ? "#2D8A39" : "#B25E09" },
            ]}
          >
            {item.completed ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>
      <Text style={styles.formDescription}>{item.description}</Text>
      <View style={styles.formFooter}>
        <Text style={styles.formInfo}>{item.questions} questions</Text>
        <Text style={styles.formInfo}>Due: {item.dueDate}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.formButton,
          { backgroundColor: item.completed ? "#f5f5f5" : "#46A996" },
        ]}
      >
        <Text
          style={[
            styles.formButtonText,
            { color: item.completed ? "#666" : "#fff" },
          ]}
        >
          {item.completed ? "View Responses" : "Fill Out Form"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Admin Forms</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View History</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={FORMS}
        renderItem={renderForm}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: "#333",
  },
  viewAll: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#46A996",
  },
  listContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  formTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
  },
  formDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  formFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  formInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#888",
  },
  formButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
  },
  formButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
});
