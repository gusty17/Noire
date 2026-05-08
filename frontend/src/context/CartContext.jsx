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
      const existing = prev.find(
        (item) => item.id === product.id
      );

      //Increase quantity if exists
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      //  Add new product
      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    return true;
  };

  //  Remove item completely
  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ➖ Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total price
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // Total quantity (for navbar badge)
  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        cartCount,

        addToCart,
        removeFromCart,
        decreaseQuantity,
        clearCart,

        total,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}