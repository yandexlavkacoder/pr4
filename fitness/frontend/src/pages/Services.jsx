import { useState, useEffect } from "react";
import { getServices } from "../api/services";
import { getCategories } from "../api/categories";
import ServiceCard from "../components/ServiceCard";

function Services() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError("");
      const [servs, cats] = await Promise.all([
        getServices(),
        getCategories()
      ]);
      setServices(servs);
      setCategories(cats);
    } catch (err) {
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter(c => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const filtered = services
    .filter(s => selectedCategories.length === 0 || selectedCategories.includes(s.category_id))
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
    );

  if (loading) return <p className="loading">Загрузка...</p>;

  return (
    <div className="container">
      <div className="services-layout">
        <aside className="aside">
          <h3>Категории</h3>
          {categories.map(cat => (
            <label key={cat.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </aside>

        <div className="services-content">
          <h2>Каталог услуг</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по названию или описанию..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <div className="services-grid">
            {filtered.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;