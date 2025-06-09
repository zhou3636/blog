const fs = require('fs');
const path = require('path');

// 配置项
const IMG_DIR = path.join('docs/img'); // 图片目录路径
const OUTPUT_FILE = path.join(IMG_DIR, 'img.json'); // 输出文件路径
const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.jfif', '.png', '.gif', '.webp', '.bmp']; // 支持的图片格式

/**
 * 从文件名解析标题（以空格分隔，最多3个标题）
 */
function parseFilename(filename) {
    const { name, ext } = path.parse(filename);
    
    if (!IMG_EXTENSIONS.includes(ext.toLowerCase())) {
        return { titles: ['', '', ''] };
    }

    const titleSegments = name.split(/\s+/).filter(Boolean);
    
    return {
        titles: [
            titleSegments[0] || '',
            titleSegments[1] || '',
            titleSegments[2] || ''
        ]
    };
}

/**
 * 主函数
 */
function generateImageManifest() {
    try {
        // 1. 读取img目录
        const files = fs.readdirSync(IMG_DIR);

        // 2. 过滤图片文件并处理
        const result = files
            .filter(file => IMG_EXTENSIONS.includes(path.extname(file).toLowerCase()))
            .map(file => {
                const { titles } = parseFilename(file);
                return {
                    file,
                    title: titles[0], // 主标题
                    title1: titles[1], // 副标题1
                    title2: titles[2]  // 副标题2
                };
            });

        // 3. 写入JSON文件
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
        console.log(`✅ 成功生成 ${result.length} 个图片信息到 ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('❌ 出错:', error.message);
    }
}

// 执行
generateImageManifest();