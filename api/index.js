// Vercel Serverless Function 入口
// 这个文件用于 Vercel 部署
const express = require('express');
const cors = require('cors');
const path = require('path');

// Vercel 中路径处理
const SolutionMatcher = require('../src/matcher');

const app = express();
const matcher = new SolutionMatcher();

app.use(cors());
app.use(express.json());

// 静态文件服务（前端）
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// 提供静态文件的路由
app.get('/styles.css', (req, res) => {
  res.sendFile(path.join(frontendPath, 'styles.css'));
});

app.get('/app.js', (req, res) => {
  res.sendFile(path.join(frontendPath, 'app.js'));
});

// API 路由
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
      error: error.message
    });
  }
});

app.post('/api/match', async (req, res) => {
  try {
    const { painPoint } = req.body;
    
    if (!painPoint || painPoint.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: '请输入行业痛点'
      });
    }

    const matches = await matcher.matchSolutions(painPoint);
    
    res.json({
      success: true,
      data: {
        input: painPoint,
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

// 处理所有其他路由，返回前端页面
app.get('*', (req, res) => {
  // 排除 API 路由
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  // 返回前端页面
  const indexPath = path.join(__dirname, '../frontend/index.html');
  res.sendFile(indexPath);
});

// Vercel 需要导出 app
module.exports = app;
