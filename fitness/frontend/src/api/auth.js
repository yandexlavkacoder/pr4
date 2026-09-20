const API_URL = 'http://localhost:5000/api/auth';

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка авторизации');
  }
  return await response.json();
}

export async function register(full_name, email, password, phone) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name, email, password, phone }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка регистрации');
  }
  return await response.json();
}

export async function sendCode(email) {
  const response = await fetch(`${API_URL}/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка отправки кода');
  }
  return await response.json();
}

export async function verifyCode(email, code) {
  const response = await fetch(`${API_URL}/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Неверный код');
  }
  return await response.json();
}

export async function resetPassword(email, code, new_password) {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, new_password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка сброса пароля');
  }
  return await response.json();
}