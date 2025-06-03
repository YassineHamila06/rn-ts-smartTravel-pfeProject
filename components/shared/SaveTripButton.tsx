import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Heart } from "lucide-react-native";
import { isTripSaved, toggleSavedTrip } from "@/utils/savedTripsManager";
import { useSavedTrips } from "@/context/SavedTripsContext";


interface SaveTripButtonProps {
  tripId: string;
  size?: number;
  style?: object;
}

const SaveTripButton: React.FC<SaveTripButtonProps> = ({
  tripId,
  size = 24,
  style,
}) => {
  const { refreshKey, triggerRefresh } = useSavedTrips();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the trip is saved when the component mounts
    const checkSavedStatus = async () => {
      try {
        setIsLoading(true);
        const saved = await isTripSaved(tripId);
        setIsSaved(saved);
        console.log("data:", saved + tripId);
        console.log("--------------");
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedStatus();
  }, [tripId , refreshKey]);

  const handleToggleSave = async () => {
    try {
      setIsLoading(true);
      const newSavedStatus = await toggleSavedTrip(tripId);
      setIsSaved(newSavedStatus);
      triggerRefresh();
    } catch (error) {
      console.error("Error toggling saved status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleToggleSave}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FF4949" />
      ) : (
        <Heart
          size={size}
          color={isSaved ? "#FF4949" : "#ffffff"}
          fill={isSaved ? "#FF4949" : "none"}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SaveTripButton;
