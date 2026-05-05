import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Add to cart
  const addToCart = (product, isLoggedIn) => {
    if (!isLoggedIn) {
      alert("Please log in to add items to cart");
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
    return true;
  };

  // ❌ Remove item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // 🔢 Total price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}