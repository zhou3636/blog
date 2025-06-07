let articles = []; // 存储原始数据
let currentSearch = '';
let currentTag = '';

// 加载数据并初始化页面
async function init() {

    try {
        const response = await fetch('md/mdlist2.json');
        if (!response.ok) throw new Error(`错误代码: ${response.status}`);
        articles = await response.json();
        renderTags();
        renderArticles();
    } catch (error) {
        console.error('加载数据失败:', error.message);
    }
}
// 渲染文章列表
function renderArticles() {
    const container = document.getElementById('left-column');
    const filtered = articles.filter(article => {
        const matchSearch = article.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            article.date.includes(currentSearch);
        const matchTag = !currentTag || article.tags.includes(currentTag);
        return matchSearch && matchTag;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
                <div class="article-card-2">未搜索到匹配文字的文章</div>
        `;
        return;
    }

    container.innerHTML = filtered.map(article => `
        <a href="view.html?file=${encodeURIComponent(article.file)}" target="_blank" class="article-card-2">
            <div class="article-date-2">${article.date}</div>
            <div class="article-title-2">${article.title}</div>
            <div class="article-tags-2">${article.tags.map(tag => `<span class="article-tag-2">#${tag}</span>`).join('')}</div>
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
// 事件监听
document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderArticles();
});

document.getElementById('tagsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
        currentTag = e.target.dataset.tag;
        document.querySelectorAll('#tagsContainer .tag').forEach(tag => {
            tag.style.backgroundColor = tag === e.target ? '#d1e9ff' : '#e8f4ffcc';
        });
        renderArticles();
    }
});

// 初始化
init();