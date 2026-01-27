// 测试 Gemini AI 功能
const SolutionMatcher = require('./src/matcher');

async function test() {
  console.log('🧪 开始测试 Gemini AI 集成...\n');
  
  const matcher = new SolutionMatcher();
  
  // 测试用例
  const testCases = [
    '我的店铺经常缺货，不知道该进多少货',
    '餐厅点餐太慢，客人等不及',
    '送货司机总是走错路，浪费时间',
    '房子太多管理不过来',
    '病人预约经常冲突'
  ];

  for (const testCase of testCases) {
    console.log(`\n📝 测试输入: "${testCase}"`);
    console.log('─'.repeat(60));
    
    try {
      const results = await matcher.matchSolutions(testCase);
      
      if (results.length > 0) {
        const match = results[0];
        console.log(`✅ 匹配行业: ${match.industry}`);
        console.log(`📦 解决方案: ${match.solution.name}`);
        console.log(`💰 开发价格: HKD ${match.solution.development.price.toLocaleString()}`);
        
        if (match.aiAnalysis) {
          console.log(`🤖 AI 分析: ${match.aiAnalysis.reasoning}`);
          if (match.aiAnalysis.customRecommendation) {
            console.log(`💡 个性化建议: ${match.aiAnalysis.customRecommendation}`);
          }
        }
      } else {
        console.log('❌ 未找到匹配方案');
      }
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
    }
  }
  
  console.log('\n\n✨ 测试完成！');
}

test();
