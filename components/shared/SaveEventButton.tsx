import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Heart } from "lucide-react-native";
import { isEventSaved, toggleSavedEvent } from "@/utils/savedEventsManager";

interface SaveEventButtonProps {
  eventId: string;
  size?: number;
  style?: object;
}

const SaveEventButton: React.FC<SaveEventButtonProps> = ({
  eventId,
  size = 24,
  style,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the event is saved when the component mounts
    const checkSavedStatus = async () => {
      try {
        setIsLoading(true);
        const saved = await isEventSaved(eventId);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedStatus();
  }, [eventId]);

  const handleToggleSave = async () => {
    try {
      setIsLoading(true);
      const newSavedStatus = await toggleSavedEvent(eventId);
      setIsSaved(newSavedStatus);
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

export default SaveEventButton;
