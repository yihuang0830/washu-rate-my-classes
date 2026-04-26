import { useState, useEffect, useMemo } from "react";
import CourseCard from "../components/CourseCard";
import { fetchCourses } from "../services/sheetsApi";
import { DEPARTMENTS, LEVELS } from "../data/mockData";
import { getReviewFormUrl } from "../services/sheetsApi";
import styles from "./HomePage.module.css";

const SORT_OPTIONS = [
  { value: "overall", label: "综合评分" },
  { value: "reviews", label: "评价数量" },
  { value: "workload", label: "工作量（低→高）" },
  { value: "difficulty", label: "难度（低→高）" },
];

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("overall");

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = courses;

    if (dept !== "All") list = list.filter((c) => c.department === dept);
    if (level !== "All") list = list.filter((c) => c.level.startsWith(level[0]));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.professors.some((p) => p.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list = [...list].sort((a, b) => {
      if (sort === "overall") return b.avgOverall - a.avgOverall;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      if (sort === "workload") return a.avgWorkload - b.avgWorkload;
      if (sort === "difficulty") return a.avgDifficulty - b.avgDifficulty;
      return 0;
    });

    return list;
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
          <a
            href={getReviewFormUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.heroBtn}
          >
            分享你的课程经历 →
          </a>
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
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
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
          <div className={styles.loading}>
            <div className={styles.spinner} />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>没有找到符合条件的课程</p>
            <p style={{ fontSize: 13, color: "var(--gray-500)", marginTop: 8 }}>
              试试换一个关键词，或者清除筛选条件
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className={styles.ctaBanner}>
          <div>
            <strong>上过这门课？</strong> 分享你的真实经历，帮助学弟学妹做出更好的选择。
          </div>
          <a
            href={getReviewFormUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            写评价
          </a>
        </div>
      </div>
    </div>
  );
}
