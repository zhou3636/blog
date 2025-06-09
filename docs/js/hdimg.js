function showImage(element) {
    const dialog = document.getElementById('hdimg');
    const img = document.getElementById('img-hd');
    const loading = document.getElementById('aa');
    dialog.showModal();
    // 显示加载中
    loading.style.display = 'block';
    //重新设定src
    img.src = '';
    img.src = element.getAttribute('data-src');
    // 图片加载完
    img.onload = function () { loading.style.display = 'none'; };
}