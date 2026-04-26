import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";
import { fetchCourses, getReviewFormUrl } from "../services/sheetsApi";
import styles from "./CoursePage.module.css";

function StatBox({ label, value, unit, color }) {
  return (
    <div className={styles.statBox}>
      <div className={styles.statValue} style={color ? { color } : {}}>
        {value}
        {unit && <span className={styles.statUnit}>{unit}</span>}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function RatingBar({ label, value, max = 5 }) {
  const pct = (value / max) * 100;
  return (
    <div className={styles.ratingBar}>
      <span className={styles.ratingBarLabel}>{label}</span>
      <div className={styles.ratingBarTrack}>
        <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.ratingBarVal}>{value}/{max}</span>
    </div>
  );
}

export default function CoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");
  const [profFilter, setProfFilter] = useState("All");

  useEffect(() => {
    fetchCourses().then((courses) => {
      const found = courses.find((c) => c.id === id);
      setCourse(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className={styles.center}>
        <p>课程未找到</p>
        <Link to="/" className={styles.backLink}>← 返回首页</Link>
      </div>
    );
  }

  const professors = ["All", ...new Set(course.reviews.map((r) => r.professor))];
  const visibleReviews =
    profFilter === "All"
      ? course.reviews
      : course.reviews.filter((r) => r.professor === profFilter);

  const syllabi = course.resources.filter((r) => r.type === "syllabus");
  const exams = course.resources.filter((r) => r.type === "exam");

  return (
    <div className={styles.page}>
      {/* Back */}
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
              <p className={styles.professors}>
                授课教授：{course.professors.join(" · ")}
              </p>
            </div>
            <a
              href={`${getReviewFormUrl()}?entry.course=${course.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.writeBtn}
            >
              + 写评价
            </a>
          </div>

          <p className={styles.description}>{course.description}</p>

          <div className={styles.tags}>
            {course.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div className={styles.overallBox}>
              <div className={styles.overallNum}>{course.avgOverall.toFixed(1)}</div>
              <StarRating value={course.avgOverall} size="lg" />
              <div className={styles.overallSub}>{course.reviewCount} 条评价</div>
            </div>

            <div className={styles.bars}>
              <RatingBar label="综合评分" value={course.avgOverall} />
              <RatingBar label="课程难度" value={course.avgDifficulty} />
            </div>

            <div className={styles.statBoxes}>
              <StatBox
                label="周均工作量"
                value={course.avgWorkload}
                unit="小时"
              />
              <StatBox
                label="愿意重选"
                value={`${course.wouldTakeAgain}%`}
                color={course.wouldTakeAgain >= 75 ? "var(--green)" : course.wouldTakeAgain >= 50 ? "var(--yellow)" : "var(--washu-red)"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container">
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            评价 ({course.reviewCount})
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
          <div className={styles.reviewsSection}>
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
              {visibleReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            <div className={styles.writeReview}>
              <p>你也上过这门课？分享你的评价帮助学弟学妹！</p>
              <a
                href={getReviewFormUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.writeBtn}
              >
                写评价
              </a>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className={styles.resourcesSection}>
            {syllabi.length > 0 && (
              <div className={styles.resourceGroup}>
                <h3 className={styles.resourceTitle}>Syllabus</h3>
                <div className={styles.resourceList}>
                  {syllabi.map((r, i) => (
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resourceItem}
                    >
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
                    <a
                      key={i}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resourceItem}
                    >
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
                  你有这门课的 syllabus 或往年试卷？联系我们上传！
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
