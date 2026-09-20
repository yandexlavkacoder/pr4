import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById } from "../api/services";
import { getServiceReviews, createReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      setLoading(true);
      const [serv, revs] = await Promise.all([
        getServiceById(id),
        getServiceReviews(id)
      ]);
      setService(serv);
      setReviews(revs);

      if (user) {
        const mine = revs.find(r => r.user_id === user.id);
        if (mine) {
          setMyReview(mine);
          setRating(mine.rating);
          setComment(mine.comment || "");
        }
      }
    } catch (err) {
      setError("Не удалось загрузить услугу");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault();
    setReviewError("");

    if (!user) {
      setReviewError("Только авторизованные пользователи могут оставить отзыв");
      return;
    }

    if (!comment.trim()) {
      setReviewError("Введите комментарий");
      return;
    }

    try {
      await createReview(user.id, Number(id), rating, comment);
      setMyReview(null);
      setComment("");
      setRating(5);
      load();
    } catch (err) {
      setReviewError("Ошибка при отправке отзыва");
    }
  }

  if (loading) return <p className="loading">Загрузка...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!service) return null;

  return (
    <div className="container service-detail">
      <button onClick={() => navigate(-1)} className="btn-secondary">Назад</button>

      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <p>Длительность: {service.duration} мин</p>
      <p>Категория: {service.category_name}</p>
      <p className="price">{service.price} руб</p>

      <h2>Отзывы</h2>

      {reviews.length === 0 && <p>Отзывов пока нет</p>}

      {reviews.map(rev => (
        <div key={rev.id} className="review">
          <div className="review-header">
            <span>{rev.user_name}</span>
            <span className="review-rating">
              {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
            </span>
          </div>
          <p>{rev.comment}</p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
            {new Date(rev.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}

      {!user ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          Войдите, чтобы оставить отзыв
        </p>
      ) : user.role_id === 1 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>
          Администратор не может оставлять отзывы
        </p>
      ) : (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h3>{myReview ? "Изменить отзыв" : "Оставить отзыв"}</h3>
          {reviewError && <p className="error">{reviewError}</p>}

          <label>Оценка</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>5 - Отлично</option>
            <option value={4}>4 - Хорошо</option>
            <option value={3}>3 - Средне</option>
            <option value={2}>2 - Плохо</option>
            <option value={1}>1 - Ужасно</option>
          </select>

          <label>Комментарий</label>
          <textarea
            placeholder="Напишите ваш отзыв..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            {myReview ? "Обновить отзыв" : "Отправить"}
          </button>
        </form>
      )}
    </div>
  );
}

export default ServiceDetail;