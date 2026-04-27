import { supabase } from "./supabase";

export async function fetchReviewsForCourse(courseId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchAllReviewStats() {
  const { data, error } = await supabase
    .from("reviews")
    .select("course_id, overall, difficulty, workload, would_take_again");

  if (error) throw error;

  const stats = {};
  for (const r of data) {
    if (!stats[r.course_id]) {
      stats[r.course_id] = { sum_overall: 0, sum_difficulty: 0, sum_workload: 0, yes: 0, count: 0 };
    }
    const s = stats[r.course_id];
    s.sum_overall += r.overall;
    s.sum_difficulty += r.difficulty;
    s.sum_workload += r.workload;
    if (r.would_take_again) s.yes++;
    s.count++;
  }

  const result = {};
  for (const [id, s] of Object.entries(stats)) {
    result[id] = {
      avgOverall:    Math.round((s.sum_overall   / s.count) * 10) / 10,
      avgDifficulty: Math.round((s.sum_difficulty / s.count) * 10) / 10,
      avgWorkload:   Math.round(s.sum_workload   / s.count),
      wouldTakeAgain: Math.round((s.yes / s.count) * 100),
      reviewCount:   s.count,
    };
  }
  return result;
}

export async function submitReview(review) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToReviews(courseId, onNewReview) {
  return supabase
    .channel(`reviews:${courseId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "reviews", filter: `course_id=eq.${courseId}` },
      (payload) => onNewReview(payload.new)
    )
    .subscribe();
}
