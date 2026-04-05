# 港湾 - 后端 API 设计文档

## 概述

基于 Nuxt 4 + SQLite 构建全栈应用，使用 Nuxt Server API 提供后端服务。

---

## 技术栈

| 技术           | 说明                               |
| -------------- | ---------------------------------- |
| Nuxt 4         | 全栈框架（前端 + Server API）      |
| SQLite         | 轻量级数据库（无需安装，文件存储） |
| better-sqlite3 | SQLite 同步驱动                    |
| uuid           | UUID 生成                          |

---

## 数据库设计

### 1. stories 表（故事

```sql
CREATE TABLE stories (
  id TEXT PRIMARY KEY,           -- UUID
  category TEXT NOT NULL,        -- 分类
  emoji TEXT NOT NULL,           -- 表情
  title TEXT NOT NULL,           -- 标题
  preview TEXT NOT NULL,         -- 预览
  content TEXT NOT NULL,         -- 完整内容
  tags TEXT NOT NULL,            -- 标签（JSON 数组）
  likes INTEGER DEFAULT 0,       -- 点赞数
  baobao INTEGER DEFAULT 0,      -- 抱抱数
  date TEXT NOT NULL,            -- 发布日期
  created_at TEXT NOT NULL       -- 创建时间
);
```

### 2. comments 表（评论）

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,           -- UUID
  story_id TEXT NOT NULL,        -- 关联故事 ID
  parent_id TEXT DEFAULT NULL,   -- 父评论 ID（用于回复）
  content TEXT NOT NULL,         -- 评论内容
  avatar TEXT NOT NULL,          -- 头像（随机分配）
  nickname TEXT NOT NULL,        -- 昵称（随机分配）
  created_at TEXT NOT NULL,      -- 创建时间
  FOREIGN KEY (story_id) REFERENCES stories(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);
```

---

## API 接口设计

### 基础路径

```
http://localhost:3000/api
```

### 1. 故事相关

#### 1.1 获取故事列表

```
GET /api/stories
```

**Query 参数：**

| 参数  | 类型   | 必填 | 说明              |
| ----- | ------ | ---- | ----------------- |
| page  | number | 否   | 页码，默认 1      |
| limit | number | 否   | 每页数量，默认 10 |
| tag   | string | 否   | 按标签筛选        |

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "category": "经典语录",
        "emoji": "💔",
        "title": "「我只是不想耽误你」",
        "preview": "...",
        "content": "...",
        "tags": ["分手借口", "甩锅大师"],
        "likes": 2341,
        "baobao": 6782,
        "date": "2026-03-28"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

#### 1.2 获取单个故事

```
GET /api/stories/:id
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "category": "经典语录",
    "emoji": "💔",
    "title": "「我只是不想耽误你」",
    "preview": "...",
    "content": "...",
    "tags": ["分手借口", "甩锅大师"],
    "likes": 2341,
    "baobao": 6782,
    "date": "2026-03-28"
  }
}
```

#### 1.3 新增故事

```
POST /api/stories
```

**请求体：**

```json
{
  "category": "经典语录",
  "emoji": "💔",
  "title": "故事标题",
  "preview": "预览内容...",
  "content": "完整内容...",
  "tags": ["标签1", "标签2"]
}
```

**字段说明：**

| 字段     | 类型     | 必填 | 说明                                     |
| -------- | -------- | ---- | ---------------------------------------- |
| category | string   | 是   | 分类                                     |
| emoji    | string   | 是   | 表情符号                                 |
| title    | string   | 是   | 标题                                     |
| preview  | string   | 是   | 预览内容（自动截取 content 前 100 字符） |
| content  | string   | 是   | 完整内容                                 |
| tags     | string[] | 是   | 标签数组                                 |

**响应示例：**

```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

#### 1.4 点赞

```
POST /api/stories/:id/like
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "likes": 2342
  }
}
```

#### 1.5 抱抱

```
POST /api/stories/:id/baobao
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "baobao": 6783
  }
}
```

---

### 2. 评论相关

#### 2.1 获取评论列表

```
GET /api/stories/:storyId/comments
```

**Query 参数：**

| 参数  | 类型   | 必填 | 说明              |
| ----- | ------ | ---- | ----------------- |
| page  | number | 否   | 页码，默认 1      |
| limit | number | 否   | 每页数量，默认 20 |

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "story_id": "550e8400-e29b-41d4-a716-446655440000",
        "parent_id": null,
        "content": "这个故事让我想起了...",
        "avatar": "🦊",
        "nickname": "小狐狸",
        "created_at": "2026-03-28 12:30:00",
        "replies": [
          {
            "id": "660e8400-e29b-41d4-a716-446655440002",
            "story_id": "550e8400-e29b-41d4-a716-446655440000",
            "parent_id": "660e8400-e29b-41d4-a716-446655440001",
            "content": "同感！",
            "avatar": "🐱",
            "nickname": "小猫咪",
            "created_at": "2026-03-28 12:35:00"
          }
        ]
      }
    ],
    "total": 50
  }
}
```

#### 2.2 发表评论

```
POST /api/stories/:storyId/comments
```

**请求体：**

```json
{
  "content": "评论内容...",
  "parent_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

**字段说明：**

| 字段      | 类型   | 必填 | 说明                    |
| --------- | ------ | ---- | ----------------------- |
| content   | string | 是   | 评论内容                |
| parent_id | string | 否   | 父评论 ID（回复时必填） |

**响应示例：**

```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "avatar": "🐶",
    "nickname": "小狗狗"
  }
}
```

---

### 3. 标签相关

#### 3.1 获取所有标签

```
GET /api/tags
```

**响应示例：**

```json
{
  "code": 200,
  "data": ["分手借口", "甩锅大师", "另有新欢", "职场故事", "家庭琐事", "友情岁月"]
}
```

---

## 随机头像与昵称

### 头像枚举

```javascript
const AVATARS = [
  '🦊',
  '🐱',
  '🐶',
  '🐼',
  '🐨',
  '🦁',
  '🐯',
  '🐮',
  '🐷',
  '🐸',
  '🐵',
  '🐔',
  '🐧',
  '🐦',
  '🦆',
  '🦅',
  '🦉',
  '🦋',
  '🐌',
  '🐛',
  '🦀',
  '🐙',
  '🦕',
  '🦖',
  '🐳',
  '🐋',
  '🐬',
  '🐟',
  '🦈',
  '🐊',
  '🐅',
  '🐆',
]
```

### 昵称枚举

```javascript
const NICKNAMES = [
  '小狐狸',
  '小猫咪',
  '小狗狗',
  '大熊猫',
  '考拉君',
  '狮子王',
  '小老虎',
  '牛牛',
  '小猪猪',
  '青蛙王子',
  '美猴王',
  '小鸡仔',
  '企鹅宝宝',
  '小鸟儿',
  '小黄鸭',
  '老鹰',
  '猫头鹰',
  '小蝴蝶',
  '小蜗牛',
  '毛毛虫',
  '小螃蟹',
  '章鱼哥',
  '恐龙妹',
  '霸王龙',
  '大鲸鱼',
  '小蓝鲸',
  '海豚音',
  '小鱼儿',
  '大白鲨',
  '鳄鱼先生',
  '小豹子',
  '花豹',
  '匿名用户',
  '路过的',
  '陌生人',
  '倾听者',
  '故事人',
  '夜猫子',
  '早起鸟',
  '潜水员',
]
```

### 随机分配逻辑

```javascript
function getRandomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)]
}

function getRandomNickname() {
  return NICKNAMES[Math.floor(Math.random() * NICKNAMES.length)]
}
```

---

## 项目目录结构

```
nuxt-app/
├── server/
│   ├── api/
│   │   ├── stories/
│   │   │   ├── index.get.ts      # GET /api/stories
│   │   │   ├── index.post.ts     # POST /api/stories
│   │   │   ├── [id].get.ts       # GET /api/stories/:id
│   │   │   ├── [id]/
│   │   │   │   ├── like.post.ts  # POST /api/stories/:id/like
│   │   │   │   ├── baobao.post.ts# POST /api/stories/:id/baobao
│   │   │   │   └── comments/
│   │   │   │       ├── index.get.ts  # GET /api/stories/:id/comments
│   │   │   │       └── index.post.ts # POST /api/stories/:id/comments
│   │   └── tags/
│   │       └── index.get.ts      # GET /api/tags
│   ├── database/
│   │   ├── index.ts              # 数据库连接
│   │   ├── init.ts               # 初始化表结构
│   │   └── data.db               # SQLite 数据库文件
│   └── utils/
│       └── random.ts             # 随机头像昵称工具
├── app/
│   └── ...                       # 前端代码
└── nuxt.config.ts
```

---

## 前端改动

### 1. 新增故事页面

**路径：** `/create`

**表单字段：**

| 字段     | 类型       | 说明                     |
| -------- | ---------- | ------------------------ |
| category | 下拉选择   | 分类选择                 |
| emoji    | 表情选择器 | 表情选择                 |
| title    | 文本输入   | 标题                     |
| content  | 文本域     | 完整内容                 |
| tags     | 可搜索下拉 | 标签（可多选，可自定义） |

### 2. 故事详情页评论组件

**功能：**

- 评论列表（支持嵌套回复）
- 发表评论
- 回复评论

### 3. 数据流调整

```
前端 useStories composable
       ↓
   useFetch / $fetch
       ↓
   Nuxt Server API
       ↓
   SQLite 数据库
```

---

## 错误码定义

| 错误码 | 说明       |
| ------ | ---------- |
| 200    | 成功       |
| 400    | 参数错误   |
| 404    | 资源不存在 |
| 500    | 服务器错误 |

**错误响应格式：**

```json
{
  "code": 400,
  "message": "标题不能为空",
  "data": null
}
```

---

## 部署说明

### 开发环境

```bash
npm run dev
```

### 生产环境

```bash
npm run build
npm run preview
```

### 环境变量

```env
NUXT_DB_PATH=./server/database/data.db
```

---

## 安全考虑

1. **内容过滤** - 敏感词过滤（可选）
2. **频率限制** - 同一 IP 发帖/评论频率限制
3. **内容长度** - 标题/内容最大长度限制
4. **XSS 防护** - 输入内容转义

---

## 后续扩展

- [ ] 管理后台
- [ ] 内容审核
- [ ] 数据统计
- [ ] 导出功能
