#!/bin/bash
# Google Cloud Run 快速部署脚本

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Google Cloud Run 部署脚本${NC}"
echo ""

# 检查 gcloud 是否安装
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ 错误: 未找到 gcloud 命令${NC}"
    echo "请先安装 Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# 默认配置
SERVICE_NAME=${1:-my-demo}
REGION=${2:-asia-east1}
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  未设置项目 ID${NC}"
    read -p "请输入项目 ID: " PROJECT_ID
    gcloud config set project $PROJECT_ID
fi

echo -e "${GREEN}配置信息:${NC}"
echo "  项目 ID: $PROJECT_ID"
echo "  服务名称: $SERVICE_NAME"
echo "  区域: $REGION"
echo ""

# 确认部署
read -p "确认部署? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消部署"
    exit 1
fi

# 启用必要的 API
echo -e "${YELLOW}📦 启用必要的 API...${NC}"
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable run.googleapis.com --quiet

# 部署
echo -e "${YELLOW}🚀 开始部署...${NC}"
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --min-instances 0 \
  --platform managed \
  --project $PROJECT_ID

# 获取 URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --region $REGION \
  --format 'value(status.url)' \
  --project $PROJECT_ID)

echo ""
echo -e "${GREEN}✅ 部署成功！${NC}"
echo ""
echo "服务 URL: $SERVICE_URL"
echo ""
echo "测试命令:"
echo "  curl $SERVICE_URL/api/industries"
echo ""
echo "查看日志:"
echo "  gcloud run services logs read $SERVICE_NAME --region $REGION"
echo ""
