# TrendScout AI

**AI 驱动的跨境电商趋势发现与选品决策平台**

*Discover trends early. Analyze with Dify Workflow. Decide SKUs with AI.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Dify](https://img.shields.io/badge/Dify-Workflow-1C64F2)](https://dify.ai/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel&logoColor=white)](https://trendscout-ai-pied.vercel.app)

[Live Demo](https://trendscout-ai-pied.vercel.app) | [Source Code](https://github.com/moncia-025/trendscout-ai) | [V2 接入说明](./docs/v2-dify-refactor.md)

---

> V2 版本通过 **Dify Multi-Agent Workflow** 返回结构化选品分析，采用 `api → service → view` 分层，已移除全部 Mock 数据。

---

## Features

### Dify Workflow 趋势分析
输入关键词，调用 Dify Workflow 返回 `TrendAnalysis` JSON（阶段、评分、风险、SKU 建议）。

### 趋势排行与对比
支持默认关键词批量分析与 Opportunity Score 排序对比。

### Google Trends
`/trends` 页面查询关键词 30 天搜索热度（真实 API，无 Mock 回退）。

### 规则引擎（保留）
`forecast-engine` / `alert-engine` / `opportunity-engine` 仍保留单元测试，供后续接回 UI。

---

## Tech Stack

| 分类 | 技术 | 用途 |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Pages & Route Handler |
| UI | React 19 / Tailwind CSS 4 | 组件化 UI |
| Language | TypeScript 5 | 全栈类型安全 |
| Validation | Zod | API 与 Workflow 输出校验 |
| AI | Dify Workflow API | Multi-Agent 趋势分析 |
| Data | google-trends-api | 搜索热度信号 |
| HTTP | Axios | 前端 API 层 |
| Testing | Vitest | Engine + 错误格式化测试 |
| Deploy | Vercel | 生产部署 |

---

## Architecture

```
View (pages/components)
  → hooks (useTrendAnalysis / useMultiTrendAnalysis)
  → services/trend-analysis.ts
  → api/trends.ts + api/request.ts
  → POST /api/trend-analysis
  → services/dify/workflow.ts
  → Dify Workflow API
```

---

## API Endpoints

| Endpoint | Method | 说明 |
| --- | ---: | --- |
| /api/trend-analysis | POST | Dify Workflow 趋势分析 |
| /api/trends | GET | Google Trends 30 天热度 |

---

## Local Development

```bash
cp .env.example .env.local   # 填入 DIFY_API_KEY
npm install
npm run dev
```

访问 http://localhost:3000

**注意：** 本地开发需同时启动 Dify 服务（默认 `http://localhost/v1`）。Dify 未启动时页面仍可浏览，点击分析会提示连接失败。

---

## Environment Variables

| 变量 | 必填 | 说明 |
| --- | :---: | --- |
| DIFY_API_KEY | 是 | Dify 工作流 API 密钥 |
| DIFY_WORKFLOW_ID | 否 | Workflow ID，默认已内置 |
| DIFY_API_BASE_URL | 否 | 默认 `http://localhost/v1` |
| DIFY_WORKFLOW_TIMEOUT_MS | 否 | 服务端超时，默认 240000 |
| NEXT_PUBLIC_DEFAULT_QUERIES | 否 | 默认批量关键词，逗号分隔 |

---

## Testing

```bash
npm test
npm run build
```

---

## Deployment

- Platform: Vercel — https://trendscout-ai-pied.vercel.app
- **线上需配置公网可访问的 Dify API 地址**，本地 `localhost` 无法被 Vercel 调用

---

## Author

**陈子恒** — AI 前端方向

GitHub: https://github.com/moncia-025
