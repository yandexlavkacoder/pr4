const API_URL = 'http://localhost:5000/api/services';

export async function getServices() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении услуг');
  return await response.json();
}

export async function getServiceById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Ошибка при получении услуги');
  return await response.json();
}

export async function createService(service) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Ошибка при создании услуги');
  return await response.json();
}

export async function updateService(id, service) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении услуги');
  return await response.json();
}

export async function deleteService(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении услуги');
}