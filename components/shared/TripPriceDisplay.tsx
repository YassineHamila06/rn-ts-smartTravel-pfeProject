import { View, Text, StyleSheet } from "react-native";
import React from "react";

interface TripPriceDisplayProps {
  price: number | string;
  reduction?: number | string;
  tripType?: string;
}

const TripPriceDisplay: React.FC<TripPriceDisplayProps> = ({
  price,
  reduction,
  tripType,
}) => {
  // Convert price to number
  const priceNum = typeof price === "string" ? parseFloat(price) : price;

  // Check if reduction exists and is greater than 0
  const reductionNum = reduction
    ? typeof reduction === "string"
      ? parseFloat(reduction)
      : reduction
    : 0;
  const hasReduction = reductionNum > 0;

  // Calculate original price if there's a reduction
  const originalPrice = hasReduction
    ? priceNum / (1 - reductionNum / 100)
    : priceNum;

  return (
    <View style={styles.container}>
      {/* Trip Type Display Removed */}

      {/* Price Display */}
      <View style={styles.priceContainer}>
        {hasReduction ? (
          <>
            <Text style={styles.discountBadge}>-{reductionNum}% off</Text>
            <View style={styles.pricesRow}>
              <Text style={styles.originalPrice}>
                ${originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.price}>${priceNum.toFixed(2)}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.price}>${priceNum.toFixed(2)}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  tripType: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  priceContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pricesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#fff",
    textDecorationLine: "line-through",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  price: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  discountBadge: {
    fontFamily: "Inter-Bold",
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#FF4949",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 4,
  },
});

export default TripPriceDisplay;
