# AI项目解决方案生成器 - 项目结构

## 目录结构
```
ai-solution-generator/
├── data/
│   └── solutions.json          # 预设的行业解决方案数据库
├── src/
│   ├── matcher.js              # 痛点匹配引擎
│   ├── api.js                  # API接口
│   └── utils.js                # 工具函数
├── frontend/
│   ├── index.html              # 前端页面
│   ├── app.js                  # 前端逻辑
│   └── styles.css              # 样式
└── README.md                   # 项目说明
```

## 核心功能
1. 用户输入行业痛点
2. AI/关键词匹配相关解决方案
3. 展示多套方案（包含开发和维护信息）
