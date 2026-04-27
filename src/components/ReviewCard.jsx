import StarRating from "./StarRating";
import styles from "./ReviewCard.module.css";

function gradeColor(grade) {
  if (!grade) return {};
  const g = grade[0];
  if (g === "A") return { background: "#dcfce7", color: "#15803d" };
  if (g === "B") return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#fee2e2", color: "#b91c1c" };
}

export default function ReviewCard({ review }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.professor}>{review.professor}</span>
          <span className={styles.semester}>{review.semester}</span>
          {review.grade && (
            <span className={`badge ${styles.grade}`} style={gradeColor(review.grade)}>
              {review.grade}
            </span>
          )}
        </div>
        <div className={styles.scores}>
          <div className={styles.score}>
            <StarRating value={review.overall} size="sm" />
            <span className={styles.scoreVal}>{review.overall}/5</span>
          </div>
          <span className={styles.dot}>·</span>
          <span className={styles.scoreChip}>难度 {review.difficulty}/5</span>
          <span className={styles.dot}>·</span>
          <span className={styles.scoreChip}>工作量 {review.workload}h/周</span>
          <span className={styles.dot}>·</span>
          <span className={styles.scoreChip} style={review.wouldTakeAgain ? { color: "var(--green)" } : { color: "#b91c1c" }}>
            {review.wouldTakeAgain ? "✓ 愿意重选" : "✗ 不会重选"}
          </span>
        </div>
      </div>
      <p className={styles.comment}>{review.comment}</p>
      <div className={styles.footer}>
        <span className={styles.date}>
          {review.created_at
            ? new Date(review.created_at).toLocaleDateString("zh-CN")
            : review.timestamp}
        </span>
      </div>
    </div>
  );
}
