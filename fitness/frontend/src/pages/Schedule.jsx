import { useState, useEffect } from "react";
import { getSchedule } from "../api/schedule";

function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const data = await getSchedule();
      setSchedule(data);
    } catch (err) {
      setError("Не удалось загрузить расписание");
    } finally {
      setLoading(false);
    }
  }

  const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

  if (loading) return <p className="loading">Загрузка...</p>;

  return (
    <div className="container">
      <h1>Расписание групповых занятий</h1>
      {error && <p className="error">{error}</p>}

      <div className="schedule-grid">
        {days.map((day, index) => {
          const dayNumber = index + 1;
          const dayItems = schedule.filter(s => s.day_of_week === dayNumber);

          return (
            <div key={dayNumber} className="schedule-day">
              <h3>{day}</h3>
              {dayItems.length === 0 && <p className="schedule-empty">Нет занятий</p>}
              {dayItems.map(item => (
                <div key={item.id} className="schedule-item">
                  <div className="schedule-time">{item.time_start} - {item.time_end}</div>
                  <div className="schedule-name">{item.service_name}</div>
                  <div className="schedule-trainer">{item.trainer}</div>
                  <div className="schedule-hall">{item.hall}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Schedule;