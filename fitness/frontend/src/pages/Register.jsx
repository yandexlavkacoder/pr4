import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password) {
      setError("Заполните обязательные поля");
      return;
    }

    if (fullName.trim().length < 2) {
      setError("Имя должно быть минимум 2 символа");
      return;
    }

    const nameRegex = /^[А-ЯЁа-яё\s-]+$/;
    if (!nameRegex.test(fullName)) {
      setError("Имя может содержать только русские буквы, пробел и дефис");
      return;
    }

    if (!email.includes("@")) {
      setError("Некорректный email");
      return;
    }

    if (password.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }

    if (phone && !/^[\d\s()+-]+$/.test(phone)) {
      setError("Некорректный телефон");
      return;
    }

    setLoading(true);
    try {
      await registerApi(fullName, email, password, phone);
      alert("Регистрация успешна! Теперь войдите.");
      navigate("/login");
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
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Полное имя"
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
          type="password"
          placeholder="Пароль (минимум 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default Register;