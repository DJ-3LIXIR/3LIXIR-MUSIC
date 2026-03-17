import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Beat } from "@/lib/data";

// Generic cart item that supports beats, plugins, and other product types
export interface CartItemBase {
  id: string;
  title: string;
  artist: string;
  price: number;
  cover: string;
  quantity: number;
  type: "beat" | "plugin" | "subscription" | "license" | "royalty-token";
  // Optional fields from Beat (backward compatible)
  bpm?: number;
  key?: string;
  tags?: string[];
  releaseDate?: string;
  youtubeUrl?: string;
  audioUrl?: string;
  memberOnly?: boolean;
  // Plugin-specific
  category?: string;
  image?: string;
  // Generic metadata
  metadata?: Record<string, any>;
}

// Keep backward compat — old CartItem type is a union
type CartItem = CartItemBase;

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Beat | CartItemBase) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "elixir_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
    return [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [items]);

  const addToCart = (item: Beat | CartItemBase) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Plugins should not stack quantity — just ignore duplicate adds
        if (existingItem.type === "plugin") {
          return prevItems;
        }
        // For beats and other items, increase quantity
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      } else {
        // Normalize Beat into CartItemBase if it doesn't have a type
        const cartItem: CartItem = {
          id: String(item.id),
          title: item.title,
          artist: item.artist,
          price: item.price,
          cover: item.cover || "",
          quantity: 1,
          type: (item as CartItemBase).type || "beat",
          // Carry over optional Beat fields
          bpm: (item as Beat).bpm,
          key: (item as Beat).key,
          tags: (item as Beat).tags,
          releaseDate: (item as Beat).releaseDate,
          youtubeUrl: (item as Beat).youtubeUrl,
          audioUrl: (item as Beat).audioUrl,
          memberOnly: (item as Beat).memberOnly,
          // Plugin fields
          category: (item as CartItemBase).category,
          image: (item as CartItemBase).image,
          metadata: (item as CartItemBase).metadata,
        };
        return [...prevItems, cartItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
