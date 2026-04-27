import { useState, useEffect, useMemo } from "react";
import CourseCard from "../components/CourseCard";
import { fetchAllReviewStats } from "../services/reviews";
import { COURSES, DEPARTMENTS, LEVELS } from "../data/mockData";
import styles from "./HomePage.module.css";

const SORT_OPTIONS = [
  { value: "overall",    label: "综合评分" },
  { value: "reviews",    label: "评价数量" },
  { value: "workload",   label: "工作量（低→高）" },
  { value: "difficulty", label: "难度（低→高）" },
];

export default function HomePage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("overall");

  useEffect(() => {
    fetchAllReviewStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  // Merge live stats into course metadata
  const courses = useMemo(() =>
    COURSES.map((c) => ({ ...c, ...(stats[c.id] || {}) })),
    [stats]
  );

  const filtered = useMemo(() => {
    let list = courses;
    if (dept !== "All")  list = list.filter((c) => c.department === dept);
    if (level !== "All") list = list.filter((c) => c.level.startsWith(level[0]));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.professors.some((p) => p.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => {
      if (sort === "overall")    return (b.avgOverall || 0)    - (a.avgOverall || 0);
      if (sort === "reviews")    return (b.reviewCount || 0)   - (a.reviewCount || 0);
      if (sort === "workload")   return (a.avgWorkload || 99)  - (b.avgWorkload || 99);
      if (sort === "difficulty") return (a.avgDifficulty || 99)- (b.avgDifficulty || 99);
      return 0;
    });
  }, [courses, query, dept, level, sort]);

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>WashU 选课指南</h1>
          <p className={styles.heroSub}>
            真实的课程评价 · 往年试卷 · Syllabus · 由中国学生会维护
          </p>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="搜索课号、课名、教授、标签…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>院系</label>
            <div className={styles.chips}>
              {DEPARTMENTS.map((d) => (
                <button
                  key={d}
                  className={`${styles.chip} ${dept === d ? styles.chipActive : ""}`}
                  onClick={() => setDept(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>年级</label>
            <div className={styles.chips}>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  className={`${styles.chip} ${level === l ? styles.chipActive : ""}`}
                  onClick={() => setLevel(l)}
                >
                  {l === "All" ? "全部" : l + "s"}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sortRow}>
            <label className={styles.filterLabel}>排序</label>
            <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className={styles.resultsHeader}>
          <span className={styles.count}>
            {loading ? "加载中…" : `找到 ${filtered.length} 门课程`}
          </span>
        </div>

        {loading ? (
          <div className={styles.loading}><div className={styles.spinner} /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>没有找到符合条件的课程</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
