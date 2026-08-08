import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS, getLessonsByTrack } from "@/data/lessons";
import { useProgress } from "@/store/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Sparkles,
  Search,
  Library,
  BookMarked,
  Server,
  Code2,
  FlaskConical,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  completedCount,
  getContinueLesson,
  isAllComplete,
  orderedTracks,
  progressPercent,
  TRACK_META,
  trackLabel,
} from "@/lib/nav";

export const Route = createFileRoute("/")({
  component: HomePage,
});

type TrackFilter = "全部" | (typeof LESSONS)[number]["track"];

function HomePage() {
  const completed = useProgress((s) => s.completed);
  const streak = useProgress((s) => s.streak);
  const [q, setQ] = useState("");
  const [track, setTrack] = useState<TrackFilter>("全部");

  const progress = progressPercent(completed);
  const doneCount = completedCount(completed);
  const cont = getContinueLesson(completed);
  const contIdx = LESSONS.findIndex((l) => l.slug === cont.slug);
  const allDone = isAllComplete(completed);

  const filtered = useMemo(() => {
    let list = track === "全部" ? LESSONS : getLessonsByTrack(track);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(s) ||
          l.summary.toLowerCase().includes(s) ||
          l.slug.includes(s),
      );
    }
    return list;
  }, [q, track]);

  const pathCards = orderedTracks().map((t) => {
    const list = getLessonsByTrack(t);
    const done = list.filter((l) => completed.includes(l.slug)).length;
    return {
      track: t,
      ...TRACK_META[t],
      done,
      total: list.length,
      pct: list.length ? Math.round((done / list.length) * 100) : 0,
    };
  });

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <section className="relative overflow-hidden rounded-xl border border-border bg-surface px-5 py-8 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px 200px at 10% -10%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg/60 px-2.5 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              v1 · Nest 交互教程
            </p>
            {streak > 0 ? (
              <span className="rounded-full bg-surface-3 px-2.5 py-1 font-mono text-xs text-muted">
                连续 {streak} 天
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl">
            带你系统学 NestJS
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            讲解 → TypeScript 源码 → 交互 Demo → 测验（≥80% 掌握）。对照官网{" "}
            <Link to="/docs" className="text-primary no-underline hover:underline">
              文档地图
            </Link>
            ，在工坊里练 JWT + CRUD。
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {allDone ? (
              <Link to="/certificate" className="no-underline">
                <Button size="lg" className="w-full sm:w-auto">
                  领取结业证明
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/lesson/$slug" params={{ slug: cont.slug }} className="no-underline">
                <Button size="lg" className="w-full sm:w-auto">
                  {doneCount > 0 ? "继续学习" : "从第一节开始"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/hub" className="no-underline">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <LayoutDashboard className="h-4 w-4" />
                学习中心
              </Button>
            </Link>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-bg/50 p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-subtle">
              {allDone ? "全部完成" : `下一课 · ${trackLabel(cont.track)}`}
            </p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-fg">
                  {allDone ? "可以生成结业证明" : cont.title}
                </p>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                  {allDone ? "想复习可从下方路径点回任意一课。" : cont.summary}
                </p>
              </div>
              {!allDone ? (
                <span className="shrink-0 font-mono text-xs text-subtle">
                  #{String(contIdx + 1).padStart(2, "0")} · {cont.minutes} 分
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-surface-3 sm:max-w-xs">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums text-muted">
              {doneCount}/{LESSONS.length}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted">
              <BookOpen className="h-3.5 w-3.5" />约 {LESSONS.reduce((a, l) => a + l.minutes, 0)}{" "}
              分钟
            </span>
            <Link to="/hub" className="text-xs text-primary no-underline hover:underline">
              详细进度 →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2">
        {[
          {
            to: "/docs" as const,
            icon: Library,
            title: "查 · 文档地图",
            desc: "官网章节 ↔ 本站课",
          },
          {
            to: "/cheatsheet" as const,
            icon: BookMarked,
            title: "查 · 速查表",
            desc: "装饰器与管道一览",
          },
          {
            to: "/studio" as const,
            icon: Server,
            title: "练 · API 工坊",
            desc: "模拟 REST / JWT",
          },
          {
            to: "/playground" as const,
            icon: Code2,
            title: "练 · 代码工场",
            desc: "Nest 片段 + 模拟响应",
          },
          {
            to: "/lab" as const,
            icon: FlaskConical,
            title: "练 · 练习场",
            desc: "刷测验题",
          },
          {
            to: "/hub" as const,
            icon: LayoutDashboard,
            title: "我 · 学习中心",
            desc: "进度 · 打卡 · 错题",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.to + item.title}
              to={item.to}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 no-underline transition-colors hover:border-border-strong hover:bg-surface-2"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-fg">{item.title}</span>
                <span className="block text-xs text-muted">{item.desc}</span>
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-fg">七条学习路径</h2>
            <p className="mt-1 text-sm text-muted">建议按 ①→⑤ 主路径学完，⑥⑦ 为扩展与补全</p>
          </div>
        </div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {pathCards.map((p) => (
            <li key={p.track}>
              <button
                type="button"
                onClick={() => {
                  setTrack(p.track);
                  document
                    .getElementById("course-outline")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-border-strong hover:bg-surface-2",
                  track === p.track && "border-primary/40 bg-primary-soft",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-fg">{p.label}</span>
                  <span className="font-mono text-[11px] text-muted">
                    {p.done}/{p.total}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{p.blurb}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full rounded-full bg-primary" style={{ width: p.pct + "%" }} />
                </div>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section id="course-outline" className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-fg">课程大纲</h2>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索课程…"
              className="h-9 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-sm text-fg placeholder:text-subtle"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {(["全部", ...orderedTracks()] as TrackFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrack(t)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                track === t ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
              )}
            >
              {t === "全部" ? "全部" : trackLabel(t)}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.map((lesson) => {
            const idx = LESSONS.findIndex((l) => l.slug === lesson.slug);
            const done = completed.includes(lesson.slug);
            return (
              <li key={lesson.slug}>
                <Link
                  to="/lesson/$slug"
                  params={{ slug: lesson.slug }}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 no-underline transition-colors hover:border-border-strong hover:bg-surface-2 sm:p-4"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium",
                      done ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-fg">{lesson.title}</span>
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] text-primary">
                        {trackLabel(lesson.track)}
                      </span>
                      {lesson.format === "reference" || lesson.track === "官方补全" ? (
                        <span className="text-[10px] text-subtle">知识卡片</span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{lesson.summary}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-subtle">
                      <Clock className="h-3 w-3" />
                      {lesson.minutes} 分 · {lesson.level}
                    </span>
                  </span>
                  <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-subtle" />
                </Link>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="rounded-xl border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
              没有匹配的课程
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
