export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // 提取原始查询参数（如 ?file=456）
  const queryParams = url.search;
  
  // 检查是否被错误重写（无扩展名但有参数）
  if (queryParams && !url.pathname.includes('.')) {
    // 还原完整路径：123.html?file=456
    const newUrl = `${url.origin}${url.pathname}.html${queryParams}`;
    return context.env.ASSETS.fetch(newUrl);
  }
  
  return context.next();
}