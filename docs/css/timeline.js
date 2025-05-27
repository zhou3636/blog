async function loadTimeline() {
    const container = document.getElementById('timeline-container');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    try {
        // 加载JSON数据
        const response = await fetch('md/mdlist.json');
        if (!response.ok) throw new Error(`错误代码: ${response.status}`);
        
        const data = await response.json();
        loading.style.display = 'none';

        // 按年份分组排序
        const grouped = data.reduce((acc, item) => {
            const year = item.date.split('-')[0];
            (acc[year] = acc[year] || []).push(item);
            return acc;
        }, {});

        // 生成时间轴HTML
        let html = '';
        Object.keys(grouped)
            .sort((a, b) => b - a) // 降序排列
            .forEach(year => {
                html += `
                    <div class="year-group">
                        <h2>${year}</h2>
                        ${grouped[year]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(item => `
                                <a href="view.html?file=${item.file}" target="_blank" class="timeline-item">
                                    <div class="timeline-date">${item.date.slice(5).replace('-', ' - ')}</div>
                                    <div class="timeline-title">${item.title}</div>
                                </a>
                            `).join('')}
                    </div>
                `;
            });

        container.insertAdjacentHTML('beforeend', html);

    } catch (error) {
        loading.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.innerHTML = `
            加载失败：${error.message}<br>
            请检查：1. JSON文件路径 2. 本地服务器 3. 控制台错误
        `;
        console.error('加载数据失败:',error.message);
    }
}

// 初始化加载
loadTimeline();
