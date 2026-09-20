const API_URL = 'http://localhost:5000/api/users';

export async function getUsers() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении пользователей');
  return await response.json();
}

export async function updateUserRole(id, role_id, requester_id) {
  const response = await fetch(`${API_URL}/${id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role_id, requester_id }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при изменении роли');
  }
  return await response.json();
}

export async function deleteUser(id, requester_id) {
  const response = await fetch(`${API_URL}/${id}?requester_id=${requester_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при удалении пользователя');
  }
}

export async function updateProfile(user_id, data) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, ...data }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при обновлении профиля');
  }
  return await response.json();
}

export async function updatePassword(user_id, old_password, new_password) {
  const response = await fetch(`${API_URL}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, old_password, new_password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при смене пароля');
  }
  return await response.json();
}