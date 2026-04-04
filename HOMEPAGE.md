# 首页设计方案

## 概览

一个展示前端开发经历的个人作品集首页，以卡片为核心载体，融合 3D 鼠标跟随动画、视差滚动、渐变光效等高级视觉效果，强调技术实力的"第一印象"。

---

## 页面结构（从上到下）

### 1. Hero Section — 全屏入场

- 全屏高度，背景为深色渐变 + 粒子/网格动画（CSS 或轻量 canvas）
- 居中大标题：名字 + 一句话定位（如 "前端工程师 · 3 年经验"）
- 标题文字使用 `background-clip: text` 实现渐变色文字
- 鼠标移动时背景粒子/网格产生视差偏移（`transform: translate3d` 基于鼠标坐标）
- 底部一个向下滚动的提示动画（弹跳箭头）

### 2. 经历卡片区域 — 核心内容

#### 卡片设计

- 每张卡片代表一段工作/项目经历
- 卡片包含：公司/项目名称、时间段、角色、技术栈标签、简要描述
- 卡片采用玻璃拟态风格（`backdrop-filter: blur` + 半透明背景 + 细边框）

#### 3D 鼠标跟随效果（每张卡片）

- 鼠标在卡片上方移动时，卡片跟随鼠标位置做 3D 倾斜（`perspective` + `rotateX/rotateY`）
- 倾斜角度与鼠标到卡片中心的距离成正比，最大倾斜约 15°
- 卡片边缘产生动态高光/阴影（通过伪元素 `radial-gradient` 跟随鼠标位置）
- 鼠标离开卡片时平滑回正（`transition` 过渡）

#### 布局 & 响应式

- **桌面端（≥1200px）**：2 列网格，卡片间距 24px
- **平板端（768px–1199px）**：2 列网格，卡片间距 16px
- **移动端（<768px）**：单列堆叠，卡片全宽
- **小屏（<480px）**：卡片内边距缩小，字号调整

### 3. 技术栈展示区

- 横向滚动或网格排列的技术图标
- 图标有悬浮放大 + 光晕效果
- 可选：鼠标跟随的聚光灯效果（`radial-gradient` 叠加层跟随鼠标）

### 4. Footer 过渡

- 简洁的联系信息 / 社交链接
- 与 Header 主题色呼应

---

## 动画清单

| 动画 | 实现方式 | 作用位置 |
|------|----------|----------|
| 卡片 3D 鼠标倾斜 | JS 监听 `mousemove`，计算 `rotateX/Y` | 每张经历卡片 |
| 卡片动态高光 | JS 更新伪元素 `radial-gradient` 的 `left/top` | 卡片表面光效 |
| 背景粒子/网格视差 | JS 监听全局 `mousemove`，`translate3d` 偏移 | Hero 背景 |
| 卡片入场动画 | `IntersectionObserver` + CSS `@keyframes`（从下方滑入 + 淡入） | 卡片滚动进入视口时 |
| 标题渐变文字动画 | `background-size` 动画实现流光效果 | Hero 标题 |
| 滚动提示箭头 | CSS `@keyframes` 弹跳 | Hero 底部 |
| 技术栈图标悬浮 | CSS `:hover` 放大 + 光晕 `box-shadow` | 技术栈区域 |
| 页面滚动视差 | 不同层以不同速度位移（`transform: translateY` 基于 scroll） | Hero 内各元素 |

---

## 响应式断点（媒体查询）

```scss
// 变量
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1200px;

// 用法
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: $bp-lg) {
    gap: 16px;
  }

  @media (max-width: $bp-md) {
    grid-template-columns: 1fr;
  }

  @media (max-width: $bp-sm) {
    gap: 12px;
    padding: 0 12px;
  }
}
```

---

## 主题适配

- 支持项目已有的 `light/dark` 主题切换（通过 `data-theme` 属性 + CSS 变量）
- 卡片玻璃拟态在暗色模式下使用深色半透明背景
- 高光效果在暗色模式下更明显（对比度更高）
- 渐变色方案跟随 `theme.css` 中定义的 `--primary-color` / `--secondary-color`

---

## 技术约束

- **纯 CSS + 少量原生 JS**：不引入额外动画库（如 GSAP），保持轻量
- **`<ClientOnly>` 包裹**：涉及 DOM 操作的动画组件需用 `<ClientOnly>` 包裹，避免 SSR 报错
- **`requestAnimationFrame`**：鼠标跟随动画使用 rAF 节流，避免性能问题
- **`will-change: transform`**：为动画元素启用 GPU 加速
- **`prefers-reduced-motion`**：尊重用户系统设置，减少动画

---

## 文件规划

```
app/
├── components/
│   ├── HeroSection.vue          # 全屏 Hero
│   ├── ExperienceCard.vue       # 单张经历卡片（含 3D 倾斜逻辑）
│   ├── ExperienceGrid.vue       # 卡片网格容器
│   ├── TechStack.vue            # 技术栈展示
│   └── ParallaxBackground.vue   # Hero 背景粒子/网格
├── pages/
│   └── index.vue                # 首页，组合以上组件
└── assets/
    └── css/
        └── homepage.scss        # 首页专属样式（动画、响应式）
```

---

## 经历卡片数据结构

```ts
interface ExperienceCard {
  id: number
  company: string
  role: string
  period: string           // "2023.06 - 至今"
  description: string
  tags: string[]           // ["Vue 3", "TypeScript", "Nuxt"]
  color?: string           // 卡片主题色（可选，用于高光/边框）
}
```
