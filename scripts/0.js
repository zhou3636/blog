const fs = require('fs');
const path = require('path');

// 配置文件路径
const MD_DIR = path.join(__dirname, '../docs/md');   // 文件存放目录
const OUTPUT_FILE = path.join(MD_DIR, 'mdlist2.json'); // 输出文件路径

// 解析.md文件内容
function parseMdFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').map(line => line.trim());
        
        // 直接取前5行（保留空行位置）
        const effectiveLines = lines.slice(0, 5);
        const [
            titleLine,
            descriptionLine,
            tagsLine,
            imgLine,
            dateLine
        ] = effectiveLines;
        
        // 解析标签（兼容不同格式）
        const tags = tagsLine?.replace(/^#+/g, '')
                    .split(/#+/g)
                    .filter(t => t)
                    .map(t => t.trim()) || [];
        
        return {
            file: path.basename(filePath),
            title: titleLine || '标题?',
            description: descriptionLine || '描述?',
            tags: Array.from(new Set(tags)), // 去重
            img: imgLine || 'md/kk.jpg',        // 空行时使用默认图
            date: dateLine || '2020-01-01'   // 空行时使用默认日期
        };
    } catch (error) {
        console.error(`解析文件失败: ${filePath}`, error);
        return null;
    }
}
// 生成文件列表
function generateMdList() {
    try {
        // 获取所有.md文件
        const files = fs.readdirSync(MD_DIR)
            .filter(f => f.endsWith('.md'))
            .map(f => path.join(MD_DIR, f));
        
        // 解析所有文件
        const result = files
            .map(parseMdFile)
            .sort((a, b) => b.date.localeCompare(a.date))
            .filter(Boolean); // 过滤解析失败的文件
        
        // 写入JSON文件
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
        console.log(`成功生成 ${result.length} 个文件列表到 ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('生成文件列表失败:', error);
        process.exit(1);
    }
}

// 执行生成
generateMdList();