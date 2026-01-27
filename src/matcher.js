// 痛点匹配引擎
const fs = require('fs');
const path = require('path');
const GeminiService = require('./gemini-service');

class SolutionMatcher {
  constructor() {
    this.solutions = this.loadSolutions();
    this.gemini = new GeminiService();
  }

  loadSolutions() {
    const dataPath = path.join(__dirname, '../data/solutions.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  }

  // 主匹配函数（异步，支持 AI）
  async matchSolutions(userInput) {
    // 尝试使用 Gemini AI 分析
    const aiAnalysis = await this.gemini.analyzeAndMapIndustry(
      userInput, 
      this.getAllIndustries()
    );

    if (aiAnalysis && aiAnalysis.industry_id) {
      console.log(`🎯 AI 映射到行业: ${aiAnalysis.industry_id} (置信度: ${aiAnalysis.confidence})`);
      
      // 根据 AI 分析结果获取对应行业的解决方案
      const industry = this.solutions.industries.find(
        ind => ind.id === aiAnalysis.industry_id
      );

      if (industry && industry.solutions.length > 0) {
        const matches = [];
        
        for (const solution of industry.solutions) {
          // 生成个性化建议
          const customRecommendation = await this.gemini.generateCustomRecommendation(
            userInput, 
            solution
          );

          matches.push({
            score: aiAnalysis.confidence * 100,
            industry: industry.name,
            solution: solution,
            aiAnalysis: {
              reasoning: aiAnalysis.reasoning,
              confidence: aiAnalysis.confidence,
              customRecommendation: customRecommendation
            }
          });
        }

        return matches;
      }
    }

    // 如果 AI 不可用或失败，使用传统关键词匹配
    console.log('📝 使用关键词匹配模式');
    return this.keywordMatch(userInput);
  }

  // 传统关键词匹配（备用方案）
  keywordMatch(userInput) {
    const normalizedInput = userInput.toLowerCase();
    const matches = [];

    // 遍历所有行业
    for (const industry of this.solutions.industries) {
      // 检查关键词匹配
      const keywordScore = this.calculateKeywordScore(normalizedInput, industry.keywords);
      
      if (keywordScore > 0) {
        // 为该行业的每个解决方案计算匹配度
        for (const solution of industry.solutions) {
          const painPointScore = this.calculatePainPointScore(normalizedInput, solution.painPoint);
          const totalScore = keywordScore + painPointScore;

          if (totalScore > 0) {
            matches.push({
              score: totalScore,
              industry: industry.name,
              solution: solution
            });
          }
        }
      }
    }

    // 如果没有匹配，返回所有行业的第一个方案（确保总有结果）
    if (matches.length === 0) {
      console.log('⚠️  无关键词匹配，返回默认方案');
      for (const industry of this.solutions.industries.slice(0, 3)) {
        if (industry.solutions.length > 0) {
          matches.push({
            score: 1,
            industry: industry.name,
            solution: industry.solutions[0]
          });
        }
      }
    }

    // 按匹配度排序，返回前3个
    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 3);
  }

  // 计算关键词匹配分数
  calculateKeywordScore(input, keywords) {
    let score = 0;
    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        score += 2;
      }
    }
    return score;
  }

  // 计算痛点描述匹配分数
  calculatePainPointScore(input, painPoint) {
    const painPointLower = painPoint.toLowerCase();
    const words = input.split(/\s+/);
    let score = 0;

    for (const word of words) {
      if (word.length > 1 && painPointLower.includes(word)) {
        score += 1;
      }
    }
    return score;
  }

  // 获取所有行业列表
  getAllIndustries() {
    return this.solutions.industries.map(industry => ({
      id: industry.id,
      name: industry.name,
      keywords: industry.keywords
    }));
  }

  // 根据行业ID获取解决方案
  getSolutionsByIndustry(industryId) {
    const industry = this.solutions.industries.find(ind => ind.id === industryId);
    return industry ? industry.solutions : [];
  }
}

module.exports = SolutionMatcher;
