// 最终 AI 测试
async function test() {
  const testCases = [
    '餐厅点餐太慢，客人等不及',
    '物流配送路线不优化',
    '病人预约经常冲突',
    '我想提高工作效率'
  ];

  for (const testInput of testCases) {
    console.log(`\n📝 测试: ${testInput}`);
    console.log('─'.repeat(60));
    
    try {
      const response = await fetch('http://localhost:3000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ painPoint: testInput })
      });

      const result = await response.json();
      
      if (result.success && result.data.solutions.length > 0) {
        const match = result.data.solutions[0];
        console.log(`✅ 行业: ${match.industry}`);
        console.log(`📦 方案: ${match.solution.name}`);
        
        if (match.aiAnalysis) {
          console.log(`🤖 AI 分析: ${match.aiAnalysis.reasoning}`);
          console.log(`📊 置信度: ${(match.aiAnalysis.confidence * 100).toFixed(0)}%`);
          if (match.aiAnalysis.customRecommendation) {
            console.log(`💡 建议: ${match.aiAnalysis.customRecommendation}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ 错误:', error.message);
    }
    
    // 等待一下避免请求太快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ 测试完成！');
}

test();
