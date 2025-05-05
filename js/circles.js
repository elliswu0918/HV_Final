// DOM 元素
const cardStack = document.getElementById('cardStack');
const skipBtn = document.querySelector('.skip-btn');
const likeBtn = document.querySelector('.like-btn');
const matchOverlay = document.getElementById('matchOverlay');

// 用戶互動歷史存儲
const USER_CIRCLES_KEY = 'userCircles';
const USER_SKIPPED_KEY = 'skippedCircles';

// 獲取用戶已加入的小圈圈
function getUserCircles() {
    return JSON.parse(localStorage.getItem(USER_CIRCLES_KEY) || '[]');
}

// 獲取用戶已略過的小圈圈
function getSkippedCircles() {
    return JSON.parse(localStorage.getItem(USER_SKIPPED_KEY) || '[]');
}

// 保存用戶加入的小圈圈
function saveUserCircle(circle) {
    const userCircles = getUserCircles();
    const timestamp = new Date().toISOString();

    userCircles.push({
        ...circle,
        joinedAt: timestamp
    });

    localStorage.setItem(USER_CIRCLES_KEY, JSON.stringify(userCircles));

    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || {};
    if (!chatHistory[circle.id]) {
        chatHistory[circle.id] = [{
            type: 'system',
            content: '歡迎加入小圈圈！開始聊天吧！',
            timestamp: timestamp,
            isRead: false
        }];
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
}

// 保存用戶略過的小圈圈
function saveSkippedCircle(circleId) {
    const skippedCircles = getSkippedCircles();
    skippedCircles.push({ id: circleId, skippedAt: new Date().toISOString() });
    localStorage.setItem(USER_SKIPPED_KEY, JSON.stringify(skippedCircles));
}

const originalCircles = [
    { id: 1, title: '照護經驗分享', members: 4, description: '分享照護經驗和心得，互相支持和鼓勵。我們一起面對照護路上的挑戰，分享成功經驗與解決方案。', tags: ['照護', '經驗分享', '互助'], image: 'group1.jpg' },
    { id: 2, title: '情緒支持小組', members: 3, description: '一個安全的空間，讓我們互相傾聽和支持。在這裡，你可以自由表達情緒，獲得理解與共鳴。', tags: ['情緒支持', '傾聽', '陪伴'], image: 'group2.jpg' },
    { id: 3, title: '照護技巧交流', members: 5, description: '交流照護技巧和實用建議，提升照護品質。分享專業知識，學習新的照護方法。', tags: ['技巧分享', '實用建議', '經驗交流'], image: 'group3.jpg' }
];

let circles = [...originalCircles];
let currentIndex = 0;
let currentCard = null;
let startX = 0;
let currentX = 0;
let isSwiping = false;

function createCard(circle) {
    const card = document.createElement('div');
    card.className = 'circle-card';
    card.innerHTML = `
        <div class="circle-card-image">
            <span class="material-icons">groups</span>
        </div>
        <div class="circle-card-content">
            <h2 class="circle-card-title">${circle.title}</h2>
            <div class="circle-card-members">
                <span class="material-icons">person</span>
                ${circle.members} 位成員
            </div>
            <p class="circle-card-description">${circle.description}</p>
            <div class="circle-card-tags">
                ${circle.tags.map(tag => `<span class="circle-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="swipe-indicator like">加入</div>
        <div class="swipe-indicator skip">略過</div>
    `;

    card.addEventListener('mousedown', startSwipe);
    card.addEventListener('mousemove', moveSwipe);
    card.addEventListener('mouseup', endSwipe);
    card.addEventListener('mouseleave', endSwipe);

    card.addEventListener('touchstart', startSwipe);
    card.addEventListener('touchmove', moveSwipe);
    card.addEventListener('touchend', endSwipe);

    return card;
}

function startSwipe(e) {
    if (isSwiping) return;
    isSwiping = true;
    currentCard = this;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    currentX = startX;
    currentCard.classList.add('swiping');
}

function moveSwipe(e) {
    if (!isSwiping) return;
    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;
    const rotate = deltaX * 0.1;

    currentCard.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    const likeIndicator = currentCard.querySelector('.swipe-indicator.like');
    const skipIndicator = currentCard.querySelector('.swipe-indicator.skip');

    if (deltaX > 50) {
        likeIndicator.style.opacity = '1';
        skipIndicator.style.opacity = '0';
    } else if (deltaX < -50) {
        likeIndicator.style.opacity = '0';
        skipIndicator.style.opacity = '1';
    } else {
        likeIndicator.style.opacity = '0';
        skipIndicator.style.opacity = '0';
    }
}

function endSwipe() {
    if (!isSwiping) return;
    isSwiping = false;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 100) {
        const direction = deltaX > 0 ? 'right' : 'left';
        completeSwipe(direction);
    } else {
        currentCard.style.transform = '';
    }

    currentCard.classList.remove('swiping');
    const indicators = currentCard.querySelectorAll('.swipe-indicator');
    indicators.forEach(i => i.style.opacity = '0');
}

function completeSwipe(direction) {
    const circle = circles[currentIndex];
    const transform = direction === 'right' ? 'translateX(200%)' : 'translateX(-200%)';
    currentCard.style.transform = `${transform} rotate(${direction === 'right' ? 90 : -90}deg)`;

    setTimeout(() => {
        cardStack.removeChild(currentCard);
        if (direction === 'right') {
            saveUserCircle(circle);
            showMatch(circle);
        } else {
            saveSkippedCircle(circle.id);
        }
        currentIndex++;
        loadNextCard();
    }, 300);
}

function showMatch(circle) {
    const matchInfo = matchOverlay.querySelector('.match-circle-info');
    matchInfo.innerHTML = `
        <h3>${circle.title}</h3>
        <p>${circle.members} 位成員</p>
        <div class="circle-card-tags">
            ${circle.tags.map(tag => `<span class="circle-tag">${tag}</span>`).join('')}
        </div>
        <p class="join-time">加入時間：${new Date().toLocaleString()}</p>
    `;
    matchOverlay.classList.add('active');
}

function startChat() {
    const userCircles = getUserCircles();
    const lastJoined = userCircles[userCircles.length - 1];
    if (lastJoined) {
        matchOverlay.classList.remove('active');
        window.location.href = `chat-room.html?circleId=${lastJoined.id}`;
    }
}

function continueSwiping() {
    matchOverlay.classList.remove('active');
}

function loadNextCard() {
    if (currentIndex >= circles.length) {
        showNoMoreCards();
        return;
    }
    const card = createCard(circles[currentIndex]);
    cardStack.appendChild(card);
}

function showNoMoreCards() {
    cardStack.innerHTML = `
        <div class="no-more-cards">
            <span class="material-icons">mood</span>
            <p>暫時沒有更多小圈圈了</p>
            <p>請稍後再來看看</p>
        </div>
    `;
}

skipBtn.addEventListener('click', () => {
    if (currentCard) completeSwipe('left');
});

likeBtn.addEventListener('click', () => {
    if (currentCard) completeSwipe('right');
});

document.addEventListener('DOMContentLoaded', () => {
    // 每次載入時清除跳過與加入紀錄
    localStorage.removeItem(USER_CIRCLES_KEY);
    localStorage.removeItem(USER_SKIPPED_KEY);

    circles = [...originalCircles];
    currentIndex = 0;
    loadNextCard();
});