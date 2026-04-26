import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import styles from "./CourseCard.module.css";

function difficultyLabel(d) {
  if (d <= 2) return { text: "轻松", cls: "easy" };
  if (d <= 3.5) return { text: "中等", cls: "medium" };
  return { text: "偏难", cls: "hard" };
}

export default function CourseCard({ course }) {
  const diff = difficultyLabel(course.avgDifficulty);

  return (
    <Link to={`/course/${course.id}`} className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.code}>{course.code}</span>
          <span className={`badge ${styles[diff.cls + "Badge"]}`}>{diff.text}</span>
        </div>
        <span className={styles.dept}>{course.department}</span>
      </div>

      <h3 className={styles.name}>{course.name}</h3>

      <p className={styles.desc}>{course.description}</p>

      <div className={styles.tags}>
        {course.tags.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <StarRating value={course.avgOverall} size="sm" />
          <span className={styles.statNum}>{course.avgOverall.toFixed(1)}</span>
          <span className={styles.statLabel}>综合</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{course.avgDifficulty.toFixed(1)}</span>
          <span className={styles.statLabel}>难度 /5</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statNum}>{course.avgWorkload}h</span>
          <span className={styles.statLabel}>周均时间</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={`${styles.statNum} ${styles.green}`}>{course.wouldTakeAgain}%</span>
          <span className={styles.statLabel}>愿意重选</span>
        </div>
        <div className={styles.reviewCount}>{course.reviewCount} 条评价</div>
      </div>
    </Link>
  );
}
