export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "hello"
  | "module-graph"
  | "controller"
  | "provider-di"
  | "dto-validation"
  | "pipe"
  | "guard"
  | "interceptor"
  | "exception"
  | "middleware"
  | "crud"
  | "jwt"
  | "config"
  | "lifecycle"
  | "testing";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "请求管道" | "数据与 REST" | "鉴权与安全" | "工程化" | "微服务" | "官方补全";
  format?: "course" | "reference";
  minutes: number;
  /** 官网路径（相对 docs.nestjs.com），如 /controllers */
  official?: string;
  blocks: LessonBlock[];
};

export const TRACKS: Lesson["track"][] = [
  "基础",
  "请求管道",
  "数据与 REST",
  "鉴权与安全",
  "工程化",
  "微服务",
  "官方补全",
];

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "NestJS 是什么",
    summary: "渐进式 Node 后端框架：模块、装饰器、依赖注入。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "/",
    blocks: [
      {
        type: "text",
        title: "为什么是 Nest",
        body: "NestJS 用 TypeScript + 装饰器，把 Express/Fastify 包成「可测试、可扩展」的应用架构。核心隐喻来自 Angular：Module 组织边界，Controller 接 HTTP，Provider 装业务，通过 DI 注入。\n\n学习方法：看源码 → 点 Demo 模拟请求 → 做测验。",
      },
      {
        type: "code",
        title: "最小应用",
        lang: "ts",
        code: `// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  hello() {
    return { message: 'Hello Nest' };
  }
}`,
      },
      { type: "demo", kind: "hello", title: "动手：发一次 GET /" },
      {
        type: "tip",
        body: "Nest 默认底层是 Express；也可换 Fastify。业务代码尽量不绑死底层 API。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "Nest 的组织方式更接近？",
            options: ["纯脚本拼装", "模块 + 装饰器 + DI", "仅 class 无装饰器", "只写路由文件"],
            answer: 1,
            explain: "Module / Controller / Provider + DI。",
          },
          {
            id: "i2",
            question: "Controller 主要职责？",
            options: ["连数据库", "接 HTTP 并委托业务", "画页面", "管进程"],
            answer: 1,
            explain: "路由与入参，业务放 Service。",
          },
        ],
      },
    ],
  },
  {
    slug: "cli-first-app",
    title: "CLI 与项目骨架",
    summary: "nest new / nest g · 目录约定。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "/cli/overview",
    blocks: [
      {
        type: "text",
        title: "从 CLI 开始",
        body: "`@nestjs/cli` 是官方脚手架。`nest new` 生成完整项目；`nest g resource notes` 可一次生成 module/controller/service/DTO。\n\nsrc/ 下常见：main.ts 入口、app.module.ts 根模块、*.module / *.controller / *.service。",
      },
      {
        type: "code",
        title: "常用命令",
        lang: "bash",
        code: `npm i -g @nestjs/cli
nest new learning-nest
cd learning-nest
nest g module cats
nest g controller cats
nest g service cats
# 或一站式 REST 资源
nest g resource cats --no-spec
npm run start:dev`,
      },
      {
        type: "tip",
        body: "开发用 start:dev（watch）；生产用 nest build + node dist/main。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "生成模块的 CLI？",
            options: ["nest make module", "nest g module", "nest new module", "npm module"],
            answer: 1,
            explain: "nest generate / nest g。",
          },
          {
            id: "c2",
            question: "根模块文件通常是？",
            options: ["index.ts", "app.module.ts", "server.js", "routes.ts"],
            answer: 1,
            explain: "AppModule 挂到 NestFactory.create。",
          },
        ],
      },
    ],
  },
  {
    slug: "modules",
    title: "模块 Module",
    summary: "imports / controllers / providers / exports。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "/modules",
    blocks: [
      {
        type: "text",
        title: "模块是边界",
        body: "每个功能域一个 Module。providers 仅本模块可见；要给别的模块用，必须 exports。imports 引入其他模块的 exports。\n\n根 AppModule 组装全局图；业务模块保持小而内聚。",
      },
      {
        type: "code",
        title: "CatsModule",
        lang: "ts",
        code: `import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService], // 其他模块才能注入 CatsService
})
export class CatsModule {}

// app.module.ts
@Module({
  imports: [CatsModule],
})
export class AppModule {}`,
      },
      { type: "demo", kind: "module-graph", title: "动手：模块依赖图" },
      {
        type: "quiz",
        questions: [
          {
            id: "m1",
            question: "跨模块注入 Service 需要？",
            options: ["只写 providers", "exports + imports", "全局变量", "在 controller  new"],
            answer: 1,
            explain: "提供方 exports，使用方 imports。",
          },
          {
            id: "m2",
            question: "controllers 数组放什么？",
            options: ["任意 class", "路由控制器", "中间件", "实体"],
            answer: 1,
            explain: "Controller 负责路由。",
          },
        ],
      },
    ],
  },
  {
    slug: "controllers",
    title: "控制器 Controller",
    summary: "@Get @Post · 路径 · 参数装饰器。",
    level: "入门",
    track: "基础",
    minutes: 12,
    official: "/controllers",
    blocks: [
      {
        type: "text",
        title: "路由映射",
        body: "`@Controller('cats')` 设前缀。方法上 `@Get()`、`@Post()`、`@Get(':id')` 等映射动词与路径。\n\n参数：`@Param('id')`、`@Query()`、`@Body()`、`@Headers()`、`@Req()`。尽量用 DTO 而不是裸 any。",
      },
      {
        type: "code",
        title: "REST 控制器",
        lang: "ts",
        code: `@Controller('cats')
export class CatsController {
  constructor(private readonly cats: CatsService) {}

  @Get()
  findAll(@Query('tag') tag?: string) {
    return this.cats.findAll(tag);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cats.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCatDto) {
    return this.cats.create(dto);
  }
}`,
      },
      { type: "demo", kind: "controller", title: "动手：路由匹配" },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "取路径参数 id？",
            options: ["@Query('id')", "@Param('id')", "@Body('id')", "@Header('id')"],
            answer: 1,
            explain: "@Param。",
          },
          {
            id: "r2",
            question: "Controller 里写重业务？",
            options: ["推荐", "应下沉到 Service", "必须写 SQL", "只能写 static"],
            answer: 1,
            explain: "薄控制器、厚服务。",
          },
        ],
      },
    ],
  },
  {
    slug: "providers",
    title: "Provider 与依赖注入",
    summary: "@Injectable · constructor 注入 · 自定义 token。",
    level: "入门",
    track: "基础",
    minutes: 12,
    official: "/providers",
    blocks: [
      {
        type: "text",
        title: "DI 是核心",
        body: "Service 标 `@Injectable()`，在 module providers 注册后，可在 constructor 注入。Nest 容器解析依赖图，方便单测 mock。\n\n自定义：`{ provide: 'CONFIG', useValue }` / `useFactory` / `useClass`。",
      },
      {
        type: "code",
        title: "注入示例",
        lang: "ts",
        code: `@Injectable()
export class CatsService {
  private items: Cat[] = [];
  findAll() { return this.items; }
  create(dto: CreateCatDto) {
    const cat = { id: Date.now(), ...dto };
    this.items.push(cat);
    return cat;
  }
}

@Controller('cats')
export class CatsController {
  // Nest 注入同一 CatsService 单例（默认 scope）
  constructor(private readonly cats: CatsService) {}
}`,
      },
      { type: "demo", kind: "provider-di", title: "动手：DI 容器" },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "Service 要被注入需？",
            options: ["export 即可", "@Injectable + providers 注册", "写 global", "继承 Controller"],
            answer: 1,
            explain: "装饰器 + 模块注册。",
          },
          {
            id: "p2",
            question: "useFactory 适合？",
            options: ["写 UI", "异步/条件创建依赖", "替代 Controller", "关 DI"],
            answer: 1,
            explain: "工厂可 async、可读 config。",
          },
        ],
      },
    ],
  },
  {
    slug: "request-lifecycle",
    title: "请求生命周期",
    summary: "Middleware → Guards → Interceptors → Pipes → Handler → …",
    level: "入门",
    track: "请求管道",
    minutes: 10,
    official: "/faq/request-lifecycle",
    blocks: [
      {
        type: "text",
        title: "一条请求怎么走",
        body: "顺序（简化）：中间件 → 守卫 → 拦截器(前) → 管道(校验/转换) → 路由处理器 → 拦截器(后) → 异常过滤器（出错时）→ 响应。\n\n搞清顺序才能正确放鉴权、日志、校验。",
      },
      {
        type: "code",
        title: "心智模型",
        lang: "text",
        code: `Incoming request
  → Middleware
  → Guards          // canActivate?
  → Interceptors    // before
  → Pipes           // transform / validate
  → Controller method
  → Interceptors    // after / map
  → Exception filters (if thrown)
  → Response`,
      },
      { type: "demo", kind: "middleware", title: "动手：管道顺序" },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "鉴权 Guard 相对 Pipe？",
            options: ["在 Pipe 之后", "在 Pipe 之前", "同时", "无关"],
            answer: 1,
            explain: "Guard 先于 Pipe。",
          },
          {
            id: "l2",
            question: "校验 body 用？",
            options: ["仅 Middleware", "Pipe（常 ValidationPipe）", "只能 Guard", "Filter"],
            answer: 1,
            explain: "ValidationPipe + class-validator。",
          },
        ],
      },
    ],
  },
  {
    slug: "middleware",
    title: "中间件 Middleware",
    summary: "函数/类中间件 · 绑定路由。",
    level: "进阶",
    track: "请求管道",
    minutes: 8,
    official: "/middleware",
    blocks: [
      {
        type: "text",
        title: "贴近 Express",
        body: "中间件最先执行，可改 req、打日志、短路。类中间件实现 NestMiddleware；在 Module 的 configure(consumer) 里 forRoutes。",
      },
      {
        type: "code",
        title: "LoggerMiddleware",
        lang: "ts",
        code: `@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.method, req.url);
    next();
  }
}

export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "mw1",
            question: "中间件位置？",
            options: ["管道最后", "请求最早一批", "只在响应后", "替代 Controller"],
            answer: 1,
            explain: "生命周期最前。",
          },
        ],
      },
    ],
  },
  {
    slug: "pipes",
    title: "管道 Pipe",
    summary: "转换与校验 · ParseIntPipe · ValidationPipe。",
    level: "进阶",
    track: "请求管道",
    minutes: 12,
    official: "/pipes",
    blocks: [
      {
        type: "text",
        title: "进 Handler 前整形",
        body: "Pipe 实现 `transform(value, metadata)`：转换类型或抛 BadRequestException。内置 ParseIntPipe、ParseUUIDPipe；全局 `ValidationPipe` + DTO 装饰器是标配。",
      },
      {
        type: "code",
        title: "全局校验",
        lang: "ts",
        code: `// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,      // 剥未知字段
    forbidNonWhitelisted: true,
    transform: true,      // 纯对象 → DTO 类实例
  }),
);

// create-cat.dto.ts
export class CreateCatDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @Min(0)
  age: number;
}`,
      },
      { type: "demo", kind: "pipe", title: "动手：Pipe 转换" },
      {
        type: "quiz",
        questions: [
          {
            id: "pi1",
            question: "whitelist: true 作用？",
            options: ["允许任意字段", "去掉 DTO 未声明字段", "关校验", "只校验 query"],
            answer: 1,
            explain: "防批量赋值多余属性。",
          },
        ],
      },
    ],
  },
  {
    slug: "dto-validation",
    title: "DTO 与 class-validator",
    summary: "输入契约 · 装饰器校验。",
    level: "进阶",
    track: "请求管道",
    minutes: 10,
    official: "/techniques/validation",
    blocks: [
      {
        type: "text",
        title: "DTO = 边界契约",
        body: "不要把 Entity 直接当入参。CreateXxxDto / UpdateXxxDto 描述允许字段；配合 ValidationPipe 在边界挡脏数据。",
      },
      {
        type: "code",
        title: "Update 用 PartialType",
        lang: "ts",
        code: `import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
// 所有字段可选，仍带原校验规则`,
      },
      { type: "demo", kind: "dto-validation", title: "动手：校验失败 vs 通过" },
      {
        type: "quiz",
        questions: [
          {
            id: "d1",
            question: "DTO 主要放在？",
            options: ["数据库层内部", "HTTP/边界输入", "仅测试", "前端"],
            answer: 1,
            explain: "入站契约。",
          },
        ],
      },
    ],
  },
  {
    slug: "guards",
    title: "守卫 Guard",
    summary: "canActivate · 角色与鉴权。",
    level: "进阶",
    track: "请求管道",
    minutes: 12,
    official: "/guards",
    blocks: [
      {
        type: "text",
        title: "决定能不能进",
        body: "Guard 返回 boolean / Promise / Observable。常见：AuthGuard('jwt')、RolesGuard。用 `@SetMetadata` + Reflector 读角色。\n\n注意：Guard ≠ 数据权限过滤；细粒度仍要在业务层。",
      },
      {
        type: "code",
        title: "RolesGuard",
        lang: "ts",
        code: `@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles?.length) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return roles.includes(user?.role);
  }
}

@Post()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
create() { /* ... */ }`,
      },
      { type: "demo", kind: "guard", title: "动手：放行 / 拒绝" },
      {
        type: "quiz",
        questions: [
          {
            id: "g1",
            question: "Guard 失败通常？",
            options: ["200 空 body", "抛 403/401", "静默", "转 Pipe"],
            answer: 1,
            explain: "Unauthorized / Forbidden。",
          },
        ],
      },
    ],
  },
  {
    slug: "interceptors",
    title: "拦截器 Interceptor",
    summary: "AOP：日志、缓存、变换响应。",
    level: "进阶",
    track: "请求管道",
    minutes: 10,
    official: "/interceptors",
    blocks: [
      {
        type: "text",
        title: "环绕 Handler",
        body: "`intercept(context, next)` 里 `next.handle()` 返回 Observable，可用 RxJS `map`/`tap`/`timeout`。适合统一包装 `{ data }`、计时日志、缓存。",
      },
      {
        type: "code",
        title: "TransformInterceptor",
        lang: "ts",
        code: `@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(_ctx: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => ({ success: true, data })),
    );
  }
}`,
      },
      { type: "demo", kind: "interceptor", title: "动手：响应包装" },
      {
        type: "quiz",
        questions: [
          {
            id: "it1",
            question: "Interceptor 基于？",
            options: ["仅同步函数", "RxJS Observable", "Generator", "WebSocket 专用"],
            answer: 1,
            explain: "next.handle() 是 Observable。",
          },
        ],
      },
    ],
  },
  {
    slug: "exception-filters",
    title: "异常过滤器",
    summary: "HttpException · 统一错误形状。",
    level: "进阶",
    track: "请求管道",
    minutes: 10,
    official: "/exception-filters",
    blocks: [
      {
        type: "text",
        title: "错误也是契约",
        body: "抛 `NotFoundException` / `BadRequestException` 等；自定义 `@Catch()` Filter 格式化 status + message + timestamp。全局 `app.useGlobalFilters`。",
      },
      {
        type: "code",
        title: "HttpExceptionFilter",
        lang: "ts",
        code: `@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();
    res.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}`,
      },
      { type: "demo", kind: "exception", title: "动手：异常形状" },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: "资源不存在宜抛？",
            options: ["Error 裸抛", "NotFoundException", "只 console", "return null 当 200"],
            answer: 1,
            explain: "语义化 HTTP 异常。",
          },
        ],
      },
    ],
  },
  {
    slug: "rest-crud",
    title: "REST CRUD 实战",
    summary: "资源设计 · Service 内存仓库。",
    level: "实战",
    track: "数据与 REST",
    minutes: 14,
    official: "/controllers",
    blocks: [
      {
        type: "text",
        title: "标准资源",
        body: "GET 列表/详情、POST 创建、PATCH/PUT 更新、DELETE 删除。幂等与状态码：201 Created、204 No Content、404。\n\n先内存 Map 跑通，再换 ORM。",
      },
      {
        type: "code",
        title: "NotesService",
        lang: "ts",
        code: `@Injectable()
export class NotesService {
  private seq = 1;
  private store = new Map<number, Note>();

  create(dto: CreateNoteDto) {
    const note = { id: this.seq++, ...dto, createdAt: new Date() };
    this.store.set(note.id, note);
    return note;
  }
  findAll() { return [...this.store.values()]; }
  findOne(id: number) {
    const n = this.store.get(id);
    if (!n) throw new NotFoundException();
    return n;
  }
  remove(id: number) {
    if (!this.store.delete(id)) throw new NotFoundException();
  }
}`,
      },
      { type: "demo", kind: "crud", title: "动手：CRUD 面板" },
      {
        type: "quiz",
        questions: [
          {
            id: "cr1",
            question: "创建成功常见状态码？",
            options: ["200 仅此", "201", "204", "302"],
            answer: 1,
            explain: "201 Created。",
          },
        ],
      },
    ],
  },
  {
    slug: "databases",
    title: "数据库与 ORM",
    summary: "TypeORM / Prisma 接入思路。",
    level: "实战",
    track: "数据与 REST",
    minutes: 12,
    official: "/techniques/database",
    blocks: [
      {
        type: "text",
        title: "Repository 模式",
        body: "Nest 集成 TypeORM、Prisma、MikroORM、Mongoose 等。原则：Service 依赖抽象（Repository / PrismaService），不在 Controller 写 SQL。\n\n ent 迁移、连接池、事务放工程化阶段加深。",
      },
      {
        type: "code",
        title: "TypeORM 片段",
        lang: "ts",
        code: `@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Cat]),
  ],
  providers: [CatsService],
})
export class CatsModule {}

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private repo: Repository<Cat>,
  ) {}
  findAll() { return this.repo.find(); }
}`,
      },
      {
        type: "tip",
        body: "生产务必关 synchronize，改用 migration。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "db1",
            question: "forFeature 作用？",
            options: ["连库全局", "注册本模块实体仓库", "开 CORS", "写中间件"],
            answer: 1,
            explain: "模块级 Repository 注入。",
          },
        ],
      },
    ],
  },
  {
    slug: "config-env",
    title: "配置 ConfigModule",
    summary: "@nestjs/config · 环境变量 · 校验。",
    level: "进阶",
    track: "数据与 REST",
    minutes: 10,
    official: "/techniques/configuration",
    blocks: [
      {
        type: "text",
        title: "十二要素",
        body: "`ConfigModule.forRoot({ isGlobal: true })` 加载 .env；`ConfigService.get('PORT')`。用 Joi/Zod 校验启动配置，缺关键项直接失败。",
      },
      {
        type: "code",
        title: "配置注入",
        lang: "ts",
        code: `@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}
  secret() { return this.config.getOrThrow<string>('JWT_SECRET'); }
}`,
      },
      { type: "demo", kind: "config", title: "动手：读配置" },
      {
        type: "quiz",
        questions: [
          {
            id: "cf1",
            question: "密钥应放？",
            options: ["提交 git 的源码", "环境变量/密钥管理", "前端 localStorage", "公开 README"],
            answer: 1,
            explain: "Secret 不进仓库。",
          },
        ],
      },
    ],
  },
  {
    slug: "serialization",
    title: "序列化与响应",
    summary: "ClassSerializer · @Exclude · 状态码。",
    level: "进阶",
    track: "数据与 REST",
    minutes: 8,
    official: "/techniques/serialization",
    blocks: [
      {
        type: "text",
        title: "别把密码吐出去",
        body: "`ClassSerializerInterceptor` + `@Exclude()` 隐藏 password 等字段。`@HttpCode`、`@Header`、`@Redirect` 控制响应细节。",
      },
      {
        type: "code",
        title: "Entity 排除字段",
        lang: "ts",
        code: `export class UserEntity {
  id: number;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

// 返回 new UserEntity(user) + ClassSerializerInterceptor`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "s1",
            question: "隐藏 password 常用？",
            options: ["@Exclude + Serializer", "前端不显示即可", "delete 全局", "关 HTTPS"],
            answer: 0,
            explain: "服务端序列化层剥离。",
          },
        ],
      },
    ],
  },
  {
    slug: "auth-jwt",
    title: "JWT 鉴权",
    summary: "Passport · JwtModule · 策略。",
    level: "实战",
    track: "鉴权与安全",
    minutes: 14,
    official: "/security/authentication",
    blocks: [
      {
        type: "text",
        title: "无状态会话",
        body: "登录校验密码 → 签发 JWT → 客户端 Authorization: Bearer。JwtStrategy 校验签名与过期，把 user 挂到 request。\n\n刷新令牌、黑名单是进阶；先跑通 access token。",
      },
      {
        type: "code",
        title: "JwtStrategy",
        lang: "ts",
        code: `@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }
  validate(payload: { sub: number; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}

@UseGuards(AuthGuard('jwt'))
@Get('me')
me(@Request() req) {
  return req.user;
}`,
      },
      { type: "demo", kind: "jwt", title: "动手：Bearer 流程" },
      {
        type: "quiz",
        questions: [
          {
            id: "j1",
            question: "JWT 默认适合？",
            options: ["服务端 Session 唯一方案", "无状态 API 鉴权", "替代 HTTPS", "存大文件"],
            answer: 1,
            explain: "签名的 claims，常无状态。",
          },
        ],
      },
    ],
  },
  {
    slug: "auth-guards-deep",
    title: "公开路由与角色",
    summary: "@Public · Roles · 组合守卫。",
    level: "实战",
    track: "鉴权与安全",
    minutes: 10,
    official: "/security/authorization",
    blocks: [
      {
        type: "text",
        title: "默认锁定，显式公开",
        body: "全局 JwtAuthGuard + `@Public()` 元数据跳过；管理接口叠加 RolesGuard。组合顺序：先认证再授权。",
      },
      {
        type: "code",
        title: "Public 装饰器",
        lang: "ts",
        code: `export const IS_PUBLIC = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }
  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ag1",
            question: "登录接口应？",
            options: ["必须 JWT", "标 @Public 免鉴权", "只用角色", "关 Guard 全局"],
            answer: 1,
            explain: "登录本身不能要求已登录。",
          },
        ],
      },
    ],
  },
  {
    slug: "security-basics",
    title: "安全基础",
    summary: "Helmet · CORS · 限流 · 校验。",
    level: "实战",
    track: "鉴权与安全",
    minutes: 10,
    official: "/security/helmet",
    blocks: [
      {
        type: "text",
        title: "默认不安全要补齐",
        body: "helmet 设安全头；enableCors 白名单来源；@nestjs/throttler 限流；永远校验输入；密码 bcrypt；密钥轮换。",
      },
      {
        type: "code",
        title: "main 安全片段",
        lang: "ts",
        code: `const app = await NestFactory.create(AppModule);
app.use(helmet());
app.enableCors({ origin: ['https://app.example.com'], credentials: true });
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
await app.listen(process.env.PORT ?? 3000);`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sec1",
            question: "CORS origin: true 生产？",
            options: ["很安全", "过宽，应白名单", "替代 JWT", "关 HTTPS"],
            answer: 1,
            explain: "明确允许的前端源。",
          },
        ],
      },
    ],
  },
  {
    slug: "testing",
    title: "测试",
    summary: "TestingModule · mock Provider · e2e。",
    level: "进阶",
    track: "工程化",
    minutes: 12,
    official: "/fundamentals/testing",
    blocks: [
      {
        type: "text",
        title: "DI 让测试变简单",
        body: "`Test.createTestingModule` 覆盖 providers，用 mock 替真实 DB。单元测 Service；e2e 用 supertest 打真实 HTTP 栈。",
      },
      {
        type: "code",
        title: "单元测试",
        lang: "ts",
        code: `const moduleRef = await Test.createTestingModule({
  providers: [
    CatsService,
    { provide: getRepositoryToken(Cat), useValue: mockRepo },
  ],
}).compile();

const service = moduleRef.get(CatsService);
await expect(service.findOne(1)).resolves.toEqual({ id: 1, name: 'Mimi' });`,
      },
      { type: "demo", kind: "testing", title: "动手：mock 注入" },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "覆盖 Provider 用？",
            options: ["改源码硬编码", "TestingModule providers useValue", "只能 e2e", "关 DI"],
            answer: 1,
            explain: "测试模块替换依赖。",
          },
        ],
      },
    ],
  },
  {
    slug: "lifecycle-hooks",
    title: "生命周期钩子",
    summary: "onModuleInit · onApplicationBootstrap · 关闭。",
    level: "进阶",
    track: "工程化",
    minutes: 8,
    official: "/fundamentals/lifecycle-events",
    blocks: [
      {
        type: "text",
        title: "启动与销毁",
        body: "实现 OnModuleInit / OnApplicationBootstrap 做预热；OnModuleDestroy / BeforeApplicationShutdown 关连接。`app.enableShutdownHooks()` 响应 SIGTERM。",
      },
      {
        type: "code",
        title: "钩子",
        lang: "ts",
        code: `@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}`,
      },
      { type: "demo", kind: "lifecycle", title: "动手：钩子顺序" },
      {
        type: "quiz",
        questions: [
          {
            id: "lf1",
            question: "连数据库适合？",
            options: ["构造函数同步阻塞", "onModuleInit", "仅 Guard", "Pipe"],
            answer: 1,
            explain: "异步初始化钩子。",
          },
        ],
      },
    ],
  },
  {
    slug: "logging-perf",
    title: "日志与性能",
    summary: "Logger · 拦截器计时 · 缓存。",
    level: "进阶",
    track: "工程化",
    minutes: 8,
    official: "/techniques/logger",
    blocks: [
      {
        type: "text",
        title: "可观测",
        body: "用 Nest Logger 或 Pino；请求 ID 贯穿日志；热点读路径可 CacheInterceptor + redis。避免在热路径打同步巨型 JSON。",
      },
      {
        type: "code",
        title: "计时拦截器",
        lang: "ts",
        code: `intercept(ctx: ExecutionContext, next: CallHandler) {
  const now = Date.now();
  return next.handle().pipe(
    tap(() => this.logger.log(\`+\${Date.now() - now}ms\`)),
  );
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "lp1",
            question: "生产日志避免？",
            options: ["结构化字段", "打印明文密码/token", "request id", "级别分流"],
            answer: 1,
            explain: "敏感信息脱敏。",
          },
        ],
      },
    ],
  },
  {
    slug: "deploy",
    title: "构建与部署",
    summary: "nest build · Docker · 健康检查。",
    level: "实战",
    track: "工程化",
    minutes: 10,
    official: "/recipes/deployment",
    blocks: [
      {
        type: "text",
        title: "上线清单",
        body: "`nest build` → `node dist/main`；多阶段 Docker；环境变量注入；`/health` 探活；优雅关闭；勿开 synchronize。",
      },
      {
        type: "code",
        title: "Dockerfile 要点",
        lang: "dockerfile",
        code: `FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "dp1",
            question: "生产入口通常是？",
            options: ["ts-node src", "node dist/main", "nest start --watch", "vite"],
            answer: 1,
            explain: "编译后的 JS。",
          },
        ],
      },
    ],
  },
  {
    slug: "microservices-intro",
    title: "微服务入门",
    summary: "传输层 · 消息模式 · 混合应用。",
    level: "进阶",
    track: "微服务",
    minutes: 12,
    official: "/microservices/basics",
    blocks: [
      {
        type: "text",
        title: "不止 HTTP",
        body: "Nest 用同一套 DI，换 TCP/Redis/NATS/Kafka 等传输。`@MessagePattern` / `@EventPattern`；也可 Hybrid：HTTP + 微服务监听并存。",
      },
      {
        type: "code",
        title: "消息处理器",
        lang: "ts",
        code: `@Controller()
export class MathController {
  @MessagePattern({ cmd: 'sum' })
  sum(data: number[]): number {
    return data.reduce((a, b) => a + b, 0);
  }
}

// 客户端
const result = await client.send({ cmd: 'sum' }, [1, 2, 3]).toPromise();`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "ms1",
            question: "EventPattern 特点？",
            options: ["必须有返回", "发后不管（事件）", "仅 HTTP", "替代 Module"],
            answer: 1,
            explain: "事件无响应约定。",
          },
        ],
      },
    ],
  },
  {
    slug: "graphql-ws",
    title: "GraphQL 与 WebSocket",
    summary: "扩展传输：GQL code-first · Gateway。",
    level: "进阶",
    track: "微服务",
    minutes: 10,
    official: "/graphql/quick-start",
    format: "reference",
    blocks: [
      {
        type: "text",
        title: "同一架构多协议",
        body: "GraphQLModule、@WebSocketGateway 仍用 Module/Provider。先把 HTTP REST 与鉴权学稳，再扩展。",
      },
      {
        type: "code",
        title: "Gateway 片段",
        lang: "ts",
        code: `@WebSocketGateway({ cors: true })
export class ChatGateway {
  @SubscribeMessage('chat')
  handle(client: Socket, payload: string) {
    return { event: 'chat', data: payload };
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "gw1",
            question: "Nest 扩展协议时？",
            options: ["丢掉 Module", "继续用 DI 与装饰器", "只能 Express 路由", "禁止 Guard"],
            answer: 1,
            explain: "统一编程模型。",
          },
        ],
      },
    ],
  },
  {
    slug: "openapi",
    title: "OpenAPI / Swagger",
    summary: "文档即代码 · @ApiTags。",
    level: "进阶",
    track: "工程化",
    minutes: 8,
    official: "/openapi/introduction",
    blocks: [
      {
        type: "text",
        title: "协作契约",
        body: "`@nestjs/swagger` 从装饰器生成 /api 文档。DTO 加 `@ApiProperty`；配合 Validation 减少前后端扯皮。",
      },
      {
        type: "code",
        title: "启用 Swagger",
        lang: "ts",
        code: `const config = new DocumentBuilder()
  .setTitle('Cats')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "oa1",
            question: "Swagger 主要价值？",
            options: ["替代数据库", "API 文档与调试", "前端框架", "ORM"],
            answer: 1,
            explain: "OpenAPI 文档。",
          },
        ],
      },
    ],
  },
  {
    slug: "interview",
    title: "面试串讲",
    summary: "模块边界 · 管道顺序 · DI · 鉴权。",
    level: "进阶",
    track: "工程化",
    minutes: 12,
    blocks: [
      {
        type: "text",
        title: "高频问答",
        body: "1) Module exports 做什么？\n2) Guard / Pipe / Interceptor 顺序？\n3) 为何要用 DTO 而不是 Entity？\n4) JWT 放哪、如何刷新？\n5) 如何单测带 DB 的 Service？\n6) 全局 Filter 统一错误格式？\n\n能画请求生命周期 + 举项目里 Module 切分，就过线。",
      },
      {
        type: "tip",
        body: "准备一个「笔记 API」故事：AuthModule + NotesModule + JWT + ValidationPipe + e2e。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "iv1",
            question: "Nest 相对裸 Express 最大卖点？",
            options: ["更快 V8", "架构约定与 DI 可测", "自带数据库", "不用 TypeScript"],
            answer: 1,
            explain: "可维护的后端架构。",
          },
          {
            id: "iv2",
            question: "跨模块复用 Service？",
            options: ["复制粘贴", "exports + imports", "globalThis", "只 static"],
            answer: 1,
            explain: "模块导出。",
          },
        ],
      },
    ],
  },
  // —— 官方补全（reference）——
  {
    slug: "custom-providers",
    title: "自定义 Provider",
    summary: "useClass / useValue / useFactory / useExisting。",
    level: "进阶",
    track: "官方补全",
    format: "reference",
    minutes: 8,
    official: "/fundamentals/custom-providers",
    blocks: [
      {
        type: "text",
        title: "四种提供方式",
        body: "标准 class 只是语法糖。token 可以是字符串/Symbol；工厂可注入其他依赖；useExisting 建别名。",
      },
      {
        type: "code",
        title: "工厂 Provider",
        lang: "ts",
        code: `{
  provide: 'ASYNC_CONNECTION',
  useFactory: async (config: ConfigService) => {
    return createConnection(config.get('DB_URL'));
  },
  inject: [ConfigService],
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cp1",
            question: "异步连接适合？",
            options: ["useValue 同步对象", "useFactory async", "只能 Controller", "Pipe"],
            answer: 1,
            explain: "工厂可返回 Promise。",
          },
        ],
      },
    ],
  },
  {
    slug: "dynamic-modules",
    title: "动态模块",
    summary: "forRoot / forRootAsync · 可配置库。",
    level: "进阶",
    track: "官方补全",
    format: "reference",
    minutes: 8,
    official: "/fundamentals/dynamic-modules",
    blocks: [
      {
        type: "text",
        title: "库作者模式",
        body: "`static forRoot(options)` 返回 DynamicModule，把 options 注册为 provider。forRootAsync 支持 inject 配置服务。",
      },
      {
        type: "code",
        title: "forRoot",
        lang: "ts",
        code: `@Module({})
export class CatsModule {
  static forRoot(options: CatsOptions): DynamicModule {
    return {
      module: CatsModule,
      providers: [
        { provide: 'CATS_OPTIONS', useValue: options },
        CatsService,
      ],
      exports: [CatsService],
    };
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "dm1",
            question: "forRoot 返回？",
            options: ["void", "DynamicModule", "Controller", "string"],
            answer: 1,
            explain: "动态模块元数据。",
          },
        ],
      },
    ],
  },
  {
    slug: "scopes",
    title: "注入作用域",
    summary: "DEFAULT · REQUEST · TRANSIENT。",
    level: "进阶",
    track: "官方补全",
    format: "reference",
    minutes: 8,
    official: "/fundamentals/injection-scopes",
    blocks: [
      {
        type: "text",
        title: "别滥用 REQUEST",
        body: "默认单例。REQUEST 每请求新实例（代价：子树可能变 request-scoped）。TRANSIENT 每次注入新实例。能单例就单例。",
      },
      {
        type: "code",
        title: "Request scope",
        lang: "ts",
        code: `@Injectable({ scope: Scope.REQUEST })
export class RequestContext {
  constructor(@Inject(REQUEST) private req: Request) {}
  userId() { return this.req.user?.userId; }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sc1",
            question: "默认 scope？",
            options: ["REQUEST", "单例 DEFAULT", "TRANSIENT", "无"],
            answer: 1,
            explain: "应用级单例。",
          },
        ],
      },
    ],
  },
  {
    slug: "versioning",
    title: "API 版本",
    summary: "URI / Header / Media type 版本。",
    level: "进阶",
    track: "官方补全",
    format: "reference",
    minutes: 6,
    official: "/techniques/versioning",
    blocks: [
      {
        type: "text",
        title: "平滑演进",
        body: "`app.enableVersioning({ type: VersioningType.URI })`，控制器 `@Version('2')`。",
      },
      {
        type: "code",
        title: "版本路由",
        lang: "ts",
        code: `@Controller('cats')
@Version('1')
export class CatsControllerV1 {
  @Get() findAll() { return 'v1'; }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "v1",
            question: "URI 版本示例？",
            options: ["/cats", "/v1/cats", "仅 query", "仅 cookie"],
            answer: 1,
            explain: "路径带版本前缀。",
          },
        ],
      },
    ],
  },
  {
    slug: "task-queues",
    title: "任务与调度",
    summary: "Schedule · Queues 思路。",
    level: "进阶",
    track: "官方补全",
    format: "reference",
    minutes: 6,
    official: "/techniques/task-scheduling",
    blocks: [
      {
        type: "text",
        title: "别在请求里干重活",
        body: "@nestjs/schedule 做 cron；重任务丢 Bull/BullMQ 队列，Worker 消费。HTTP 快速 202 + 查询状态。",
      },
      {
        type: "code",
        title: "Cron",
        lang: "ts",
        code: `@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_HOUR)
  handle() {
    // 清理过期 token 等
  }
}`,
      },
      {
        type: "quiz",
        questions: [
          {
            id: "tq1",
            question: "大导出任务宜？",
            options: ["同步卡死请求", "队列异步处理", "仅前端循环", "关超时"],
            answer: 1,
            explain: "异步任务。",
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "毕业作品清单",
    summary: "从零搭一个笔记 API。",
    level: "实战",
    track: "工程化",
    minutes: 10,
    blocks: [
      {
        type: "text",
        title: "建议交付物",
        body: "1. nest new + Notes/Auth 模块\n2. ValidationPipe + DTO\n3. JWT 登录 + 受保护 CRUD\n4. 统一异常 Filter\n5. Swagger\n6. 单元测试 Service + 1 条 e2e\n7. Dockerfile + README\n\n做完后回到「工坊」用模拟 API 对照请求日志。",
      },
      {
        type: "tip",
        body: "工坊演示账号见 /studio：用 Bearer 走完登录与笔记 CRUD。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "cap1",
            question: "毕业项目最小闭环？",
            options: ["只有 Hello", "鉴权 + 资源 CRUD + 校验", "仅前端", "仅 Docker"],
            answer: 1,
            explain: "可演示的完整 API。",
          },
        ],
      },
    ],
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): {
  prev?: Lesson;
  next?: Lesson;
} {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({
            ...q,
            lessonSlug: lesson.slug,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }
  return out;
}

export function isCourseLesson(l: Lesson): boolean {
  if (l.format === "reference") return false;
  if (l.format === "course") return true;
  return l.track !== "官方补全";
}

export function getCourseLessons(): Lesson[] {
  return LESSONS.filter(isCourseLesson);
}
