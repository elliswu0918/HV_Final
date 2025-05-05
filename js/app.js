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
        // 這裡應該是調用 AI API 的地方
        // 目前使用模擬回應
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = getAIResponse(message);
        chatMessages.removeChild(typingDiv);
        addMessage(response);
    } catch (error) {
        chatMessages.removeChild(typingDiv);
        addMessage('抱歉，我現在無法回應，請稍後再試。');
    }
}

// 模擬 AI 回應
function getAIResponse(message) {
    const responses = [
        '我理解你的感受。讓我們一起探討這個問題。',
        '聽起來這對你來說是個困擾。你想多談談嗎？',
        '我在這裡陪著你。要不要告訴我更多？',
        '這確實是個難處理的情況。我們可以一起想辦法。',
        '謝謝你願意分享。你做得很好。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
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