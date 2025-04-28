import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_EVENTS_KEY = "savedEvents";

// Get all saved event IDs
export const getSavedEventIds = async (): Promise<string[]> => {
  try {
    const savedEventsJson = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
    return savedEventsJson ? JSON.parse(savedEventsJson) : [];
  } catch (error) {
    console.error("Error getting saved events:", error);
    return [];
  }
};

// Check if an event is saved
export const isEventSaved = async (eventId: string): Promise<boolean> => {
  try {
    const savedEvents = await getSavedEventIds();
    return savedEvents.includes(eventId);
  } catch (error) {
    console.error("Error checking if event is saved:", error);
    return false;
  }
};

// Save an event
export const saveEvent = async (eventId: string): Promise<boolean> => {
  try {
    const savedEvents = await getSavedEventIds();
    if (!savedEvents.includes(eventId)) {
      savedEvents.push(eventId);
      await AsyncStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents));
    }
    return true;
  } catch (error) {
    console.error("Error saving event:", error);
    return false;
  }
};

// Remove a saved event
export const removeSavedEvent = async (eventId: string): Promise<boolean> => {
  try {
    const savedEvents = await getSavedEventIds();
    const filteredEvents = savedEvents.filter((id) => id !== eventId);
    await AsyncStorage.setItem(
      SAVED_EVENTS_KEY,
      JSON.stringify(filteredEvents)
    );
    return true;
  } catch (error) {
    console.error("Error removing saved event:", error);
    return false;
  }
};

// Toggle saved status
export const toggleSavedEvent = async (eventId: string): Promise<boolean> => {
  try {
    const isSaved = await isEventSaved(eventId);
    if (isSaved) {
      await removeSavedEvent(eventId);
      return false; // Now unsaved
    } else {
      await saveEvent(eventId);
      return true; // Now saved
    }
  } catch (error) {
    console.error("Error toggling saved event:", error);
    return false;
  }
};
