
function showhdimg() {
    const dialog = document.getElementById('hdimg');
    
    // 显示加载动画
    dialog.innerHTML = '<div class="loading"></div>';
    dialog.showModal();
    
    // 创建新的图片元素
    const img = new Image();
    
    // 图片加载完成后显示
    img.onload = function() {
        dialog.innerHTML = `<img src="image/nxd-2.jpeg" onclick="hdimg.close()">`;
    };
    
    // 开始加载图片
    img.src = 'image/nxd-2.jpeg';
}

// 点击背景关闭弹窗
document.getElementById('hdimg').addEventListener('click', function(e) {
    if (e.target === this) {
        this.close();
    }
});