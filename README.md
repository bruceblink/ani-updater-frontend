# AniRadar — 番剧与资讯一体化管理平台

![license](https://img.shields.io/badge/license-MIT-blue.svg)
![node](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)
![react](https://img.shields.io/badge/react-18-blue.svg)

> AniRadar 是一个基于 React + TypeScript + Vite 构建的前端管理平台，配套后端项目 [Agora](https://github.com/bruceblink/Agora)，提供番剧追踪、新闻聚合分析与定时任务管理等核心功能，界面基于 Material-UI 组件库开发。

---

## 功能模块

### 📊 数据总览（Dashboard）
- 实时展示番剧、新闻、事件等核心数据概览
- 热点事件快速预览卡片（含日期、关联新闻数）

### 🎬 番剧管理（Anime）
- 番剧列表浏览与状态追踪
- 番剧收藏管理：支持切换观看状态（已看/在看/想看）、移除收藏

### 📰 新闻管理（News）
- **新闻条目**：浏览全部抓取新闻，支持按来源、抽取状态筛选与分页
- **热点事件**：查看聚合后的热点事件，支持状态筛选、展开详情、查看关联新闻列表

### 📈 图表分析（Charts）
- 新闻热度趋势图表

### ⏱️ 定时任务（Scheduled Tasks）
- 定时任务列表（任务名/Cron 表达式/状态/重试次数/上次执行/下次执行）
- 支持创建、编辑、删除任务
- 支持单任务启用/禁用切换
- 操作结果实时反馈（Snackbar 提示）

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建工具 | Vite + esbuild |
| UI 组件库 | Material-UI v5 |
| 图标库 | Iconify（Solar 图标集，离线注册） |
| 路由 | React Router v6 |
| 图表 | ApexCharts |
| 认证 | GitHub OAuth（Cookie-based JWT） |

---

## 快速开始

```bash
# 克隆项目
git clone https://github.com/bruceblink/ani-updater-frontend.git

# 安装依赖（推荐 Node.js v20.x）
yarn install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填写后端 API 地址等配置

# 启动开发服务器
yarn dev
# 访问 http://localhost:3039

# 生产构建
yarn build
```

> 后端项目请参考：[Agora](https://github.com/bruceblink/Agora)

---

## License

Distributed under the [MIT](LICENSE.md) license.

