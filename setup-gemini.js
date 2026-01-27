// Gemini API Key 配置助手
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 Gemini AI 配置助手\n');
console.log('═'.repeat(60));
console.log('');
console.log('📝 步骤 1: 获取 API Key');
console.log('   访问: https://makersuite.google.com/app/apikey');
console.log('   使用 Google 账号登录并创建 API Key');
console.log('');
console.log('═'.repeat(60));
console.log('');

rl.question('请粘贴您的 Gemini API Key（或按回车跳过）: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('\n⚠️  未配置 API Key，系统将使用关键词匹配模式');
    console.log('💡 您可以稍后编辑 .env 文件手动配置\n');
    rl.close();
    return;
  }

  // 写入 .env 文件
  const envContent = `# Google Gemini API Key
# 获取地址: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=${apiKey.trim()}
`;

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ API Key 配置成功！');
  console.log('');
  console.log('🚀 下一步：');
  console.log('   1. 重启服务器: npm start');
  console.log('   2. 测试 AI 功能: node test-gemini.js');
  console.log('   3. 访问: http://localhost:3000');
  console.log('');
  console.log('💡 提示: 看到 "✅ Gemini AI 已启用" 表示配置成功');
  console.log('');
  
  rl.close();
});
