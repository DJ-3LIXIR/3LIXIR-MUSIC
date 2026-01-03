import { createContext, useContext, useState, ReactNode } from "react";
import { Beat } from "@/lib/data";

interface CartItem extends Beat {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (beat: Beat) => void;
  removeFromCart: (beatId: string) => void;
  updateQuantity: (beatId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (beat: Beat) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === beat.id);

      if (existingItem) {
        // If item exists, increase quantity
        return prevItems.map((item) =>
          item.id === beat.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...beat, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (beatId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== beatId));
  };

  const updateQuantity = (beatId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(beatId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === beatId ? { ...item, quantity } : item,
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
