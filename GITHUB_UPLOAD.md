# GitHub上传步骤

## ✅ Git已初始化完成

代码已经commit，现在需要推送到GitHub。

---

## 📤 推送到GitHub

### 第1步：创建GitHub仓库

1. 打开浏览器，访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `engineering-cost-admin`
   - **Description**: `工程造价管理后台 - Vue3 + Element Plus`
   - **Public** 或 **Private**（根据需要选择）
   - ❌ **不要勾选** "Add a README file"
   - ❌ **不要勾选** "Add .gitignore"
   - ❌ **不要勾选** "Choose a license"
3. 点击 **"Create repository"**

### 第2步：关联远程仓库

创建完成后，GitHub会显示命令，或者执行：

```bash
# 在PowerShell中执行（当前目录：F:\CODE\Tes\admin）
git remote add origin https://github.com/你的用户名/engineering-cost-admin.git
```

**替换** `你的用户名` 为你的实际GitHub用户名！

### 第3步：推送代码

```bash
# 重命名分支为main（如果还是master）
git branch -M main

# 推送到GitHub
git push -u origin main
```

### 第4步：输入GitHub凭据

首次推送会要求输入：
- GitHub用户名
- Personal Access Token（不是密码！）

**如何获取Token：**
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选权限：`repo`（全选）
4. 点击 "Generate token"
5. **复制token**（只显示一次！）
6. 在命令行中粘贴作为密码

---

## 🚀 使用Vercel CLI快速部署

推送成功后，可以使用Vercel CLI一键部署：

```bash
# 确保已安装Vercel CLI
npm install -g vercel

# 登录Vercel（会打开浏览器）
vercel login

# 部署（第一次会询问配置）
vercel --prod
```

### Vercel部署问题回答：
```
? Set up and deploy "F:\CODE\Tes\admin"? [Y/n] y
? Which scope do you want to deploy to? (选择你的账号)
? Link to existing project? [y/N] n
? What's your project's name? engineering-cost-admin
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

部署完成后会得到URL：
```
✅ Production: https://engineering-cost-admin.vercel.app
```

---

## 🌐 通过Vercel网站部署（备选）

如果CLI有问题，可以通过网站：

1. 访问：https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `engineering-cost-admin` 仓库
4. 配置项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

---

## ⚙️ 配置生产环境API

部署完成后，需要配置API地址：

### 方法1：在Vercel项目设置中添加环境变量
1. 进入项目设置 → Environment Variables
2. 添加：
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://你的后端API.onrender.com/api`
3. 重新部署

### 方法2：修改代码（临时方案）
编辑 `src/utils/request.js`：
```javascript
const request = axios.create({
  baseURL: 'https://你的后端API.onrender.com/api',
  timeout: 10000
})
```

提交并推送：
```bash
git add .
git commit -m "Update API base URL"
git push
```

Vercel会自动重新部署！

---

## 📝 完整命令清单

```bash
# 1. 关联GitHub（只需一次）
git remote add origin https://github.com/你的用户名/engineering-cost-admin.git

# 2. 推送代码
git branch -M main
git push -u origin main

# 3. 部署到Vercel
vercel login
vercel --prod

# 4. 后续更新（修改代码后）
git add .
git commit -m "更新说明"
git push
# Vercel会自动重新部署
```

---

## 🎯 检查清单

上传成功后检查：
- [ ] GitHub仓库可以访问
- [ ] 代码完整上传
- [ ] README.md显示正常
- [ ] Vercel部署成功
- [ ] 可以访问管理后台URL
- [ ] 登录功能正常
- [ ] API连接正常（需要后端已部署）

---

## 🆘 常见问题

### 1. push被拒绝
```bash
# 强制推送（谨慎使用）
git push -u origin main --force
```

### 2. 找不到remote
```bash
# 检查remote
git remote -v

# 如果没有，重新添加
git remote add origin https://github.com/你的用户名/engineering-cost-admin.git
```

### 3. Token认证失败
- 重新生成Token
- 确保勾选了 `repo` 权限
- Windows可能需要更新凭据管理器

### 4. Vercel部署失败
检查：
- package.json中的依赖是否完整
- 构建命令是否正确
- 环境变量是否配置

---

## 🎊 完成！

上传和部署完成后，你将拥有：

1. **GitHub仓库**：代码版本管理
   - `https://github.com/你的用户名/engineering-cost-admin`

2. **Vercel应用**：在线管理后台
   - `https://engineering-cost-admin.vercel.app`

3. **自动部署**：每次push后自动更新

---

**现在执行上面的命令开始上传吧！** 🚀
