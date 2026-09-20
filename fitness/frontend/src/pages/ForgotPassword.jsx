import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendCode, verifyCode, resetPassword } from "../api/auth";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSendCode(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !email.includes("@")) {
      setError("Некорректный email");
      return;
    }

    setLoading(true);
    try {
      await sendCode(email);
      setMessage("Код отправлен на email");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!code || code.length !== 6) {
      setError("Введите 6-значный код");
      return;
    }

    setLoading(true);
    try {
      await verifyCode(email, code);
      setMessage("Код подтверждён");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword || newPassword.length < 6) {
      setError("Пароль минимум 6 символов");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      alert("Пароль изменён. Войдите с новым паролем.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-box">
      <h2>Сброс пароля</h2>

      {step === 1 && (
        <form onSubmit={handleSendCode}>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            Введите email, привязанный к аккаунту. Мы отправим код для сброса пароля.
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Отправка..." : "Отправить код"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode}>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            Введите код из письма (6 цифр)
          </p>

          <input
            type="text"
            placeholder="Код"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Проверка..." : "Подтвердить код"}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            Придумайте новый пароль
          </p>

          <input
            type="password"
            placeholder="Новый пароль (минимум 6 символов)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Сохранение..." : "Сменить пароль"}
          </button>
        </form>
      )}

      <p style={{ marginTop: '15px' }}>
        <Link to="/login">Вернуться ко входу</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;