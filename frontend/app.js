// 多语言配置
const i18n = {
  'zh-CN': {
    title: 'AI 解决方案生成器',
    subtitle: '描述您的业务痛点，AI 为您定制专属技术方案',
    modelLabel: 'AI 模型',
    model1: 'GPT-3.5 Turbo · 快速',
    model2: 'GPT-4.1 Mini · 精准',
    model3: 'GPT-4o Mini · 均衡',
    placeholder: '例如：我经营一家连锁餐厅，每天排队等位时间长，顾客流失严重，需要一个智能排队和预约系统...',
    generateBtn: '生成解决方案',
    generating: '生成中...',
    loading: 'AI 正在分析您的需求',
    industries: ['零售', '餐饮', '物流', '医疗', '教育', '金融', '美容', '酒店', '制造', '更多'],
    more: '更多',
    noResults: '未找到匹配的解决方案',
    noResultsTip: '请尝试使用不同的关键词描述您的痛点',
    painPointLabel: '解决痛点：',
    coreFeatures: '✦ 核心功能',
    devQuote: '📦 开发报价',
    devPrice: '开发价格',
    devDuration: '开发周期',
    techStack: '技术栈',
    resources: '所需资源',
    humanResources: '人力配置',
    maintenance: '🔧 运维成本',
    monthlyFee: '每月维护费用',
    person: '人',
    emptyInput: '请输入您的业务痛点',
    error: '错误：',
    requestFailed: '请求失败：',
    voiceInput: '语音输入',
    voiceStop: '点击停止录音',
    voiceNotSupported: '您的浏览器不支持语音输入',
    micDenied: '麦克风权限被拒绝',
    noSpeech: '未检测到语音'
  },
  'zh-TW': {
    title: 'AI 解決方案生成器',
    subtitle: '描述您的業務痛點，AI 為您定制專屬技術方案',
    modelLabel: 'AI 模型',
    model1: 'GPT-3.5 Turbo · 快速',
    model2: 'GPT-4.1 Mini · 精準',
    model3: 'GPT-4o Mini · 均衡',
    placeholder: '例如：我經營一家連鎖餐廳，每天排隊等位時間長，顧客流失嚴重，需要一個智能排隊和預約系統...',
    generateBtn: '生成解決方案',
    generating: '生成中...',
    loading: 'AI 正在分析您的需求',
    industries: ['零售', '餐飲', '物流', '醫療', '教育', '金融', '美容', '酒店', '製造', '更多'],
    more: '更多',
    noResults: '未找到匹配的解決方案',
    noResultsTip: '請嘗試使用不同的關鍵詞描述您的痛點',
    painPointLabel: '解決痛點：',
    coreFeatures: '✦ 核心功能',
    devQuote: '📦 開發報價',
    devPrice: '開發價格',
    devDuration: '開發週期',
    techStack: '技術棧',
    resources: '所需資源',
    humanResources: '人力配置',
    maintenance: '🔧 運維成本',
    monthlyFee: '每月維護費用',
    person: '人',
    emptyInput: '請輸入您的業務痛點',
    error: '錯誤：',
    requestFailed: '請求失敗：',
    voiceInput: '語音輸入',
    voiceStop: '點擊停止錄音',
    voiceNotSupported: '您的瀏覽器不支持語音輸入',
    micDenied: '麥克風權限被拒絕',
    noSpeech: '未檢測到語音'
  },
  'en': {
    title: 'AI Solution Generator',
    subtitle: 'Describe your business pain points, AI will customize solutions for you',
    modelLabel: 'AI Model',
    model1: 'GPT-3.5 Turbo · Fast',
    model2: 'GPT-4.1 Mini · Precise',
    model3: 'GPT-4o Mini · Balanced',
    placeholder: 'E.g.: I run a chain restaurant, long waiting times every day, losing customers, need a smart queuing and reservation system...',
    generateBtn: 'Generate Solution',
    generating: 'Generating...',
    loading: 'AI is analyzing your requirements',
    industries: ['Retail', 'F&B', 'Logistics', 'Healthcare', 'Education', 'Finance', 'Beauty', 'Hotel', 'Manufacturing', 'More'],
    more: 'More',
    noResults: 'No matching solutions found',
    noResultsTip: 'Please try different keywords to describe your pain points',
    painPointLabel: 'Pain Point: ',
    coreFeatures: '✦ Core Features',
    devQuote: '📦 Development Quote',
    devPrice: 'Development Price',
    devDuration: 'Development Duration',
    techStack: 'Tech Stack',
    resources: 'Resources Required',
    humanResources: 'Human Resources',
    maintenance: '🔧 Maintenance Cost',
    monthlyFee: 'Monthly Fee',
    person: '',
    emptyInput: 'Please enter your business pain point',
    error: 'Error: ',
    requestFailed: 'Request failed: ',
    voiceInput: 'Voice input',
    voiceStop: 'Click to stop',
    voiceNotSupported: 'Voice input not supported',
    micDenied: 'Microphone access denied',
    noSpeech: 'No speech detected'
  }
};

// 当前语言
let currentLang = localStorage.getItem('lang') || 'zh-CN';

// 语言代码映射（用于语音识别）
const speechLangMap = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en': 'en-US'
};

// 获取翻译
function t(key) {
  return i18n[currentLang][key] || key;
}

// 切换语言
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  updateUI();
}

// 更新界面语言
function updateUI() {
  // 更新标题
  document.querySelector('[data-i18n="title"]').textContent = t('title');
  document.querySelector('[data-i18n="subtitle"]').textContent = t('subtitle');
  document.querySelector('[data-i18n="modelLabel"]').textContent = t('modelLabel');
  document.querySelector('[data-i18n="generateBtn"]').textContent = t('generateBtn');
  document.querySelector('[data-i18n="loading"]').textContent = t('loading');
  
  // 更新 placeholder
  document.getElementById('painPointInput').placeholder = t('placeholder');
  
  // 更新模型选项
  const modelOptions = document.getElementById('modelSelect').options;
  modelOptions[0].textContent = t('model1');
  modelOptions[1].textContent = t('model2');
  modelOptions[2].textContent = t('model3');
  
  // 更新底部标签
  const footerTags = document.getElementById('footerTags');
  const industries = t('industries');
  footerTags.innerHTML = industries.map(ind => `<span>${ind}</span>`).join('');
  
  // 更新页面标题
  document.title = t('title') + ' | YuniTech';
}

// 前端逻辑
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

// 初始化语言选择器
document.getElementById('langSelect').value = currentLang;
document.getElementById('langSelect').addEventListener('change', (e) => {
  switchLanguage(e.target.value);
});

// 初始化界面
updateUI();

document.getElementById('matchBtn').addEventListener('click', async () => {
  const painPoint = document.getElementById('painPointInput').value.trim();
  const model = document.getElementById('modelSelect').value;
  
  if (!painPoint) {
    showToast(t('emptyInput'));
    return;
  }

  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE}/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ painPoint, model, lang: currentLang })
    });

    const result = await response.json();
    
    if (result.success) {
      displayResults(result.data);
    } else {
      showToast(t('error') + result.error);
    }
  } catch (error) {
    showToast(t('requestFailed') + error.message);
  } finally {
    showLoading(false);
  }
});

// 回车键提交
document.getElementById('painPointInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    document.getElementById('matchBtn').click();
  }
});

// ===== 语音输入功能 =====
const voiceBtn = document.getElementById('voiceBtn');
let recognition = null;
let isRecording = false;

// 检查浏览器是否支持语音识别
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  
  // 语音识别结果处理
  recognition.onresult = (event) => {
    const textarea = document.getElementById('painPointInput');
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // 追加最终结果
    if (finalTranscript) {
      textarea.value += finalTranscript;
    }
  };
  
  recognition.onerror = (event) => {
    console.error('语音识别错误:', event.error);
    stopRecording();
    if (event.error === 'not-allowed') {
      showToast(t('micDenied'));
    } else if (event.error === 'no-speech') {
      showToast(t('noSpeech'));
    }
  };
  
  recognition.onend = () => {
    if (isRecording) {
      // 如果还在录音状态但识别结束了，重新启动
      try {
        recognition.start();
      } catch (e) {
        stopRecording();
      }
    }
  };
  
  // 点击语音按钮
  voiceBtn.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });
  
} else {
  // 浏览器不支持语音识别
  voiceBtn.disabled = true;
  voiceBtn.title = t('voiceNotSupported');
}

function startRecording() {
  if (!recognition) return;
  
  // 设置识别语言
  recognition.lang = speechLangMap[currentLang] || 'zh-CN';
  
  try {
    recognition.start();
    isRecording = true;
    voiceBtn.classList.add('recording');
    voiceBtn.title = t('voiceStop');
  } catch (e) {
    console.error('启动语音识别失败:', e);
  }
}

function stopRecording() {
  if (!recognition) return;
  
  try {
    recognition.stop();
  } catch (e) {
    // 忽略
  }
  isRecording = false;
  voiceBtn.classList.remove('recording');
  voiceBtn.title = t('voiceInput');
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
  document.getElementById('results').style.display = show ? 'none' : 'block';
  document.getElementById('matchBtn').disabled = show;
  
  if (show) {
    document.getElementById('matchBtn').innerHTML = `
      <span class="btn-text">${t('generating')}</span>
    `;
  } else {
    document.getElementById('matchBtn').innerHTML = `
      <span class="btn-text">${t('generateBtn')}</span>
      <span class="btn-icon">→</span>
    `;
  }
}

function showToast(message) {
  alert(message);
}

function formatPrice(price) {
  return new Intl.NumberFormat('zh-HK').format(price);
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  
  if (data.solutions.length === 0) {
    resultsDiv.innerHTML = `
      <div class="no-results">
        <h3>${t('noResults')}</h3>
        <p>${t('noResultsTip')}</p>
      </div>
    `;
    return;
  }

  let html = ``;

  data.solutions.forEach((match, index) => {
    const solution = match.solution;
    const dev = solution.development;
    const maint = solution.maintenance;

    html += `
      <div class="solution-card" style="animation-delay: ${index * 0.1}s">
        <div class="solution-header">
          <h3>${solution.name}</h3>
          <span class="industry-tag">${match.industry}</span>
        </div>

        <div class="pain-point">
          <strong>${t('painPointLabel')}</strong>${solution.painPoint}
        </div>

        <div class="description">${solution.description}</div>

        <div class="features">
          <h4>${t('coreFeatures')}</h4>
          <ul>
            ${solution.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <div class="section-divider"></div>

        <div class="development-section">
          <h4>${t('devQuote')}</h4>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="label">${t('devPrice')}</span>
              <span class="value price">HKD ${formatPrice(dev.price)}</span>
            </div>
            <div class="info-item">
              <span class="label">${t('devDuration')}</span>
              <span class="value">${dev.duration}</span>
            </div>
          </div>

          <div class="tech-stack">
            <strong>${t('techStack')}</strong>
            ${dev.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>

          <div class="resources">
            <strong>${t('resources')}</strong>
            <ul>
              ${dev.resources.map(r => `
                <li>
                  <span><span class="resource-type">${r.type}</span>${r.name || r.specs || ''}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="human-resources">
            <strong>${t('humanResources')}</strong>
            <ul>
              ${dev.humanResources.map(hr => `
                <li>
                  <span>${hr.role}</span>
                  <span style="color: var(--text-muted);">${hr.count}${t('person')} · ${hr.duration}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="section-divider"></div>

        <div class="maintenance-section">
          <h4>${t('maintenance')}</h4>
          
          <div class="info-item" style="margin-bottom: 20px;">
            <span class="label">${t('monthlyFee')}</span>
            <span class="value price">HKD ${formatPrice(maint.monthlyPrice)}/${currentLang === 'en' ? 'mo' : '月'}</span>
          </div>

          <div class="resources">
            <strong>${t('resources')}</strong>
            <ul>
              ${maint.resources.map(r => `
                <li>
                  <span><span class="resource-type">${r.type}</span>${r.name || ''}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  });

  resultsDiv.innerHTML = html;
}
