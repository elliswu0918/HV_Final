// 示範資料
const DEMO_CIRCLES = [
    {
        id: 'circle1',
        title: '心靈成長小組',
        memberCount: 15,
        description: '一起分享生活點滴，互相支持與鼓勵',
        tags: ['成長', '分享', '支持']
    },
    {
        id: 'circle2',
        title: '情緒支持圈',
        memberCount: 8,
        description: '在這裡可以安心地表達情緒，獲得理解與陪伴',
        tags: ['情緒', '支持', '理解']
    },
    {
        id: 'circle3',
        title: '正念冥想小組',
        memberCount: 12,
        description: '學習正念冥想，找回內心的平靜',
        tags: ['冥想', '正念', '平靜']
    }
];

const DEMO_MESSAGES = {
    circle1: [
        { sender: 'system', content: '歡迎加入心靈成長小組！', timestamp: Date.now() - 86400000, read: true },
        { sender: 'member1', content: '大家好，很高興能加入這個小組！', timestamp: Date.now() - 3600000, read: false },
        { sender: 'member2', content: '歡迎新朋友～今天過得如何？', timestamp: Date.now() - 1800000, read: false }
    ],
    circle2: [
        { sender: 'system', content: '歡迎來到情緒支持圈！', timestamp: Date.now() - 43200000, read: true },
        { sender: 'member3', content: '這裡的氛圍真的很溫暖呢', timestamp: Date.now() - 900000, read: false }
    ],
    circle3: [
        { sender: 'system', content: '歡迎加入正念冥想小組！', timestamp: Date.now() - 21600000, read: true }
    ]
};

const DEMO_PROFILE = {
    nickname: '小天使',
    avatar: 'images/default-avatar.png',
    interests: ['心理成長', '冥想', '正念'],
    bio: '願意聆聽，願意分享，一起在生命中成長。',
    joinDate: new Date().toISOString()
};

// 示範資料
const DEMO_RESOURCES = [
    {
        id: 'resource1',
        name: '心靈關懷中心',
        type: '諮商中心',
        address: '台北市大安區和平東路一段',
        lat: 25.026,
        lng: 121.543,
        rating: 4.8,
        ratingCount: 156,
        phone: '02-2123-4567',
        description: '提供專業心理諮商服務，協助你找到內心的平靜。',
        recommendations: [
            '這裡的諮商師非常專業。',
            '環境舒適，適合進行心理諮詢。'
        ],
        reviews: [
            { author: '小美', rating: 5, content: '非常專業的服務。', date: '2024-02-15' },
            { author: '阿明', rating: 4, content: '環境很舒適。', date: '2024-02-10' }
        ]
    },
    {
        id: 'resource2',
        name: '陽光心理診所',
        type: '心理診所',
        address: '台北市信義區松仁路',
        lat: 25.033,
        lng: 121.568,
        rating: 4.6,
        ratingCount: 89,
        phone: '02-2789-1234',
        description: '專業的心理醫療團隊，為你提供全面的心理健康服務。',
        recommendations: [
            '醫師非常細心，能夠理解我的需求。',
            '診所的設施非常完善，讓我感到很舒適。'
        ],
        reviews: [
            { author: '小林', rating: 5, content: '醫師很專業，解答了我很多困擾已久的問題。診所環境也很溫馨。', date: '2024-02-12' },
            { author: '小周', rating: 4, content: '預約容易，醫師會細心傾聽並給予實用的建議。', date: '2024-02-08' }
        ]
    },
    {
        id: 'resource3',
        name: '希望協談室',
        type: '諮商中心',
        address: '台北市中山區南京東路',
        lat: 25.052,
        lng: 121.533,
        rating: 4.7,
        ratingCount: 123,
        phone: '02-2345-6789',
        description: '溫暖友善的環境，讓你可以安心地訴說心事。',
        reviews: [
            { author: '小陳', rating: 5, content: '諮商師很有同理心，幫助我看清問題的核心。環境安靜舒適。', date: '2024-02-14' },
            { author: '小李', rating: 4, content: '服務態度很好，諮商過程中感受到滿滿的支持與鼓勵。', date: '2024-02-09' }
        ]
    },
    // 可以繼續添加更多資源
];

// 初始化示範資料
function initDemoData() {
    // 初始化個人資料
    localStorage.setItem('userProfile', JSON.stringify(DEMO_PROFILE));
    
    // 初始化圈子資料
    localStorage.setItem('userCircles', JSON.stringify(DEMO_CIRCLES));
    
    // 初始化聊天記錄
    DEMO_CIRCLES.forEach(circle => {
        const chatKey = `chatHistory_${circle.id}`;
        localStorage.setItem(chatKey, JSON.stringify(DEMO_MESSAGES[circle.id] || []));
    });
}

// 更新頁面上的個人資料
function updateProfileDisplay() {
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    if (!userProfile) return;

    // 更新頭像
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        avatarElement.src = userProfile.avatar;
        avatarElement.alt = `${userProfile.nickname}的頭像`;
    }

    // 更新暱稱
    const nicknameElement = document.getElementById('userNickname');
    if (nicknameElement) {
        nicknameElement.textContent = userProfile.nickname;
    }
}

// 獲取用戶已加入的圈子
function getUserCircles() {
    const circles = localStorage.getItem('userCircles');
    return circles ? JSON.parse(circles) : [];
}

// 獲取聊天歷史
function getChatHistory(circleId) {
    const history = localStorage.getItem(`chatHistory_${circleId}`);
    return history ? JSON.parse(history) : [];
}

// 獲取未讀消息數量
function getUnreadCount(circleId) {
    const history = getChatHistory(circleId);
    return history.filter(msg => !msg.read && msg.sender !== 'user').length;
}

// 更新聊天預覽
function updateChatPreview() {
    const chatPreview = document.getElementById('chatPreview');
    if (!chatPreview) return;

    const userCircles = getUserCircles();
    
    if (userCircles.length === 0) {
        chatPreview.innerHTML = `
            <div class="preview-no-circles">
                還沒有加入任何圈子<br>
                去探索有趣的圈子吧！
            </div>
        `;
        return;
    }

    let totalUnread = 0;
    let previewHTML = '';

    userCircles.forEach(circle => {
        const unreadCount = getUnreadCount(circle.id);
        totalUnread += unreadCount;

        previewHTML += `
            <div class="preview-circle" onclick="window.location.href='chat-room.html?circleId=${circle.id}'">
                <div class="preview-circle-icon">
                    <span class="material-icons">group</span>
                </div>
                <div class="preview-circle-info">
                    <div class="preview-circle-title">
                        ${circle.title}
                        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
                    </div>
                    <div class="preview-circle-members">${circle.memberCount} 位成員</div>
                </div>
            </div>
        `;
    });

    chatPreview.innerHTML = previewHTML;

    // 更新導航欄徽章
    const chatNavItem = document.getElementById('chatNavItem');
    if (chatNavItem) {
        const badge = chatNavItem.querySelector('.nav-badge');
        if (totalUnread > 0) {
            if (badge) {
                badge.textContent = totalUnread;
            } else {
                const newBadge = document.createElement('div');
                newBadge.className = 'nav-badge';
                newBadge.textContent = totalUnread;
                chatNavItem.appendChild(newBadge);
            }
        } else if (badge) {
            badge.remove();
        }
    }
}

// 初始化地圖
function initMap() {
    const mapContainer = document.getElementById('map');
    const loadingElement = document.querySelector('.map-loading');
    const errorElement = document.querySelector('.map-error');

    if (errorElement) errorElement.style.display = 'none';
    if (loadingElement) loadingElement.style.display = 'flex';

    const map = new google.maps.Map(mapContainer, {
        center: { lat: 25.0330, lng: 121.5654 },
        zoom: 13,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // 載入支援資源資料
    DEMO_RESOURCES.forEach(resource => {
        const marker = createResourceMarker(map, resource);
        const infoWindow = createInfoWindow(resource);
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
}

// 載入支援資源資料
async function loadSupportResources() {
    // 模擬從後端 API 獲取資料
    return [
        {
            id: 1,
            name: '台北市社區心理衛生中心',
            type: '心理諮商',
            rating: 4.8,
            reviewCount: 156,
            address: '台北市中正區金山南路一段5號',
            phone: '02-33936779',
            description: '提供心理健康諮詢、心理評估與個別諮商等服務',
            position: { lat: 25.0375, lng: 121.5275 },
            reviews: [
                { author: '王小明', date: '2024-03-15', rating: 5, content: '非常專業的諮商服務，讓我找到了面對問題的方向。' },
                { author: '李小華', date: '2024-03-10', rating: 4, content: '環境舒適，諮商師很有耐心。' }
            ]
        },
        {
            id: 2,
            name: '心晴診所',
            type: '精神科診所',
            rating: 4.5,
            reviewCount: 89,
            address: '台北市大安區敦化南路二段76號',
            phone: '02-27557666',
            description: '提供精神科門診、心理諮商與身心科診療服務',
            position: { lat: 25.0280, lng: 121.5490 },
            reviews: [
                { author: '張小芳', date: '2024-03-12', rating: 5, content: '醫師很親切，解釋得很詳細。' },
                { author: '林小豪', date: '2024-03-08', rating: 4, content: '預約制度完善，等候時間短。' }
            ]
        }
    ];
}

// 建立資源標記
function createResourceMarker(map, resource) {
    const markerColor = getMarkerColor(resource.rating);
    
    const marker = new google.maps.Marker({
        position: resource.position,
        map: map,
        label: {
            text: resource.rating.toString(),
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold'
        },
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 16
        }
    });

    // 滑鼠懸停時顯示預覽
    const previewContent = document.createElement('div');
    previewContent.className = 'marker-preview';
    previewContent.innerHTML = `
        <strong>${resource.name}</strong>
        <div>
            <span class="material-icons" style="color: #FFD700; font-size: 16px;">star</span>
            ${resource.rating} (${resource.ratingCount})
        </div>
    `;

    const preview = new google.maps.InfoWindow({
        content: previewContent,
        disableAutoPan: true
    });

    marker.addListener('mouseover', () => {
        preview.open(map, marker);
    });

    marker.addListener('mouseout', () => {
        preview.close();
    });

    return marker;
}

// 建立資訊視窗
function createInfoWindow(resource) {
    const content = document.createElement('div');
    content.className = 'info-window';
    content.innerHTML = `
        <div class="info-header">
            <h3>${resource.name}</h3>
            <div class="rating">
                <span class="material-icons" style="color: #FFD700;">star</span>
                ${resource.rating} (${resource.ratingCount} 則評價)
            </div>
        </div>
        <div class="info-body">
            <p><strong>類型：</strong>${resource.type}</p>
            <p><strong>地址：</strong>${resource.address}</p>
            <p><strong>電話：</strong>${resource.phone}</p>
            <p>${resource.description}</p>
            <div class="reviews-section">
                <h4>最新評價</h4>
                ${resource.reviews.map(review => `
                    <div class="review-card">
                        <div class="review-header">
                            <span class="review-author">${review.author}</span>
                            <span class="review-date">${review.date}</span>
                        </div>
                        <div class="review-rating">
                            ${Array(review.rating).fill('<span class="material-icons" style="color: #FFD700; font-size: 14px;">star</span>').join('')}
                        </div>
                        <p class="review-content">${review.content}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    return new google.maps.InfoWindow({
        content: content,
        maxWidth: 360
    });
}

// 根據評分取得標記顏色
function getMarkerColor(rating) {
    if (rating >= 4.5) return '#4CAF50';  // 綠色
    if (rating >= 4.0) return '#2196F3';  // 藍色
    if (rating >= 3.5) return '#FFC107';  // 黃色
    return '#FF9800';  // 橘色
}

// 更新資源卡片顯示
function updateResourcesList() {
    const resourcesList = document.getElementById('resourcesList');
    if (!resourcesList) return;

    let html = '<div class="resources-grid">';
    
    DEMO_RESOURCES.forEach(resource => {
        const ratingStars = '⭐'.repeat(Math.floor(resource.rating)) + 
            (resource.rating % 1 >= 0.5 ? '⭐' : '');
        
        html += `
            <div class="resource-card" onclick="showResourceDetails('${resource.id}')">
                <div class="resource-icon">
                    <span class="material-icons">${resource.type === '諮商中心' ? 'psychology' : 'local_hospital'}</span>
                </div>
                <div class="resource-info">
                    <h3>${resource.name}</h3>
                    <p class="type">${resource.type}</p>
                    <div class="rating-container">
                        <span class="rating">${ratingStars}</span>
                        <span class="rating-number">${resource.rating}</span>
                        <span class="rating-count">(${resource.ratingCount}則評價)</span>
                    </div>
                    <p class="address">${resource.address}</p>
                </div>
            </div>
        `;
    });

    html += '</div>';
    resourcesList.innerHTML = html;
}

// 顯示資源詳細信息
function showResourceDetails(resourceId) {
    const resource = DEMO_RESOURCES.find(r => r.id === resourceId);
    if (!resource || !map) return;

    // 移動地圖到資源位置
    map.panTo({ lat: resource.lat, lng: resource.lng });
    map.setZoom(15);

    // 更新信息窗口內容
    const reviewsHtml = resource.reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                <span class="review-date">${review.date}</span>
            </div>
            <p class="review-content">${review.content}</p>
        </div>
    `).join('');

    const content = `
        <div class="info-window">
            <h3>${resource.name}</h3>
            <p class="type">${resource.type}</p>
            <div class="rating-container">
                <span class="rating">評分：${resource.rating} ⭐</span>
                <span class="rating-count">(${resource.ratingCount}則評價)</span>
            </div>
            <p class="address">地址：${resource.address}</p>
            <p class="phone">電話：${resource.phone}</p>
            <p class="description">${resource.description}</p>
            <div class="reviews-section">
                <h4>使用者評價</h4>
                ${reviewsHtml}
            </div>
        </div>
    `;

    // 打開信息窗口
    const marker = markers.find(m => m.getTitle() === resource.name);
    if (marker) {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
    }
}

// 獲取推薦評價
function getFeaturedReviews() {
    const data = localStorage.getItem('demoResources');
    const resources = data ? JSON.parse(data) : [];

    const featuredReviews = [];

    resources.forEach(resource => {
        (resource.reviews || []).forEach(review => {
            if (review.rating >= 4) {
                featuredReviews.push({
                    ...review,
                    resourceName: resource.name
                });
            }
        });
    });

    console.log('提取的推薦評價:', featuredReviews); // 除錯用
    return featuredReviews
        .sort((a, b) => b.rating - a.rating || new Date(b.date) - new Date(a.date))
        .slice(0, 6);
}

// 更新推薦評價顯示
function updateFeaturedReviews() {
    const featuredReviewsContainer = document.getElementById('featuredReviewsContainer');
    if (!featuredReviewsContainer) return;

    const reviews = getFeaturedReviews();
    let reviewsHtml = '';

    reviews.forEach(review => {
        reviewsHtml += `
            <div class="featured-review-card">
                <div class="featured-review-header">
                    ${review.resourceName}
                    <div class="featured-review-rating">⭐ ${review.rating}</div>
                </div>
                <div class="featured-review-content">${review.content}</div>
                <div class="featured-review-author">
                    <div class="featured-review-name">${review.author}</div>
                    <div class="featured-review-date">${review.date}</div>
                </div>
            </div>
        `;
    });

    featuredReviewsContainer.innerHTML = reviewsHtml;
}


// 更新推薦內容顯示
function updateRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations');
    if (!recommendationsContainer) return;

    let recommendationsHtml = '';

    DEMO_RESOURCES.forEach(resource => {
        recommendationsHtml += `
            <div class="recommendation-item">
                <strong>${resource.name}</strong>
                <ul>
                    ${resource.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    recommendationsContainer.innerHTML = recommendationsHtml;
}

function renderRecommendedCircles() {
    const container = document.querySelector('.circles-container');
    const circles = getUserCircles(); // 使用已初始化的 DEMO_CIRCLES

    container.innerHTML = circles.map(circle => `
        <div class="circle-card" onclick="location.href='chat-room.html?circleId=${circle.id}'">
            <h3>${circle.title}</h3>
            <p>${circle.description}</p>
            <div class="tags">${circle.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        </div>
    `).join('');
}

function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
}

// 頁面加載時初始化示範資料並更新顯示
document.addEventListener('DOMContentLoaded', () => {
    // 清除之前的資料並初始化示範資料
    localStorage.clear();
    initDemoData();
    localStorage.setItem('demoResources', JSON.stringify(DEMO_RESOURCES)); // ✅ 修正點

    // 更新個人資料顯示
    updateProfileDisplay();

    // 更新推薦評價與內容
    updateFeaturedReviews();
    updateRecommendations();

    // 更新聊天預覽
    updateChatPreview();
    setInterval(updateChatPreview, 30000);

    // 初始化地圖
    if (window.google && window.google.maps) {
        initMap();
    } else {
        setTimeout(() => {
            if (window.google && window.google.maps) {
                initMap();
            } else {
                const mapContainer = document.getElementById('map');
                if (mapContainer) {
                    mapContainer.innerHTML = `
                        <div style="text-align: center; padding: 20px;">
                            <p style="color: #666;">地圖服務暫時無法使用</p>
                            <p style="color: #999; font-size: 14px;">請確認網路連接後重新整理頁面</p>
                        </div>
                    `;
                }
            }
        }, 1000);
    }

    // 小圈圈渲染
    renderRecommendedCircles();

    // 聊天視窗事件
    document.querySelector('.start-chat-btn').addEventListener('click', () => {
        document.querySelector('.chat-dialog').style.display = 'block';
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        document.querySelector('.chat-dialog').style.display = 'none';
    });

    loadGoogleMaps();

    document.querySelector('.prev-button').addEventListener('click', () => {
        document.querySelector('.reviews-slider').scrollBy({ left: -300, behavior: 'smooth' });
    });

    document.querySelector('.next-button').addEventListener('click', () => {
        document.querySelector('.reviews-slider').scrollBy({ left: 300, behavior: 'smooth' });
    });
});

let currentIndex = 0;

function slideReviews(direction) {
    const slider = document.querySelector('.reviews-slider');
    const cards = document.querySelectorAll('.featured-review-card');
    const totalCards = cards.length;

    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % totalCards; // 向右滑動
    } else {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards; // 向左滑動
    }

    const offset = -currentIndex * (cards[0].offsetWidth + 16); // 計算偏移量
    slider.style.transform = `translateX(${offset}px)`; // 更新滑動位置
}

// 在 DOMContentLoaded 事件中添加左右滑動按鈕
document.addEventListener("DOMContentLoaded", function () {
    const nextButton = document.querySelector('.next-button');
    const prevButton = document.querySelector('.prev-button');

    nextButton.onclick = () => slideReviews('next');
    prevButton.onclick = () => slideReviews('prev');
});


