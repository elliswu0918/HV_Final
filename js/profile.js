// DOM 元素
const profileForm = document.getElementById('profileForm');
const tagsContainer = document.getElementById('tagsContainer');
const tagInput = document.getElementById('tagInput');
const avatar = document.getElementById('avatar');
const changeAvatarBtn = document.querySelector('.change-avatar-btn');

// 標籤列表
let tags = [];

// 從 localStorage 加載用戶資料
function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    
    // 填充表單
    profileForm.nickname.value = profile.nickname || '';
    profileForm.age.value = profile.age || '';
    profileForm.experience.value = profile.experience || '';
    profileForm.bio.value = profile.bio || '';
    profileForm.showProfile.checked = profile.showProfile || false;
    profileForm.allowMessage.checked = profile.allowMessage || false;

    // 加載標籤
    tags = profile.tags || [];
    renderTags();

    // 加載頭像
    if (profile.avatar) {
        avatar.src = profile.avatar;
    }
}

// 渲染標籤
function renderTags() {
    tagsContainer.innerHTML = tags.map(tag => `
        <div class="tag-item">
            ${tag}
            <span class="material-icons remove-tag" onclick="removeTag('${tag}')">close</span>
        </div>
    `).join('');
}

// 添加標籤
function addTag(tag) {
    tag = tag.trim();
    if (tag && !tags.includes(tag)) {
        tags.push(tag);
        renderTags();
    }
}

// 移除標籤
function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
}

// 處理標籤輸入
tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTag(tagInput.value);
        tagInput.value = '';
    }
});

// 處理表單提交
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const profile = {
        nickname: profileForm.nickname.value,
        age: profileForm.age.value,
        experience: profileForm.experience.value,
        bio: profileForm.bio.value,
        showProfile: profileForm.showProfile.checked,
        allowMessage: profileForm.allowMessage.checked,
        tags: tags,
        avatar: avatar.src
    };

    // 保存到 localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));

    // 顯示成功消息
    alert('個人資料已更新！');
});

// 處理頭像更改
changeAvatarBtn.addEventListener('click', () => {
    // 創建文件輸入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatar.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
});

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', loadUserProfile); 