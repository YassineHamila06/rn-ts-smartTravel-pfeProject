import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image as RNImage,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
} from "@/utils/cartManager";
import { useFocusEffect, useRouter } from "expo-router";
import { useGetTripsQuery } from "@/services/API";
import { Image } from "expo-image";
import { blurHashCode } from "@/utils/utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface CartItemWithDetails {
  _id: string;
  quantity: number;
  destination: string;
  image: string;
  price: number;
  [key: string]: any;
}

const CartScreen = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: allTrips, isLoading: isTripsLoading } = useGetTripsQuery();

  // Refresh the cart items list whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCartItems();
    }, [allTrips])
  );

  // Load cart items from AsyncStorage
  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const storedCartItems = await getCartItems();

      if (allTrips && storedCartItems.length > 0) {
        // Combine cart items with trip details
        const cartItemsWithDetails = storedCartItems
          .map((cartItem) => {
            const tripDetails = allTrips.find(
              (trip) => trip._id === cartItem._id
            );
            return {
              ...cartItem,
              ...tripDetails,
            };
          })
          .filter((item) => item.destination); // Filter out any items that don't have trip data

        setCartItems(cartItemsWithDetails);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to load cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to trip details
  const navigateToTripDetails = (trip: CartItemWithDetails) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id: trip._id, trip: JSON.stringify(trip) },
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async (tripId: string) => {
    const success = await removeFromCart(tripId);
    if (success) {
      loadCartItems();
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (tripId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const success = await updateCartItemQuantity(tripId, newQuantity);
    if (success) {
      loadCartItems();
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  if (isLoading || isTripsLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <ShoppingBag size={100} color="#CCCCCC" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text style={styles.browseButtonText}>Browse Trips</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cartItem}
            onPress={() => navigateToTripDetails(item)}
          >
            <Image
              placeholder={{ blurhash: blurHashCode }}
              source={{ uri: item.image }}
              style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.destination}</Text>
              <Text style={styles.itemPrice}>${item.price}</Text>

              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    handleUpdateQuantity(item._id, item.quantity - 1)
                  }
                >
                  <Minus size={16} color="#666" />
                </TouchableOpacity>

                <Text style={styles.quantity}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    handleUpdateQuantity(item._id, item.quantity + 1)
                  }
                >
                  <Plus size={16} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFromCart(item._id)}
                >
                  <Trash2 size={18} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Playfair-Bold",
    fontSize: 28,
    marginBottom: 20,
    color: "#333",
  },
  cartItem: {
    flexDirection: "row",
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize",
  },
  itemPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#0066FF",
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    marginLeft: "auto",
    padding: 6,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 16,
  },
  totalText: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "#333",
  },
  totalAmount: {
    fontFamily: "Inter-Bold",
    fontSize: 22,
    color: "#0066FF",
  },
  checkoutButton: {
    backgroundColor: "#46A996",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  checkoutButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontFamily: "Inter-Medium",
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: "#0066FF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  browseButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
