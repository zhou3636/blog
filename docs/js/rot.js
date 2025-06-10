class HashRouter {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.init();
    }

    // 注册路由
    route(path, handler) {
        this.routes[path] = handler;
    }

    // 初始化路由
    init() {
        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // 页面加载时处理初始路由
        window.addEventListener('load', () => {
            this.handleRouteChange();
        });
    }

    // 处理路由变化
    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        this.navigate(hash);
    }

    // 导航到指定路由
    navigate(path) {
        const handler = this.routes[path];
        if (handler) {
            this.currentRoute = path;
            handler();
            this.updateActiveNav(path);
        } else {
            // 路由不存在，跳转到首页
            this.navigate('/');
        }
    }

    // 更新导航栏活跃状态
    updateActiveNav(currentPath) {
        const navLinks = document.querySelectorAll('.nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentPath}`) {
                link.classList.add('active');
            }
        });
    }

    // 编程式导航
    push(path) {
        window.location.hash = path;
    }
}

// 动态加载JS文件的工具函数 - 支持强制重新加载
function loadScript(src, forceReload = false) {
    return new Promise((resolve, reject) => {
        // 如果需要强制重新加载，先移除已存在的脚本
        if (forceReload) {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
        } else {
            // 检查是否已经加载过
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve();
                return;
            }
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

// 页面和对应JS文件的配置
const pageConfig = {
    '/': {
        htmlFile: 'home.html',
        jsFile: null
    },
    '/wz': {
        htmlFile: 'wz.html',
        jsFile: 'js/wzlist.js' 
    },
    '/photo': {
        htmlFile: 'photo.html',
        jsFile: 'js/imglist.js' 
        
    },
    '/about': {
        htmlFile: 'about.html',
        jsFile: null
    }
};

// 缓存已加载的页面内容
const pageCache = {};

// 异步加载HTML文件内容
async function loadPageContent(filePath) {
    // 如果已缓存，直接返回
    if (pageCache[filePath]) {
        return pageCache[filePath];
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        
        // 创建临时DOM来解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取body内容（排除导航栏）
        const bodyContent = doc.body.cloneNode(true);
        
        // 移除导航栏（如果存在）
        const navElement = bodyContent.querySelector('.nav');
        if (navElement) {
            navElement.remove();
        }
        
        // 获取处理后的内容
        const content = bodyContent.innerHTML;
        
        // 缓存内容
        pageCache[filePath] = content;
        
        return content;
    } catch (error) {
        console.error(`加载页面失败: ${filePath}`, error);
        return `<div class="error-page">
            <h2>页面加载失败</h2>
            <p>无法加载 ${filePath}</p>
            <p>错误信息: ${error.message}</p>
        </div>`;
    }
}

// 创建路由实例
const router = new HashRouter();
const appContainer = document.getElementById('app');

// 修改后的渲染页面函数 - 解决方案
async function renderPage(route) {
    const config = pageConfig[route];
    if (!config) {
        appContainer.innerHTML = '<div class="error-page"><h2>页面未找到</h2></div>';
        return;
    }

    // 显示加载状态
    appContainer.innerHTML = '<div class="loading">正在加载...</div>';
    
    try {
        // 1. 先加载HTML内容
        const content = await loadPageContent(config.htmlFile);
        appContainer.innerHTML = content;
        
        // 2. 等待DOM更新
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // 3. 如果有对应的JS文件，强制重新加载（替代方案）
        if (config.jsFile) {
            await loadScript(config.jsFile, true); // 强制重新加载
        }
        
        // 5. 执行页面加载后的回调
        if (typeof window.onPageLoaded === 'function') {
            window.onPageLoaded(route);
        }
        
    } catch (error) {
        console.error('页面加载失败:', error);
        appContainer.innerHTML = `<div class="error-page">
            <h2>页面加载失败</h2>
            <p>${error.message}</p>
        </div>`;
    }
}

// 注册路由
router.route('/', () => {
    renderPage('/');
});

router.route('/wz', () => {
    renderPage('/wz');
});

router.route('/photo', () => {
    renderPage('/photo');
});

router.route('/about', () => {
    renderPage('/about');
});

// 清除页面缓存的工具函数
function clearPageCache(route = null) {
    if (route) {
        const config = pageConfig[route];
        if (config && config.htmlFile && pageCache[config.htmlFile]) {
            delete pageCache[config.htmlFile];
        }
    } else {
        // 清除所有缓存
        Object.keys(pageCache).forEach(key => {
            delete pageCache[key];
        });
    }
}

// 清除脚本缓存的工具函数
function removeScript(src) {
    const script = document.querySelector(`script[src="${src}"]`);
    if (script) {
        script.remove();
    }
}

// 预加载指定页面
async function preloadPage(route) {
    const config = pageConfig[route];
    if (config && config.htmlFile && !pageCache[config.htmlFile]) {
        await loadPageContent(config.htmlFile);
    }
}

// 预加载所有页面
async function preloadAllPages() {
    const loadPromises = Object.keys(pageConfig).map(route => preloadPage(route));
    await Promise.all(loadPromises);
}

// 如果需要在特定路由执行特定逻辑，可以添加路由守卫
function addRouteGuard(path, beforeEnter) {
    const originalHandler = router.routes[path];
    router.route(path, () => {
        if (beforeEnter && beforeEnter() !== false) {
            originalHandler();
        }
    });
}