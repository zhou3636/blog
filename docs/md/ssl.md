Acme
自动申请安装部署ssl证书#自动化工具
#软件#SSL
2025-05-05
## 安装环境
`apt update -y && apt install -y curl && apt install -y socat `
## 安装acme.sh
`curl https://get.acme.sh | sh -s email=my@example.com`  
## 申请&更新
### HTTP
申请`~/.acme.sh/acme.sh  --issue -d example.com  --standalone`  
更新`~/.acme.sh/acme.sh  --renew -d example.com  --standalone`  
### DNS API

添加变量`export CF_Token=" ******************************** "`  
参考网站<https://github.com/acmesh-official/acme.sh/wiki/dnsapi>  
申请`~/.acme.sh/acme.sh --issue --dns dns_cf -d example.com`  
更新`~/.acme.sh/acme.sh --renew --dns dns_cf -d example.com`  
## 设置默认ca
`~/.acme.sh/acme.sh --set-default-ca --server letsencrypt `

## 安装到目录
`~/.acme.sh/acme.sh --installcert -d example.com --key-file /root/k.key --fullchain-file /root/c.crt`

## 定义端口
如果用了反代之类的不是 80 端口，则可以手动指定。
`acme.sh  --issue  -d example.com  --standalone --httpport 88`
当然它还支持 tls 模式，不是 443 端口的话也可以自行指定。
### 自行指定tls端口
`acme.sh  --issue  -d example.com  --alpn --tlsport 8443  `  
<https://blog.csdn.net/luanlz/article/details/139833958>
