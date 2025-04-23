import AsyncStorage from "@react-native-async-storage/async-storage";

const SAVED_TRIPS_KEY = "savedTrips";

// Get all saved trip IDs
export const getSavedTripIds = async (): Promise<string[]> => {
  try {
    const savedTripsJson = await AsyncStorage.getItem(SAVED_TRIPS_KEY);
    return savedTripsJson ? JSON.parse(savedTripsJson) : [];
  } catch (error) {
    console.error("Error getting saved trips:", error);
    return [];
  }
};

// Check if a trip is saved
export const isTripSaved = async (tripId: string): Promise<boolean> => {
  try {
    const savedTrips = await getSavedTripIds();
    return savedTrips.includes(tripId);
  } catch (error) {
    console.error("Error checking if trip is saved:", error);
    return false;
  }
};

// Save a trip
export const saveTrip = async (tripId: string): Promise<boolean> => {
  try {
    const savedTrips = await getSavedTripIds();
    if (!savedTrips.includes(tripId)) {
      savedTrips.push(tripId);
      await AsyncStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips));
    }
    return true;
  } catch (error) {
    console.error("Error saving trip:", error);
    return false;
  }
};

// Remove a saved trip
export const removeSavedTrip = async (tripId: string): Promise<boolean> => {
  try {
    const savedTrips = await getSavedTripIds();
    const filteredTrips = savedTrips.filter((id) => id !== tripId);
    await AsyncStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(filteredTrips));
    return true;
  } catch (error) {
    console.error("Error removing saved trip:", error);
    return false;
  }
};

// Toggle saved status
export const toggleSavedTrip = async (tripId: string): Promise<boolean> => {
  try {
    const isSaved = await isTripSaved(tripId);
    if (isSaved) {
      await removeSavedTrip(tripId);
      return false; // Now unsaved
    } else {
      await saveTrip(tripId);
      return true; // Now saved
    }
  } catch (error) {
    console.error("Error toggling saved trip:", error);
    return false;
  }
};
