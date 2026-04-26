import { COURSES } from "../data/mockData";

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const USE_MOCK = !SHEET_ID || !API_KEY;

// Google Sheet column mapping (adjust to match your sheet's column order)
const COL = {
  courseCode: 0,
  professor: 1,
  semester: 2,
  grade: 3,
  overall: 4,
  difficulty: 5,
  workload: 6,
  wouldTakeAgain: 7,
  comment: 8,
  timestamp: 9,
};

function rowToReview(row, index) {
  return {
    id: index,
    professor: row[COL.professor] || "",
    semester: row[COL.semester] || "",
    grade: row[COL.grade] || "",
    overall: Number(row[COL.overall]) || 0,
    difficulty: Number(row[COL.difficulty]) || 0,
    workload: Number(row[COL.workload]) || 0,
    wouldTakeAgain: row[COL.wouldTakeAgain]?.toLowerCase() === "yes",
    comment: row[COL.comment] || "",
    helpful: 0,
    timestamp: row[COL.timestamp] || "",
  };
}

export async function fetchCourses() {
  if (USE_MOCK) return COURSES;

  try {
    const range = "Reviews!A2:J";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values || [];

    // Group rows by course code and merge with static course metadata
    const reviewsByCode = {};
    rows.forEach((row, i) => {
      const code = row[COL.courseCode];
      if (!code) return;
      if (!reviewsByCode[code]) reviewsByCode[code] = [];
      reviewsByCode[code].push(rowToReview(row, i));
    });

    return COURSES.map((course) => {
      const sheetReviews = reviewsByCode[course.code] || [];
      if (sheetReviews.length === 0) return course;

      const allReviews = [...sheetReviews, ...course.reviews];
      const avgOverall =
        allReviews.reduce((s, r) => s + r.overall, 0) / allReviews.length;
      const avgDifficulty =
        allReviews.reduce((s, r) => s + r.difficulty, 0) / allReviews.length;
      const avgWorkload =
        allReviews.reduce((s, r) => s + r.workload, 0) / allReviews.length;
      const wouldTakeAgain =
        (allReviews.filter((r) => r.wouldTakeAgain).length /
          allReviews.length) *
        100;

      return {
        ...course,
        reviews: allReviews,
        reviewCount: allReviews.length,
        avgOverall: Math.round(avgOverall * 10) / 10,
        avgDifficulty: Math.round(avgDifficulty * 10) / 10,
        avgWorkload: Math.round(avgWorkload),
        wouldTakeAgain: Math.round(wouldTakeAgain),
      };
    });
  } catch (err) {
    console.error("Sheets API error, falling back to mock data:", err);
    return COURSES;
  }
}

export function getReviewFormUrl() {
  const formUrl = import.meta.env.VITE_GOOGLE_FORM_URL;
  return formUrl || "#";
}
