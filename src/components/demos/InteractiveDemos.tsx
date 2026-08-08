import { useMemo, useState, type ReactNode } from "react";
import type { DemoKind } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Play, Shield, ShieldOff } from "lucide-react";

/**
 * Nest 概念交互 Demo（浏览器内模拟，非真实 Nest 进程）。
 */
export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            交互 Demo · 概念模拟
          </p>
          <h3 className="mt-0.5 font-display text-base font-semibold text-fg">{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted transition-colors hover:text-fg"
        >
          {collapsed ? "展开" : "收起"}
          {collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div className="p-4 sm:p-5">
        {hint ? <p className="mb-4 text-sm text-muted">{hint}</p> : null}
        {!collapsed ? (
          <DemoBody kind={kind} />
        ) : (
          <p className="text-sm text-muted">已收起 — 展开后可继续操作。</p>
        )}
      </div>
    </section>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg border border-border bg-bg p-3 sm:p-4", className)}>
      {children}
    </div>
  );
}

function Log({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-code-bg p-3 font-mono text-[11px] leading-relaxed text-code-fg">
      {lines.length ? lines.join("\n") : "// 等待操作…"}
    </pre>
  );
}

function DemoBody({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "hello":
      return <HelloDemo />;
    case "module-graph":
      return <ModuleGraphDemo />;
    case "controller":
      return <ControllerDemo />;
    case "provider-di":
      return <DiDemo />;
    case "dto-validation":
      return <DtoDemo />;
    case "pipe":
      return <PipeDemo />;
    case "guard":
      return <GuardDemo />;
    case "interceptor":
      return <InterceptorDemo />;
    case "exception":
      return <ExceptionDemo />;
    case "middleware":
      return <LifecycleDemo />;
    case "crud":
      return <CrudDemo />;
    case "jwt":
      return <JwtDemo />;
    case "config":
      return <ConfigDemo />;
    case "lifecycle":
      return <HooksDemo />;
    case "testing":
      return <TestingDemo />;
    default:
      return <p className="text-sm text-muted">未知 Demo：{kind}</p>;
  }
}

function HelloDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [res, setRes] = useState<string>("");

  function hit() {
    setLog((l) =>
      [...l, "→ GET /", "  AppController.hello()", "← 200 { message: 'Hello Nest' }"].slice(-12),
    );
    setRes(JSON.stringify({ message: "Hello Nest" }, null, 2));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">模拟最小 Controller 对根路径的响应。</p>
      <Button onClick={hit}>
        <Play className="h-4 w-4" />
        发送 GET /
      </Button>
      {res ? (
        <Panel>
          <p className="text-xs text-subtle">Response body</p>
          <pre className="mt-1 font-mono text-sm text-primary">{res}</pre>
        </Panel>
      ) : null}
      <Log lines={log} />
    </div>
  );
}

function ModuleGraphDemo() {
  const [exportService, setExportService] = useState(true);
  const [importCats, setImportCats] = useState(true);
  const canInject = exportService && importCats;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        OrdersService 想注入 CatsService：需要 CatsModule.exports + OrdersModule.imports。
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setExportService((v) => !v)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium",
            exportService ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
          )}
        >
          CatsModule exports CatsService: {exportService ? "ON" : "OFF"}
        </button>
        <button
          type="button"
          onClick={() => setImportCats((v) => !v)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium",
            importCats ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
          )}
        >
          OrdersModule imports CatsModule: {importCats ? "ON" : "OFF"}
        </button>
      </div>
      <Panel>
        <p className="font-mono text-xs text-muted">DI resolve OrdersService → CatsService</p>
        <p className={cn("mt-2 text-sm font-semibold", canInject ? "text-primary" : "text-danger")}>
          {canInject ? "✓ 注入成功" : "✗ Nest 报 UnknownDependenciesException"}
        </p>
      </Panel>
    </div>
  );
}

function ControllerDemo() {
  const routes = [
    { method: "GET", path: "/cats", handler: "findAll" },
    { method: "GET", path: "/cats/:id", handler: "findOne" },
    { method: "POST", path: "/cats", handler: "create" },
  ];
  const [input, setInput] = useState("GET /cats/3");
  const match = useMemo(() => {
    const m = input.trim().match(/^(GET|POST|PATCH|PUT|DELETE)\s+(\/\S*)/i);
    if (!m) return null;
    const method = m[1]!.toUpperCase();
    const path = m[2]!;
    if (method === "GET" && path === "/cats") return routes[0];
    if (method === "GET" && /^\/cats\/[^/]+$/.test(path)) return routes[1];
    if (method === "POST" && path === "/cats") return routes[2];
    return null;
  }, [input]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">输入请求行，看是否命中 @Controller('cats') 路由。</p>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-fg"
      />
      <div className="flex flex-wrap gap-2">
        {["GET /cats", "GET /cats/3", "POST /cats", "GET /dogs"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setInput(s)}
            className="rounded-full bg-surface-3 px-2.5 py-1 text-[11px] text-muted hover:text-fg"
          >
            {s}
          </button>
        ))}
      </div>
      <Panel>
        {match ? (
          <p className="text-sm">
            命中 <span className="font-mono text-primary">{match.handler}()</span> · {match.method}{" "}
            {match.path}
          </p>
        ) : (
          <p className="text-sm text-danger">404 Cannot {input}</p>
        )}
      </Panel>
    </div>
  );
}

function DiDemo() {
  const [instances, setInstances] = useState(0);
  const [calls, setCalls] = useState(0);

  function createController() {
    if (instances === 0) setInstances(1);
    setCalls((c) => c + 1);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">默认 scope 下，多个 Controller 共享同一个 Service 单例。</p>
      <Button onClick={createController}>new CatsController()（注入 Service）</Button>
      <div className="grid gap-2 sm:grid-cols-2">
        <Panel>
          <p className="text-xs text-subtle">CatsService 实例数</p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">{instances || 0}</p>
        </Panel>
        <Panel>
          <p className="text-xs text-subtle">Controller 构造次数</p>
          <p className="mt-1 font-display text-2xl font-semibold text-fg">{calls}</p>
        </Panel>
      </div>
      <p className="text-xs text-muted">构造多次 Controller，Service 仍是 1 — 这就是 DEFAULT 单例。</p>
    </div>
  );
}

function DtoDemo() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("3");
  const [extra, setExtra] = useState(true);

  const result = useMemo(() => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("name must be longer than 0");
    const ageN = Number(age);
    if (!Number.isInteger(ageN) || ageN < 0) errors.push("age must be int ≥ 0");
    if (errors.length) return { ok: false as const, errors };
    const body: Record<string, unknown> = { name: name.trim(), age: ageN };
    return {
      ok: true as const,
      body,
      stripped: extra ? "extraField 被 whitelist 剥离" : null,
    };
  }, [name, age, extra]);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-muted">
          name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-fg"
          />
        </label>
        <label className="text-xs text-muted">
          age
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 text-sm text-fg"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={extra} onChange={(e) => setExtra(e.target.checked)} />
        body 带 extraField（whitelist 会剥掉）
      </label>
      <Panel>
        {result.ok ? (
          <div>
            <p className="text-sm text-primary">200 校验通过</p>
            <pre className="mt-1 font-mono text-xs">{JSON.stringify(result.body, null, 2)}</pre>
            {result.stripped ? <p className="mt-1 text-xs text-muted">{result.stripped}</p> : null}
          </div>
        ) : (
          <div>
            <p className="text-sm text-danger">400 Bad Request</p>
            <ul className="mt-1 list-inside list-disc text-xs text-muted">
              {result.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </Panel>
    </div>
  );
}

function PipeDemo() {
  const [raw, setRaw] = useState("42");
  const out = useMemo(() => {
    if (!/^\d+$/.test(raw.trim())) return { ok: false, msg: "ParseIntPipe → 400" };
    return { ok: true, msg: `number ${Number(raw.trim())}` };
  }, [raw]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">@Param('id', ParseIntPipe) 把字符串变成 number。</p>
      <input
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        className="w-full rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm"
      />
      <Panel>
        <p className={cn("text-sm font-medium", out.ok ? "text-primary" : "text-danger")}>{out.msg}</p>
      </Panel>
    </div>
  );
}

function GuardDemo() {
  const [role, setRole] = useState<"guest" | "user" | "admin">("guest");
  const [needAdmin, setNeedAdmin] = useState(true);
  const allowed = needAdmin ? role === "admin" : role !== "guest";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["guest", "user", "admin"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              role === r ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
            )}
          >
            身份: {r}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={needAdmin} onChange={(e) => setNeedAdmin(e.target.checked)} />
        路由要求 @Roles('admin')
      </label>
      <Panel className="flex items-center gap-3">
        {allowed ? (
          <Shield className="h-8 w-8 text-primary" />
        ) : (
          <ShieldOff className="h-8 w-8 text-danger" />
        )}
        <div>
          <p className={cn("text-sm font-semibold", allowed ? "text-primary" : "text-danger")}>
            {allowed ? "canActivate → true" : "canActivate → false → 403"}
          </p>
          <p className="text-xs text-muted">Guard 在 Pipe 之前执行</p>
        </div>
      </Panel>
    </div>
  );
}

function InterceptorDemo() {
  const [wrapped, setWrapped] = useState<string>("");

  function run() {
    const data = { id: 1, name: "Mimi" };
    setWrapped(JSON.stringify({ success: true, data }, null, 2));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">TransformInterceptor 用 map 包装 Handler 返回值。</p>
      <Button onClick={run}>执行 Handler + Interceptor</Button>
      {wrapped ? (
        <Panel>
          <pre className="font-mono text-xs text-primary">{wrapped}</pre>
        </Panel>
      ) : null}
    </div>
  );
}

function ExceptionDemo() {
  const [out, setOut] = useState("");

  function boom() {
    setOut(
      JSON.stringify(
        {
          statusCode: 404,
          message: "Cat #9 not found",
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      ),
    );
  }

  return (
    <div className="space-y-3">
      <Button variant="secondary" onClick={boom}>
        throw new NotFoundException()
      </Button>
      {out ? (
        <Panel>
          <p className="text-xs text-danger">ExceptionFilter 输出</p>
          <pre className="mt-1 font-mono text-xs">{out}</pre>
        </Panel>
      ) : null}
    </div>
  );
}

function LifecycleDemo() {
  const steps = [
    "Middleware",
    "Guards",
    "Interceptors (before)",
    "Pipes",
    "Handler",
    "Interceptors (after)",
    "Exception Filter?",
  ];
  const [i, setI] = useState(0);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setI((v) => Math.min(v + 1, steps.length - 1))}>下一步</Button>
        <Button variant="secondary" onClick={() => setI(0)}>
          重置
        </Button>
      </div>
      <ol className="space-y-1">
        {steps.map((s, idx) => (
          <li
            key={s}
            className={cn(
              "rounded-md px-3 py-2 font-mono text-xs",
              idx === i
                ? "bg-primary-soft text-primary"
                : idx < i
                  ? "bg-surface-2 text-muted"
                  : "text-subtle",
            )}
          >
            {idx + 1}. {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function CrudDemo() {
  const [items, setItems] = useState<{ id: number; title: string }[]>([
    { id: 1, title: "First note" },
  ]);
  const [title, setTitle] = useState("");
  const [seq, setSeq] = useState(2);

  function create() {
    if (!title.trim()) return;
    setItems((list) => [...list, { id: seq, title: title.trim() }]);
    setSeq((s) => s + 1);
    setTitle("");
  }

  function remove(id: number) {
    setItems((list) => list.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
          className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 text-sm"
        />
        <Button onClick={create}>POST</Button>
      </div>
      <ul className="space-y-2">
        {items.map((n) => (
          <li
            key={n.id}
            className="flex items-center justify-between rounded-md border border-border bg-bg px-3 py-2 text-sm"
          >
            <span className="font-mono text-xs text-subtle">#{n.id}</span>
            <span className="flex-1 px-2 text-fg">{n.title}</span>
            <button
              type="button"
              onClick={() => remove(n.id)}
              className="text-xs text-danger hover:underline"
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function JwtDemo() {
  const [token, setToken] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  function login() {
    const t = `ey.demo.${Date.now().toString(36)}`;
    setToken(t);
    setLog((l) => [...l, "POST /auth/login → 200 + access_token"].slice(-8));
  }

  function me() {
    if (!token) {
      setLog((l) => [...l, "GET /me → 401 Unauthorized"].slice(-8));
      return;
    }
    setLog((l) =>
      [...l, `GET /me Authorization: Bearer ${token.slice(0, 16)}… → 200`].slice(-8),
    );
  }

  function logout() {
    setToken(null);
    setLog((l) => [...l, "客户端丢弃 token（无状态 JWT 服务端可不存）"].slice(-8));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button onClick={login}>登录签发 JWT</Button>
        <Button variant="secondary" onClick={me}>
          带 Token 访问 /me
        </Button>
        <Button variant="secondary" onClick={logout}>
          退出
        </Button>
      </div>
      <Panel>
        <p className="text-xs text-subtle">当前 token</p>
        <p className="mt-1 break-all font-mono text-xs text-primary">{token ?? "（无）"}</p>
      </Panel>
      <Log lines={log} />
    </div>
  );
}

function ConfigDemo() {
  const [port, setPort] = useState("3000");
  const [secret, setSecret] = useState("super-secret");
  const valid = secret.trim().length >= 8 && /^\d+$/.test(port);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-muted">
          PORT
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-sm"
          />
        </label>
        <label className="text-xs text-muted">
          JWT_SECRET
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-bg px-2 py-1.5 font-mono text-sm"
          />
        </label>
      </div>
      <Panel>
        <p className={cn("text-sm font-medium", valid ? "text-primary" : "text-danger")}>
          {valid
            ? `ConfigService OK · listen(${port})`
            : "Joi/Zod 校验失败：应用拒绝启动"}
        </p>
      </Panel>
    </div>
  );
}

function HooksDemo() {
  const order = [
    "constructor",
    "onModuleInit",
    "onApplicationBootstrap",
    "… running …",
    "onModuleDestroy",
    "beforeApplicationShutdown",
    "onApplicationShutdown",
  ];
  const [i, setI] = useState(0);

  return (
    <div className="space-y-3">
      <Button onClick={() => setI((v) => (v + 1) % order.length)}>推进生命周期</Button>
      <ul className="space-y-1">
        {order.map((s, idx) => (
          <li
            key={s}
            className={cn(
              "rounded-md px-3 py-1.5 font-mono text-xs",
              idx === i ? "bg-primary-soft text-primary" : "text-muted",
            )}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestingDemo() {
  const [useMock, setUseMock] = useState(true);
  const result = useMock ? "findOne → { id: 1, name: 'mock' }  ✓ 单测绿" : "连真实 DB… 慢且脆";

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={useMock} onChange={(e) => setUseMock(e.target.checked)} />
        TestingModule 用 useValue mock Repository
      </label>
      <Panel>
        <p className="text-sm text-fg">{result}</p>
      </Panel>
    </div>
  );
}
