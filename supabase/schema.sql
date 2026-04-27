-- ============================================================
-- WashU Rate My Classes — Supabase Schema
-- 在 Supabase Dashboard → SQL Editor 里运行这个文件
-- ============================================================

create table if not exists reviews (
  id             uuid        default gen_random_uuid() primary key,
  course_id      text        not null,
  professor      text        not null,
  semester       text        not null,
  grade          text,
  overall        integer     not null check (overall between 1 and 5),
  difficulty     integer     not null check (difficulty between 1 and 5),
  workload       integer     not null check (workload between 1 and 40),
  would_take_again boolean   not null,
  comment        text        not null check (length(comment) >= 10),
  created_at     timestamptz default now()
);

-- 开启行级安全
alter table reviews enable row level security;

-- 任何人都可以读
create policy "public read"
  on reviews for select
  to anon
  using (true);

-- 任何人都可以添加
create policy "public insert"
  on reviews for insert
  to anon
  with check (true);

-- 没有 delete/update policy = 物理上无法删除或修改他人评价

-- ============================================================
-- 初始种子数据（把之前的 mock 评价导入）
-- ============================================================

insert into reviews (course_id, professor, semester, grade, overall, difficulty, workload, would_take_again, comment) values
  ('cse131',  'Ron Cytron',   'Fall 2024',   'A',  5, 2, 6,  true,  'Cytron 真的很负责，office hour 去了收获很大。课程内容对 CS 新生很友好，不会太难。Studio 的形式很有意思，比纯听课好多了。'),
  ('cse131',  'Bill Siever',  'Spring 2024', 'A-', 4, 3, 10, true,  'Siever 讲课很清晰，但作业量有点多。考试题目很直接，不会出刁钻的题。有编程基础的人会觉得很轻松。'),
  ('cse131',  'Ron Cytron',   'Fall 2023',   'B+', 4, 3, 9,  true,  '零基础入门还是有点压力的，但整体教得很好。建议提前熟悉一下 Java 语法。'),
  ('cse247',  'Tao Ju',       'Fall 2024',   'A-', 4, 5, 15, true,  'Tao Ju 讲课逻辑超级清晰，PPT 做得很好。但课程本身真的硬核，每次 PA 都要花一整个周末。考试压力也大，但学完之后做 Leetcode 感觉开窍了。'),
  ('cse247',  'Tao Ju',       'Spring 2024', 'B',  3, 5, 16, false, '内容很重要但学起来真的痛苦。期末周同时要交 PA 还要复习考试，时间管理很重要。建议大二再选，大一直接上容易崩。'),
  ('math233', 'Gary Jensen',  'Fall 2024',   'A',  4, 4, 10, true,  'Jensen 老爷子讲课很有激情，板书很工整。考试题目和作业风格基本一致，不会出意外。建议把往年考题都刷一遍，性价比最高。'),
  ('math233', 'John McCarthy','Spring 2024', 'B+', 3, 4, 11, true,  'McCarthy 讲课比较快，跟不上就去看录像。作业量适中，考试偏难。多维积分那块要多练。'),
  ('econ1011','Werner Troesken','Fall 2024', 'A',  5, 2, 4,  true,  '这个课真的太轻松了，Troesken 讲课很幽默，期中期末都是选择题。完全不需要死记硬背，理解概念就行。GPA 神课。'),
  ('econ1011','Alvin Murphy', 'Spring 2024', 'A-', 4, 3, 6,  true,  'Murphy 讲课更严格一点，会用一些数学模型，比较适合打算深入学经济的同学。考试有计算题，不完全是选择。'),
  ('cse330',  'Doug Shook',   'Fall 2024',   'A',  5, 3, 12, true,  'WashU CSE 最值得上的课没有之一。Shook 老师超级 nice，有问题随时回复。期末做的项目直接放简历，面试被问了好几次。学到的东西比很多理论课加起来还实用。'),
  ('cse330',  'Doug Shook',   'Spring 2024', 'A',  5, 3, 13, true,  '每周都在做有意思的东西，从来不觉得无聊。作业多但不痛苦，因为做的都是真实的 web 功能。强烈建议大二/大三就选。'),
  ('psyc101', 'Randy Larsen', 'Fall 2024',   'A',  4, 2, 4,  true,  'Larsen 讲课很吸引人，内容也很有意思。考试全是选择题，认真听课就能过。适合作为通识课轻松拿 A。'),
  ('biol2960','Sarah Elgin',  'Fall 2024',   'B+', 4, 4, 12, true,  'Elgin 是这个领域的大牛，讲课很专业。但课程内容真的很多，记忆量很大。建议提前开始复习，不要压到考试前。往年考题非常有参考价值。'),
  ('biol2960','Lilianna Solnica-Krezel','Spring 2024','B',3,4,11,false,'内容量太大了，每周要吸收大量新知识。考试题型变化多，往年题不一定完全对应。需要真的理解，不能只靠背。'),
  ('econ4011','Alvin Murphy', 'Fall 2024',   'A-', 4, 4, 13, true,  'Murphy 讲得很系统，从 OLS 到 IV 到 panel data 一步步来。作业用 R，一开始有点痛苦，熟了之后很顺手。对找 quant/data science 岗位很有帮助。');
