import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Search } from "lucide-react-native";

type Props = {
  onSearchChange: (text: string) => void;
};

const SearchInput = ({ onSearchChange }: Props) => {
  return (
    <View style={styles.searchSection}>
      <Text style={styles.whereToText}>Where to?</Text>
      <View style={styles.searchInputContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search places to go..."
          placeholderTextColor="#666"
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  whereToText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#333",
    padding: 15,
  },
});
