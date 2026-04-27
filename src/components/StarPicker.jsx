import { useState } from "react";
import styles from "./StarPicker.module.css";

export default function StarPicker({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${i <= display ? styles.filled : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            aria-label={`${i} star${i > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      {value > 0 && <span className={styles.val}>{value}/5</span>}
    </div>
  );
}
