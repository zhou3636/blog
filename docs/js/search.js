// 增强版独立脚本
let observer;

function initSearch() {
  const searchBox = document.getElementById('searchBox');
  const list = document.getElementById('articleContainer');
  
  // 使用WeakMap保持内存安全
  const itemData = new WeakMap();
  
  // 构建索引
  const rebuildIndex = () => {
    Array.from(list.children).forEach(item => {
      const title = item.querySelector('.title-l').textContent;
      const desc = item.querySelector('.desc').textContent;
      itemData.set(item, `${title} ${desc}`.toLowerCase());
    });
  };
  
  // 首次构建
  rebuildIndex();
  
  // 监听后续变化
  observer = new MutationObserver(rebuildIndex);
  observer.observe(list, { childList: true });
  
  // 防抖搜索
  let searchTimer;
  searchBox.addEventListener('input', function() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const keyword = this.value.toLowerCase();
      Array.from(list.children).forEach(item => {
        const visible = itemData.get(item).includes(keyword);
        item.style.display = visible ? '' : 'none';
      });
    }, 80);
  });
}

// 安全初始化
if(document.readyState === 'complete') {
  initSearch();
} else {
  window.addEventListener('load', initSearch);
}
