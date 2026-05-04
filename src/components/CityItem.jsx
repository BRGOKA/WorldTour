/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CityContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { curentCity, deletCity } = useCities();
  const {
    id,
    emoji,
    cityName,
    date,
    position: { lat, lng },
  } = city;

  function handleDelte(e) {
    e.preventDefault();
    deletCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${city.id === curentCity.id ? styles["cityItem--active"] : ""}`}
        to={`${id}?lat=${lat}&lng=${lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelte}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
