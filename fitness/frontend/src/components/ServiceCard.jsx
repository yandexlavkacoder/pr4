import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const DEFAULT_IMAGE = "https://img.magnific.com/free-photo/weightlifter-performing-deadlift-silhouette_23-2151982349.jpg?semt=ais_hybrid&w=740&q=80";

function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const isAdmin = user && (user.role_id === 1 || user.role_id === 3);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(service.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="service-card">
      <img
        src={service.image && service.image.trim() !== "" ? service.image : DEFAULT_IMAGE}
        alt={service.name}
        className="service-image"
        onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
      />
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <p>Длительность: {service.duration} мин</p>
      <p>Категория: {service.category_name}</p>
      <p className="price">{service.price} руб</p>

      <button
        onClick={() => navigate(`/services/${service.id}`)}
        className="btn-secondary"
      >
        Подробнее
      </button>

      {!isAdmin && (
        <button onClick={handleAdd} className="btn-primary" style={{ marginTop: '10px' }}>
          В корзину
        </button>
      )}
    </div>
  );
}

export default ServiceCard;