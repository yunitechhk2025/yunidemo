// AI 服务 - 支持 OpenAI 协议和原生 Gemini
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiService {
  constructor() {
    // 优先使用 OpenAI 兼容协议
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      this.initOpenAIMode();
    } 
    // 其次使用原生 Gemini
    else if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      this.initGeminiMode();
    } 
    // 都没有则禁用 AI
    else {
      console.warn('⚠️  警告: 未配置 API Key，将使用关键词匹配模式');
      this.enabled = false;
      this.mode = 'keyword';
    }
  }

  initOpenAIMode() {
    try {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
      });
      this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
      this.mode = 'openai';
      this.enabled = true;
      console.log(`✅ AI 已启用 (OpenAI 协议模式)`);
      console.log(`   模型: ${this.model}`);
      console.log(`   接口: ${process.env.OPENAI_BASE_URL || 'OpenAI 官方'}`);
    } catch (error) {
      console.error('❌ OpenAI 初始化失败:', error.message);
      this.enabled = false;
      this.mode = 'keyword';
    }
  }

  initGeminiMode() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      this.mode = 'gemini';
      this.enabled = true;
      console.log('✅ AI 已启用 (Gemini 原生模式)');
    } catch (error) {
      console.error('❌ Gemini 初始化失败:', error.message);
      this.enabled = false;
      this.mode = 'keyword';
    }
  }

  // 分析用户输入，映射到行业
  async analyzeAndMapIndustry(userInput, industries) {
    if (!this.enabled) {
      return null;
    }

    const industryList = industries.map(ind => 
      `- ${ind.id}: ${ind.name} (关键词: ${ind.keywords.join('、')})`
    ).join('\n');

    const prompt = `你是一个专业的行业分析助手。请分析用户的业务痛点，并将其映射到最合适的行业。

可选行业列表：
${industryList}

用户输入：
"${userInput}"

请分析用户描述的痛点属于哪个行业，并返回JSON格式：
{
  "industry_id": "行业ID",
  "confidence": 0.95,
  "reasoning": "简短的分析理由"
}

要求：
1. 必须从上述行业列表中选择一个最匹配的
2. confidence 是匹配置信度 (0-1)
3. reasoning 用中文简要说明为什么选择这个行业
4. 只返回JSON，不要其他文字`;

    try {
      let responseText;

      if (this.mode === 'openai') {
        // OpenAI 协议模式
        const completion = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: '你是一个专业的行业分析助手，擅长分析业务痛点并推荐解决方案。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        
        console.log('🔍 API 原始响应:', JSON.stringify(completion, null, 2));
        
        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
          responseText = completion.choices[0].message.content;
        } else {
          console.error('❌ API 响应格式异常:', completion);
          return null;
        }
      } else {
        // Gemini 原生模式
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
      }

      // 提取 JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        console.log('🤖 AI 分析结果:', analysis);
        return analysis;
      }

      return null;
    } catch (error) {
      console.error(`❌ AI API 调用失败 (${this.mode}):`, error.message);
      return null;
    }
  }

  // 生成个性化的方案建议
  async generateCustomRecommendation(userInput, solution) {
    if (!this.enabled) {
      return null;
    }

    const prompt = `基于用户的具体痛点，为以下解决方案生成个性化建议。

用户痛点：
"${userInput}"

解决方案：
名称: ${solution.name}
描述: ${solution.description}

请生成一段简短的个性化建议（50-80字），说明这个方案如何解决用户的具体问题。
只返回建议文字，不要其他内容。`;

    try {
      let responseText;

      if (this.mode === 'openai') {
        const completion = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: '你是一个专业的解决方案顾问。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        });
        responseText = completion.choices[0].message.content;
      } else {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
      }

      return responseText.trim();
    } catch (error) {
      console.error('❌ 生成建议失败:', error.message);
      return null;
    }
  }
}

module.exports = GeminiService;
