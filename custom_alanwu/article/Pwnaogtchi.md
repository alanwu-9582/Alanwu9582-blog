<!-- title: Pwnagotchi -->
<!-- description: Pwnagotchi 簡易配置教學 zh-tw -->
<!-- category: Hacking -->
<!-- tags: programming -->
<!-- published time: 2024/10/18 -->
<!-- cover: <?=customDirPath?>/image/articleCover/pwnagotchi_cover.gif -->

# Pwnagotchi
Pwnagotchi 是一種基於 A2C 的 "AI"，利用 bettercap 從周圍的 Wi-Fi 環境中學習，以最大化其捕獲的可破解 WPA 密鑰。這些密鑰以 PCAP 文件的形式收集，包含任何由 hashcat 支持的握手形式，包括 PMKID、完整和半完整的 WPA 握手。

![](image/articleImage/pwnagotchi/pwnagotchi_item.png)


## Setup
### Hardware
必要的:
- [ ] Raspberry Pi Zero W（請參閱此處以了解其他替代機型的更多詳細信息）。
- [ ] microSD 卡（建議至少 8GB）。
- [ ] micro-USB 傳輸線，能夠傳輸數據（不僅僅是充電！）。

可選：
- [ ] 行動電源或是電池模組
- [ ] 時鐘模組
- [ ] 支援的顯示器

### Flashing the Image
1. 下載最新的 Pwnagotchi 韌體 (擇一, 或是其他的)：
    * [Pwnagotchi Releases](https://github.com/evilsocket/pwnagotchi/releases)
    * [jayofelony-github](https://github.com/jayofelony/pwnagotchi) (非官方, 但我是用這個)

2. 使用 [Balena Etcher](https://etcher.balena.io/) 將韌體燒錄到 microSD 卡中
3. 把 microSD 卡插入 Raspberry Pi Zero W
4. 下載 Windows 驅動程式 [RNDIS/Ethernet Gadget](https://modclouddownloadprod.blob.core.windows.net/shared/mod-rndis-driver-windows.zip)
5. 將驅動程式解壓縮後，右鍵點擊 `RNDIS.inf` 並選擇 `安裝`

### Connecting to Pwnagotchi
6. 連接 Raspberry Pi Zero W 和電腦 (Micro-USB 插在靠近中間的 USB 口)
7. 開啟控制台, `View network connections`

![](image/articleImage/pwnagotchi/pwnagotchi_ethernet.png)

8. 找到 `USB Ethernet/RNDIS Gadget` 右鍵點擊並選擇 `Properties`
9. 在 `Internet Protocol Version 4 (TCP/IPv4)` 中設置 
    * IP 位址: `10.0.0.1` 
    * 子網遮罩: `255.255.255.0` 
    * (DNS 伺服器: `8.8.8.8`)
10. 接著選擇自己的家用 Wifi 右鍵點擊並選擇 `Properties` 到 Sharing 頁面
    * 開啟 **Allow other network users to connect through this computer's Internet connection** 分享到 **USB Ethernet/RNDIS Gadget**


![](image/articleImage/pwnagotchi/pwnagotchi_ethernet_2.png)

11. 開啟 powershell
```Bash
ssh pi@10.0.0.2
```
12. 輸入密碼 `pwnagotchi`
13. 進入使用安裝精靈下載
```Bash
sudo pwnagotchi --wizard
```
14. 按照說明進行配置
15. 更改密碼
```Bash
passwd
```
16. 開啟設定檔
```Bash
sudo nano /etc/pwnagotchi/config.toml
```
17. 更改 `main.whitelist` 的設定(pwnagotchi 會忽略這些網路)
18. 更改 `main.plugins` 的設定(啟用或停用插件) [官方插件](https://pwnagotchi.ai/plugins/)
19. 如果要使用網頁介面
```Bash
main.plugins.webcfg.enabled = true
ui.web.enabled = true
ui.web.username = <username>
ui.web.password = <password>
ui.web.port = 8080
```
20. 重啟 Pwnagotchi
21. 進入網頁介面[http://10.0.0.2:8080](http://10.0.0.2:8080)
22. 輸入帳號密碼後即可看到 Pwnagotchi 的狀態與一些設定

![](image/articleImage/pwnagotchi/pwnagotchi_webui.png)

## Plugins
[Pwnagotchi Plugins](https://pwnagotchi.ai/plugins/)

### bluetooth tethering
讓 Pwnagotchi 透過藍芽連接與手機連線，並使用手機的網路 
```Bash
sudo nano /etc/pwnagotchi/config.toml
```

1. 先至手機設定藍芽配對，並取得手機的 MAC 位址
2. 在 Pwnagotchi 的設定檔中加入以下設定

(iphone)
```Bash
main.plugins.bt-tether.enabled = true
main.plugins.bt-tether.devices.ios-phone.enabled = true
main.plugins.bt-tether.devices.ios-phone.search_order = 1
main.plugins.bt-tether.devices.ios-phone.mac = <iphone_mac>
main.plugins.bt-tether.devices.ios-phone.ip = "172.20.10.6"
main.plugins.bt-tether.devices.ios-phone.netmask = 14
main.plugins.bt-tether.devices.ios-phone.interval = 1
main.plugins.bt-tether.devices.ios-phone.scantime = 20
main.plugins.bt-tether.devices.ios-phone.max_tries = 0
main.plugins.bt-tether.devices.ios-phone.share_internet = true
main.plugins.bt-tether.devices.ios-phone.priority = 99
```
(android)
```Bash
main.plugins.bt-tether.enabled = true
main.plugins.bt-tether.devices.android-phone.enabled = true
main.plugins.bt-tether.devices.android-phone.search_order = 1
main.plugins.bt-tether.devices.android-phone.mac = <android_mac>
main.plugins.bt-tether.devices.android-phone.ip = "192.168.44.44"
main.plugins.bt-tether.devices.android-phone.netmask = 24
main.plugins.bt-tether.devices.android-phone.interval = 1
main.plugins.bt-tether.devices.android-phone.scantime = 20
main.plugins.bt-tether.devices.android-phone.max_tries = 0
main.plugins.bt-tether.devices.android-phone.share_internet = true
main.plugins.bt-tether.devices.android-phone.priority = 99
```
Pwnagotchi 會出現一個 `BT` 的符號
* `C` 連接成功：這表示已成功連接到設備。
* `NF` 找不到：這表示無法連接到設備（可能是因為找不到設備）。
* `PE` 配對錯誤：這個錯誤發生在配對問題時。
* `BE` Bnep 錯誤：這個錯誤發生在無法創建 NAP 時。
* `AE` 地址錯誤：無法將 IP 分配給 NAP 介面。

3. 儲存並退出 comfig.toml
4. 連接至手機藍芽
```Bash
sudo bluetoothctl
```

```Bash
scan on
```

當找到手機的 MAC 位址後
```Bash
pair <phone_mac>
trust <phone_mac>
```

5. 重啟 Pwnagotchi
6. 手機設定中開啟網路分享
7. 透過手機網頁介面查看 Pwnagotchi 的狀態或是安裝 Termius(iOS) 透過 SSH 連接

安裝 Termius 後，新增一個新的主機，並輸入 Pwnagotchi 的 IP 位址，帳號密碼即可連接
* IP or Hostname: `172.20.10.6` (iphone)
* Port: `22`
* Username: `pi`
* Password: `<password>`

## Useful Commands
開啟 bettercap ui [bettercap](http://10.0.0.2/#/login) 只有在 MANU 模式下才能使用
帳號密碼: `pwnagotchi`

編輯設定檔：
```Bash
sudo nano /etc/pwnagotchi/config.toml
```

複製 Pwnagotchi 的檔案到本機：
```Bash
scp pi@<Pwnagotchi_IP>:<file_path> <local_path> # 複製單一檔案
scp -r pi@<Pwnagotchi_IP>:<folder_path> <local_path> # 複製整個資料夾
```

資料來源: [Pwnagotchi](https://pwnagotchi.ai/)