# Lusion /projects 风格复刻（学习用途）

从零复刻 [lusion.co/projects](https://lusion.co/projects) 的展示页，纯 HTML/CSS/JS。
不包含原站任何受版权保护的素材（图片/视频/字体），卡片视觉为 CSS 占位图，代码均为原创。

## 在线打开指定版本

部署在 GitHub Pages 上，每个步骤一份快照：

| 版本 | 内容 | 地址 |
| --- | --- | --- |
| 最新 | 所有已完成步骤 | `/`（仓库主页部署） |
| v0.6 | Step 6：全屏菜单 + 平滑滚动 + 移动端 | `versions/step-6/` |
| v0.5 | Step 5：CTA 区 + 页脚 | `versions/step-5/` |
| v0.4.1 | Step 4 修正：页面整体内收 | `versions/step-4.1/` |
| v0.4 | Step 4 初版：逐卡片内收（已被 v0.4.1 取代） | `versions/step-4/` |
| v0.3 | Step 3：动画层 + 8 张卡片 | `versions/step-3/` |
| v0.2 | Step 2：作品卡片网格（19 张） | `versions/step-2/` |
| v0.1 | Step 1：骨架 + 导航 + 首屏 | `versions/step-1/` |

（把上面的相对地址拼在 Pages 域名后即可，如 `https://<user>.github.io/lusion-clone/versions/step-1/`）

## 本地运行

```bash
cd lusion-clone
python3 -m http.server 4173
# 打开 http://localhost:4173
```

调试：URL 加 `#static` 可跳过全部动效。

## 更新记录

见 [CHANGELOG.md](CHANGELOG.md)。
