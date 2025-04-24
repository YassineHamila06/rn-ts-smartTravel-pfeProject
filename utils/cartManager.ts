import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_ITEMS_KEY = "cartItems";

// Interface for cart items
export interface CartItem {
  _id: string;
  quantity: number;
  // Add other properties as needed
}

// Get all cart items
export const getCartItems = async (): Promise<CartItem[]> => {
  try {
    const cartItemsJson = await AsyncStorage.getItem(CART_ITEMS_KEY);
    return cartItemsJson ? JSON.parse(cartItemsJson) : [];
  } catch (error) {
    console.error("Error getting cart items:", error);
    return [];
  }
};

// Add item to cart
export const addToCart = async (
  tripId: string,
  quantity: number = 1
): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const existingItemIndex = cartItems.findIndex(
      (item) => item._id === tripId
    );

    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cartItems.push({ _id: tripId, quantity });
    }

    await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
    return true;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = async (tripId: string): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const filteredItems = cartItems.filter((item) => item._id !== tripId);
    await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(filteredItems));
    return true;
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return false;
  }
};

// Update item quantity
export const updateCartItemQuantity = async (
  tripId: string,
  quantity: number
): Promise<boolean> => {
  try {
    const cartItems = await getCartItems();
    const itemIndex = cartItems.findIndex((item) => item._id === tripId);

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity = quantity;
      await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return false;
  }
};

// Clear cart
export const clearCart = async (): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return false;
  }
};
