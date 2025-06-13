async function img() {
    try {
        // 读取JSON文件
        const response = await fetch('img/img.json');
        const data = await response.json();

        // 获取容器元素
        const container = document.getElementById('pts');

        // 清空容器
        container.innerHTML = '';

        // 遍历数组生成HTML
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'photo-card';
            div.innerHTML = `
                <div class="photo" data-src="img/${item.file}" onclick="showImage(this)">
                <img class="img-s" src="img2/${item.file}" alt="图片" onerror="this.style.display='none'">
                </div>
                <span class='title-p1'>${item.title}</span>
                <span class='title-p2'>${item.title1}</span>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error('加载图片列表失败:', error);
        document.getElementById('pts').innerHTML = '<p style="color: red;">加载图片列表失败</p>';
    }
}

// 页面加载完成后执行
// document.addEventListener('DOMContentLoaded', loadImageList);
img()