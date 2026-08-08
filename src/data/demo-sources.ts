import type { DemoKind } from "./lessons";

/** 供 sync-manifest 与文档引用：每个 DemoKind 对应一段示意源码 */
export const DEMO_SOURCES: Record<DemoKind, { title: string; code: string }> = {
  hello: {
    title: "Hello Controller",
    code: `@Controller()\nexport class AppController {\n  @Get()\n  hello() { return { message: 'Hello Nest' }; }\n}`,
  },
  "module-graph": {
    title: "Module exports",
    code: `@Module({ providers: [CatsService], exports: [CatsService] })\nexport class CatsModule {}`,
  },
  controller: {
    title: "REST routes",
    code: `@Controller('cats')\nexport class CatsController {\n  @Get() findAll() {}\n  @Get(':id') findOne(@Param('id') id: string) {}\n  @Post() create(@Body() dto: CreateCatDto) {}\n}`,
  },
  "provider-di": {
    title: "DI",
    code: `@Injectable()\nexport class CatsService {}\n\nconstructor(private cats: CatsService) {}`,
  },
  "dto-validation": {
    title: "DTO",
    code: `export class CreateCatDto {\n  @IsString() name: string;\n  @IsInt() @Min(0) age: number;\n}`,
  },
  pipe: {
    title: "ParseIntPipe",
    code: `@Get(':id')\nfindOne(@Param('id', ParseIntPipe) id: number) {}`,
  },
  guard: {
    title: "RolesGuard",
    code: `@UseGuards(AuthGuard('jwt'), RolesGuard)\n@Roles('admin')\n@Post() create() {}`,
  },
  interceptor: {
    title: "Transform",
    code: `return next.handle().pipe(map((data) => ({ success: true, data })));`,
  },
  exception: {
    title: "NotFound",
    code: `throw new NotFoundException('Cat #9 not found');`,
  },
  middleware: {
    title: "Lifecycle",
    code: `Middleware → Guards → Interceptors → Pipes → Handler`,
  },
  crud: {
    title: "CRUD",
    code: `create / findAll / findOne / update / remove`,
  },
  jwt: {
    title: "JWT",
    code: `@UseGuards(AuthGuard('jwt'))\n@Get('me') me(@Req() req) { return req.user; }`,
  },
  config: {
    title: "Config",
    code: `ConfigModule.forRoot({ isGlobal: true })`,
  },
  lifecycle: {
    title: "Hooks",
    code: `onModuleInit / onModuleDestroy`,
  },
  testing: {
    title: "TestingModule",
    code: `Test.createTestingModule({ providers: [...] }).compile()`,
  },
};

export function getDemoSource(kind: DemoKind) {
  return DEMO_SOURCES[kind];
}
