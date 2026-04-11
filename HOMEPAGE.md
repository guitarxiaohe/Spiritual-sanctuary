# 港湾 - 匿名故事分享平台

## 概览

一个基于 Nuxt 4 开发的匿名故事分享平台，"不知道找谁说的时候，说给陌生人听"。这里大家互不相识，没有评判，只有倾听。你的故事不会消失，总有人懂你。

---

## 核心功能

### 1. 故事分享系统

- **匿名发布** - 无需登录，任何人都可以分享故事
- **随机身份** - 系统自动分配随机头像和昵称
- **标签分类** - 通过标签筛选感兴趣的故事
- **UUID 标识** - 使用 UUID 防止 ID 失真

### 2. 互动功能

- **点赞共鸣** - 表达对故事的认同
- **抱抱温暖** - 传递温暖和支持
- **嵌套评论** - 支持多层级回复
- **实时更新** - 互动数据实时保存到数据库

### 3. 主题系统

- **深色/浅色模式** - 跟随系统或手动切换
- **多种配色方案** - 默认蓝、绿色、海洋蓝等
- **平滑过渡动画** - 主题切换时的渐变效果
- **CSS 变量驱动** - 方便扩展新主题

### 4. 国际化支持

支持五种语言：

- 🇨🇳 中文（简体）
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇹🇭 ไทย

### 5. 安全防护

- **IP 限流** - 每小时最多 5 次发布请求
- **自动清理** - 定期清理过期限流记录
- **代理支持** - 正确识别真实 IP

---

## 页面结构

### 1. 首页 (index.vue)

- **Hero 区域** - 全屏背景，标题和简介
- **故事列表** - 瀑布流展示所有故事
- **标签筛选** - 快速筛选相关故事
- **发布入口** - "我也想写一条"按钮

### 2. 发布页 (create.vue)

- **故事内容** - 文本输入框
- **标签选择** - 可自定义标签
- **随机身份** - 显示随机头像和昵称
- **发布限制** - IP 限流保护

### 3. 故事详情页 (stories/[id].vue)

- **故事详情** - 完整故事内容
- **互动按钮** - 点赞和抱抱
- **评论区域** - 嵌套评论展示
- **评论输入** - 匿名评论功能

---

## 技术架构

### 前端技术栈

| 技术         | 说明                   |
| ------------ | ---------------------- |
| Nuxt 4       | Vue 3 全栈框架         |
| Vue 3        | 渐进式 JavaScript 框架 |
| Pinia        | 状态管理               |
| VueUse       | 组合式 API 工具集      |
| @nuxtjs/i18n | 国际化模块             |
| SCSS         | CSS 预处理器           |
| TypeScript   | 类型安全               |

### 后端技术栈

| 技术            | 说明         |
| --------------- | ------------ |
| Nuxt Server API | 服务端 API   |
| SQLite          | 嵌入式数据库 |
| better-sqlite3  | SQLite 驱动  |
| UUID            | 唯一标识符   |

### 开发工具

| 工具     | 说明       |
| -------- | ---------- |
| Husky    | Git 钩子   |
| Prettier | 代码格式化 |
| pnpm     | 包管理器   |

---

## 数据库设计

### stories 表

```sql
CREATE TABLE stories (
  id TEXT PRIMARY KEY,           -- UUID
  content TEXT NOT NULL,         -- 故事内容
  author_name TEXT NOT NULL,     -- 作者昵称
  author_avatar TEXT NOT NULL,   -- 作者头像
  tags TEXT,                     -- 标签（JSON 数组）
  likes INTEGER DEFAULT 0,       -- 点赞数
  baobao INTEGER DEFAULT 0,      -- 抱抱数
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
```

### comments 表

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,           -- UUID
  story_id TEXT NOT NULL,        -- 故事 ID
  parent_id TEXT,                -- 父评论 ID
  content TEXT NOT NULL,         -- 评论内容
  author_name TEXT NOT NULL,     -- 作者昵称
  author_avatar TEXT NOT NULL,   -- 作者头像
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (story_id) REFERENCES stories(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
)
```

### rate_limits 表

```sql
CREATE TABLE rate_limits (
  ip TEXT PRIMARY KEY,           -- IP 地址
  count INTEGER DEFAULT 1,       -- 请求次数
  blocked_until TEXT             -- 封禁截止时间
)
```

---

## API 接口

### 故事相关

| 方法 | 路径                    | 说明          |
| ---- | ----------------------- | ------------- |
| GET  | /api/stories            | 获取故事列表  |
| POST | /api/stories            | 发布新故事    |
| GET  | /api/stories/:id        | 获取单个故事  |
| POST | /api/stories/:id/like   | 点赞/取消点赞 |
| POST | /api/stories/:id/baobao | 抱抱/取消抱抱 |

### 评论相关

| 方法 | 路径                      | 说明         |
| ---- | ------------------------- | ------------ |
| GET  | /api/stories/:id/comments | 获取评论列表 |
| POST | /api/stories/:id/comments | 发表评论     |

### 标签相关

| 方法 | 路径      | 说明         |
| ---- | --------- | ------------ |
| GET  | /api/tags | 获取所有标签 |

### 限流相关

| 方法 | 路径            | 说明         |
| ---- | --------------- | ------------ |
| GET  | /api/rate-limit | 查询限流状态 |

---

## 主题系统

### CSS 变量

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --theme-text: #1f2937;
  --theme-text-muted: #6b7280;
  --theme-bg: #ffffff;
  --theme-surface: #f9fafb;
}

[data-theme='dark'] {
  --theme-text: #f9fafb;
  --theme-text-muted: #9ca3af;
  --theme-bg: #111827;
  --theme-surface: #1f2937;
}
```

### 配色方案

- **默认蓝** - #3b82f6
- **绿色** - #10b981
- **海洋蓝** - #006bea

---

## 国际化结构

```
i18n/locales/
├── zh/           # 中文
│   ├── common.json
│   ├── hero.json
│   ├── create.json
│   └── comments.json
├── en/           # 英语
├── ja/           # 日语
├── ko/           # 韩语
└── th/           # 泰语
```

---

## 文件结构

```
nuxt-app/
├── app/
│   ├── assets/css/          # 样式文件
│   ├── components/          # Vue 组件
│   ├── composables/         # 组合式函数
│   ├── data/               # 静态数据
│   ├── layouts/            # 布局组件
│   ├── pages/              # 页面路由
│   ├── plugins/            # Nuxt 插件
│   └── stores/             # Pinia 状态管理
├── i18n/locales/           # 国际化文件
├── server/
│   ├── api/                # Server API 路由
│   ├── database/           # 数据库文件
│   └── utils/              # 服务端工具
├── IDE/                    # 想法收集文件夹
├── public/                 # 公共静态资源
└── nuxt.config.ts          # Nuxt 配置
```

---

## 响应式设计

### 断点设置

```scss
$bp-sm: 480px; // 小屏手机
$bp-md: 768px; // 平板
$bp-lg: 1200px; // 桌面
```

### 适配策略

- **桌面端（≥1200px）** - 双列布局，完整功能
- **平板端（768px–1199px）** - 双列布局，优化间距
- **移动端（<768px）** - 单列布局，简化交互
- **小屏（<480px）** - 紧凑布局，优化触控

---

## 性能优化

- **GPU 加速** - 使用 `will-change` 和 `transform`
- **懒加载** - 图片和组件按需加载
- **代码分割** - 自动路由分割
- **SSR 优化** - 服务端渲染提升首屏速度
- **客户端存储** - localStorage 缓存用户状态

---

## 开发规范

### Git 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 分支管理

- `main` - 生产分支
- `dev` - 开发分支
- 功能分支 - 从 dev 创建

### 代码格式化

- 使用 Prettier 自动格式化
- Husky pre-commit 钩子自动执行
- 统一代码风格

---

## 未来规划

查看 [IDE 文件夹](./IDE/) 了解更多想法和改进建议。

### 计划功能

- [ ] 用户注册/登录系统
- [ ] 故事收藏功能
- [ ] 私信功能
- [ ] 举报机制
- [ ] 管理后台
- [ ] 数据统计
- [ ] 消息通知
- [ ] 分享功能

---

## 贡献指南

欢迎在 [IDE 文件夹](./IDE/) 中提交你的想法和改进建议！

### 如何贡献

1. 在 IDE 文件夹中创建新的想法文件夹
2. 按照 [IDE/README.md](./IDE/README.md) 规范编写文档
3. 提交 Pull Request

---

## 许可证

MIT License
