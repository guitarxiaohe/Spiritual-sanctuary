# 🫧 港湾 - 匿名故事分享平台

> 不知道找谁说的时候，说给陌生人听

一个基于 Nuxt 3 开发的匿名故事分享平台，这里大家互不相识，没有评判，只有倾听。你的故事不会消失，总有人懂你。

## ✨ 功能特性

- 📝 **故事分享** - 匿名分享你的故事，找到共鸣
- 🏷️ **标签筛选** - 通过标签快速找到相关故事
- 💔 **共鸣互动** - 点赞表达共鸣，抱抱传递温暖
- 🌓 **主题切换** - 支持深色/浅色主题，保护你的眼睛
- 📱 **响应式设计** - 完美适配桌面端、平板和移动端
- 🎨 **精美动效** - 流畅的卡片动画和交互反馈

## 🛠️ 技术栈

| 技术                                          | 说明                   |
| --------------------------------------------- | ---------------------- |
| [Nuxt 4](https://nuxt.com/)                   | Vue 3 全栈框架         |
| [Vue 3](https://vuejs.org/)                   | 渐进式 JavaScript 框架 |
| [Pinia](https://pinia.vuejs.org/)             | Vue 状态管理           |
| [Element Plus](https://element-plus.org/)     | Vue 3 UI 组件库        |
| [Nuxt UI](https://ui.nuxt.com/)               | Nuxt UI 组件库         |
| [SCSS](https://sass-lang.com/)                | CSS 预处理器           |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全               |

## 📁 项目结构

```
nuxt-app/
├── app/
│   ├── assets/           # 静态资源
│   │   ├── css/          # 全局样式
│   │   └── styles/       # 组件样式
│   ├── components/       # Vue 组件
│   │   ├── ExperienceCard.vue
│   │   ├── ExperienceGrid.vue
│   │   ├── HeroSection.vue
│   │   ├── ParallaxBackground.vue
│   │   ├── StoryCard.vue
│   │   ├── TechStack.vue
│   │   └── ThemeSwitcher.vue
│   ├── composables/      # 组合式函数
│   │   ├── useStories.ts
│   │   └── useTheme.ts
│   ├── data/             # 故事数据 (JSON)
│   ├── layouts/          # 布局组件
│   │   ├── Footer.vue
│   │   ├── Header.vue
│   │   └── index.vue
│   ├── pages/            # 页面路由
│   │   ├── index.vue
│   │   └── stories/
│   │       └── [id].vue
│   ├── plugins/          # Nuxt 插件
│   ├── stores/           # Pinia 状态管理
│   └── app.vue           # 根组件
├── configs/              # 配置文件
│   ├── base/
│   └── vite/
├── public/               # 公共静态资源
├── nuxt.config.ts        # Nuxt 配置
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- pnpm / npm / yarn / bun

### 安装依赖

```bash
# pnpm (推荐)
pnpm install

# npm
npm install

# yarn
yarn install

# bun
bun install
```

### 开发模式

启动开发服务器，访问 `http://localhost:3000`：

```bash
# pnpm
pnpm dev

# npm
npm run dev

# yarn
yarn dev

# bun
bun run dev
```

### 生产构建

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview

# 静态生成
pnpm generate
```

## 📖 页面说明

### 首页 (`/`)

- Hero 区域展示平台介绍和统计数据
- 标签筛选栏快速过滤故事
- 故事卡片网格展示
- 支持点赞（共鸣）和抱抱互动

### 故事详情 (`/stories/:id`)

- 展示完整故事内容
- 显示故事分类、标签、日期等信息
- 支持互动操作

## 🎨 主题系统

项目内置深色/浅色主题切换，通过 CSS 变量实现：

```css
:root {
  --theme-primary: #1a1a2e;
  --theme-secondary: #4a4e69;
  --theme-bgc: #fafafa;
}

[data-theme='dark'] {
  --theme-primary: #e0e0e0;
  --theme-secondary: #9a8c98;
  --theme-bgc: #0f0f1a;
}
```

## 📝 添加新故事

在 `app/data/` 目录下创建新的 JSON 文件：

```json
{
  "category": "分类名称",
  "emoji": "🌟",
  "title": "故事标题",
  "preview": "故事预览内容...",
  "content": "完整故事内容...",
  "tags": ["标签1", "标签2"],
  "likes": 0,
  "xiatou": 0,
  "date": "2024-01-01"
}
```

文件命名格式：`{序号}-{拼音名称}.json`，如 `09-xin-gushi.json`

## 🔧 配置说明

### Nuxt 配置

项目采用分层配置结构：

- `nuxt.config.ts` - 主配置入口
- `configs/base/nuxt.config.ts` - 基础配置（模块、CSS、主题等）
- `configs/vite/nuxt.config.ts` - Vite 构建配置

### 已安装模块

- `@element-plus/nuxt` - Element Plus 集成
- `@pinia/nuxt` - Pinia 状态管理
- `@nuxtjs/color-mode` - 主题切换

## 📄 License

MIT License

---

<div align="center">
  <sub>Built with ❤️ using Nuxt 3</sub>
</div>
