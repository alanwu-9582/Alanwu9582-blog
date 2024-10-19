<!-- title: Useful Hacking Commands -->
<!-- description: 一些有可能用的指令 -->
<!-- category: Hacking -->
<!-- tags: programming -->
<!-- published time: 2024/10/16 -->
<!-- cover: <?=customDirPath?>/image/articleCover/frc8725_software_edu_cover.jpg -->

# Useful Hacking Commands
這裡有一些有可能用到的指令，這些指令可以用來偵測網路、掃描網路、攻擊網路等等。

## ping
### basic ping
向**目標**發送 ICMP 回聲請求以檢查連接性並測量響應時間。用於初步偵查以驗證目標系統是否可達。

* -s 指定要發送的封包大小。默認大小為 56 位元。
* -f 用大封包進行洪水攻擊。

```bash
ping -s <size> -f <target>
```
### iftop 

顯示網路介面的實時頻寬使用情況。監控網路流量，以檢測可能表明惡意活動的異常情況，或者評估他們對網路頻寬的測試影響。
```bash
apt install iftop
iftop
```

### hping3
發送 SYN 封包到指定的埠，以高速（-flood）模擬 SYN 洪水攻擊。

* `-S` 標誌設置 SYN 標誌
* `-V` 啟用詳細模式
* `-p` 指定目標埠

```bash
apt install hping3
hping3 -S --flood -V -p <port> <target>
```

執行 traceroute 到 example.com 這用於繪製封包到目標的路徑，這可以幫助識別防火牆、路由器和其他網路設備。

* `-I` 使用 ICMP 封包
* `-V` 啟用詳細模式

```bash
hping3 --traceroute -I -V example.com
```

### ptunnel
建立一個封裝在 ICMP 回聲請求和回應中的隧道。使用這個來繞過網路限制或進行隱蔽通信。

* `-p` 指定代理伺服器的 IP 位址
* `-lp` 指定本地端口
* `-da` 指定目標 IP 位址
* `-dp` 指定目標埠

```bash
apt install ptunnel
ptunnel -p <proxy_ip> -lp <local_port> -da <dest_ip> -dp <dest_port>
```

### tcpdump
捕獲所有網路介面上的 ICMP 封包。此命令對於監控和分析 ICMP 流量以檢測可疑活動（如 ping 掃描或網路映射嘗試）非常有用。

* `-i` 指定網路介面

```bash
apt install tcpdump
tcpdump -i <interface> icmp
tcpdump -i any icmp # 監控所有網路介面上的 ICMP 封包
```

資料來源: [https://www.youtube.com/watch?v=gL4j-a-g9pA](https://www.youtube.com/watch?v=gL4j-a-g9pA)
