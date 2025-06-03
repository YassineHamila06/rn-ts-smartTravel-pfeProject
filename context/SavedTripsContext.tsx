import React, { createContext, useState, useContext } from "react";

const SavedTripsContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const SavedTripsProvider = ({ children }: any) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <SavedTripsContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </SavedTripsContext.Provider>
  );
};

export const useSavedTrips = () => useContext(SavedTripsContext);
