# 📥 Google Cloud SDK 安装指南（Windows）

## 方法一：使用安装程序（推荐）

### 1. 下载安装程序

**直接下载链接：**
```
https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe
```

或者访问官网：
```
https://cloud.google.com/sdk/docs/install
```

### 2. 安装步骤

1. **运行安装程序**
   - 双击下载的 `GoogleCloudSDKInstaller.exe`
   - 按照向导完成安装

2. **选择安装选项**
   - ✅ 勾选 "Run gcloud init"（安装后自动初始化）
   - ✅ 选择安装位置（默认即可）

3. **完成安装**
   - 安装完成后会自动打开命令提示符
   - 按照提示完成初始化

### 3. 验证安装

打开新的命令提示符（CMD）或 PowerShell，运行：

```bash
gcloud --version
```

如果显示版本信息，说明安装成功！

---

## 方法二：使用 PowerShell 快速安装

### 一键下载并安装

在 PowerShell（管理员权限）中运行：

```powershell
# 下载安装程序
Invoke-WebRequest -Uri "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe" -OutFile "$env:TEMP\GoogleCloudSDKInstaller.exe"

# 运行安装程序
& "$env:TEMP\GoogleCloudSDKInstaller.exe"
```

---

## 方法三：使用包管理器（Chocolatey）

如果您已安装 Chocolatey：

```powershell
choco install gcloudsdk
```

---

## 安装后初始化

### 1. 登录 Google Cloud

```bash
gcloud auth login
```

这会打开浏览器，让您登录 Google 账号。

### 2. 设置项目

```bash
# 创建新项目（可选）
gcloud projects create your-project-id

# 或使用现有项目
gcloud config set project YOUR_PROJECT_ID
```

### 3. 启用必要的 API

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

---

## 常见问题

### Q1: 安装后找不到 gcloud 命令？

**解决方案：**
1. 关闭并重新打开命令提示符/PowerShell
2. 检查环境变量是否已添加：
   - 打开"系统属性" > "环境变量"
   - 确认 `PATH` 中包含 Google Cloud SDK 路径（通常在 `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin`）

### Q2: 需要管理员权限吗？

安装时需要管理员权限，但日常使用不需要。

### Q3: 如何更新 SDK？

```bash
gcloud components update
```

### Q4: 如何卸载？

1. 控制面板 > 程序和功能 > 卸载 Google Cloud SDK
2. 或使用安装程序卸载

---

## 快速测试

安装完成后，测试是否正常工作：

```bash
# 查看版本
gcloud --version

# 查看当前配置
gcloud config list

# 查看可用项目
gcloud projects list
```

---

## 下一步

安装完成后，就可以使用部署命令了：

```bash
gcloud run deploy my-demo \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated
```

---

## 📞 获取帮助

- 官方文档：https://cloud.google.com/sdk/docs/install
- 问题反馈：https://cloud.google.com/support

祝安装顺利！🚀
