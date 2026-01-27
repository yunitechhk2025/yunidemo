# 🚀 Vercel 部署指南

Vercel 是完全免费的平台（个人项目），非常适合快速部署。

---

## ✅ 项目已配置完成

项目已准备好 Vercel 部署：
- ✅ `vercel.json` 配置文件已创建
- ✅ `api/index.js` Vercel 适配文件已创建
- ✅ 所有依赖已配置

---

## 🚀 快速部署（3步）

### 方法一：使用命令行（推荐）

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```
这会打开浏览器，使用 GitHub/Google/GitLab 账号登录。

#### 3. 部署项目
```bash
# 在项目根目录运行
vercel --prod
```

完成！部署成功后，Vercel 会显示您的应用 URL。

---

### 方法二：使用网页界面（更简单）

#### 1. 访问 Vercel
打开 https://vercel.com

#### 2. 登录账号
使用 GitHub/Google/GitLab 账号登录

#### 3. 导入项目
- 点击 "Add New..." > "Project"
- 选择 "Import Git Repository"
- 连接您的 GitHub/GitLab/Bitbucket 仓库
- 或直接拖拽项目文件夹

#### 4. 配置项目
Vercel 会自动检测：
- ✅ Framework Preset: Other
- ✅ Root Directory: `./`
- ✅ Build Command: （留空，不需要构建）
- ✅ Output Directory: （留空）
- ✅ Install Command: `npm install`

#### 5. 环境变量（可选）
如果需要设置 API Key，在 "Environment Variables" 中添加：
- `GEMINI_API_KEY` = your_key_here
- `OPENAI_API_KEY` = your_key_here（如果使用）

#### 6. 部署
点击 "Deploy" 按钮，等待部署完成。

---

## ⚙️ 环境变量配置

### 在 Vercel 网页界面设置

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加变量：
   - `GEMINI_API_KEY` = your_key
   - `NODE_ENV` = production

### 使用命令行设置

```bash
vercel env add GEMINI_API_KEY
vercel env add OPENAI_API_KEY
```

---

## 🔄 更新部署

### 代码更新后重新部署

```bash
# 使用命令行
vercel --prod

# 或推送到 Git（如果连接了 GitHub）
git push
# Vercel 会自动部署
```

---

## 📊 查看部署状态

### 命令行
```bash
# 查看部署列表
vercel ls

# 查看部署详情
vercel inspect [deployment-url]
```

### 网页界面
访问 https://vercel.com/dashboard 查看所有部署

---

## 🌍 访问您的应用

部署成功后，Vercel 会提供：
- **生产环境 URL**: `https://your-project.vercel.app`
- **预览 URL**: 每次推送都有新的预览链接

---

## ✅ 验证部署

部署完成后，测试 API：

```bash
# 测试行业列表 API
curl https://your-project.vercel.app/api/industries

# 测试匹配 API
curl -X POST https://your-project.vercel.app/api/match \
  -H "Content-Type: application/json" \
  -d '{"painPoint":"我的零售店库存管理很混乱"}'
```

---

## 🎯 Vercel 优势

- ✅ **完全免费**（个人项目）
- ✅ **自动 HTTPS**（SSL 证书）
- ✅ **全球 CDN**（快速访问）
- ✅ **自动部署**（连接 Git 后自动部署）
- ✅ **预览部署**（每次推送都有预览链接）
- ✅ **零配置**（开箱即用）

---

## 📝 项目结构说明

```
demo/
├── api/
│   └── index.js          # Vercel Serverless Function 入口
├── src/
│   ├── api.js            # 原始 Express 服务器
│   ├── matcher.js        # 匹配逻辑
│   └── gemini-service.js # AI 服务
├── frontend/             # 前端文件
├── data/                 # 数据文件
├── vercel.json           # Vercel 配置
└── package.json          # 依赖配置
```

---

## 🔧 故障排查

### 问题 1: 部署失败

**检查：**
1. 确保 `package.json` 存在
2. 确保所有依赖都在 `dependencies` 中（不是 `devDependencies`）
3. 查看 Vercel 部署日志

### 问题 2: API 路由不工作

**检查：**
1. 确认 `api/index.js` 文件存在
2. 确认 `vercel.json` 配置正确
3. 检查路由路径是否正确

### 问题 3: 环境变量未生效

**解决：**
1. 在 Vercel 网页界面重新设置环境变量
2. 重新部署项目

### 问题 4: 静态文件无法访问

**检查：**
1. 确认 `frontend` 目录存在
2. 确认 `api/index.js` 中配置了静态文件服务

---

## 💡 提示

1. **首次部署**：建议使用网页界面，更直观
2. **后续更新**：连接 Git 后，推送代码自动部署
3. **预览部署**：每次推送都会创建预览链接，不影响生产环境
4. **自定义域名**：可以在项目设置中添加自己的域名

---

## 🎉 部署成功！

部署完成后，您的应用将在以下 URL 可用：
```
https://your-project.vercel.app
```

**下一步：**
1. 测试 API 端点
2. 访问前端页面
3. 配置自定义域名（可选）

---

## 📞 获取帮助

- Vercel 文档：https://vercel.com/docs
- 社区支持：https://github.com/vercel/vercel/discussions

祝部署顺利！🚀
