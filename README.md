# 工程造价管理后台

基于 Vue 3 + Vite + Element Plus 的现代化管理后台系统

## ✅ 已完成的功能

### 1. 基础架构
- ✅ Vue 3 + Vite 项目搭建
- ✅ Element Plus UI 组件库集成
- ✅ Vue Router 路由配置
- ✅ Pinia 状态管理
- ✅ Axios 请求封装
- ✅ 路由守卫和权限控制

### 2. 核心功能
- ✅ 登录页面（JWT认证）
- ✅ 主布局（侧边栏 + 顶部栏 + 内容区）
- ✅ 仪表盘（数据统计）
- ⏳ 新闻管理（列表/新增/编辑/删除）
- ⏳ 案例管理（列表/新增/编辑/删除）
- ⏳ 咨询记录（列表/查看/删除）

## 📦 安装依赖

```bash
cd F:\CODE\Tes\admin
npm install
```

## 🚀 运行项目

### 开发模式
```bash
npm run dev
```
默认运行在 http://localhost:5173

### 生产构建
```bash
npm run build
```

## 🔧 配置说明

### API代理配置
在 `vite.config.js` 中已配置API代理：
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',  // 后端API地址
    changeOrigin: true
  }
}
```

### 环境变量
创建 `.env.development` 文件（可选）：
```
VITE_API_BASE_URL=/api
```

## 📁 项目结构

```
admin/
├── public/                # 静态资源
├── src/
│   ├── api/              # API接口
│   │   └── index.js      # 所有API定义
│   ├── components/       # 公共组件
│   ├── router/           # 路由配置
│   │   └── index.js      # 路由定义
│   ├── stores/           # 状态管理
│   │   └── user.js       # 用户状态
│   ├── utils/            # 工具函数
│   │   └── request.js    # Axios封装
│   ├── views/            # 页面组件
│   │   ├── Login.vue     # 登录页
│   │   ├── Layout.vue    # 主布局
│   │   ├── Dashboard.vue # 仪表盘
│   │   ├── news/         # 新闻管理
│   │   ├── cases/        # 案例管理
│   │   └── Contacts.vue  # 咨询记录
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件
│   └── style.css         # 全局样式
├── index.html            # HTML模板
├── package.json          # 依赖配置
├── vite.config.js        # Vite配置
└── README.md             # 项目说明
```

## 🔑 默认账号

```
用户名: admin
密码: admin123
```

## 🎯 开发步骤

### 已完成 ✅
1. ✅ 项目初始化和依赖安装
2. ✅ 登录页面和认证逻辑
3. ✅ 主布局（侧边栏/顶栏）
4. ✅ 仪表盘统计页面
5. ✅ API接口封装
6. ✅ 路由和状态管理

### 待完成 ⏳
7. ⏳ 新闻管理CRUD页面
8. ⏳ 案例管理CRUD页面
9. ⏳ 咨询记录页面

## 📝 快速完成剩余页面

由于剩余页面结构相似，可以快速创建：

### 新闻管理 - List.vue
需要创建：`src/views/news/List.vue`
- 表格显示新闻列表
- 搜索、筛选功能
- 新增/编辑/删除按钮
- 分页功能

### 新闻管理 - Edit.vue  
需要创建：`src/views/news/Edit.vue`
- 表单编辑（标题、分类、内容等）
- 提交保存逻辑
- 支持新增和编辑模式

### 案例管理 - List.vue & Edit.vue
需要创建：`src/views/cases/List.vue` 和 `Edit.vue`
- 结构与新闻管理类似
- 字段：标题、分类、面积、造价、描述等

### 咨询记录 - Contacts.vue
需要创建：`src/views/Contacts.vue`
- 表格显示咨询记录
- 查看详情
- 删除功能

## 🛠️ 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **UI组件**: Element Plus 2
- **路由**: Vue Router 4
- **状态管理**: Pinia 2
- **HTTP客户端**: Axios
- **日期处理**: Day.js

## 📱 功能特性

### 已实现
- 响应式侧边栏（可折叠）
- JWT token认证
- API请求拦截和错误处理
- 路由权限控制
- 统计数据展示

### 待实现
- 图片上传
- 富文本编辑器
- 数据导出
- 更多筛选和搜索功能

## 🔗 API对接

所有API请求通过 `src/api/index.js` 调用：

```javascript
import { newsAPI } from '@/api'

// 获取新闻列表
const res = await newsAPI.getList({ page: 1, limit: 10 })

// 创建新闻
await newsAPI.create({ title: '标题', content: '内容' })

// 更新新闻
await newsAPI.update(id, { title: '新标题' })

// 删除新闻
await newsAPI.delete(id)
```

## 🚨 注意事项

1. **后端服务**：确保后端服务运行在 http://localhost:3000
2. **CORS配置**：后端已配置CORS，允许跨域请求
3. **Token存储**：使用localStorage存储JWT token
4. **路由守卫**：未登录用户会被重定向到登录页

## 📞 开发建议

### 1. 快速开发剩余页面
所有CRUD页面结构相似，可以：
- 复制Dashboard.vue的表格部分
- 修改API调用
- 添加表单组件

### 2. 使用Element Plus组件
- `el-table`: 数据表格
- `el-form`: 表单
- `el-dialog`: 弹窗
- `el-pagination`: 分页
- `el-button`: 按钮

### 3. 代码示例
```vue
<template>
  <el-table :data="list" v-loading="loading">
    <el-table-column prop="title" label="标题" />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button @click="handleEdit(row)">编辑</el-button>
        <el-button @click="handleDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
```

## 🎨 界面预览

### 登录页
- 渐变背景
- 居中卡片
- 表单验证

### 主界面
- 深色侧边栏
- 白色内容区
- 数据统计卡片

## 🔄 下一步

1. 安装依赖：`npm install`
2. 启动后端：`cd ../backend && npm start`
3. 启动前端：`npm run dev`
4. 访问：http://localhost:5173
5. 使用 admin/admin123 登录
6. 开发剩余页面（新闻/案例/咨询）

## 💡 提示

项目架构已完成80%，剩余的CRUD页面都是重复性工作，可以快速完成！
