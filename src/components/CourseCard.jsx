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
  const hasStats = course.reviewCount > 0;

  return (
    <Link to={`/course/${course.id}`} className={styles.card}>
      {/* Top row */}
      <div className={styles.topRow}>
        <div className={styles.codeWrap}>
          <span className={styles.code}>{course.code}</span>
          <span className={`${styles.diffBadge} ${styles[diff.cls]}`}>{diff.text}</span>
        </div>
        <span className={styles.dept}>{course.department}</span>
      </div>

      {/* Title */}
      <h3 className={styles.name}>{course.name}</h3>

      {/* Professors */}
      <p className={styles.profs}>{course.professors.join(" · ")}</p>

      {/* Tags */}
      <div className={styles.tags}>
        {course.tags.slice(0, 4).map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      {/* Stats */}
      <div className={styles.statsWrap}>
        {hasStats ? (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCell}>
                <div className={styles.statMain}>
                  <span className={styles.statBig}>{course.avgOverall?.toFixed(1)}</span>
                  <StarRating value={course.avgOverall} size="sm" />
                </div>
                <span className={styles.statSub}>综合</span>
              </div>
              <div className={styles.statCell}>
                <span className={styles.statBig}>{course.avgDifficulty?.toFixed(1)}</span>
                <span className={styles.statSub}>难度 /5</span>
              </div>
              <div className={styles.statCell}>
                <span className={styles.statBig}>{course.avgWorkload}<span className={styles.statUnit}>h</span></span>
                <span className={styles.statSub}>周均</span>
              </div>
              <div className={styles.statCell}>
                <span className={`${styles.statBig} ${course.wouldTakeAgain >= 70 ? styles.green : styles.orange}`}>
                  {course.wouldTakeAgain}%
                </span>
                <span className={styles.statSub}>愿意重选</span>
              </div>
            </div>
            <div className={styles.reviewBadge}>{course.reviewCount} 条评价</div>
          </>
        ) : (
          <span className={styles.noReviews}>暂无评价 — 来写第一条</span>
        )}
      </div>
    </Link>
  );
}
