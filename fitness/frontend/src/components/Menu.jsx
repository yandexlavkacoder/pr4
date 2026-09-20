import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Menu() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { getCount } = useCart();

  const linkStyle = (isActive) => ({
    color: isActive ? "#007bff" : "inherit",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
  });

  const isAdmin = user && (user.role_id === 1 || user.role_id === 3);

  return (
    <nav className="menu">
      <NavLink to="/" end style={({ isActive }) => linkStyle(isActive)}>Главная</NavLink>
      <NavLink to="/services" style={({ isActive }) => linkStyle(isActive)}>Услуги</NavLink>
      <NavLink to="/schedule" style={({ isActive }) => linkStyle(isActive)}>Расписание</NavLink>

      {!isAdmin && (
        <NavLink to="/cart" style={({ isActive }) => linkStyle(isActive)}>
          Корзина {user && getCount() > 0 ? `(${getCount()})` : ''}
        </NavLink>
      )}

      {user ? (
        <>
          {isAdmin ? (
            <NavLink to="/admin" style={({ isActive }) => linkStyle(isActive)}>Админ</NavLink>
          ) : (
            <NavLink to="/dashboard" style={({ isActive }) => linkStyle(isActive)}>Кабинет</NavLink>
          )}
          <button onClick={logout} className="btn-logout">Выйти</button>
        </>
      ) : (
        <NavLink to="/login" style={({ isActive }) => linkStyle(isActive)}>Авторизация</NavLink>
      )}

      <button onClick={toggleTheme} className="btn-theme">
        {theme === "light" ? "Тёмная" : "Светлая"}
      </button>
    </nav>
  );
}

export default Menu;