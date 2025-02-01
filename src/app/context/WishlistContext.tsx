"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (CarId: number) => void;
  removeFromWishlist: (CarId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem("wishlist");
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist]);

  // Add to wishlist
  const addToWishlist = (CarId: number) => {
    setWishlist((prev) => {
      if (!prev.includes(CarId)) {
        return [...prev, CarId];
      }
      return prev;
    });
  };

  // Remove from wishlist
  const removeFromWishlist = (CarId: number) => {
    setWishlist((prev) => prev.filter((id) => id !== CarId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
