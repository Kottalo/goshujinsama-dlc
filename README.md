# GoshujinSama · 少女系列 DLC 下载中心

使用提供的品牌头像、六款游戏封面与 MediaFire 链接制作的静态网站。无需安装依赖，下载入口和常见问题无需 JavaScript 即可使用。

## 网站

https://kottalo.github.io/goshujinsama-dlc/

## 本地预览

在仓库目录运行 `python -m http.server 8080`，访问 `http://localhost:8080`；也可以直接用浏览器打开 `index.html`。

## 检查

安装 Node.js 22 或以上，运行 `node --test tests/site.test.mjs`。检查六款游戏的下载目标、共用补丁说明、素材文件和导航锚点。

## 更新

- `index.html`：游戏名称、图片、下载链接、安装指南和常见问题。
- `style.css`：颜色、排版及手机布局。
- `assets/`：品牌头像和游戏封面，保留原始图片。
- `tests/site.test.mjs`：更换文件 ID 时同步修改下载目标检查。

推送到 `main` 后，GitHub Actions 检查站点并发布到 GitHub Pages。仓库 Pages 设置的 Source 应选择 GitHub Actions。

文件托管于 MediaFire，网站只链接至提供的文件页面，不重新托管压缩包、不使用会过期的临时直链。各游戏安装方式以下载包内说明为准。球球少女下载入口使用《斗地主少女 + 球球少女补丁》合集包。

图片由项目所有者提供，素材权利归各自权利人所有。
