threadSBT
=========

> 2023 &copy; MaoHuPi
> 
> 繁體中文 / [English](README.md)

專案簡介
----

`threadSBT`為一個靜態部落格模板(Static Blogger Template)，整體設計參考自[Jimmy](https://jimmycai.com/)的[Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack)，不過此模板除了基礎的章節篩選與瀏覽功能外，還添加了：`RSS`、`Twitter Meta Card`、`背景音樂播放`、`互動角色`與`簡報檢視`等延伸功能，來**使部落格更容易被搜尋引擎的爬蟲接受**，也**提升了網頁在使用層面的多樣性**，並**使其看起來更加活潑**。

不過本模板沒有使用像[Hugo](https://gohugo.io/)系統那樣「`直接將文章內容寫入輸出之HTML`」的方式（也拔除了`全內文搜索`的功能），而是將`HTML`寫成單一檔案，而其它資料內容則是在必要時才將以載入，來減少`Github Page`的流量使用。

使用說明
----

本專案使用`Python`來將設定檔與文章資訊寫入、轉換成JS易取用之格式，所以若無法執行執行檔，或沒有與自身系統相對應的執行檔，則可在下載`Python`與必要的函式庫（`opencv-python`、`numpy`等）後，執行`Python`程式碼。

本專案的主程式為`render.py`，其他`Python`檔則可用以對單一的資料面向做更新。而`render.py`的指令參數規則如下：

```txt
--h, -help
--v, -version
-custom <custom directory path>
-update <update type (all / config / article / portfolio)>
```

使用範例：

```bat
python render.py -custom "custom" -update "article"
```

版本更新
----

v1.0.0 2023/09/05 初版