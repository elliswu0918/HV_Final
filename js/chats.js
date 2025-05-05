// DOM 元素
const chatList = document.getElementById('chatList');

// 從 localStorage 獲取用戶加入的小圈圈
function getUserCircles() {
    return JSON.parse(localStorage.getItem('userCircles')) || [];
}

// 從 localStorage 獲取聊天記錄
function getChatHistory() {
    return JSON.parse(localStorage.getItem('chatHistory')) || {};
}

// 格式化時間
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return '昨天';
    } else if (diffDays < 7) {
        const days = ['日', '一', '二', '三', '四', '五', '六'];
        return '星期' + days[date.getDay()];
    } else {
        return date.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
    }
}

// 獲取最後一條消息
function getLastMessage(circleId) {
    const chatHistory = getChatHistory();
    const messages = chatHistory[circleId] || [];
    return messages[messages.length - 1] || null;
}

// 獲取未讀消息數量
function getUnreadCount(circleId) {
    const chatHistory = getChatHistory();
    const messages = chatHistory[circleId] || [];
    return messages.filter(msg => !msg.isRead).length;
}

// 渲染聊天列表
function renderChatList() {
    const userCircles = getUserCircles();
    
    if (userCircles.length === 0) {
        chatList.innerHTML = `
            <div class="no-chats">
                <span class="material-icons">chat_bubble_outline</span>
                <p>還沒有加入任何小圈圈</p>
                <p>快去探索有趣的小圈圈吧！</p>
            </div>
        `;
        return;
    }

    chatList.innerHTML = userCircles.map(circle => {
        const lastMessage = getLastMessage(circle.id);
        const unreadCount = getUnreadCount(circle.id);
        
        return `
            <div class="chat-item" onclick="openChat(${circle.id})">
                <div class="chat-avatar">
                    <span class="material-icons">groups</span>
                </div>
                <div class="chat-content">
                    <div class="chat-header">
                        <span class="chat-title">${circle.title}</span>
                        <span class="chat-time">${lastMessage ? formatTime(lastMessage.timestamp) : '剛剛加入'}</span>
                    </div>
                    <div class="chat-last-message">
                        ${lastMessage ? lastMessage.content : '開始聊天吧！'}
                    </div>
                </div>
                ${unreadCount > 0 ? `
                    <div class="chat-meta">
                        <span class="unread-badge">${unreadCount}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// 打開聊天室
function openChat(circleId) {
    window.location.href = `chat-room.html?circleId=${circleId}`;
}

// 更新底部導航欄的未讀消息提示
function updateNavBadge() {
    const userCircles = getUserCircles();
    const totalUnread = userCircles.reduce((sum, circle) => {
        return sum + getUnreadCount(circle.id);
    }, 0);

    const chatNavItem = document.querySelector('.nav-item[href="chats.html"]');
    if (totalUnread > 0) {
        // 如果還沒有徽章，則創建一個
        if (!chatNavItem.querySelector('.nav-badge')) {
            const badge = document.createElement('span');
            badge.className = 'nav-badge';
            chatNavItem.appendChild(badge);
        }
        chatNavItem.querySelector('.nav-badge').textContent = totalUnread;
    } else {
        // 如果沒有未讀消息，移除徽章
        const badge = chatNavItem.querySelector('.nav-badge');
        if (badge) {
            badge.remove();
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderChatList();
    updateNavBadge();
});

// 定期更新聊天列表和未讀消息提示
setInterval(() => {
    renderChatList();
    updateNavBadge();
}, 30000); // 每30秒更新一次 