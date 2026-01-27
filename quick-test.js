// 快速测试 AI 功能
async function test() {
  console.log('🧪 测试 AI 匹配功能...\n');
  
  const testInput = '我的店铺经常缺货，不知道该进多少货';
  
  try {
    const response = await fetch('http://localhost:3000/api/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ painPoint: testInput })
    });

    const result = await response.json();
    
    console.log('📝 输入:', testInput);
    console.log('─'.repeat(60));
    
    if (result.success) {
      console.log(`✅ 找到 ${result.data.matchCount} 个方案`);
      console.log(`🤖 AI 状态: ${result.data.aiEnabled ? '已启用' : '未启用'}`);
      console.log('');
      
      result.data.solutions.forEach((match, index) => {
        console.log(`方案 ${index + 1}: ${match.solution.name}`);
        console.log(`行业: ${match.industry}`);
        console.log(`价格: HKD ${match.solution.development.price.toLocaleString()}`);
        
        if (match.aiAnalysis) {
          console.log(`🤖 AI 分析: ${match.aiAnalysis.reasoning}`);
          if (match.aiAnalysis.customRecommendation) {
            console.log(`💡 建议: ${match.aiAnalysis.customRecommendation}`);
          }
        }
        console.log('');
      });
    } else {
      console.log('❌ 错误:', result.error);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

test();
