# Changelog

## [0.2.0] - 2026-04-27

### 新增
- **Supabase 数据库集成**：课程评价存储在 PostgreSQL，完全替代 Google Sheets 方案
- **实时更新**：新评价提交后通过 Supabase Realtime 推送，无需刷新页面即可看到
- **内嵌评价表单**：在课程详情页直接写评价，不再跳转外部链接
  - 星级选择器（鼠标悬停预览）
  - 教授、学期、成绩下拉选择
  - 工作量填写、是否愿意重选切换按钮
  - 提交后自动切换回评价列表
- **Row Level Security（RLS）**：数据库层面限制为只能 INSERT + SELECT，物理上无法删除或修改他人评价
- **初始种子数据**：15 条真实风格的评价预置入数据库

### 修复
- 课程卡片底部 stats 行溢出/截断问题（改用 CSS Grid 4 列布局）

### 技术栈变更
- 移除：Google Sheets API、Google Forms 依赖
- 新增：`@supabase/supabase-js`

---

## [0.1.0] - 2026-04-25

### 新增
- **项目初始化**：React + Vite，部署目标 Vercel
- **首页**：搜索（课号/课名/教授/标签）、按院系和年级筛选、四种排序方式
- **课程详情页**：评分统计（综合/难度/工作量/愿意重选）、按教授筛选评价、Syllabus & Past Exam 下载区
- **8 门 WashU 真实课程 mock 数据**：CSE 131/247/330、MATH 233、ECON 1011/4011、BIOL 2960、PSYC 1010
- **Navbar**：WashU 红色主题
- **WashU 配色系统**：CSS 变量驱动，#a51417 主色
- **Google Sheets API 服务层**（已被 Supabase 替代）

---

## 待办 / 下一步

- [ ] 接入 WashU Bulletin 真实课程数据（~1000+ 门课）
- [ ] Past exam / syllabus 上传功能（Google Drive 或 Supabase Storage）
- [ ] 部署到 Vercel（生产环境）
- [ ] 设置 Supabase 防滥用策略（rate limiting）
- [ ] 移动端响应式优化
