function createStar() {
    const hash3 = window.location.hash;
    if (hash3 === '#docs' || hash3 === '#gallery') return;
    // 如果符合停止条件，直接退出函数

    const star = document.createElement('div');
    star.className = 'star';
    
    const sizes = ['small', 'medium', 'large', 'giant'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    star.classList.add(randomSize);
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.animationDelay = Math.random() * 3 + 's';
    
    document.getElementById('starsContainer').appendChild(star);
}

function createShootingStar() {
    const hash3 = window.location.hash;
    if (hash3 === '#docs' || hash3 === '#gallery') return;
    // 如果符合停止条件，直接退出函数

    const shootingStar = document.createElement('div');
    shootingStar.className = 'shooting-star';
    
    const startY = Math.random() * (window.innerHeight * 0.3);
    const startX = Math.random() * window.innerWidth * 0.3;
    
    shootingStar.style.left = startX + 'px';
    shootingStar.style.top = startY + 'px';
    shootingStar.style.animationDelay = Math.random() * 5 + 's';
    
    document.getElementById('starsContainer').appendChild(shootingStar);
    
    setTimeout(() => {
        if (shootingStar.parentNode) {
            shootingStar.parentNode.removeChild(shootingStar);
        }
    }, 8000);
}

// 创建初始星星
for (let i = 0; i < 200; i++) {
    createStar();
}

// 定期创建流星
setInterval(createShootingStar, 5000);

// 动态添加新星星
setInterval(() => {
    if (document.querySelectorAll('.star').length < 250) {
        createStar();
    }
}, 2000);

// 鼠标交互效果
// document.addEventListener('mousemove', (e) => {
//     if (Math.random() < 0.1) {
//         const sparkle = document.createElement('div');
//         sparkle.className = 'star medium';
//         sparkle.style.left = e.clientX + 'px';
//         sparkle.style.top = e.clientY + 'px';
//         sparkle.style.animationDuration = '0.8s';
//         sparkle.style.pointerEvents = 'none';
        
//         document.getElementById('starsContainer').appendChild(sparkle);
        
//         setTimeout(() => {
//             if (sparkle.parentNode) {
//                 sparkle.parentNode.removeChild(sparkle);
//             }
//         }, 1000);
//     }
// });

// 点击创建爆炸效果
// document.addEventListener('click', (e) => {
//     for (let i = 0; i < 8; i++) {
//         const sparkle = document.createElement('div');
//         sparkle.className = 'star large';
//         sparkle.style.left = (e.clientX + (Math.random() - 0.5) * 100) + 'px';
//         sparkle.style.top = (e.clientY + (Math.random() - 0.5) * 100) + 'px';
//         sparkle.style.animationDuration = '1s';
//         sparkle.style.pointerEvents = 'none';
        
//         document.getElementById('starsContainer').appendChild(sparkle);
        
//         setTimeout(() => {
//             if (sparkle.parentNode) {
//                 sparkle.parentNode.removeChild(sparkle);
//             }
//         }, 1200);
//     }
// });