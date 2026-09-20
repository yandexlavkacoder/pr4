import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Заполните все поля");
      return;
    }

    if (!email.includes("@")) {
      setError("Некорректный email");
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.user);
      navigate("/");
    } catch (err) {
      if (err.message === "Failed to fetch") {
        setError("Сервер недоступен. Проверьте соединение.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-box">
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        <Link to="/forgot-password">Забыли пароль?</Link>
      </p>

      <p style={{ marginTop: '10px' }}>
        Нет аккаунта? <Link to="/register">Регистрация</Link>
      </p>
    </div>
  );
}

export default Login;