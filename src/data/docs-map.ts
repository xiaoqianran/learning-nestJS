/** 对照 docs.nestjs.com · 左侧官网 / 右侧本站课 */

export type DocLink = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  title: string;
  items: DocLink[];
};

const DOC = "https://docs.nestjs.com";

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", official: `${DOC}`, lessonSlug: "intro" },
      { title: "First steps", official: `${DOC}/first-steps`, lessonSlug: "cli-first-app" },
      { title: "Controllers", official: `${DOC}/controllers`, lessonSlug: "controllers" },
      { title: "Providers", official: `${DOC}/providers`, lessonSlug: "providers" },
      { title: "Modules", official: `${DOC}/modules`, lessonSlug: "modules" },
    ],
  },
  {
    title: "Techniques · pipeline",
    items: [
      {
        title: "Request lifecycle",
        official: `${DOC}/faq/request-lifecycle`,
        lessonSlug: "request-lifecycle",
      },
      { title: "Middleware", official: `${DOC}/middleware`, lessonSlug: "middleware" },
      { title: "Pipes", official: `${DOC}/pipes`, lessonSlug: "pipes" },
      { title: "Guards", official: `${DOC}/guards`, lessonSlug: "guards" },
      { title: "Interceptors", official: `${DOC}/interceptors`, lessonSlug: "interceptors" },
      {
        title: "Exception filters",
        official: `${DOC}/exception-filters`,
        lessonSlug: "exception-filters",
      },
      {
        title: "Validation",
        official: `${DOC}/techniques/validation`,
        lessonSlug: "dto-validation",
      },
    ],
  },
  {
    title: "Security & data",
    items: [
      {
        title: "Authentication",
        official: `${DOC}/security/authentication`,
        lessonSlug: "auth-jwt",
      },
      {
        title: "Authorization",
        official: `${DOC}/security/authorization`,
        lessonSlug: "auth-guards-deep",
      },
      { title: "Helmet / CORS", official: `${DOC}/security/helmet`, lessonSlug: "security-basics" },
      {
        title: "Database",
        official: `${DOC}/techniques/database`,
        lessonSlug: "databases",
      },
      {
        title: "Configuration",
        official: `${DOC}/techniques/configuration`,
        lessonSlug: "config-env",
      },
      {
        title: "Serialization",
        official: `${DOC}/techniques/serialization`,
        lessonSlug: "serialization",
      },
    ],
  },
  {
    title: "Fundamentals",
    items: [
      {
        title: "Custom providers",
        official: `${DOC}/fundamentals/custom-providers`,
        lessonSlug: "custom-providers",
      },
      {
        title: "Dynamic modules",
        official: `${DOC}/fundamentals/dynamic-modules`,
        lessonSlug: "dynamic-modules",
      },
      {
        title: "Injection scopes",
        official: `${DOC}/fundamentals/injection-scopes`,
        lessonSlug: "scopes",
      },
      {
        title: "Lifecycle events",
        official: `${DOC}/fundamentals/lifecycle-events`,
        lessonSlug: "lifecycle-hooks",
      },
      {
        title: "Testing",
        official: `${DOC}/fundamentals/testing`,
        lessonSlug: "testing",
      },
    ],
  },
  {
    title: "OpenAPI · CLI · Deploy",
    items: [
      {
        title: "OpenAPI (Swagger)",
        official: `${DOC}/openapi/introduction`,
        lessonSlug: "openapi",
      },
      { title: "CLI overview", official: `${DOC}/cli/overview`, lessonSlug: "cli-first-app" },
      {
        title: "Deployment",
        official: `${DOC}/recipes/deployment`,
        lessonSlug: "deploy",
      },
      {
        title: "Versioning",
        official: `${DOC}/techniques/versioning`,
        lessonSlug: "versioning",
      },
      {
        title: "Task scheduling",
        official: `${DOC}/techniques/task-scheduling`,
        lessonSlug: "task-queues",
      },
    ],
  },
  {
    title: "Microservices & more",
    items: [
      {
        title: "Microservices",
        official: `${DOC}/microservices/basics`,
        lessonSlug: "microservices-intro",
      },
      {
        title: "GraphQL",
        official: `${DOC}/graphql/quick-start`,
        lessonSlug: "graphql-ws",
      },
      {
        title: "WebSockets",
        official: `${DOC}/websockets/gateways`,
        lessonSlug: "graphql-ws",
      },
      {
        title: "REST CRUD 实战",
        official: `${DOC}/controllers`,
        lessonSlug: "rest-crud",
      },
      {
        title: "毕业作品清单",
        official: `${DOC}`,
        lessonSlug: "capstone",
      },
      {
        title: "面试串讲",
        official: `${DOC}`,
        lessonSlug: "interview",
      },
    ],
  },
];

export function getDocsCoverage() {
  let total = 0;
  let linked = 0;
  for (const sec of DOC_SECTIONS) {
    for (const it of sec.items) {
      total += 1;
      if (it.lessonSlug) linked += 1;
    }
  }
  return {
    total,
    linked,
    percent: total === 0 ? 0 : Math.round((linked / total) * 100),
  };
}
