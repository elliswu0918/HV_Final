// DOM 元素
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const circleName = document.getElementById('circleName');
const memberCount = document.getElementById('memberCount');

// 每次重新載入時重置聊天資料
localStorage.removeItem('chatHistory');

// 獲取 URL 參數中的 circleId
const urlParams = new URLSearchParams(window.location.search);
const circleId = urlParams.get('circleId');

// 從 localStorage 獲取小圈圈信息
function getCircleInfo(circleId) {
    const userCircles = JSON.parse(localStorage.getItem('userCircles')) || [];
    return userCircles.find(circle => circle.id === parseInt(circleId));
}

// 從 localStorage 獲取聊天記錄
function getChatHistory(circleId) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};
    return chatHistory[circleId] || [];
}

// 保存聊天記錄
function saveChatHistory(circleId, messages) {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};
    chatHistory[circleId] = messages;
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// 標記消息為已讀
function markMessagesAsRead(circleId) {
    const messages = getChatHistory(circleId);
    const updatedMessages = messages.map(msg => ({
        ...msg,
        isRead: true
    }));
    saveChatHistory(circleId, updatedMessages);
}

// 添加消息到聊天界面
function addMessageToUI(message, isScrollToBottom = true) {
    const messageDiv = document.createElement('div');

    if (message.type === 'system') {
        messageDiv.className = 'system-message';
        messageDiv.textContent = message.content;
    } else {
        messageDiv.className = `message ${message.isSelf ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${message.content}
            </div>
            <div class="message-info">
                ${!message.isSelf ? `<img src="${message.avatar || 'https://via.placeholder.com/24'}" alt="頭像" class="message-avatar">` : ''}
                <span class="message-time">${formatTime(message.timestamp)}</span>
            </div>
        `;
    }

    chatMessages.appendChild(messageDiv);

    if (isScrollToBottom) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 格式化時間
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

// 發送消息
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;

    const message = {
        type: 'user',
        content: content,
        timestamp: new Date().toISOString(),
        isSelf: true,
        isRead: true
    };

    // 添加到 UI
    addMessageToUI(message);

    // 保存到歷史記錄
    const messages = getChatHistory(circleId);
    messages.push(message);
    saveChatHistory(circleId, messages);

    // 清空輸入框
    messageInput.value = '';

    // 模擬其他成員回覆
    setTimeout(() => {
        const response = {
            type: 'user',
            content: getRandomResponse(),
            timestamp: new Date().toISOString(),
            isSelf: false,
            isRead: true,
            avatar: 'https://via.placeholder.com/24'
        };

        messages.push(response);
        saveChatHistory(circleId, messages);
        addMessageToUI(response);
    }, 1000 + Math.random() * 2000);
}

// 獲取隨機回覆
function getRandomResponse() {
    const responses = [
        '謝謝你的分享！',
        '我也有類似的經歷。',
        '這確實是個值得討論的話題。',
        '你說得很有道理！',
        '讓我們一起加油！',
        '分享經驗真的很重要。',
        '我完全理解你的感受。'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// 初始化聊天室
function initChatRoom() {
    if (!circleId) {
        alert('無效的小圈圈ID');
        window.location.href = 'chats.html';
        return;
    }

    const circle = getCircleInfo(circleId);
    if (!circle) {
        alert('找不到該小圈圈');
        window.location.href = 'chats.html';
        return;
    }

    // 更新頁面信息
    circleName.textContent = circle.title;
    memberCount.textContent = `${circle.members} 位成員`;

    // 載入歷史消息
    const messages = getChatHistory(circleId);
    messages.forEach(message => {
        addMessageToUI(message, false);
    });

    // 滾動到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 標記消息為已讀
    markMessagesAsRead(circleId);
}

// 事件監聽器
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', initChatRoom);