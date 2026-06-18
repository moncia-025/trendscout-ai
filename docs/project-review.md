# TrendScout AI 项目正式验收报告

> 验收角色：前端 Tech Lead（10 年经验）· 校招 / 实习生面试官视角  
> 验收日期：2026-06-18  
> 项目仓库：[moncia-025/trendscout-ai](https://github.com/moncia-025/trendscout-ai)

---

## 项目概览

| 项 | 内容 |
|---|---|
| 技术栈 | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Zod · OpenAI SDK (DeepSeek) |
| 定位 | AI 驱动的跨境电商趋势分析与选品平台 |
| 核心页面 | Dashboard · `/forecast` · `/trend/[slug]` · `/consultant` · `/trends` · `/comparison` · `/stream-analysis` |
| 核心 API | 8 个 Route Handler（forecast-analysis · product-consultant · ai-stream · alert-analysis · trends · trend-comparison 等） |

---

# 一、产品维度

## 评估摘要

| 维度 | 结论 |
|---|---|
| 产品定位 | **清晰** — 「趋势发现 → 预测 → AI 解读 → 选品决策」链路表述一致 |
| 用户痛点 | **真实** — 跨境卖家对趋势窗口、SKU 选择、备货节奏确有刚需 |
| 用户流程 | **基本完整，但数据层未打通** — 页面齐全，多数模块仍基于静态 Mock |
| MVP | **Demo 级成立** — 可演示完整故事，尚不足以支撑真实卖家日常使用 |
| 商业化 | **有想象空间** — SaaS 订阅 / 选品报告 / API 均可，但需真实数据源与差异化 |

## 优点

1. **功能矩阵完整**：八大核心能力均有对应页面或 API，不是单点 Demo。
2. **叙事连贯**：Dashboard 聚合「本周推荐 → 机会排行 → 趋势表 → AI 洞察 → 预警 → 机会报告」，符合卖家决策路径。
3. **垂直场景聚焦**：Coquette / Clean Girl / Old Money 等美妆时尚趋势，比泛化「AI 聊天」更有产品感。
4. **中英文信息架构合理**：导航与业务文案以中文为主，阶段/风险等领域模型用英文枚举，便于扩展。

## 问题

1. **「AI」标签与真实能力不一致**：`AiInsightPanel` 展示的是 Mock 字段，`AlertPanel` 走规则引擎（`alert-engine.ts`），`/api/alert-analysis` 已实现但未接入 UI。
2. **数据孤岛**：Google Trends、Forecast Engine、Comparison Engine、AI 分析各自独立，未形成「一条趋势 ID 贯穿全链路」。
3. **缺少用户身份与持久化**：无登录、无收藏、无历史报告，无法形成留存闭环。
4. **决策出口弱**：分析结果无法导出、无法「加入选品清单」或「生成采购建议单」。
5. **MVP 边界模糊**：`/stream-demo` 与 `/stream-analysis` 并存，前者为模拟 SSE，易让评审者困惑产品真实能力。

## 改进建议

1. **统一数据层**：以 `trendId` 为核心，Mock → Google Trends → Forecast 逐级替换，而非各模块各读各的。
2. **诚实标注 AI 层级**：规则生成 / 本地引擎 / LLM 增强，三级 Badge 区分，避免「AI 洗稿」质疑。
3. **打通 Alert 闭环**：点击预警卡片 → 调用 `/api/alert-analysis` → 展示 AI 深度解读。
4. **补一个「行动」节点**：如「生成选品 Brief PDF」或「复制 TikTok 测款清单」，让 Demo 有明确交付物。
5. **收敛 Demo 页**：合并或下线 `stream-demo`，保留真实 DeepSeek 流式页即可。

## 评分：**72 / 100**

---

# 二、前端工程维度

## 检查摘要

| 检查项 | 结论 |
|---|---|
| 目录结构 | ✅ 清晰分层：`app/` · `components/` · `lib/` · `services/` · `hooks/` · `types/` · `data/` |
| 组件拆分 | ✅ 按业务域拆分（dashboard / forecast / trend），粒度适中 |
| TypeScript | ✅ API 入参出参有 Zod 校验；⚠️ `types/trend.ts` 反向 re-export `mock-data` 类型，耦合偏高 |
| Tailwind | ✅ 统一 zinc 色系、圆角卡片、SectionHeader 模式，视觉一致 |
| 状态管理 | ⚠️ 纯 `useState` + `useEffect`，无共享状态；多页重复 fetch 逻辑 |
| API 设计 | ✅ RESTful Route Handler + Zod；⚠️ 响应格式不统一（有的 `{ data }`，有的直接返回 body） |
| 错误处理 | ✅ 前端有 loading / error / skeleton；⚠️ AI 层 silent fallback 吞掉异常 |
| 可维护性 | ⚠️ 无测试；SparkleIcon 等重复；`consultant/page.tsx` 400+ 行可抽 hook |

## 优点

1. **Next.js App Router 用法规范**：Server Component 负责布局，Client Component 按需 `"use client"`。
2. **Engine 与 UI 分离**：`forecast-engine` · `comparison-engine` · `opportunity-engine` 等纯函数，可单测。
3. **Zod + JSON Schema 输出**：API 层与 AI 层双重校验，工程意识良好。
4. **SSE 流式实现完整**：`ReadableStream` + `AbortController` + 客户端 buffer 解析，非玩具级。
5. **UI 完成度高**：Skeleton、空态、错误态、响应式布局均有，超出典型课程项目水准。

## 风险点

1. **零测试覆盖**：Engine 权重、Alert 阈值、Forecast 公式变更无回归保障。
2. **类型定义源混乱**：领域类型定义在 `mock-data.ts`，`types/` 目录名存实亡。
3. **重复代码**：`useForecastAnalysis` 与 `consultant/page.tsx` 的 fetch 模式高度相似；多个页面内联 `SparkleIcon`。
4. **静默降级**：`analyzeTrend()` catch 后返回 fallback，用户无法感知 AI 是否真正被调用。
5. **无环境变量校验**：`DEEPSEEK_API_KEY` 缺失时运行时才报错，缺少 startup 检查。
6. **Google Trends fallback 无标识**：Mock 数据与真实数据 UI 表现一致，存在误导风险。

## 重构建议

1. **抽 `useAiFetch<T>` 通用 Hook**：统一 loading / error / cancel / retry。
2. **类型下沉**：将 `Trend` 等接口移至 `types/trend.ts`，`mock-data` 仅做数据源。
3. **补 Engine 单元测试**：优先 `forecast-engine` · `comparison-engine` · `alert-engine`。
4. **统一 API Response Envelope**：`{ success, data, error, meta }` 全站一致。
5. **抽 `icons/sparkle.tsx` + `ui/` 原子组件**：减少页面体积。
6. **AI 调用加 telemetry**：记录 latency、token、fallback 率（console 或简单日志表即可）。

## 评分：**78 / 100**

---

# 三、AI 产品维度

## 检查摘要

| 检查项 | 结论 |
|---|---|
| DeepSeek 接入 | ✅ OpenAI SDK + `baseURL` 切换，标准做法 |
| Prompt 设计 | ✅ 结构化 JSON 输出 + 中文字段约束 + 业务上下文注入 |
| AI 输出质量 | ⚠️ 依赖 Mock 输入，输出「听起来专业」但缺乏外部事实锚点 |
| AI 价值真实性 | ⚠️ 部分模块为规则引擎 + LLM 包装，价值增量有限 |
| 是否套壳 | ⚠️ 存在「套壳风险」，但非纯 ChatGPT 套壳 — 有 Engine + Prompt 工程 |
| AI 产品特征 | ✅ 具备：结构化报告 · JSON Schema · SSE 流式 · Fallback · 多 Agent 角色 |

## 优点

1. **Prompt 工程有章法**：System / User 分离，字段 Schema 写进 Prompt，`response_format: json_object` 配合 Zod parse。
2. **多场景 Agent 分工**：Trend Analyst · Product Consultant · Alert Analyst · Stream Analyst，角色边界清晰。
3. **Fallback 策略成熟**：API 失败时本地规则生成可读报告，保证 Demo 不白屏 — 产品思维正确。
4. **流式体验真实**：`/api/ai-stream` 对接 DeepSeek `stream: true`，前端逐 token 渲染，是合格的 AI 交互范式。
5. **输入上下文丰富**：Trend Analyst Prompt 注入阶段、SKU 竞争度、风险、90 天预测曲线，非空泛提问。

## 风险

1. **「AI 洗标签」**：Dashboard 多处 Badge 写 AI，但数据源是人工 Mock，面试官会追问「AI 贡献在哪」。
2. **Stream 分析缺数据 grounding**：仅传 `trendName` 字符串，LLM 靠幻觉补全，与 Forecast 页「数据驱动分析」形成反差。
3. **无成本控制**：Forecast 页 mount 即 `Promise.all` 批量调 3 次 LLM，无缓存、无 debounce、无 rate limit。
4. **无输出评测**：缺少 golden set、人工打分或 LLM-as-judge，无法迭代 Prompt。
5. **profitEstimate 等字段**：LLM 生成的毛利率区间缺乏依据，存在合规与信任风险。

## 优化建议

1. **RAG 或 Tool Use**：Stream 分析前先注入 `forecastData` + Google Trends 摘要，减少幻觉。
2. **缓存层**：同一趋势 24h 内复用 AI 报告，Redis 或文件缓存即可。
3. **显式 AI 状态**：UI 展示「AI 生成 · 规则兜底 · 缓存命中」三种来源。
4. **Prompt 版本化**：`prompts.ts` 加 `PROMPT_VERSION`，便于 A/B 与回归。
5. **评估脚本**：5 条固定趋势 + 期望字段完整性检查，CI 跑 smoke test。

## 评分：**74 / 100**

---

# 四、面试维度

> 假设候选人投递：**AI 前端开发实习生**

## 维度评估

| 维度 | 评分 | 说明 |
|---|---|---|
| 项目含金量 | ⭐⭐⭐⭐ | 功能广、技术点全，明显超过 Todo / 博客类项目 |
| 技术深度 | ⭐⭐⭐ | SSE、Zod、Engine 分离有深度，但未触及性能、测试、架构权衡 |
| 产品思维 | ⭐⭐⭐⭐ | 功能矩阵、用户路径、Fallback 设计体现产品意识 |
| 工程能力 | ⭐⭐⭐ | 代码可读性好，缺测试与工程化配套 |
| 面试项目标准 | **达到并超过普通实习 bar，接近优秀实习 bar** |

## 综合评分：**76 / 100**

---

## 面试官追问 TOP 20（含参考答案方向）

### 架构与 Next.js

**1. 为什么 Forecast 分析用 Client Component + `useEffect` fetch，而不是 Server Component 直接调 AI？**

> 参考答案方向：AI 调用耗时长（10–30s）、需 loading 态与客户端交互；Server Component 适合静态/缓存数据。可补充：可用 Server Actions + `useTransition`，或 Route Handler + SWR 优化。

**2. `/api/ai-stream` 的 SSE 是怎么实现的？和 WebSocket 有什么区别？**

> 参考答案方向：`ReadableStream` + `TextEncoder` + `data: xxx\n\n` 格式；SSE 单向、基于 HTTP、易过防火墙；WebSocket 双向但部署复杂。提到 `AbortController` 处理客户端断开。

**3. 为什么用 OpenAI SDK 调 DeepSeek，而不是直接 `fetch`？**

> 参考答案方向：SDK 封装重试、类型、流式 iterator；`baseURL` 切换即可换模型。代价是 bundle 体积，但 API Route 在 Node runtime 无此问题。

### TypeScript 与数据

**4. 为什么用 Zod 而不是手写 TypeScript interface 做 API 校验？**

> 参考答案方向：Runtime 校验 + 类型推断一体；`safeParse` 友好错误处理；AI JSON 输出必须 runtime parse，TS 编译期无法保证。

**5. `types/trend.ts` 从 `mock-data` re-export，你怎么看这种写法？**

> 参考答案方向：承认是 MVP 妥协；类型应独立于数据源；Mock 是实现细节，不应成为类型源。改进：types 定义接口，mock-data  satisfies Trend[]。

**6. Forecast Engine 的预测公式是什么？为什么按 Stage 写死 delta？**

> 参考答案方向：`FORECAST_MAP` 按 Emerging/Growing/Peak/Declining 给 d30/d60/d90；是规则引擎非 ML。应说明这是 Demo 简化，生产需时间序列或外部模型。

### AI 产品

**7. `analyzeTrend` catch 里 silent fallback，生产环境你会怎么处理？**

> 参考答案方向：Demo 可 silent；生产应 log + metric + UI 提示「AI 不可用，展示规则报告」；区分 fallback 与真实 AI 响应。

**8. Prompt 里要求 JSON 输出，模型仍可能违规，你如何防御？**

> 参考答案方向：`response_format: json_object` + Zod parse + retry once + fallback；可提 json repair 或 function calling。

**9. Stream 分析只传 trendName，如何保证输出质量？**

> 参考答案方向：承认当前不足；应注入 forecast、Google Trends、SKU 列表作为 context；或 RAG 检索行业报告。

**10. 批量 Forecast 分析一次请求调 3 次 LLM，如何优化成本和延迟？**

> 参考答案方向：合并为单次 batch prompt；加 Redis 缓存；lazy load 用户展开时才请求；edge cache + stale-while-revalidate。

**11. Alert Panel 叫 AI 预警，但代码是规则引擎，你怎么解释？**

> 参考答案方向：诚实说明 Alert 是规则触发 + `/api/alert-analysis` 是 LLM 增强；产品命名需与实现一致；计划 UI 接入 AI 分析。

### 前端工程

**12. 多个页面重复的 fetch 逻辑，你会怎么抽象？**

> 参考答案方向：自定义 `useAiQuery` hook；或 TanStack Query 管 cache/retry/stale；或 Server Component + suspense。

**13. 为什么项目没有选 Zustand / Redux？**

> 参考答案方向：当前无跨页共享状态，props + local state 足够；引入全局状态会增加复杂度。若加用户收藏/对比篮，再引入。

**14. Google Trends API 失败时 Mock fallback，UX 上有什么问题？**

> 参考答案方向：用户不知情；应 UI 标注「模拟数据」；或 disable 该模块并提示配置代理。

**15. 如何保证 `.env.local` 的 API Key 不泄露？**

> 参考答案方向：仅 Server Route 调用；`.gitignore` 已含 `.env*`；Vercel 环境变量；禁止 client 暴露；可提 key rotation。

### 产品与业务

**16. 这个项目和 Jasper / 普通 ChatGPT 套壳有什么本质区别？**

> 参考答案方向：有领域 Engine（forecast/comparison/opportunity）、结构化输出、垂直工作流；不是开放式对话。但数据真实性仍是短板。

**17. MVP 如果要给 10 个真实卖家用，你先改什么？**

> 参考答案方向：真实 Google Trends  pipeline、用户输入 keyword、报告导出、数据 source 标注、错误监控。

**18. comparison-engine 权重 40/30/20/10 怎么定的？**

> 参考答案方向：业务假设 + 可调参；应 A/B 或让卖家自定义权重；Engine 纯函数便于改。

**19. 如果 DeepSeek 换成 GPT-4o，改动量有多大？**

> 参考答案方向：改 `baseURL` + `apiKey` + model name；Prompt 可能需微调；抽象 `AiProvider` interface 更佳。

**20. 你做这个项目最大的技术难点是什么？**

> 参考答案方向：SSE 流式解析 buffer 拆包；或 AI JSON 不稳定 + Zod 校验；或 Next.js Client/Server 边界。需结合真实踩坑，忌背答案。

---

# 五、最终结论

## 产品等级

### ✅ **优秀实习项目**

（介于「普通实习项目」与「校招竞争力项目」之间）

**判定依据：**

- 超过典型课程 Demo：功能完整、UI  polished、真实 LLM 接入、SSE 流式
- 尚未达到校招 bar：缺测试、缺真实数据闭环、部分 AI 标签与实现不符、无工程化观测

若补 **测试 + 真实数据管道 + Alert AI 接入 UI + README 架构说明**，可冲击 **校招竞争力项目**。

---

## 总体评分

| 维度 | 分数 |
|---|---|
| 产品 | 72 |
| 前端工程 | 78 |
| AI 产品 | 74 |
| 面试表现（项目呈现） | 76 |
| **加权总分** | **75 / 100** |

---

## 未来最值得继续投入的 3 个方向

### 1. 真实数据管道（优先级：★★★★★）

将 Google Trends → Forecast Engine → 全站模块打通，以 `trendId` 为单一数据源，Mock 仅作 offline fallback。**这是从 Demo 到产品的分水岭。**

### 2. AI 能力诚实化 + 端到端闭环（优先级：★★★★☆）

- Alert / Insight 等模块接入已有 AI API  
- UI 标注数据来源（实时 / 缓存 / 规则兜底）  
- Stream 分析注入结构化 context，降低幻觉  

**这是从「像 AI 产品」到「是 AI 产品」的关键。**

### 3. 工程化底座：测试 · 缓存 · 可观测（优先级：★★★★☆）

- Engine 单元测试 + AI smoke test  
- AI 响应缓存与 cost 控制  
- 统一 API envelope 与错误上报  

**这是从「能跑 Demo」到「经得起面试官深挖」的护城河。**

---

*本报告基于仓库当前 main 分支代码静态审查与架构走读，未包含线上部署与用户实测数据。*
