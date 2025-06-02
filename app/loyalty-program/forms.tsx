import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { ClipboardList } from "lucide-react-native";
import { useGetSurveysQuery } from "@/services/API";
import { useRouter } from "expo-router";

export default function FormsSection() {
  const { data: surveys, isLoading, isError, refetch } = useGetSurveysQuery();
  const [refreshing, setRefreshing] = useState(false);
  console.log("Fetched surveys:", surveys);

  const router = useRouter();
  const publishedSurveys =
    surveys?.filter((s) => s.status === "published") || [];
  console.log("Published surveys:", publishedSurveys);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderForm = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        elevation: 2,
      }}
      onPress={() => router.push(`../form/${item._id}`)} // 👈 navigate to screen
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
      >
        <ClipboardList size={20} color="#46A996" />
        <Text
          style={{ marginLeft: 8, fontWeight: "bold", fontSize: 16, flex: 1 }}
        >
          {item.title}
        </Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor:
              item.status === "completed" ? "#E3F2E6" : "#FFF4E5",
          }}
        >
    
        </View>
      </View>

      <Text style={{ color: "#666", marginBottom: 8 }}>{item.description}</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
  
        <Text style={{ fontSize: 12, color: "#888" }}>
          published at: {new Date(item.createdAt).toDateString()}
        </Text>
      </View>

      <TouchableOpacity
  style={{
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: item.status === "completed" ? "#f5f5f5" : "#46A996",
    alignItems: "center",
  }}
  onPress={() => router.push(`../form/${item._id}`)} // ✅ Add this line
>
  <Text style={{ color: item.status === "completed" ? "#666" : "#fff" }}>
    {item.status === "completed" ? "View Responses" : "Fill Out Survey"}
  </Text>
</TouchableOpacity>

    </TouchableOpacity>
  );

  if (isLoading) {
    return <Text style={{ padding: 20 }}>Loading forms...</Text>;
  }

  if (isError) {
    return <Text style={{ padding: 20 }}>Failed to load forms.</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Admin Forms</Text>
      </View>

      <FlatList
        data={publishedSurveys}
        renderItem={renderForm}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 150 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#46A996"]}
            tintColor="#46A996"
          />
        }
      />
    </View>
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
