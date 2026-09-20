const API_URL = 'http://localhost:5000/api/categories';

export async function getCategories() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении категорий');
  return await response.json();
}

export async function createCategory(category) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error('Ошибка при создании категории');
  return await response.json();
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении категории');
  return await response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении категории');
}