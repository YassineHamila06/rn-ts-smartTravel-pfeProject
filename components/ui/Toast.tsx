import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = "success",
  duration = 3000,
  onHide,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration - 600),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) {
          onHide();
        }
      });
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "info":
      default:
        return styles.info;
    }
  };

  return (
    <Animated.View style={[styles.container, getTypeStyles(), { opacity }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  error: {
    backgroundColor: "#F44336",
  },
  info: {
    backgroundColor: "#2196F3",
  },
  message: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
});

export default Toast;
