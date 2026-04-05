# 🫧 港湾 - 匿名故事分享平台

> 不知道找谁说的时候，说给陌生人听

一个基于 Nuxt 4 开发的匿名故事分享平台，这里大家互不相识，没有评判，只有倾听。你的故事不会消失，总有人懂你。

## ✨ 功能特性

- 📝 **故事分享** - 匿名分享你的故事，找到共鸣
- 💬 **评论互动** - 支持嵌套回复，匿名交流
- 🏷️ **标签筛选** - 通过标签快速找到相关故事
- 💔 **共鸣互动** - 点赞表达共鸣，抱抱传递温暖
- 🌓 **主题切换** - 支持深色/浅色主题，多种配色方案
- 🎨 **精美动效** - 主题切换动画、卡片动画和交互反馈
- 📱 **响应式设计** - 完美适配桌面端、平板和移动端
- 🛡️ **安全防护** - IP 限流防止恶意请求

## 🛠️ 技术栈

| 技术                                                         | 说明                                |
| ------------------------------------------------------------ | ----------------------------------- |
| [Nuxt 4](https://nuxt.com/)                                  | Vue 3 全栈框架（前端 + Server API） |
| [Vue 3](https://vuejs.org/)                                  | 渐进式 JavaScript 框架              |
| [Pinia](https://pinia.vuejs.org/)                            | Vue 状态管理                        |
| [VueUse](https://vueuse.org/)                                | Vue 组合式 API 工具集               |
| [SQLite](https://www.sqlite.org/)                            | 轻量级嵌入式数据库                  |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | SQLite 同步驱动                     |
| [SCSS](https://sass-lang.com/)                               | CSS 预处理器                        |
| [TypeScript](https://www.typescriptlang.org/)                | 类型安全                            |

## 📁 项目结构

```
nuxt-app/
├── app/
│   ├── assets/
│   │   └── css/              # 全局样式（主题变量）
│   ├── components/           # Vue 组件
│   │   ├── Comments.vue      # 评论组件
│   │   ├── StoryCard.vue     # 故事卡片
│   │   └── ThemeSwitcher.vue # 主题切换器
│   ├── composables/          # 组合式函数
│   │   ├── useStories.ts     # 故事数据管理
│   │   └── useTheme.ts       # 主题控制
│   ├── data/                 # 静态故事数据 (JSON)
│   ├── layouts/              # 布局组件
│   │   ├── Header.vue        # 顶部导航
│   │   └── Footer.vue        # 底部信息
│   ├── pages/                # 页面路由
│   │   ├── index.vue         # 首页
│   │   ├── create.vue        # 发布故事页
│   │   └── stories/[id].vue  # 故事详情页
│   ├── plugins/              # Nuxt 插件
│   ├── stores/               # Pinia 状态管理
│   └── app.vue               # 根组件
├── server/
│   ├── api/                  # Server API 路由
│   │   ├── rate-limit.get.ts # 限流状态查询
│   │   ├── stories/          # 故事相关 API
│   │   │   ├── index.get.ts  # 获取故事列表
│   │   │   ├── index.post.ts # 发布新故事
│   │   │   └── [id]/         # 单个故事操作
│   │   │       ├── like.post.ts    # 点赞
│   │   │       ├── baobao.post.ts  # 抱抱
│   │   │       └── comments/       # 评论 API
│   │   └── tags/             # 标签 API
│   ├── database/             # 数据库
│   │   ├── index.ts          # 数据库初始化
│   │   └── data.db           # SQLite 数据文件
│   └── utils/                # 服务端工具
│       ├── random.ts         # 随机头像昵称
│       └── rateLimit.ts      # IP 限流
├── configs/                  # 配置文件
├── public/                   # 公共静态资源
├── nuxt.config.ts            # Nuxt 配置
└── package.json
```

## 🚀 快速开始

### 环境要求

- Node.js 20.x 或更高版本
- pnpm 9.x 或更高版本

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动开发服务器，访问 `http://localhost:3000`：

```bash
pnpm dev
```

### 生产构建

```bash
# 构建
pnpm build

# 预览构建结果
pnpm preview
```

## 📖 页面说明

### 首页 (`/`)

- Hero 区域展示平台介绍和统计数据
- 标签筛选栏快速过滤故事
- 故事卡片网格展示
- 浮动按钮快速发布新故事
- 支持点赞（共鸣）和抱抱互动

### 发布故事 (`/create`)

- 选择分类和心情表情
- 输入标题和故事内容
- 添加标签（支持自定义）
- 显示剩余发布次数
- IP 限流保护（每小时 5 次）

### 故事详情 (`/stories/:id`)

- 展示完整故事内容
- 显示故事分类、标签、日期等信息
- 评论区域（支持嵌套回复）
- 支持互动操作

## 🎨 主题系统

项目内置多种主题配色，支持深色/浅色模式切换：

| 配色方案 | 主色    | 辅助色  |
| -------- | ------- | ------- |
| Rose     | #f43f5e | #c084fc |
| Emerald  | #10b981 | #38bdf8 |
| Amber    | #f59e0b | #ef4444 |
| Green    | #22c55e | #a3e635 |
| Ocean    | #3b82f6 | #22d3ee |

主题切换带有方向性动画效果：

- 白天 → 黑夜：从左到右过渡
- 黑夜 → 白天：从右到左过渡

## 🛡️ 安全防护

### IP 限流

| 配置项   | 值     |
| -------- | ------ |
| 时间窗口 | 1 小时 |
| 最大请求 | 5 次   |
| 封禁时长 | 1 小时 |

### 内容验证

- 标题：最多 100 字
- 故事内容：最多 5000 字
- 评论内容：最多 1000 字

## 📊 数据库设计

### stories 表（故事）

| 字段       | 类型    | 说明              |
| ---------- | ------- | ----------------- |
| id         | TEXT    | UUID 主键         |
| category   | TEXT    | 分类              |
| emoji      | TEXT    | 心情表情          |
| title      | TEXT    | 标题              |
| preview    | TEXT    | 预览内容          |
| content    | TEXT    | 完整内容          |
| tags       | TEXT    | 标签（JSON 数组） |
| likes      | INTEGER | 点赞数            |
| baobao     | INTEGER | 抱抱数            |
| date       | TEXT    | 发布日期          |
| created_at | TEXT    | 创建时间          |

### comments 表（评论）

| 字段       | 类型 | 说明        |
| ---------- | ---- | ----------- |
| id         | TEXT | UUID 主键   |
| story_id   | TEXT | 关联故事 ID |
| parent_id  | TEXT | 父评论 ID   |
| content    | TEXT | 评论内容    |
| avatar     | TEXT | 随机头像    |
| nickname   | TEXT | 随机昵称    |
| created_at | TEXT | 创建时间    |

## � API 接口

### 故事相关

```
GET  /api/stories          # 获取故事列表
POST /api/stories          # 发布新故事
GET  /api/stories/:id      # 获取单个故事
POST /api/stories/:id/like # 点赞/取消点赞
POST /api/stories/:id/baobao # 抱抱/取消抱抱
```

### 评论相关

```
GET  /api/stories/:id/comments # 获取评论列表
POST /api/stories/:id/comments # 发表评论
```

### 其他

```
GET /api/tags         # 获取所有标签
GET /api/rate-limit   # 获取限流状态
```

## 📝 开发说明

### 添加新的配色方案

1. 在 `app/stores/modules/system/type.ts` 中添加配色定义
2. 在 `app/assets/css/theme.css` 中添加 CSS 变量
3. 在 `ThemeSwitcher.vue` 中添加选项

### 本地数据存储

数据存储在 `server/database/data.db`，这是一个 SQLite 数据库文件。首次运行时会自动创建表结构。

## 📄 License

MIT License

---

<div align="center">
  <sub>Built with ❤️ using Nuxt 4</sub>
</div>
