import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/orders";

function Checkout() {
  const { cart, getTotal, loadCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [address, setAddress] = useState(user?.address || "");
  const [deliveryDate, setDeliveryDate] = useState(today);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Введите адрес доставки");
      return;
    }

    if (deliveryDate < today) {
      setError("Дата доставки не может быть в прошлом");
      return;
    }

    setLoading(true);
    try {
      await createOrder(user.id, address, deliveryDate);
      await loadCart();
      alert("Заказ успешно оформлен");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <p>Корзина пуста</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Оформление заказа</h2>

      <form onSubmit={handleSubmit} className="form-box">
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Адрес доставки"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="date"
          value={deliveryDate}
          min={today}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />

        <h3>Итого: {getTotal()} руб</h3>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Оформление..." : "Подтвердить заказ"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;