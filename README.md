threadSBT
=========

![license MIT](https://img.shields.io/badge/license-MIT-blue)
![python 3.9.6](https://img.shields.io/badge/python-3.9.6-blue)

> 2023 &copy; MaoHuPi
> 
> English / [繁體中文](README.zh-TW.md)

What
----

`threadSBT` is a static Blogger Template. The overall design is based on [Jimmy](https://jimmycai.com/)’s [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack), but in addition to the basic chapter filtering and browsing functions, this template also adds: `RSS`, `Twitter Meta Card`, `Background Music Playback`, `Interactive Characters` and `Presentation View` and other extensions Function to **make the blog more easily accepted by search engine crawlers**, and also **increase the diversity of web pages in terms of use**, and **make it look more lively**.

However, this template does not use the method of "`directly writing the article content into the output HTML`" like the [Hugo](https://gohugo.io/) system (it also removes the `full text search` function). Instead, `HTML` is written as a single file, and other data content is loaded when necessary to reduce the traffic usage of `Github Page`.

How
---

This project uses `Python` to write and convert configuration files and article information into a format that is easy to use in JS. Therefore, if you cannot execute the executable file, or there is no executable file corresponding to your own system, you can download `Python `After installing the necessary function libraries (`opencv-python`, `numpy`, etc.), execute the `Python` code.

The main program of this project is `render.py`, and other `Python` files can be used to update a single data aspect. The instruction parameter rules of `render.py` are as follows:

```txt
--h, -help
--v, -version
-custom <custom directory path>
-update <update type (all / config / article / portfolio)>
```

Example of use:

```bat
python render.py -custom "custom" -update "article"
```

Versions
--------

v1.0.0 2023/09/05 First edition.