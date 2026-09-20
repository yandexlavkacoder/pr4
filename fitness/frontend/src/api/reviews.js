const API_URL = 'http://localhost:5000/api/reviews';

export async function getServiceReviews(serviceId) {
  const response = await fetch(`${API_URL}/service/${serviceId}`);
  if (!response.ok) throw new Error('Ошибка при получении отзывов');
  return await response.json();
}

export async function getAllReviews() {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) throw new Error('Ошибка при получении отзывов');
  return await response.json();
}

export async function createReview(user_id, service_id, rating, comment) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, service_id, rating, comment }),
  });
  if (!response.ok) throw new Error('Ошибка при создании отзыва');
  return await response.json();
}

export async function deleteReview(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении отзыва');
}