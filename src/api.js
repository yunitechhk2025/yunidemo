// Express API服务
const express = require('express');
const cors = require('cors');
const SolutionMatcher = require('./matcher');

const app = express();
const matcher = new SolutionMatcher();

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 获取所有行业列表
app.get('/api/industries', (req, res) => {
  try {
    const industries = matcher.getAllIndustries();
    res.json({
      success: true,
      data: industries
    });
  } catch (error) {
    console.error('获取行业列表错误:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// 根据痛点匹配解决方案
app.post('/api/match', async (req, res) => {
  try {
    const { painPoint, model, lang } = req.body;
    
    if (!painPoint || painPoint.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '请输入行业痛点'
      });
    }

    const matches = await matcher.matchSolutions(painPoint, model, lang);
    
    res.json({
      success: true,
      data: {
        input: painPoint,
        model: matcher.gemini.model,
        matchCount: matches.length,
        solutions: matches,
        aiEnabled: matcher.gemini.enabled
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 根据行业ID获取解决方案
app.get('/api/industry/:id/solutions', (req, res) => {
  try {
    const { id } = req.params;
    const solutions = matcher.getSolutionsByIndustry(id);
    
    res.json({
      success: true,
      data: solutions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI解决方案生成器运行在 http://localhost:${PORT}`);
});
