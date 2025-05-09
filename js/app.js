// DOM 元素
const chatDialog = document.querySelector('.chat-dialog');
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.send-btn');
const closeButton = document.querySelector('.close-btn');
const chatbotCard = document.querySelector('.chatbot-card');
const userAvatar = document.getElementById('userAvatar');
const userNickname = document.getElementById('userNickname');

// 初始化隱藏聊天對話框
chatDialog.style.display = 'none';

// 加載用戶資料
function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    // 更新頭像和暱稱
    if (profile.avatar) {
        userAvatar.src = profile.avatar;
    }
    if (profile.nickname) {
        userNickname.textContent = profile.nickname;
    }
}

// 打開聊天對話框
function openChat() {
    chatDialog.style.display = 'flex';
    chatInput.focus();
}

// 關閉聊天對話框
function closeChat() {
    chatDialog.style.display = 'none';
}

// 添加消息到聊天界面
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message}
        </div>
        <div class="message-time">
            ${new Date().toLocaleTimeString()}
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 處理用戶發送消息
async function handleSendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // 添加用戶消息
    addMessage(message, true);
    chatInput.value = '';

    // 顯示機器人正在輸入
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.textContent = '機器人正在輸入...';
    chatMessages.appendChild(typingDiv);

    try {
        // 調用生成式 AI 的回應
        const response = await getLocalModelResponse(message);
        chatMessages.removeChild(typingDiv);
        addMessage(response);
    } catch (error) {
        chatMessages.removeChild(typingDiv);
        addMessage('抱歉，我現在無法回應，請稍後再試。');
    }
}

// 事件監聽器
chatbotCard.addEventListener('click', openChat);
closeButton.addEventListener('click', closeChat);
sendButton.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});

// 初始化地圖（使用 Google Maps API）
function initMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    const map = new google.maps.Map(mapContainer, {
        center: { lat: 25.0330, lng: 121.5654 }, // 台北市中心
        zoom: 12
    });

    // 添加示例標記
    const markers = [
        {
            position: { lat: 25.0375, lng: 121.5637 },
            title: '心理諮商中心'
        },
        {
            position: { lat: 25.0330, lng: 121.5654 },
            title: '情緒支持團體'
        }
    ];

    markers.forEach(markerInfo => {
        new google.maps.Marker({
            position: markerInfo.position,
            map: map,
            title: markerInfo.title
        });
    });
}

// 當 Google Maps API 加載完成時初始化地圖
window.initMap = initMap;

// 小圈圈數據
const circles = [
    {
        title: '照護經驗分享',
        members: 4,
        tags: ['照護', '經驗分享', '互助'],
        description: '分享照護經驗和心得，互相支持和鼓勵。'
    },
    {
        title: '情緒支持小組',
        members: 3,
        tags: ['情緒支持', '傾聽', '陪伴'],
        description: '一個安全的空間，讓我們互相傾聽和支持。'
    },
    {
        title: '照護技巧交流',
        members: 5,
        tags: ['技巧分享', '實用建議', '經驗交流'],
        description: '交流照護技巧和實用建議，提升照護品質。'
    }
];

// 渲染小圈圈
function renderCircles() {
    const container = document.querySelector('.circles-container');
    if (!container) return;

    // 只顯示前兩個小圈圈作為預覽
    const previewCircles = circles.slice(0, 2);
    
    container.innerHTML = previewCircles.map(circle => `
        <div class="circle-card" onclick="window.location.href='circles.html'">
            <div class="circle-icon">
                <span class="material-icons">groups</span>
            </div>
            <div class="circle-content">
                <h3>${circle.title}</h3>
                <p><span class="material-icons">person</span> ${circle.members} 位成員</p>
                <p class="circle-description">${circle.description}</p>
                <div class="tags">
                    ${circle.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 加入小圈圈
function joinCircle(circle) {
    const profile = JSON.parse(localStorage.getItem('userProfile'));
    if (!profile || !profile.nickname) {
        alert('請先完善個人資料再加入小圈圈！');
        window.location.href = 'profile.html';
        return;
    }

    alert(`已成功加入「${circle.title}」小圈圈！`);
    // 這裡可以添加加入小圈圈的邏輯
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    renderCircles();
});

async function getLocalModelResponse(userMsg) {
    const prompt = `
你是一位專業的心理諮商師，擅長以同理心和支持性的方式與來訪者對話。
請遵循以下原則：
1. 使用溫和、平靜的語氣
2. 展現積極傾聽和同理心
3. 避免直接給建議，而是引導來訪者自我探索
4. 使用開放式問題鼓勵來訪者表達
5. 適時反映來訪者的情緒
6. 保持專業界限
7. 注意來訪者的情緒變化
8. 在適當時機做摘要與統整

以下是來訪者的提問：${userMsg}
`;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCq_cLijJCx4DszzypqYeTmyhy1bJ0U4HA", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        console.log("API 響應：", data);

        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return reply || "目前無法取得生成式 AI 的回應。";
    } catch (e) {
        console.error("生成式 AI API 錯誤：", e);
        return "呼叫生成式 AI 失敗，請稍後再試。";
    }
} 