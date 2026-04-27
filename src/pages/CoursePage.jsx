import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import StarRating from "../components/StarRating";
import { fetchReviewsForCourse, subscribeToReviews } from "../services/reviews";
import { COURSES } from "../data/mockData";
import styles from "./CoursePage.module.css";

function computeStats(reviews) {
  if (!reviews.length) return { avgOverall: 0, avgDifficulty: 0, avgWorkload: 0, wouldTakeAgain: 0 };
  const n = reviews.length;
  return {
    avgOverall:    Math.round(reviews.reduce((s, r) => s + r.overall,    0) / n * 10) / 10,
    avgDifficulty: Math.round(reviews.reduce((s, r) => s + r.difficulty, 0) / n * 10) / 10,
    avgWorkload:   Math.round(reviews.reduce((s, r) => s + r.workload,   0) / n),
    wouldTakeAgain: Math.round(reviews.filter((r) => r.would_take_again).length / n * 100),
  };
}

function RatingBar({ label, value }) {
  return (
    <div className={styles.ratingBar}>
      <span className={styles.ratingBarLabel}>{label}</span>
      <div className={styles.ratingBarTrack}>
        <div className={styles.ratingBarFill} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className={styles.ratingBarVal}>{value}/5</span>
    </div>
  );
}

export default function CoursePage() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");
  const [profFilter, setProfFilter] = useState("All");
  const channelRef = useRef(null);

  const course = COURSES.find((c) => c.id === id);

  useEffect(() => {
    if (!course) { setLoading(false); return; }

    fetchReviewsForCourse(id).then((data) => {
      setReviews(data);
      setLoading(false);
    });

    // Realtime: new reviews appear instantly
    channelRef.current = subscribeToReviews(id, (newReview) => {
      setReviews((prev) => [newReview, ...prev]);
    });

    return () => { channelRef.current?.unsubscribe(); };
  }, [id]);

  if (!course) {
    return (
      <div className={styles.center}>
        <p>课程未找到</p>
        <Link to="/" className={styles.backLink}>← 返回首页</Link>
      </div>
    );
  }

  const stats = computeStats(reviews);
  const professors = ["All", ...new Set(reviews.map((r) => r.professor))];
  const visibleReviews = profFilter === "All" ? reviews : reviews.filter((r) => r.professor === profFilter);
  const syllabi = course.resources.filter((r) => r.type === "syllabus");
  const exams   = course.resources.filter((r) => r.type === "exam");

  return (
    <div className={styles.page}>
      <div className="container">
        <Link to="/" className={styles.back}>← 返回课程列表</Link>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <div className={styles.headerTop}>
            <div>
              <div className={styles.codeRow}>
                <span className={styles.code}>{course.code}</span>
                <span className={styles.dept}>{course.department}</span>
                <span className={styles.credits}>{course.credits} 学分</span>
              </div>
              <h1 className={styles.title}>{course.name}</h1>
              <p className={styles.professors}>授课教授：{course.professors.join(" · ")}</p>
            </div>
          </div>
          <p className={styles.description}>{course.description}</p>
          <div className={styles.tags}>
            {course.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && reviews.length > 0 && (
        <div className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              <div className={styles.overallBox}>
                <div className={styles.overallNum}>{stats.avgOverall.toFixed(1)}</div>
                <StarRating value={stats.avgOverall} size="lg" />
                <div className={styles.overallSub}>{reviews.length} 条评价</div>
              </div>
              <div className={styles.bars}>
                <RatingBar label="综合评分" value={stats.avgOverall} />
                <RatingBar label="课程难度" value={stats.avgDifficulty} />
              </div>
              <div className={styles.statBoxes}>
                <div className={styles.statBox}>
                  <div className={styles.statValue}>{stats.avgWorkload}<span className={styles.statUnit}>h</span></div>
                  <div className={styles.statLabel}>周均工作量</div>
                </div>
                <div className={styles.statBox}>
                  <div className={styles.statValue} style={{ color: stats.wouldTakeAgain >= 70 ? "var(--green)" : "var(--yellow)" }}>
                    {stats.wouldTakeAgain}%
                  </div>
                  <div className={styles.statLabel}>愿意重选</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="container">
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            评价 {reviews.length > 0 && `(${reviews.length})`}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "write" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("write")}
          >
            + 写评价
          </button>
          <button
            className={`${styles.tab} ${activeTab === "resources" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            往年资料 ({course.resources.length})
          </button>
        </div>

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className={styles.section}>
            {loading ? (
              <div className={styles.center}><div className={styles.spinner} /></div>
            ) : reviews.length === 0 ? (
              <div className={styles.empty}>
                <p>还没有评价</p>
                <button className={styles.emptyBtn} onClick={() => setActiveTab("write")}>
                  成为第一个写评价的人 →
                </button>
              </div>
            ) : (
              <>
                {professors.length > 2 && (
                  <div className={styles.profFilter}>
                    <span className={styles.filterLabel}>按教授筛选：</span>
                    {professors.map((p) => (
                      <button
                        key={p}
                        className={`${styles.profChip} ${profFilter === p ? styles.profChipActive : ""}`}
                        onClick={() => setProfFilter(p)}
                      >
                        {p === "All" ? "全部" : p}
                      </button>
                    ))}
                  </div>
                )}
                <div className={styles.reviewList}>
                  {visibleReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* Write Tab */}
        {activeTab === "write" && (
          <div className={styles.section}>
            <ReviewForm
              course={course}
              onSubmitted={() => setActiveTab("reviews")}
            />
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className={styles.section}>
            {syllabi.length > 0 && (
              <div className={styles.resourceGroup}>
                <h3 className={styles.resourceTitle}>Syllabus</h3>
                <div className={styles.resourceList}>
                  {syllabi.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceItem}>
                      <span className={styles.resourceIcon}>📄</span>
                      <div>
                        <div className={styles.resourceName}>{r.name}</div>
                        <div className={styles.resourceSem}>{r.semester}</div>
                      </div>
                      <span className={styles.resourceArrow}>↓</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {exams.length > 0 && (
              <div className={styles.resourceGroup}>
                <h3 className={styles.resourceTitle}>Past Exams</h3>
                <div className={styles.resourceList}>
                  {exams.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceItem}>
                      <span className={styles.resourceIcon}>📝</span>
                      <div>
                        <div className={styles.resourceName}>{r.name}</div>
                        <div className={styles.resourceSem}>{r.semester}</div>
                      </div>
                      <span className={styles.resourceArrow}>↓</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {course.resources.length === 0 && (
              <div className={styles.empty}>
                <p>暂无资料</p>
                <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 8 }}>
                  有这门课的 syllabus 或往年试卷？联系我们上传！
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
