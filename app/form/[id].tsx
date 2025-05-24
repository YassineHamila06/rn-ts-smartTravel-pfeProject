import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  useGetQuestionsBySurveyIdQuery,
  useAddResponseMutation,
} from "@/services/API";
import { decodeJWT } from "@/utils/utils"; // You must implement this if not yet
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function FormDetailsScreen() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded = decodeJWT(token);
        setUserId(decoded?.id || decoded?._id || null); // Support both id and _id
      }
    };

    fetchUserId();
  }, []);
  const { id } = useLocalSearchParams();
  const {
    data: questions,
    isLoading,
    isError,
  } = useGetQuestionsBySurveyIdQuery(id as string);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [addResponse] = useAddResponseMutation();

  const handleChange = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const decoded = decodeJWT(token || "");
    const userId = decoded?._id || decoded?.id;

    if (!userId) {
      Alert.alert("Error", "User not found.");
      return;
    }

    const entries = Object.entries(responses);
    if (entries.length === 0) {
      Alert.alert("Error", "Please answer at least one question.");
      return;
    }

    const promises = entries
      .map(([questionId, value]) => {
        if (!value) return null;
        return addResponse({ questionId, userId, value }).unwrap();
      })
      .filter(Boolean);

    const results = await Promise.allSettled(promises);

    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      console.warn("Some responses failed:", failed);
      Alert.alert("Partial Success", "Some responses failed to submit.");
    } else {
      Alert.alert("Success", "All responses submitted!");
    }

    setResponses({});
  };

  const renderQuestion = ({ item }: { item: any }) => (
    <View style={styles.questionCard}>
      <Text style={styles.questionTitle}>{item.text}</Text>
      <Text style={styles.questionType}>Type: {item.type}</Text>

      {item.options?.length > 0 ? (
        item.options.map((opt: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              responses[item._id] === opt && styles.optionButtonSelected,
            ]}
            onPress={() => handleChange(item._id, opt)}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <TextInput
          placeholder="Your answer"
          style={styles.textInput}
          onChangeText={(text) => handleChange(item._id, text)}
          value={responses[item._id] || ""}
        />
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#46A996" />
        <Text>Loading questions...</Text>
      </View>
    );
  }

  if (isError || !questions) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>Failed to load questions.</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Survey Questions</Text>}
      data={questions}
      renderItem={renderQuestion}
      keyExtractor={(item) => item._id}
      ListFooterComponent={
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      }
      contentContainerStyle={{ paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: "#F8F9FA",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: "#F9FCFF",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#46A996", // green strip
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 4,
  },
  questionType: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#46A996", // matches app theme
    marginBottom: 10,
  },

  optionButton: {
    backgroundColor: "#F2F4F5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  optionButtonSelected: {
    backgroundColor: "#E6FCF4",
    borderColor: "#46A996",
  },
  optionText: {
    color: "#1A1A1A",
    fontSize: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#FAFAFA",
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: "#46A996",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    shadowColor: "#46A996",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F8F9FA",
  },
});
