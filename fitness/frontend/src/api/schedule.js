const API_URL = 'http://localhost:5000/api/schedule';

export async function getSchedule() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении расписания');
  return await response.json();
}

export async function createSchedule(item) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Ошибка при создании занятия');
  return await response.json();
}

export async function deleteSchedule(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Ошибка при удалении занятия');
}