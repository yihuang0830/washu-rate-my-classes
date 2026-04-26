import styles from "./StarRating.module.css";

export default function StarRating({ value, size = "md" }) {
  return (
    <span className={`${styles.stars} ${styles[size]}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={styles.star}
          style={{ opacity: i <= Math.round(value) ? 1 : 0.2 }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
