let articles = []; // 存储原始数据
let currentSearch = '';
let currentTag = '';

// 加载数据并初始化页面
async function init() {

    try {
        const response = await fetch('https://855655.xyz/md/mdlist.json');
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
        const matchSearch = article.title.includes(currentSearch) ||
            article.description.includes(currentSearch);
        const matchTag = !currentTag || article.tags.includes(currentTag);
        return matchSearch && matchTag;
    });

    container.innerHTML = filtered.map(article => `
    <a href="view.html?file=${encodeURIComponent(article.file)}" class="article-card">
        <div class="incard">   
          <div class="article-title">${article.title}</div>
          <div class="article-description">${article.description}</div>
          <div class="article-tags">${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}</div>
        </div>
        <img class="imgbox" src="${article.img}" alt="">
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