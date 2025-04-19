import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { ArrowLeft, Camera, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import {
  useFetchUserProfileQuery,
  useGetUsersQuery,
  useUpdateUserProfileMutation,
} from "@/services/API";
import { blurHashCode } from "@/utils/utils";
import { heightPercentageToDP } from "react-native-responsive-screen";

export default function EditProfileScreen() {
  const { data: users = [] } = useGetUsersQuery();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("userToken");
      if (storedToken) {
        setToken(storedToken);
        const decoded: any = JSON.parse(atob(storedToken.split(".")[1]));
        setUserId(decoded.id);
      }
    };
    fetchToken();
  }, []);

  const { data: userProfileData, isLoading } = useFetchUserProfileQuery(
    undefined,
    { skip: !token }
  );

  const [updateProfil, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });

  const [originalImage, setOriginalImage] = useState<string>("");
  const [newSelectedImage, setNewSelectedImage] = useState<string>("");

  useEffect(() => {
    if (userProfileData) {
      setProfileData({
        firstName: userProfileData.name || "",
        lastName: userProfileData.lastname || "",
        email: userProfileData.email || "",
        profileImage: "",
      });

      const userImage =
        users?.find((user) => user?._id === userProfileData.id)?.profileImage ||
        "";
      setOriginalImage(userImage);
    }
  }, [userProfileData, users]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length) {
        setNewSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const cancelImageChange = () => {
    setNewSelectedImage("");
  };

  const handleSave = async () => {
    if (!userId || !token) {
      console.log("Missing user ID or token");
      return;
    }

    try {
      await updateProfil({
        id: userId,
        name: profileData.firstName,
        lastname: profileData.lastName,
        email: profileData.email,
        profileImage: newSelectedImage || originalImage || "",
      }).unwrap();

      alert("Profile updated successfully!");
      router.push("/profile");
    } catch (error: any) {
      console.error(error);
      alert(error?.data?.message || "Something went wrong. Try again.");
    }
  };

  const displayImage = newSelectedImage || originalImage || undefined;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.profileImageSection,
            {
              paddingVertical: heightPercentageToDP("1.5%"),
              alignSelf: "center",
            },
          ]}
        >
          <View>
            <Image
              placeholder={{ blurhash: blurHashCode }}
              source={{ uri: displayImage }}
              style={styles.profileImage}
            />
          </View>

          {newSelectedImage && (
            <TouchableOpacity
              onPress={cancelImageChange}
              style={styles.cancelButton}
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
          )}

          <Text style={styles.changePhotoText}>change profile image</Text>
        </TouchableOpacity>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.firstName}
              onChangeText={(text) => handleInputChange("firstName", text)}
              placeholder="Enter your first name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.lastName}
              onChangeText={(text) => handleInputChange("lastName", text)}
              placeholder="Enter your last name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.disabledButton]}
          onPress={handleSave}
          disabled={isUpdating}
        >
          <Text style={styles.saveButtonText}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  backButton: { padding: 5 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  placeholder: { width: 34 },
  content: { flex: 1, padding: 20 },
  profileImageSection: { alignItems: "center", marginBottom: 30 },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
  },
  cancelButton: {
    position: "absolute",
    top: 0,
    right: 100,
    backgroundColor: "#46A996",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoText: {
    fontSize: 14,
    color: "#0066FF",
    marginTop: 8,
  },
  formSection: { marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: "#333", marginBottom: 8 },
  textInput: {
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  saveButton: {
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  saveButtonText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  disabledButton: { backgroundColor: "#99c2ff", opacity: 0.8 },
});
