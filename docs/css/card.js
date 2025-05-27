fetch('card.html')
.then(response => response.text())
.then(html => document.getElementById('card').innerHTML = html);