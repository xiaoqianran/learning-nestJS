import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "核心建筑块",
    items: [
      { k: "@Module", v: "imports / controllers / providers / exports" },
      { k: "@Controller('x')", v: "路由前缀；方法上 @Get @Post…" },
      { k: "@Injectable", v: "Provider；constructor 注入" },
      { k: "exports + imports", v: "跨模块共享 Service" },
      { k: "NestFactory.create", v: "main.ts 启动应用" },
    ],
  },
  {
    title: "请求管道",
    items: [
      { k: "顺序", v: "Middleware → Guard → Interceptor前 → Pipe → Handler → …" },
      { k: "Guard", v: "canActivate；鉴权/角色" },
      { k: "Pipe", v: "transform / validate；ParseIntPipe" },
      { k: "Interceptor", v: "RxJS 环绕；日志/包装/缓存" },
      { k: "ExceptionFilter", v: "@Catch；统一错误 JSON" },
      { k: "ValidationPipe", v: "whitelist + transform + DTO" },
    ],
  },
  {
    title: "参数与 DTO",
    items: [
      { k: "@Param @Query @Body", v: "路径 / 查询 / 体" },
      { k: "CreateXxxDto", v: "class-validator 装饰器" },
      { k: "PartialType", v: "UpdateDto 全可选" },
      { k: "@HttpCode @Header", v: "状态码与响应头" },
      { k: "@Exclude", v: "序列化隐藏 password" },
    ],
  },
  {
    title: "鉴权",
    items: [
      { k: "AuthGuard('jwt')", v: "Passport 策略" },
      { k: "Bearer token", v: "Authorization 头" },
      { k: "@Public()", v: "跳过全局 JwtAuthGuard" },
      { k: "RolesGuard", v: "Reflector 读元数据" },
      { k: "helmet + CORS", v: "安全头与源白名单" },
    ],
  },
  {
    title: "配置 · 数据 · 测试",
    items: [
      { k: "ConfigModule", v: "forRoot + ConfigService" },
      { k: "TypeORM/Prisma", v: "forFeature / PrismaService" },
      { k: "TestingModule", v: "useValue mock 依赖" },
      { k: "e2e + supertest", v: "打真实 HTTP 栈" },
      { k: "enableShutdownHooks", v: "SIGTERM 优雅退出" },
    ],
  },
  {
    title: "工程",
    items: [
      { k: "nest g resource", v: "一站生成 CRUD 骨架" },
      { k: "nest build", v: "产出 dist/main" },
      { k: "Swagger", v: "DocumentBuilder + setup('api')" },
      { k: "VersioningType.URI", v: "/v1/... 版本" },
      { k: "docs.nestjs.com", v: "权威文档" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          一页纸
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">NestJS 速查表</h1>
        <p className="mt-2 text-sm text-muted">
          写接口时扫一眼。细节回{" "}
          <Link to="/docs" className="text-primary no-underline hover:underline">
            文档地图
          </Link>{" "}
          或{" "}
          <a
            href="https://docs.nestjs.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary no-underline hover:underline"
          >
            docs.nestjs.com
          </a>
          。
        </p>
      </header>

      <div className="space-y-4">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="overflow-hidden rounded-xl border border-border bg-surface">
            <h2 className="border-b border-border bg-surface-2 px-4 py-2.5 font-display text-sm font-semibold">
              {sec.title}
            </h2>
            <ul className="divide-y divide-border">
              {sec.items.map((it) => (
                <li key={it.k} className="grid gap-1 px-4 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-3">
                  <code className="font-mono text-xs text-primary">{it.k}</code>
                  <span className="text-sm text-muted">{it.v}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
