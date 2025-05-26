let articles = []; // 存储原始数据
let currentSearch = '';
let currentTag = '';

// 加载数据并初始化页面
async function init() {

    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    try {
        const response = await fetch('./md/mdlist.json');
        if (!response.ok) throw new Error(`错误代码: ${response.status}`);
        articles = await response.json();
        renderTags();
        renderArticles();
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
// 渲染文章列表
function renderArticles() {
    const container = document.getElementById('left-column');
    const filtered = articles.filter(article => {
        const matchSearch = article.title.includes(currentSearch) || 
                          article.description.includes(currentSearch);
        const matchTag = !currentTag || article.tags.includes(currentTag);
        return matchSearch && matchTag;
    });

    container.innerHTML = filtered.map(article => `
        <a href="view.html?file=${encodeURIComponent(article.file)}"  target="_blank" class="article-card">
            <div class="article-title">${article.title}</div>
            <div class="article-description">${article.description}</div>
            <div class="article-tags">
                ${article.tags.map(tag => `
                    <span class="article-tag">${tag}</span>
                `).join('')}
            </div>
        </a>
    `).join('');
}

// 渲染所有标签
function renderTags() {
    const tags = [...new Set(articles.flatMap(article => article.tags))];
    const container = document.getElementById('tagsContainer');
    
    container.innerHTML = [
        '<div class="tag" data-tag="">全部</div>',
        ...tags.map(tag => `
            <div class="tag" data-tag="${tag}">${tag}</div>
        `)
    ].join('');
}
loading.style.display = 'none';
// 事件监听
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderArticles();
});

document.getElementById('tagsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        currentTag = e.target.dataset.tag;
        document.querySelectorAll('#tagsContainer .tag').forEach(tag => {
            tag.style.backgroundColor = tag === e.target ? '#d0e0ff' : '#f0f0f0';
        });
        renderArticles();
    }
});

// 初始化
init();