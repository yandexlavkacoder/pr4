import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders, cancelOrder } from "../api/orders";

function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profileMessage, setProfileMessage] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [user]);

  async function loadOrders() {
    try {
      setLoading(true);
      const data = await getUserOrders(user.id);
      setOrders(data);
    } catch (err) {
      setError("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(orderId) {
    if (!window.confirm("Отменить заказ?")) return;

    try {
      await cancelOrder(orderId);
      loadOrders();
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    setProfileMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          full_name: fullName,
          email,
          phone,
          address
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      const data = await response.json();
      updateUser({ ...user, ...data.user });
      setProfileMessage("Профиль обновлён");
    } catch (err) {
      setProfileMessage("Ошибка: " + err.message);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordMessage("");

    if (!oldPassword || !newPassword) {
      setPasswordMessage("Заполните все поля");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Пароль минимум 6 символов");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          old_password: oldPassword,
          new_password: newPassword
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      setOldPassword("");
      setNewPassword("");
      setPasswordMessage("Пароль изменён");
    } catch (err) {
      setPasswordMessage("Ошибка: " + err.message);
    }
  }

  if (!user) return null;

  return (
    <div className="container">
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать, {user.full_name}</p>

      <section className="admin-section" style={{ marginTop: '30px' }}>
        <h3>Редактировать профиль</h3>
        <form onSubmit={handleProfileUpdate} className="admin-form">
          {profileMessage && <p className="success">{profileMessage}</p>}

          <input
            type="text"
            placeholder="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" className="btn-primary">Сохранить</button>
        </form>
      </section>

      <section className="admin-section">
        <h3>Изменить пароль</h3>
        <form onSubmit={handlePasswordChange} className="admin-form">
          {passwordMessage && <p className="success">{passwordMessage}</p>}

          <input
            type="password"
            placeholder="Старый пароль"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">Сменить пароль</button>
        </form>
      </section>

      <section className="admin-section">
        <h3>Мои заказы</h3>
        {loading && <p>Загрузка...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && orders.length === 0 && <p>Заказов пока нет</p>}

        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Заказ #{order.id}</span>
              <span className="order-status">{order.status}</span>
            </div>
            <p>Адрес: {order.address}</p>
            <p>Дата доставки: {new Date(order.delivery_date).toLocaleDateString()}</p>
            <p>Сумма: {order.total} руб</p>
            <ul className="order-items">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.service_name} × {item.quantity} = {item.price * item.quantity} руб
                </li>
              ))}
            </ul>

            {order.status !== 'отменён' && order.status !== 'доставлен' && (
              <button
                onClick={() => handleCancel(order.id)}
                className="btn-danger"
                style={{ marginTop: '12px' }}
              >
                Отменить заказ
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;