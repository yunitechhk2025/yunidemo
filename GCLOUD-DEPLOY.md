# 🚀 Google Cloud Run 部署指南

使用 Google Cloud SDK (gcloud) 快速部署到 Cloud Run。

---

## 📋 前置要求

1. **安装 Google Cloud SDK**
   ```bash
   # Windows (使用 PowerShell)
   (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
   & $env:Temp\GoogleCloudSDKInstaller.exe

   # macOS
   brew install google-cloud-sdk

   # Linux
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   ```

2. **初始化并登录**
   ```bash
   gcloud init
   gcloud auth login
   ```

3. **启用必要的 API**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

---

## 🚀 快速部署

### 方法一：从源代码直接部署（推荐）

```bash
# 部署到 asia-east1 区域（台湾）
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

# 或者部署到其他区域
# asia-northeast1 (东京)
# asia-southeast1 (新加坡)
# us-central1 (美国中部)
```

### 方法二：先构建镜像再部署

```bash
# 1. 设置项目 ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# 2. 构建镜像
gcloud builds submit --tag gcr.io/$PROJECT_ID/my-demo

# 3. 部署到 Cloud Run
gcloud run deploy my-demo \
  --image gcr.io/$PROJECT_ID/my-demo \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi
```

---

## ⚙️ 配置环境变量

### 方式一：部署时设置
```bash
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,GEMINI_API_KEY=your_key_here"
```

### 方式二：使用 Secret Manager（推荐，更安全）

```bash
# 1. 创建密钥
echo -n "your-api-key" | gcloud secrets create gemini-api-key --data-file=-

# 2. 授予 Cloud Run 访问权限
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 3. 部署时引用密钥
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --update-secrets GEMINI_API_KEY=gemini-api-key:latest
```

### 方式三：部署后更新
```bash
gcloud run services update my-demo \
  --region asia-east1 \
  --update-env-vars "GEMINI_API_KEY=your_key_here"
```

---

## 📝 完整部署命令示例

```bash
# 完整部署命令（包含所有配置）
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0 \
  --set-env-vars "NODE_ENV=production" \
  --platform managed \
  --project your-project-id
```

### 参数说明

- `--source .`: 从当前目录构建并部署
- `--region asia-east1`: 部署区域（台湾）
- `--allow-unauthenticated`: 允许未认证访问（公开访问）
- `--port 3000`: 应用监听端口
- `--memory 512Mi`: 内存限制（512MB）
- `--cpu 1`: CPU 核心数
- `--timeout 300`: 请求超时时间（秒）
- `--max-instances 10`: 最大实例数
- `--min-instances 0`: 最小实例数（0 = 按需启动）

---

## 🌍 推荐区域

根据您的用户位置选择：

```bash
# 台湾/香港用户
--region asia-east1

# 日本用户
--region asia-northeast1

# 新加坡/东南亚用户
--region asia-southeast1

# 美国用户
--region us-central1

# 欧洲用户
--region europe-west1
```

---

## 🔍 查看部署状态

```bash
# 查看服务列表
gcloud run services list

# 查看服务详情
gcloud run services describe my-demo --region asia-east1

# 查看日志
gcloud run services logs read my-demo --region asia-east1

# 实时查看日志
gcloud run services logs tail my-demo --region asia-east1
```

---

## 🔗 获取访问 URL

部署成功后会显示服务 URL，格式如：
```
https://my-demo-xxxxx-xx.a.run.app
```

也可以手动获取：
```bash
gcloud run services describe my-demo \
  --region asia-east1 \
  --format 'value(status.url)'
```

---

## 🔄 更新部署

```bash
# 重新部署（代码更新后）
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated

# 只更新配置（不重新构建）
gcloud run services update my-demo \
  --region asia-east1 \
  --memory 1Gi \
  --cpu 2
```

---

## 🗑️ 删除服务

```bash
gcloud run services delete my-demo --region asia-east1
```

---

## 💰 成本优化

### 1. 设置最小实例数为 0（按需启动）
```bash
gcloud run services update my-demo \
  --region asia-east1 \
  --min-instances 0
```

### 2. 限制最大实例数
```bash
gcloud run services update my-demo \
  --region asia-east1 \
  --max-instances 5
```

### 3. 调整内存和 CPU
```bash
# 降低内存使用（如果应用不需要太多内存）
gcloud run services update my-demo \
  --region asia-east1 \
  --memory 256Mi \
  --cpu 0.5
```

---

## 🛠️ 故障排查

### 问题 1: 构建失败
```bash
# 查看构建日志
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### 问题 2: 服务无法启动
```bash
# 查看服务日志
gcloud run services logs read my-demo --region asia-east1 --limit=50
```

### 问题 3: 端口错误
确保应用使用 `process.env.PORT`（已配置）：
```javascript
const PORT = process.env.PORT || 3000;
```

### 问题 4: 内存不足
增加内存限制：
```bash
gcloud run services update my-demo \
  --region asia-east1 \
  --memory 1Gi
```

---

## 📊 监控和告警

### 查看指标
```bash
# 在 Cloud Console 中查看
# https://console.cloud.google.com/run
```

### 设置告警
1. 访问 Cloud Console
2. 进入 Cloud Run > my-demo > 监控
3. 创建告警策略

---

## ✅ 部署检查清单

- [ ] Google Cloud SDK 已安装
- [ ] 已登录并设置项目
- [ ] Cloud Build 和 Cloud Run API 已启用
- [ ] Dockerfile 存在且正确
- [ ] .gcloudignore 已配置
- [ ] 环境变量已设置（如需要）
- [ ] 测试本地构建：`docker build -t test .`
- [ ] 部署命令已执行
- [ ] 服务 URL 可访问
- [ ] 日志正常

---

## 🎉 部署成功！

部署完成后，您的应用将在以下 URL 可用：
```
https://my-demo-xxxxx-xx.a.run.app
```

**下一步：**
1. 测试 API 端点：`curl https://your-url/api/industries`
2. 访问前端页面：`https://your-url/`
3. 配置自定义域名（可选）

---

## 📞 获取帮助

```bash
# 查看帮助
gcloud run deploy --help

# 查看服务状态
gcloud run services describe my-demo --region asia-east1
```

祝部署顺利！🚀
