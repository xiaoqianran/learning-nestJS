export type NestPreset = {
  id: string;
  title: string;
  summary: string;
  files: { name: string; code: string }[];
  /** 模拟「运行」后的 HTTP 结果 */
  run: {
    method: string;
    path: string;
    status: number;
    body: unknown;
  };
};

export const NEST_PRESETS: NestPreset[] = [
  {
    id: "hello",
    title: "Hello World",
    summary: "最小 Controller",
    files: [
      {
        name: "app.controller.ts",
        code: `import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return { message: 'Hello NestJS' };
  }
}
`,
      },
    ],
    run: { method: "GET", path: "/", status: 200, body: { message: "Hello NestJS" } },
  },
  {
    id: "cats-crud",
    title: "Cats CRUD",
    summary: "Controller + Service",
    files: [
      {
        name: "cats.controller.ts",
        code: `import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private readonly cats: CatsService) {}

  @Get()
  findAll() {
    return this.cats.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cats.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCatDto) {
    return this.cats.create(dto);
  }
}
`,
      },
      {
        name: "cats.service.ts",
        code: `import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';

@Injectable()
export class CatsService {
  private items = [{ id: 1, name: 'Mimi', age: 2 }];

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    const cat = this.items.find((c) => c.id === id);
    if (!cat) throw new NotFoundException();
    return cat;
  }

  create(dto: CreateCatDto) {
    const cat = { id: Date.now(), ...dto };
    this.items.push(cat);
    return cat;
  }
}
`,
      },
      {
        name: "create-cat.dto.ts",
        code: `import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  @Min(0)
  age: number;
}
`,
      },
    ],
    run: {
      method: "GET",
      path: "/cats",
      status: 200,
      body: [{ id: 1, name: "Mimi", age: 2 }],
    },
  },
  {
    id: "jwt-guard",
    title: "JWT Guard",
    summary: "受保护的 /me",
    files: [
      {
        name: "auth.controller.ts",
        code: `import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Request() req: { user: { userId: number; email: string } }) {
    return req.user;
  }
}
`,
      },
    ],
    run: {
      method: "GET",
      path: "/me",
      status: 200,
      body: { userId: 1, email: "demo@nest.dev" },
    },
  },
  {
    id: "validation",
    title: "ValidationPipe",
    summary: "DTO 校验失败示例",
    files: [
      {
        name: "main.ts",
        code: `app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
`,
      },
    ],
    run: {
      method: "POST",
      path: "/cats",
      status: 400,
      body: {
        statusCode: 400,
        message: ["name should not be empty", "age must be an integer number"],
        error: "Bad Request",
      },
    },
  },
];

export function getPreset(id: string): NestPreset {
  return NEST_PRESETS.find((p) => p.id === id) ?? NEST_PRESETS[0]!;
}
