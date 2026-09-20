import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, loading, updateQuantity, removeItem, clearCart, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container">
        <p>Войдите, чтобы просмотреть корзину</p>
        <button onClick={() => navigate("/login")} className="btn-primary">Войти</button>
      </div>
    );
  }

  if (loading) return <p className="loading">Загрузка корзины...</p>;

  if (cart.length === 0) {
    return (
      <div className="container">
        <h2>Корзина пуста</h2>
        <button onClick={() => navigate("/services")} className="btn-primary">В каталог</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Корзина</h2>

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <div className="cart-controls">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
            <span className="quantity">{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <span>{Number(item.price) * item.quantity} руб</span>
          <button onClick={() => removeItem(item.id)} className="btn-danger">Удалить</button>
        </div>
      ))}

      <h3 className="total">Итого: {getTotal()} руб</h3>

      <div className="cart-actions">
        <button onClick={clearCart} className="btn-secondary">Очистить</button>
        <button onClick={() => navigate("/checkout")} className="btn-primary">Оформить заказ</button>
      </div>
    </div>
  );
}

export default Cart;