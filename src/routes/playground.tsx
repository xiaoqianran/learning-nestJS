import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { NEST_PRESETS, getPreset } from "@/data/nest-presets";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Code2, Play, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaygroundSearch = {
  example?: string;
};

export const Route = createFileRoute("/playground")({
  validateSearch: (search: Record<string, unknown>): PlaygroundSearch => ({
    example:
      typeof search.example === "string" && search.example.length > 0
        ? search.example
        : undefined,
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const { example } = Route.useSearch();
  const [activeId, setActiveId] = useState(example ?? "hello");
  const [fileIdx, setFileIdx] = useState(0);
  const [ran, setRan] = useState(false);
  const preset = useMemo(() => getPreset(activeId), [activeId]);
  const file = preset.files[Math.min(fileIdx, preset.files.length - 1)]!;

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          v1 · Nest 代码工场
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          代码工场
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          精选 Nest 片段（Controller / Service / DTO / Guard）。浏览器内模拟 HTTP 响应，便于对照请求与返回——完整编译请在本地{" "}
          <code className="rounded-sm bg-surface-3 px-1.5 py-0.5 font-mono text-xs text-primary">
            nest start
          </code>
          。
        </p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {NEST_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setActiveId(p.id);
              setFileIdx(0);
              setRan(false);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
              activeId === p.id
                ? "bg-primary text-primary-fg"
                : "bg-surface-3 text-muted hover:text-fg",
            )}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-medium text-fg">{preset.title}</span>
          <span className="text-muted"> · {preset.summary}</span>
        </div>
        <Button
          size="sm"
          onClick={() => setRan(true)}
        >
          <Play className="h-3.5 w-3.5" />
          模拟运行
        </Button>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {preset.files.map((f, i) => (
          <button
            key={f.name}
            type="button"
            onClick={() => setFileIdx(i)}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-[11px]",
              i === fileIdx ? "bg-primary-soft text-primary" : "bg-surface-2 text-muted",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <CodeBlock code={file.code} title={file.name} lang="ts" />

      {ran ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted">
            <Terminal className="h-3.5 w-3.5 text-primary" />
            模拟 HTTP
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-subtle">Request</p>
              <p className="mt-1 font-mono text-sm text-fg">
                {preset.run.method} {preset.run.path}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-subtle">Status</p>
              <p
                className={cn(
                  "mt-1 font-mono text-sm font-semibold",
                  preset.run.status < 400 ? "text-primary" : "text-danger",
                )}
              >
                {preset.run.status}
              </p>
            </div>
          </div>
          <pre className="border-t border-border bg-code-bg p-4 font-mono text-xs text-code-fg">
            {JSON.stringify(preset.run.body, null, 2)}
          </pre>
        </div>
      ) : null}

      <aside className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { t: "读源码", d: "左侧标签切换多文件；复制到本地 nest 项目即可运行。" },
          { t: "模拟响应", d: "点「模拟运行」看预期 HTTP 状态与 JSON body。" },
          { t: "真实验证", d: "工坊 /studio 用 MSW 模拟完整登录 + 笔记 CRUD。" },
        ].map((item) => (
          <div key={item.t} className="rounded-lg border border-border bg-surface-2 px-3.5 py-3">
            <p className="text-sm font-medium text-fg">{item.t}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{item.d}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
