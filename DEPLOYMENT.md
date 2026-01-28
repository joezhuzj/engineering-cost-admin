# 管理后台部署指南

## 方案1：部署到Vercel（推荐）

### 步骤1：推送到GitHub

```bash
cd F:\CODE\Tes\admin

# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Vue 3 管理后台完整版"

# 创建GitHub仓库（在 github.com/new）
# 然后关联远程仓库
git remote add origin https://github.com/你的用户名/engineering-cost-admin.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤2：部署到Vercel

#### 方法A：使用Vercel CLI（推荐）
```bash
# 安装Vercel CLI（如果没有）
npm install -g vercel

# 登录Vercel
vercel login

# 部署
vercel --prod
```

#### 方法B：通过Vercel网站
1. 访问 https://vercel.com
2. 登录（推荐用GitHub登录）
3. 点击 "New Project"
4. 导入你的GitHub仓库 `engineering-cost-admin`
5. 配置项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. 添加环境变量（可选）：
   - `VITE_API_BASE_URL`: `https://你的后端API地址.onrender.com/api`
7. 点击 "Deploy"

### 步骤3：配置API地址

部署完成后，需要修改API地址指向后端：

编辑 `src/utils/request.js`：
```javascript
const request = axios.create({
  baseURL: 'https://你的后端API地址.onrender.com/api',
  timeout: 10000
})
```

或者使用环境变量（推荐）：
```javascript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})
```

在Vercel项目设置中添加环境变量：
- Key: `VITE_API_BASE_URL`
- Value: `https://xxx.onrender.com/api`

---

## 方案2：部署到Netlify

### 步骤1：推送到GitHub（同上）

### 步骤2：部署到Netlify
1. 访问 https://netlify.com
2. 登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择GitHub并授权
5. 选择仓库 `engineering-cost-admin`
6. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. 添加环境变量：
   - `VITE_API_BASE_URL`
8. 点击 "Deploy site"

---

## 方案3：部署到自己的服务器

### 使用Nginx

```bash
# 1. 构建项目
npm run build

# 2. 将dist目录上传到服务器
scp -r dist/* user@your-server:/var/www/admin

# 3. 配置Nginx
# /etc/nginx/sites-available/admin
server {
    listen 80;
    server_name admin.yourdomain.com;

    root /var/www/admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 4. 启用配置
sudo ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 环境变量配置

### 开发环境 `.env.development`
```
VITE_API_BASE_URL=/api
```

### 生产环境 `.env.production`
```
VITE_API_BASE_URL=https://your-backend-api.onrender.com/api
```

---

## 部署后检查清单

- [ ] 前端可以访问
- [ ] 登录功能正常
- [ ] API请求不报CORS错误
- [ ] 数据能正常加载
- [ ] 新增/编辑/删除功能正常

---

## 常见问题

### 1. CORS错误
确保后端已配置CORS：
```javascript
// backend/server.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-admin.vercel.app'],
  credentials: true
}))
```

### 2. API请求404
检查API地址配置是否正确

### 3. 页面刷新404
确保配置了路由重写（vercel.json中已配置）

### 4. 构建失败
检查依赖是否完整：
```bash
npm install
npm run build
```

---

## 性能优化建议

### 1. 启用Gzip压缩
Vercel和Netlify默认启用

### 2. 代码分割
Vite已自动处理

### 3. 图片优化
使用WebP格式

### 4. CDN加速
Vercel和Netlify自带CDN

---

## 监控和分析

### Vercel Analytics
```bash
npm install @vercel/analytics
```

在 `main.js` 中：
```javascript
import { inject } from '@vercel/analytics'
inject()
```

---

## 回滚和版本管理

### 使用Git标签
```bash
# 标记版本
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0

# 回滚
git checkout v1.0.0
vercel --prod
```

---

## 总结

推荐使用 **Vercel** 部署：
- ✅ 免费
- ✅ 自动部署
- ✅ CDN加速
- ✅ HTTPS证书
- ✅ 自定义域名

部署完成后会得到类似的URL：
```
https://engineering-cost-admin.vercel.app
```
