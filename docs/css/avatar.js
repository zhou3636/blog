function showhdimg() {
    const dialog = document.getElementById('hdimg');
    
    // 检查是否已经有图片了
    const existingImg = dialog.querySelector('img[src]');
    if (existingImg) {
        dialog.showModal();
        return;
    }
    
    // 显示加载动画
    dialog.innerHTML = '<div class="loading"></div>';
    dialog.showModal();
    
    // 创建图片元素
    const img = document.createElement('img');
    
    // 图片加载完成后显示
    img.onload = function() {
        dialog.innerHTML = '';
        dialog.appendChild(img);
    };
    
    // 开始加载图片
    img.src = 'image/nxd-2.jpeg';
}