import { useState } from "react";
import StarPicker from "./StarPicker";
import { submitReview } from "../services/reviews";
import styles from "./ReviewForm.module.css";

const SEMESTERS = [
  "Fall 2025", "Spring 2025", "Fall 2024", "Spring 2024",
  "Fall 2023", "Spring 2023", "Fall 2022", "Spring 2022",
];

const GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F", "W", "P/NP"];

const EMPTY = {
  professor: "",
  semester: "",
  grade: "",
  overall: 0,
  difficulty: 0,
  workload: "",
  would_take_again: null,
  comment: "",
};

export default function ReviewForm({ course, onSubmitted }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function validate() {
    if (!form.professor) return "请选择授课教授";
    if (!form.semester) return "请选择上课学期";
    if (form.overall === 0) return "请给综合评分打分";
    if (form.difficulty === 0) return "请给课程难度打分";
    if (!form.workload || form.workload < 1) return "请填写每周工作量";
    if (form.would_take_again === null) return "请选择是否愿意重选";
    if (form.comment.trim().length < 10) return "评价至少 10 个字";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setSubmitting(true);
    setError("");
    try {
      await submitReview({
        course_id: course.id,
        professor: form.professor,
        semester: form.semester,
        grade: form.grade || null,
        overall: form.overall,
        difficulty: form.difficulty,
        workload: parseInt(form.workload),
        would_take_again: form.would_take_again,
        comment: form.comment.trim(),
      });
      setSuccess(true);
      setForm(EMPTY);
      onSubmitted?.();
    } catch (err) {
      setError("提交失败，请重试：" + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>✓</div>
        <p className={styles.successTitle}>评价提交成功！</p>
        <p className={styles.successSub}>感谢分享，已实时显示在评价列表里。</p>
        <button className={styles.againBtn} onClick={() => setSuccess(false)}>
          再写一条
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>写评价</h3>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>授课教授 *</label>
          <select
            className={styles.select}
            value={form.professor}
            onChange={(e) => set("professor", e.target.value)}
          >
            <option value="">选择教授</option>
            {course.professors.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>上课学期 *</label>
          <select
            className={styles.select}
            value={form.semester}
            onChange={(e) => set("semester", e.target.value)}
          >
            <option value="">选择学期</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>最终成绩</label>
          <select
            className={styles.select}
            value={form.grade}
            onChange={(e) => set("grade", e.target.value)}
          >
            <option value="">（可选）</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.ratingsRow}>
        <div className={styles.ratingField}>
          <label className={styles.label}>综合评分 *</label>
          <StarPicker value={form.overall} onChange={(v) => set("overall", v)} />
        </div>
        <div className={styles.ratingField}>
          <label className={styles.label}>课程难度 *</label>
          <StarPicker value={form.difficulty} onChange={(v) => set("difficulty", v)} />
        </div>
        <div className={styles.ratingField}>
          <label className={styles.label}>周均工作量 *</label>
          <div className={styles.workloadRow}>
            <input
              type="number"
              className={styles.workloadInput}
              min="1"
              max="40"
              placeholder="小时"
              value={form.workload}
              onChange={(e) => set("workload", e.target.value)}
            />
            <span className={styles.workloadUnit}>小时/周</span>
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>是否愿意重选这门课？*</label>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggle} ${form.would_take_again === true ? styles.toggleYes : ""}`}
            onClick={() => set("would_take_again", true)}
          >
            ✓ 愿意
          </button>
          <button
            type="button"
            className={`${styles.toggle} ${form.would_take_again === false ? styles.toggleNo : ""}`}
            onClick={() => set("would_take_again", false)}
          >
            ✗ 不会
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>评价内容 * <span className={styles.charCount}>{form.comment.length} 字</span></label>
        <textarea
          className={styles.textarea}
          placeholder="分享你的真实感受：课程难度、教授风格、考试重点、选课建议……"
          rows={4}
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? "提交中…" : "提交评价"}
      </button>
    </form>
  );
}
