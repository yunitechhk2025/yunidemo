const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');

function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    timeout: 120000,
    maxRetries: 1
  });
}

function safeJsonParse(text) {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeGeneratedSolution(raw, painPoint) {
  const solutionName = raw?.solution?.name || raw?.solution || raw?.name || 'AI生成方案';
  const dev = raw?.solution?.development || raw?.development || {};
  const maint = raw?.solution?.maintenance || raw?.maintenance || {};

  return {
    industry: raw?.industry || '通用行业',
    solution: {
      id: 'solution-001',
      name: solutionName,
      painPoint: raw?.solution?.painPoint || raw?.painPoint || painPoint,
      description: raw?.solution?.description || raw?.description || '',
      features: toArray(raw?.solution?.features || raw?.features),
      development: {
        price: Number(dev.price || raw?.price || 0),
        currency: dev.currency || 'HKD',
        duration: dev.duration || raw?.developmentDuration || '',
        techStack: toArray(dev.techStack),
        resources: toArray(dev.resources),
        humanResources: toArray(dev.humanResources).map((hr) => ({
          role: hr.role || '开发人员',
          count: Number(hr.count || 1),
          duration: hr.duration || dev.duration || '',
          link: hr.link || '/platform/talents/fullstack'
        }))
      },
      maintenance: {
        monthlyPrice: Number(maint.monthlyPrice || raw?.maintenancePrice || 0),
        duration: maint.duration || raw?.maintenanceDuration || '',
        currency: maint.currency || 'HKD',
        humanResources: toArray(maint.humanResources).map((hr) => ({
          role: hr.role || '运维工程师',
          count: Number(hr.count || 1),
          duration: hr.duration || maint.duration || ''
        })),
        resources: toArray(maint.resources)
      }
    },
    reasoning: raw?.reasoning || ''
  };
}

async function generateSolution(client, painPoint, lang, model) {
  const langMap = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    en: 'English'
  };
  const targetLang = langMap[lang] || '简体中文';

  const prompt = `根据用户的业务痛点，生成一个软件解决方案 JSON 对象。

用户痛点: ${painPoint}

语言规则（最高优先级）:
- 自动检测用户痛点的语言
- 所有文本字段必须使用与用户输入相同的语言
- 如果用户用简体中文输入，所有字段用简体中文
- 如果用户用繁體中文输入，所有字段用繁體中文
- 如果用户用 English 输入，所有字段用 English
- 如果用户用粤语/广东话输入，所有字段用繁體中文
- role、type、name、specs、duration 等每一个文本字段都必须遵守此规则，不能混用语言

Constraints:
1. development.price must be ≤ 100000 (HKD)
2. maintenance.monthlyPrice must be ≤ 5000 (HKD)
3. humanResources must have EXACTLY 1 person (one full-stack developer who handles everything)
4. maintenance must be handled by 1 person only

Resource detail rules:
- development.resources: list 3-5 specific items with concrete specs (e.g. "AWS EC2 t3.medium", "PostgreSQL 16 on RDS", "Cloudflare CDN Free Plan", "GitHub Actions CI/CD"). Include server, database, storage, CDN, CI/CD, third-party APIs as applicable.
- maintenance.resources: list 2-4 specific items (e.g. "AWS CloudWatch monitoring", "Daily automated backup", "SSL certificate auto-renewal"). Be concrete, not generic.

Return ONLY valid JSON, no other text. Use this structure:
{
  "industry": "",
  "solution": {
    "name": "",
    "painPoint": "",
    "description": "",
    "features": ["", "", ""],
    "development": {
      "price": 0,
      "currency": "HKD",
      "duration": "",
      "techStack": ["", "", ""],
      "resources": [{"type": "", "name": "", "specs": ""}],
      "humanResources": [{"role": "Full-Stack Developer", "count": 1, "duration": ""}]
    },
    "maintenance": {
      "monthlyPrice": 0,
      "currency": "HKD",
      "duration": "",
      "humanResources": [{"role": "DevOps Engineer", "count": 1, "duration": ""}],
      "resources": [{"type": "", "name": "", "specs": ""}]
    }
  },
  "reasoning": ""
}`;

  const completion = await client.chat.completions.create({
    model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '你是专业的IT解决方案架构师。只输出合法 JSON，不要输出其他内容。最关键的规则：检测用户输入的语言，所有文本字段（包括 role、type、name、specs、duration、industry、features 等）都必须使用与用户输入完全相同的语言，绝对不能混用语言。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1800
  });

  const content = completion?.choices?.[0]?.message?.content || '';
  const parsed = safeJsonParse(content);
  if (!parsed) {
    throw new Error('模型返回内容无法解析为 JSON');
  }
  return normalizeGeneratedSolution(parsed, painPoint);
}

function createApp() {
  const app = express();
  const client = createOpenAIClient();

  app.use(cors());
  app.use(express.json());

  const frontendPath = path.join(__dirname, '../frontend');
  app.use(express.static(frontendPath));

  app.get('/styles.css', (req, res) => res.sendFile(path.join(frontendPath, 'styles.css')));
  app.get('/app.js', (req, res) => res.sendFile(path.join(frontendPath, 'app.js')));
  app.get('/logo.png', (req, res) => res.sendFile(path.join(frontendPath, 'logo.png')));

  app.get('/api/industries', (req, res) => {
    res.json({ success: true, data: [] });
  });

  app.post('/api/match', async (req, res) => {
    try {
      const { painPoint, lang, model } = req.body || {};
      if (!painPoint || !painPoint.trim()) {
        return res.status(400).json({ success: false, error: '请输入行业痛点' });
      }
      if (!client) {
        return res.status(500).json({ success: false, error: '未配置 OPENAI_API_KEY' });
      }

      const generated = await generateSolution(client, painPoint.trim(), lang || 'zh-CN', model);
      return res.json({
        success: true,
        data: {
          input: painPoint,
          model: model || process.env.OPENAI_MODEL || 'gpt-4o-mini',
          matchCount: 1,
          aiEnabled: true,
          solutions: [
            {
              score: 95,
              industry: generated.industry,
              solution: generated.solution,
              aiAnalysis: {
                reasoning: generated.reasoning,
                confidence: 0.95,
                customRecommendation: generated.reasoning,
                generatedByAI: true
              }
            }
          ]
        }
      });
    } catch (error) {
      console.error('❌ 生成失败:', error.message);
      console.error('   status:', error.status);
      console.error('   code:', error.code);
      return res.status(500).json({ success: false, error: error.message || '生成失败' });
    }
  });

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, error: 'API endpoint not found' });
    }
    return res.sendFile(path.join(frontendPath, 'index.html'));
  });

  return app;
}

module.exports = createApp;
