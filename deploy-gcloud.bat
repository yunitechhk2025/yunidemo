@echo off
REM Google Cloud Run 快速部署脚本 (Windows)

echo 🚀 Google Cloud Run 部署脚本
echo.

REM 检查 gcloud 是否安装
where gcloud >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未找到 gcloud 命令
    echo 请先安装 Google Cloud SDK: https://cloud.google.com/sdk/docs/install
    exit /b 1
)

REM 默认配置
set SERVICE_NAME=my-demo
set REGION=asia-east1

if "%1" NEQ "" set SERVICE_NAME=%1
if "%2" NEQ "" set REGION=%2

REM 获取项目 ID
for /f "tokens=*" %%i in ('gcloud config get-value project 2^>nul') do set PROJECT_ID=%%i

if "%PROJECT_ID%"=="" (
    echo ⚠️  未设置项目 ID
    set /p PROJECT_ID="请输入项目 ID: "
    gcloud config set project %PROJECT_ID%
)

echo 配置信息:
echo   项目 ID: %PROJECT_ID%
echo   服务名称: %SERVICE_NAME%
echo   区域: %REGION%
echo.

REM 确认部署
set /p CONFIRM="确认部署? (y/n) "
if /i not "%CONFIRM%"=="y" (
    echo 已取消部署
    exit /b 1
)

REM 启用必要的 API
echo 📦 启用必要的 API...
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet

REM 部署
echo 🚀 开始部署...
gcloud run deploy %SERVICE_NAME% ^
  --source . ^
  --region %REGION% ^
  --allow-unauthenticated ^
  --port 3000 ^
  --memory 512Mi ^
  --cpu 1 ^
  --timeout 300 ^
  --max-instances 10 ^
  --min-instances 0 ^
  --platform managed ^
  --project %PROJECT_ID%

if %ERRORLEVEL% NEQ 0 (
    echo ❌ 部署失败
    exit /b 1
)

REM 获取 URL
for /f "tokens=*" %%i in ('gcloud run services describe %SERVICE_NAME% --region %REGION% --format "value(status.url)" --project %PROJECT_ID%') do set SERVICE_URL=%%i

echo.
echo ✅ 部署成功！
echo.
echo 服务 URL: %SERVICE_URL%
echo.
echo 测试命令:
echo   curl %SERVICE_URL%/api/industries
echo.
echo 查看日志:
echo   gcloud run services logs read %SERVICE_NAME% --region %REGION%
echo.
