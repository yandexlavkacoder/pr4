const API_URL = 'http://localhost:5000/api/orders';

export async function getUserOrders(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) throw new Error('Ошибка при получении заказов');
  return await response.json();
}

export async function getAllOrders() {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) throw new Error('Ошибка при получении заказов');
  return await response.json();
}

export async function createOrder(user_id, address, delivery_date) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, address, delivery_date }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при оформлении заказа');
  }
  return await response.json();
}

export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении статуса');
  return await response.json();
}

export async function cancelOrder(id) {
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: 'PUT',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Ошибка при отмене заказа');
  }
  return await response.json();
}

export async function deleteOrder(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении заказа');
}