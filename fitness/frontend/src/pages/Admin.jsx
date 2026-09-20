import { useState, useEffect } from "react";
import { getServices, createService, deleteService, updateService } from "../api/services";
import { getCategories, createCategory, deleteCategory, updateCategory } from "../api/categories";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../api/orders";
import { getAllReviews, deleteReview } from "../api/reviews";
import { getUsers, updateUserRole, deleteUser } from "../api/users";
import { getSchedule, createSchedule, deleteSchedule } from "../api/schedule";

function Admin() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [stats, setStats] = useState(null);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newService, setNewService] = useState({
    name: "", description: "", hours: 1, minutes: 0, price: 0, category_id: "", image: ""
  });
  const [newSchedule, setNewSchedule] = useState({
    service_id: "", day_of_week: 1, time_start: "09:00", time_end: "10:00", trainer: "", hall: ""
  });
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isMainAdmin = currentUser && currentUser.role_id === 1;

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      const requests = [
        getServices(),
        getCategories(),
        getAllOrders(),
        getSchedule(),
        fetch("http://localhost:5000/api/stats").then(r => r.json())
      ];

      if (isMainAdmin) {
        requests.push(getAllReviews());
        requests.push(getUsers());
      }

      const results = await Promise.all(requests);

      setServices(results[0]);
      setCategories(results[1]);
      setOrders(results[2]);
      setSchedule(results[3]);
      setStats(results[4]);

      if (isMainAdmin) {
        setReviews(results[5]);
        setUsers(results[6]);
      }
    } catch (err) {
      setMessage("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }

  function minutesToHours(mins) {
    return { hours: Math.floor(mins / 60), minutes: mins % 60 };
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const created = await createCategory(newCategory);
      setCategories([...categories, created]);
      setNewCategory({ name: "", description: "" });
      setMessage("Категория добавлена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleUpdateCategory(e) {
    e.preventDefault();
    try {
      const updated = await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description
      });
      setCategories(categories.map(c => c.id === updated.id ? updated : c));
      setEditingCategory(null);
      setMessage("Категория обновлена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Удалить категорию?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      setMessage("Категория удалена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleAddService(e) {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.category_id) return;

    const duration = Number(newService.hours) * 60 + Number(newService.minutes);

    if (duration <= 0) {
      setMessage("Ошибка: длительность должна быть больше 0");
      return;
    }

    try {
      const created = await createService({
        name: newService.name,
        description: newService.description,
        duration,
        price: Number(newService.price),
        category_id: Number(newService.category_id),
        image: newService.image
      });
      const cat = categories.find(c => c.id === Number(newService.category_id));
      setServices([...services, { ...created, category_name: cat ? cat.name : "" }]);
      setNewService({ name: "", description: "", hours: 1, minutes: 0, price: 0, category_id: "", image: "" });
      setMessage("Услуга добавлена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleUpdateService(e) {
    e.preventDefault();
    const duration = Number(editingService.hours) * 60 + Number(editingService.minutes);

    if (duration <= 0) {
      setMessage("Ошибка: длительность должна быть больше 0");
      return;
    }

    try {
      const updated = await updateService(editingService.id, {
        name: editingService.name,
        description: editingService.description,
        duration,
        price: Number(editingService.price),
        category_id: Number(editingService.category_id),
        image: editingService.image
      });
      const cat = categories.find(c => c.id === Number(editingService.category_id));
      setServices(services.map(s =>
        s.id === updated.id
          ? { ...updated, category_name: cat ? cat.name : s.category_name }
          : s
      ));
      setEditingService(null);
      setMessage("Услуга обновлена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteService(id) {
    if (!window.confirm("Удалить услугу?")) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
      setMessage("Услуга удалена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleAddSchedule(e) {
    e.preventDefault();
    if (!newSchedule.service_id || !newSchedule.trainer) return;
    try {
      const created = await createSchedule({
        ...newSchedule,
        service_id: Number(newSchedule.service_id),
        day_of_week: Number(newSchedule.day_of_week)
      });
      const serv = services.find(s => s.id === Number(newSchedule.service_id));
      setSchedule([...schedule, { ...created, service_name: serv ? serv.name : "" }]);
      setNewSchedule({
        service_id: "", day_of_week: 1, time_start: "09:00", time_end: "10:00", trainer: "", hall: ""
      });
      setMessage("Занятие добавлено в расписание");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteSchedule(id) {
    if (!window.confirm("Удалить занятие?")) return;
    try {
      await deleteSchedule(id);
      setSchedule(schedule.filter(s => s.id !== id));
      setMessage("Занятие удалено");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleChangeStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteOrder(id) {
    if (!window.confirm("Удалить заказ?")) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
      setMessage("Заказ удалён");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteReview(id) {
    if (!window.confirm("Удалить отзыв?")) return;
    try {
      await deleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      setMessage("Отзыв удалён");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleChangeRole(userId, roleId) {
    try {
      await updateUserRole(userId, roleId, currentUser.id);

      const roleNames = { 1: "admin", 2: "user", 3: "manager" };
      setUsers(users.map(u =>
        u.id === userId
          ? { ...u, role_id: roleId, role_name: roleNames[roleId] }
          : u
      ));
      setMessage("Роль изменена");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      await deleteUser(id, currentUser.id);
      setUsers(users.filter(u => u.id !== id));
      setMessage("Пользователь удалён");
    } catch (err) {
      setMessage("Ошибка: " + err.message);
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>;

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="container">
      <h1>Панель администратора</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        {isMainAdmin ? "Главный администратор" : "Менеджер"}
      </p>

      <div className="admin-nav">
        <a href="#stats">Статистика</a>
        <a href="#categories">Категории</a>
        <a href="#services">Услуги</a>
        <a href="#schedule">Расписание</a>
        <a href="#orders">Заказы</a>
        {isMainAdmin && <a href="#users">Пользователи</a>}
        {isMainAdmin && <a href="#reviews">Отзывы</a>}
      </div>

      {message && <p className="success">{message}</p>}

      <section className="admin-section" id="stats">
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="number">{stats.users}</div>
              <div className="label">Пользователей</div>
            </div>
            <div className="stat-card">
              <div className="number">{stats.services}</div>
              <div className="label">Услуг</div>
            </div>
            <div className="stat-card">
              <div className="number">{stats.orders}</div>
              <div className="label">Заказов</div>
            </div>
            <div className="stat-card">
              <div className="number">{stats.reviews}</div>
              <div className="label">Отзывов</div>
            </div>
          </div>
        )}
      </section>

      <section className="admin-section" id="categories">
        <h3>Категории</h3>

        <form onSubmit={handleAddCategory} className="admin-form">
          <div className="form-field">
            <label>Название</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Описание</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Добавить</button>
        </form>

        <ul className="admin-list">
          {categories.map(cat => (
            <li key={cat.id}>
              {editingCategory && editingCategory.id === cat.id ? (
                <form onSubmit={handleUpdateCategory} className="admin-form" style={{ flex: 1 }}>
                  <div className="form-field">
                    <label>Название</label>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Описание</label>
                    <input
                      type="text"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary">Сохранить</button>
                  <button type="button" onClick={() => setEditingCategory(null)} className="btn-secondary">Отмена</button>
                </form>
              ) : (
                <>
                  <span>{cat.name} — {cat.description}</span>
                  <div>
                    <button onClick={() => setEditingCategory(cat)} className="btn-secondary">Изменить</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="btn-danger">Удалить</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section" id="services">
        <h3>Услуги</h3>

        <form onSubmit={handleAddService} className="admin-form">
          <div className="form-field">
            <label>Название услуги</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Описание</label>
            <input
              type="text"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Длительность: часы</label>
            <select
              value={newService.hours}
              onChange={(e) => setNewService({ ...newService, hours: Number(e.target.value) })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i} ч</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Длительность: минуты</label>
            <select
              value={newService.minutes}
              onChange={(e) => setNewService({ ...newService, minutes: Number(e.target.value) })}
            >
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                <option key={m} value={m}>{m} мин</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Цена (руб)</label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Категория</label>
            <select
              value={newService.category_id}
              onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
            >
              <option value="">Выберите категорию</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Ссылка на картинку</label>
            <input
              type="text"
              placeholder="https://..."
              value={newService.image}
              onChange={(e) => setNewService({ ...newService, image: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Добавить</button>
        </form>

        <ul className="admin-list">
          {services.map(serv => (
            <li key={serv.id}>
              {editingService && editingService.id === serv.id ? (
                <form onSubmit={handleUpdateService} className="admin-form" style={{ flex: 1 }}>
                  <div className="form-field">
                    <label>Название</label>
                    <input
                      type="text"
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Описание</label>
                    <input
                      type="text"
                      value={editingService.description}
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Часы</label>
                    <select
                      value={editingService.hours}
                      onChange={(e) => setEditingService({ ...editingService, hours: Number(e.target.value) })}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i} ч</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Минуты</label>
                    <select
                      value={editingService.minutes}
                      onChange={(e) => setEditingService({ ...editingService, minutes: Number(e.target.value) })}
                    >
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                        <option key={m} value={m}>{m} мин</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Цена</label>
                    <input
                      type="number"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Категория</label>
                    <select
                      value={editingService.category_id}
                      onChange={(e) => setEditingService({ ...editingService, category_id: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Ссылка на картинку</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={editingService.image || ""}
                      onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary">Сохранить</button>
                  <button type="button" onClick={() => setEditingService(null)} className="btn-secondary">Отмена</button>
                </form>
              ) : (
                <>
                  <span>
                    {serv.name} — {Math.floor(serv.duration / 60)} ч {serv.duration % 60} мин — {serv.price} руб — {serv.category_name}
                  </span>
                  <div>
                    <button
                      onClick={() => setEditingService({ ...serv, ...minutesToHours(serv.duration), image: serv.image || "" })}
                      className="btn-secondary"
                    >
                      Изменить
                    </button>
                    <button onClick={() => handleDeleteService(serv.id)} className="btn-danger">Удалить</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section" id="schedule">
        <h3>Расписание</h3>

        <form onSubmit={handleAddSchedule} className="admin-form">
          <div className="form-field">
            <label>Услуга</label>
            <select
              value={newSchedule.service_id}
              onChange={(e) => setNewSchedule({ ...newSchedule, service_id: e.target.value })}
            >
              <option value="">Выберите услугу</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>День недели</label>
            <select
              value={newSchedule.day_of_week}
              onChange={(e) => setNewSchedule({ ...newSchedule, day_of_week: e.target.value })}
            >
              {days.map((d, i) => (
                <option key={i + 1} value={i + 1}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Начало</label>
            <input
              type="text"
              placeholder="09:00"
              value={newSchedule.time_start}
              onChange={(e) => setNewSchedule({ ...newSchedule, time_start: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Конец</label>
            <input
              type="text"
              placeholder="10:00"
              value={newSchedule.time_end}
              onChange={(e) => setNewSchedule({ ...newSchedule, time_end: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Тренер</label>
            <input
              type="text"
              value={newSchedule.trainer}
              onChange={(e) => setNewSchedule({ ...newSchedule, trainer: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Зал</label>
            <input
              type="text"
              value={newSchedule.hall}
              onChange={(e) => setNewSchedule({ ...newSchedule, hall: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary">Добавить</button>
        </form>

        <ul className="admin-list">
          {schedule.map(item => (
            <li key={item.id}>
              <span>
                {days[item.day_of_week - 1]} {item.time_start}-{item.time_end} — {item.service_name} — {item.trainer}
              </span>
              <button onClick={() => handleDeleteSchedule(item.id)} className="btn-danger">Удалить</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section" id="orders">
        <h3>Заказы</h3>
        {orders.length === 0 && <p>Заказов нет</p>}
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Заказ #{order.id} от {order.user_name}</span>
              <span className="order-status">{order.status}</span>
            </div>
            <p>Email: {order.user_email}</p>
            <p>Адрес: {order.address}</p>
            <p>Дата доставки: {new Date(order.delivery_date).toLocaleDateString()}</p>
            <p>Сумма: {order.total} руб</p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
              <select
                value={order.status}
                onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                className="rating-select"
                style={{ marginBottom: 0 }}
              >
                <option value="новый">новый</option>
                <option value="в обработке">в обработке</option>
                <option value="доставлен">доставлен</option>
                <option value="отменён">отменён</option>
              </select>
              {isMainAdmin && (
                <button onClick={() => handleDeleteOrder(order.id)} className="btn-danger">Удалить</button>
              )}
            </div>
          </div>
        ))}
      </section>

      {isMainAdmin && (
        <section className="admin-section" id="users">
          <h3>Пользователи</h3>
          <ul className="admin-list">
            {users.map(u => (
              <li key={u.id}>
                <span>{u.full_name} — {u.email} — {u.role_name}</span>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <select
                    value={u.role_id}
                    onChange={(e) => handleChangeRole(u.id, Number(e.target.value))}
                    className="rating-select"
                    style={{ marginBottom: 0 }}
                    disabled={u.id === currentUser.id}
                  >
                    <option value={1}>Админ</option>
                    <option value={2}>Пользователь</option>
                    <option value={3}>Менеджер</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="btn-danger"
                    disabled={u.id === currentUser.id}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isMainAdmin && (
        <section className="admin-section" id="reviews">
          <h3>Отзывы</h3>
          {reviews.length === 0 && <p>Отзывов нет</p>}
          <ul className="admin-list">
            {reviews.map(rev => (
              <li key={rev.id}>
                <span>
                  {rev.user_name} — {rev.service_name} — {rev.rating}/5 — {rev.comment}
                </span>
                <button onClick={() => handleDeleteReview(rev.id)} className="btn-danger">Удалить</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default Admin;