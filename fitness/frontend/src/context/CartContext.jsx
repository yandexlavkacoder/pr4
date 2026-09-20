import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getCart, addToCart as addApi, updateCartItem, removeCartItem, clearCart as clearApi } from "../api/cart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [user]);

  async function loadCart() {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getCart(user.id);
      setCart(data.items || []);
    } catch (err) {
      console.error(err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(serviceId) {
    if (!user) throw new Error('Требуется авторизация');
    await addApi(user.id, serviceId);
    await loadCart();
  }

  async function updateQuantity(itemId, quantity) {
    await updateCartItem(itemId, quantity);
    await loadCart();
  }

  async function removeItem(itemId) {
    await removeCartItem(itemId);
    await loadCart();
  }

  async function clearCart() {
    if (!user) return;
    await clearApi(user.id);
    await loadCart();
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  };

  const getCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, getTotal, getCount, loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);