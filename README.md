# 控制文獻實驗記錄本

成大「生成式AI」課程作業｜P16144108 系統系碩二 李亞若

把讀過的控制／系統工程論文整理成同一種格式的筆記網站。每篇論文一頁，首頁可以搜尋、依標籤和閱讀狀態篩選、依年份排序。

這個專案的重點是 [AGENTS.md](AGENTS.md)：裡面寫好網站的風格、檔案結構、筆記格式和 AI 要遵守的規則。之後只要把一篇論文丟給 AI，說一句「幫我把這篇加進文獻筆記」，AI 就能照同一套規則做出風格一致的新頁面，並自動更新首頁目錄。

## 目前收錄

| 年份 | 文獻 | 閱讀狀態 |
|---|---|---|
| 1942 | Ziegler & Nichols — Optimum Settings for Automatic Controllers | 精讀 |
| 1960 | Kalman — A New Approach to Linear Filtering and Prediction Problems | 略讀 |
| 2009 | Han — From PID to Active Disturbance Rejection Control | 精讀 |

每篇筆記都只根據實際提供的論文 PDF 撰寫，PDF 上沒有印的書目資料（例如 DOI）不會自己補。

## 資料夾結構

```
control-paper-notebook/
├── AGENTS.md              AI 規則（最重要）
├── CLAUDE.md              指向 AGENTS.md
├── README.md              本說明
├── index.html             首頁目錄
├── assets/
│   ├── css/style.css      共用樣式
│   └── js/
│       ├── papers.js      文獻資料清單
│       ├── main.js        首頁搜尋、篩選、排序
│       └── note.js        筆記頁自動填入書目資料
├── notes/                 每篇文獻一頁
└── templates/
    └── note-template.html 筆記頁範本
```

## 運作方式

- 所有文獻的書目資料、標籤、閱讀狀態、一句話總結都只寫在 `assets/js/papers.js`。
- 首頁卡片由 `main.js` 讀 `papers.js` 自動產生，所以新增文獻時不用改 `index.html`。
- 筆記頁只寫內容（問題、方法、結果、貢獻、限制、名詞小辭典），頁首的書目資料和上一篇／下一篇由 `note.js` 自動補上。

## 怎麼新增一篇文獻

**用 AI（推薦）**

1. 把 `AGENTS.md`、`assets/js/papers.js` 和**論文 PDF** 一起交給 AI（Claude Code 會自動讀 AGENTS.md）。沒有 PDF 時，AI 會先跟你要，不會自己上網找內容。
2. 說一句：「請照 AGENTS.md 的規則，把這篇論文加進文獻筆記，閱讀狀態設為略讀。」
3. 把 AI 給的新筆記檔放進 `notes/`，用它給的 `papers.js` 覆蓋原本的檔案。

**手動**

1. 複製 `templates/note-template.html` 到 `notes/`，檔名改成 `第一作者姓氏-年份.html`。
2. 把所有 `{{...}}` 換成內容。
3. 在 `assets/js/papers.js` 最後面加一筆資料。

詳細格式請看 AGENTS.md 第 5–8 節。

## 本機預覽

直接用瀏覽器打開 `index.html` 就能看，不需要安裝任何東西。

## 部署

放在 GitHub，用 GitHub Pages（Settings → Pages → Deploy from a branch → main / root）公開。
