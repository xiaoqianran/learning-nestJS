# NestJS 实战学习

交互式中文 NestJS 教程：课程 + 测验 + 进度 + 代码工场 + 模拟 API 工坊。

参考姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)

**在线访问：** [https://xiaoqianran.github.io/learning-nestJS/](https://xiaoqianran.github.io/learning-nestJS/)  
**仓库：** [https://github.com/xiaoqianran/learning-nestJS](https://github.com/xiaoqianran/learning-nestJS)

> GitHub Pages 由 **Actions** 自动部署（`Deploy to GitHub Pages` workflow，push `main` 触发）。

---

## 这是什么

面向想系统学习 **NestJS**（Node 后端架构：模块、DI、请求管道、鉴权）的同学。内容以「读一点、动手一点、测一点」组织。

你可以：

- 按路径学完课程（**讲解 + TypeScript 源码 + 交互 Demo + 小测验**）
- 在 **代码工场** 里对照 Nest 片段与模拟 HTTP 响应
- 在 **API 工坊** 里练登录、401、笔记 CRUD（模拟 REST + JWT）
- 用 **速查表** 复习，用 **学习中心 / 错题本 / 结业证明** 跟进度

> 说明：本站本身用 React + TanStack Start 承载教学内容；Demo 在浏览器内模拟 Nest 概念，完整编译请本地 `nest start`。

---

## 功能一览

| 模块 | 路径 | 说明 |
|------|------|------|
| 课程 | `/lesson/:slug` | 正文、源码、Demo、测验、笔记 |
| 首页大纲 | `/` | 搜索、路径筛选、进度条 |
| 代码工场 | `/playground` | Nest 片段 + 模拟响应 |
| API 工坊 | `/studio` | 模拟 API + 闯关任务 |
| 文档地图 | `/docs` | 对照 docs.nestjs.com |
| 主题 | 全局 | Catppuccin（默认 Red 贴合 Nest 品牌色） |
| 速查表 | `/cheatsheet` | 一页装饰器与管道 |
| 学习中心 | `/hub` | 打卡、收藏、路径进度 |
| 练习场 | `/lab` | 综合练习 |
| 错题本 | `/mistakes` | 测验错题回顾 |
| 结业证明 | `/certificate` | 全部完成后解锁 |

### API 工坊演示账号

```text
邮箱：demo@nest.dev
密码：password123
```

---

## 学习路径

| 路径 | 你学到什么 |
|------|------------|
| **基础** | Nest 是什么、CLI、Module、Controller、DI |
| **请求管道** | 生命周期、Middleware、Pipe、Guard、Interceptor、Filter |
| **数据与 REST** | CRUD、ORM、Config、序列化 |
| **鉴权与安全** | JWT、角色、Helmet/CORS |
| **工程化** | 测试、生命周期、日志、部署、OpenAPI、面试 |
| **微服务** | 消息模式、GraphQL/WS 扩展 |
| **官方补全** | 自定义 Provider、动态模块、Scope、版本、任务 |

建议顺序：

```text
基础 → 请求管道 → 数据与 REST → 鉴权 → 工坊闯关 → 工程化 → 扩展
```

---

## 本地运行

环境：Node 22+ 推荐。

```bash
git clone https://github.com/xiaoqianran/learning-nestJS.git
cd learning-nestJS
npm install
npm run dev
```

开发服务默认：`http://127.0.0.1:8080`（绑定 `0.0.0.0:8080`）。

```bash
npm run dev        # 开发
npm run build      # 生产构建（Vercel）
npm run build:pages # GitHub Pages 静态构建
npm run typecheck  # TypeScript 检查
```

GitHub Pages 静态构建会设置 `GITHUB_PAGES=true`，`base` 为 `/learning-nestJS/`。

---

## 部署

- **GitHub Pages：** 仓库 Settings → Pages → **Source = GitHub Actions**  
  Workflow：`.github/workflows/deploy-pages.yml`（`push` 到 `main` 或手动 `workflow_dispatch`）  
  站点：https://xiaoqianran.github.io/learning-nestJS/
- **Vercel：** `npm run build`（nitro preset vercel）

---

## 技术栈

- **界面与路由：** React 19、TanStack Start / Router、Vite
- **样式：** Tailwind CSS v4 · Catppuccin
- **状态：** Zustand（学习进度持久化）
- **模拟 API：** MSW（工坊）

## License

MIT
