# 🔧 在 Vercel 上配置 AI 功能

## 步骤

1. 访问 https://vercel.com/dashboard
2. 点击您的项目 `yunidemo`
3. 进入 Settings > Environment Variables
4. 添加以下变量：

### 选项一：使用 Gemini API
- `GEMINI_API_KEY` = your_gemini_api_key

### 选项二：使用 OpenAI 兼容 API
- `OPENAI_API_KEY` = your_openai_api_key
- `OPENAI_BASE_URL` = https://api.openai.com/v1（可选）
- `OPENAI_MODEL` = gpt-3.5-turbo（可选）

5. 保存后会自动重新部署

## 验证

部署完成后，测试时应该看到：
- ✅ "🤖 AI 智能分析" 标签
- ✅ AI 分析结果和建议
