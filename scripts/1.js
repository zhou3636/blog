const fs = require('fs');
const path = require('path');

// 配置文件路径
const MD_DIR = path.join(__dirname, '../docs/md');   // 文件存放目录
const OUTPUT_FILE = path.join(MD_DIR, 'mdlist.json'); // 输出文件路径

// 解析.md文件内容
function parseMdFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').map(line => line.trim());
        
        // 提取前三个有效行
        const [title, description, tagsLine,date] = lines.filter(l => l).slice(0, 4);
        
        // 解析标签（支持 #标签1#标签2 和 #标签1 #标签2 格式）
        const tags = tagsLine?.replace(/^#+/g, '')  // 去除行首的#
                    .split(/#+/g)                   // 分割标签
                    .filter(t => t)                 // 过滤空值
                    .map(t => t.trim()) || [];
        
        return {
            file: path.basename(filePath),
            title: title || '无标题',
            description: description || '无描述',
            tags: Array.from(new Set(tags)),// 去重
            date: date || '2020-01-01'
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