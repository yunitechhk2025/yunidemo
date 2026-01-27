# 🚀 快速部署指南

本文档提供多种部署方案，帮助您快速将 AI 解决方案生成器部署上线。

---

## 📋 目录

1. [方案一：Google Cloud Run 部署（推荐）](#方案一google-cloud-run-部署推荐)
2. [方案二：Docker 部署](#方案二docker-部署)
3. [方案三：PM2 部署（生产环境）](#方案三pm2-部署生产环境)
4. [方案四：其他云平台部署](#方案四其他云平台部署)
5. [方案五：传统服务器部署](#方案五传统服务器部署)
6. [环境变量配置](#环境变量配置)
7. [常见问题](#常见问题)

---

## 方案一：Google Cloud Run 部署（推荐）

### 前置要求
- 已安装 Google Cloud SDK
- 已登录并设置项目：`gcloud init`

### 快速部署步骤

#### 1. 初始化 Google Cloud
```bash
# 登录
gcloud auth login

# 设置项目
gcloud config set project YOUR_PROJECT_ID

# 启用必要的 API
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

#### 2. 一键部署
```bash
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1
```

#### 3. 设置环境变量（可选）
```bash
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=your_key"
```

#### 4. 获取访问 URL
部署成功后会显示服务 URL，或使用：
```bash
gcloud run services describe my-demo \
  --region asia-east1 \
  --format 'value(status.url)'
```

### 优势
- ✅ 无服务器，自动扩缩容
- ✅ 按使用量付费
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 零运维成本

**详细文档请查看：[GCLOUD-DEPLOY.md](./GCLOUD-DEPLOY.md)**

---

## 方案二：Docker 部署

### 前置要求
- 已安装 Docker 和 Docker Compose
- 有服务器或本地环境

### 快速部署步骤

#### 1. 准备环境变量文件
```bash
# 创建 .env 文件（如果还没有）
cp .env.example .env
# 编辑 .env 文件，填入您的 API Key（可选）
```

#### 2. 构建并启动容器
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

#### 3. 验证部署
```bash
# 检查容器状态
docker-compose ps

# 测试 API
curl http://localhost:3000/api/industries
```

#### 4. 停止服务
```bash
docker-compose down
```

### 优势
- ✅ 环境隔离，依赖清晰
- ✅ 一键启动，易于管理
- ✅ 支持健康检查
- ✅ 适合开发和生产环境

---

## 方案三：PM2 部署（生产环境）

### 前置要求
- Node.js 18+ 已安装
- 已安装 PM2：`npm install -g pm2`

### 快速部署步骤

#### 1. 安装依赖
```bash
npm install --production
```

#### 2. 配置环境变量
```bash
# 创建 .env 文件
cp .env.example .env
# 编辑 .env 文件
```

#### 3. 启动服务
```bash
# 使用 PM2 启动
pm2 start ecosystem.config.js --env production

# 或直接启动
pm2 start src/api.js --name ai-solution-generator
```

#### 4. 设置开机自启
```bash
# 保存当前进程列表
pm2 save

# 设置开机自启（根据系统选择）
# Linux
pm2 startup systemd
# macOS
pm2 startup launchd
```

#### 5. 常用 PM2 命令
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs ai-solution-generator

# 重启
pm2 restart ai-solution-generator

# 停止
pm2 stop ai-solution-generator

# 删除
pm2 delete ai-solution-generator
```

### 优势
- ✅ 进程守护，自动重启
- ✅ 日志管理完善
- ✅ 资源监控
- ✅ 适合生产环境

---

## 方案四：其他云平台部署

### 3.1 Vercel 部署（前端 + API）

#### 步骤
1. 安装 Vercel CLI：`npm i -g vercel`
2. 登录：`vercel login`
3. 部署：`vercel --prod`

**注意**：需要修改 `vercel.json` 配置（见下方）

### 3.2 Railway 部署

#### 步骤
1. 访问 [Railway.app](https://railway.app)
2. 连接 GitHub 仓库
3. 自动检测 Node.js 项目
4. 设置环境变量
5. 自动部署

### 3.3 Heroku 部署

#### 步骤
```bash
# 安装 Heroku CLI
# 登录
heroku login

# 创建应用
heroku create your-app-name

# 设置环境变量
heroku config:set GEMINI_API_KEY=your_key

# 部署
git push heroku main
```

### 3.4 阿里云/腾讯云部署

#### 使用容器服务
1. 上传 Dockerfile 和代码
2. 在容器服务中创建应用
3. 配置端口和环境变量
4. 启动服务

---

## 方案五：传统服务器部署

### 前置要求
- Linux 服务器（Ubuntu/CentOS）
- Node.js 18+ 已安装
- Nginx（可选，用于反向代理）

### 部署步骤

#### 1. 上传代码到服务器
```bash
# 使用 scp 或 git
scp -r . user@your-server:/opt/ai-solution-generator
```

#### 2. 安装依赖
```bash
cd /opt/ai-solution-generator
npm install --production
```

#### 3. 配置环境变量
```bash
# 创建 .env 文件
nano .env
```

#### 4. 使用 PM2 启动（推荐）
```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 5. 配置 Nginx 反向代理（可选）
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. 配置 SSL（可选）
```bash
# 使用 Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

---

## 环境变量配置

### .env 文件示例
```env
# 服务器配置
PORT=3000
NODE_ENV=production

# Gemini AI（可选）
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI 兼容 API（可选）
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### 环境变量说明
- `PORT`: 服务端口（默认 3000）
- `NODE_ENV`: 环境模式（development/production）
- `GEMINI_API_KEY`: Google Gemini API Key（可选）
- `OPENAI_API_KEY`: OpenAI 兼容 API Key（可选）
- `OPENAI_BASE_URL`: OpenAI API 基础 URL（可选）
- `OPENAI_MODEL`: 使用的模型名称（可选）

**注意**：不配置 AI API Key 也可以运行，系统会自动使用关键词匹配模式。

---

## 常见问题

### Q1: 端口被占用怎么办？
```bash
# 查找占用端口的进程
lsof -i :3000
# 或
netstat -tulpn | grep 3000

# 修改端口（在 .env 或启动命令中）
PORT=3001 node src/api.js
```

### Q2: 如何查看日志？
```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs ai-solution-generator

# 直接运行
node src/api.js
```

### Q3: 如何更新代码？
```bash
# Docker
docker-compose down
git pull
docker-compose build
docker-compose up -d

# PM2
pm2 restart ai-solution-generator
```

### Q4: 如何配置域名？
1. 在 DNS 提供商处添加 A 记录指向服务器 IP
2. 配置 Nginx 反向代理
3. 配置 SSL 证书

### Q5: 性能优化建议
- 使用 PM2 集群模式：`pm2 start ecosystem.config.js -i max`
- 配置 Nginx 缓存
- 使用 CDN 加速静态资源
- 启用 Gzip 压缩

---

## 📞 获取帮助

如果遇到问题，请检查：
1. Node.js 版本是否 >= 18
2. 端口是否被占用
3. 环境变量是否正确配置
4. 防火墙是否开放端口

---

## 🎉 部署成功！

部署完成后，访问：
- 本地：http://localhost:3000
- 服务器：http://your-server-ip:3000
- 域名：http://your-domain.com

祝部署顺利！🚀
