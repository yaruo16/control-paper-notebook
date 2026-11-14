# AGENTS.md — 控制文獻實驗記錄本

這份文件寫給接手這個專案的 AI（Claude、Codex、Cursor 等）。開始任何修改之前，請完整讀完，並且**嚴格照這裡的規則做**。規則沒寫到的情況，先問使用者，不要自己發明新做法。

---

## 1. 專案目的

「控制文獻實驗記錄本」是一個靜態網站，用來整理控制／系統工程領域的論文閱讀筆記。

- 每篇論文 = 一頁筆記，所有筆記使用**同一個格式**，方便比較和複習。
- 首頁是目錄，可以用關鍵字搜尋、依標籤和閱讀狀態篩選、依年份排序。
- 最常見的任務是：使用者上傳一篇論文的 PDF，說一句「幫我把這篇加進文獻筆記」，你要照第 6 節的流程新增一頁。沒有 PDF 就先索取，不可以開始做。

## 2. 技術限制

- 只用純 HTML、CSS、JavaScript，**不使用任何建置工具、框架或套件**（不要 npm、React、Tailwind、jQuery）。
- 網站部署在 GitHub Pages，所有連結都用**相對路徑**。
- 唯一允許的外部資源是 Google Fonts（見第 3 節）。
- 程式碼（HTML、CSS、JS）**不寫任何註解**。說明一律寫在 AGENTS.md 或 README.md。
- 網頁上所有介面文字使用**繁體中文**。

## 3. 整體風格：實驗記錄本風

視覺概念是「貼在方格紙上的實驗記錄頁」：方格紙背景、紅色邊線、螢光筆重點、膠帶貼住的索引卡。所有樣式都已經寫在 `assets/css/style.css`，**新增頁面時只能使用現有的 class，不能新增樣式**。

### 3.1 配色（已定義在 style.css 的 `:root`）

| 用途 | 變數 | 色碼 |
|---|---|---|
| 頁面底色 | `--paper` | `#fbf8ef` |
| 紙張（卡片、筆記頁） | `--sheet` | `#fffdf6` |
| 方格線 | `--grid` | `#dfe7f1` |
| 主要文字 | `--ink` | `#2b2b2b` |
| 次要文字 | `--ink-soft` | `#5f6368` |
| 藍筆（連結、一句話總結框） | `--pen-blue` | `#2f5aa8` |
| 紅筆（年份、邊線、段落編號） | `--pen-red` | `#c8463b` |
| 黃色螢光筆（`<mark>`） | `--hl-yellow` | `#fff27a` |
| 綠色螢光筆（標籤） | `--hl-green` | `#c6f3d0` |

### 3.2 字體

| 用途 | 字體 |
|---|---|
| 內文 | Noto Sans TC |
| 標題、手寫感文字 | LXGW WenKai TC（霞鶩文楷） |
| 標籤、數字、公式 | JetBrains Mono |

### 3.3 版面

- 首頁：頁首 → 大標題 → 搜尋／篩選列 → 卡片格狀排列（自動換行，每張最小 300px）。
- 筆記頁：頁首 → 一張置中的紙（最寬 820px），左邊有紅色邊線，段落編號 No.01、No.02… 由 CSS 自動產生。
- 手機版（寬度 640px 以下）由 style.css 自動處理，不用另外寫。

## 4. 資料夾與檔案結構

```
control-paper-notebook/
├── AGENTS.md                 ← 本文件（AI 規則）
├── CLAUDE.md                 ← 指向本文件
├── README.md                 ← 給人看的專案說明
├── index.html                ← 首頁目錄（內容由 JS 自動產生）
├── assets/
│   ├── css/
│   │   └── style.css         ← 共用樣式（禁止修改）
│   └── js/
│       ├── papers.js         ← 所有文獻的資料清單（新增文獻時要改這裡）
│       ├── main.js           ← 首頁搜尋、篩選、排序（禁止修改）
│       └── note.js           ← 筆記頁自動填入書目資料、上一篇／下一篇（禁止修改）
├── notes/
│   └── <id>.html             ← 每篇文獻一頁筆記
└── templates/
    └── note-template.html    ← 筆記頁範本（禁止修改）
```

### 4.1 資料怎麼流動（很重要）

- `assets/js/papers.js` 是**唯一的資料來源**。每篇文獻的中文短名、英文標題、作者、年份、出處、DOI、標籤、閱讀狀態、一句話總結，都只寫在這裡。
- 首頁的卡片全部由 `main.js` 讀 `papers.js` 自動產生，所以**「更新首頁目錄」= 在 `papers.js` 加一筆資料**，不要去改 `index.html`。
- 筆記頁的頁首（標題、作者、年份、出處、DOI、標籤、閱讀狀態）和「一句話總結」由 `note.js` 依 `<body data-paper="id">` 從 `papers.js` 自動填入，所以**筆記頁的 HTML 不寫這些資料**。
- 「上一篇／下一篇」依年份由舊到新自動產生，不用手動加連結。

## 5. 命名與放置規則

### 5.1 文獻 id 和檔名

- id 格式：`第一作者姓氏-年份`，全部小寫英文，例如 `ziegler-1942`、`kalman-1960`。
- 姓氏有重音或特殊字母時轉成一般英文字母：`Åström` → `astrom`、`Müller` → `muller`。
- 中文作者用拼音姓氏：韓京清 → `han`。
- 同一位第一作者、同一年有兩篇以上時，在年份後加 `b`、`c`：`han-2009b`。
- 筆記檔案放在 `notes/`，檔名就是 `<id>.html`。
- 同一個 id 必須在三個地方完全一致：檔名、`<body data-paper="...">`、`papers.js` 的 `id`。

### 5.2 papers.js 欄位規格

在 `PAPERS` 陣列**最後面**加一個物件，欄位順序固定如下：

```js
{
  id: "smith-2015",
  short: "中文短名",
  title: "Original English Title of the Paper",
  authors: "A. B. Smith, C. Lee",
  year: 2015,
  venue: "Journal Name, 12(3), 100–110",
  doi: "10.xxxx/xxxxx",
  tags: ["PID", "馬達控制"],
  status: "待讀",
  summary: "一句話總結，40–70 個中文字。"
}
```

| 欄位 | 規則 |
|---|---|
| `id` | 依 5.1 |
| `short` | 中文短名，簡短說出論文主題，最多 24 個字元（英文字母、空格也算），人名和縮寫可保留英文，例如「卡爾曼濾波」、「Ziegler–Nichols PID 調參法則」 |
| `title` | 論文原文標題，保留英文，不翻譯 |
| `authors` | 「名字縮寫. 姓氏」，用半形逗號＋空格分隔；超過 4 位作者寫前 3 位再加 `et al.` |
| `year` | 數字，不加引號 |
| `venue` | `期刊或會議名稱, 卷(期), 起–迄頁`，頁碼用 en dash `–`；照 PDF 上印的寫，PDF 沒印卷期時改寫出版年月 |
| `doi` | 只寫 DOI 本體，不含 `https://doi.org/`。PDF 上沒有印 DOI 時先問使用者；使用者也沒有就填空字串 `""`，頁面會自動顯示「PDF 未載明」，**不可以自己上網查來填** |
| `tags` | 2–4 個，從 5.3 標籤表選 |
| `status` | 只能是 `待讀`、`略讀`、`精讀` 三選一。使用者沒說時預設 `待讀` |
| `summary` | 一句話、40–70 個中文字、以句號結尾，說「這篇做了什麼、得到什麼」 |

### 5.3 標籤表

優先使用下列標籤，**不要用同義詞另創新標籤**（例如已經有「狀態估測」就不要再寫「估測」）：

`PID`、`調參`、`程序控制`、`經典論文`、`回顧論文`、`狀態估測`、`觀測器`、`最佳化`、`擾動抑制`、`預測控制`、`強健控制`、`非線性控制`、`適應控制`、`系統鑑別`、`馬達控制`

真的沒有適合的標籤時，可以新增一個，但必須**同時把它加進這張表**，並在回覆中告訴使用者。

## 6. 新增一篇文獻的流程

使用者說「把這篇加進文獻筆記」之類的話時，照下面順序做：

1. **先索取 PDF**：使用者還沒提供這篇論文的 PDF 時，**先停下來向使用者索取，不可以開始製作**。不能用網路搜尋、記憶或摘要網站的內容代替 PDF。
2. **讀論文**：只根據使用者提供的 PDF 撰寫筆記。書目資料（作者、年份、出處、DOI）也以 PDF 上印的為準；PDF 上沒有的資料（例如 DOI）先問使用者，不要自己補。
3. **決定 id**：依 5.1 規則，並確認 `notes/` 裡沒有同名檔案。
4. **複製範本**：把第 7 節的範本（等同 `templates/note-template.html`）存成 `notes/<id>.html`。
5. **替換佔位符**：把所有 `{{...}}` 換成內容，依第 8 節的寫作規則填寫。完成後檔案裡**不能留下任何 `{{` 或 `}}`**。
6. **更新目錄**：在 `assets/js/papers.js` 的 `PAPERS` 陣列最後加一筆資料（5.2）。注意前一筆結尾要補逗號。
7. **自我檢查**：逐項跑完第 11 節的檢查清單。
8. **回報**：照第 10 節的格式回覆使用者。

## 7. 筆記頁範本

這就是 `templates/note-template.html` 的內容。新頁面**必須從這份範本開始**，不能刪除或調換任何 `<section>`，也不能改 `id`、`class`。

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{中文短名}}｜控制文獻實驗記錄本</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body class="note-page" data-paper="{{id}}">
  <header class="site-bar">
    <a class="brand" href="../index.html">控制文獻實驗記錄本</a>
    <a class="back" href="../index.html">← 回到目錄</a>
  </header>

  <main class="sheet">
    <header id="paper-meta" class="paper-meta"></header>

    <section id="summary" class="entry">
      <h2>一句話總結</h2>
      <p class="one-line"></p>
    </section>

    <section id="problem" class="entry">
      <h2>研究問題</h2>
      <p>{{這篇想解決什麼問題、為什麼重要，1–3 句}}</p>
    </section>

    <section id="method" class="entry">
      <h2>方法</h2>
      <ol>
        <li>{{方法步驟 1}}</li>
        <li>{{方法步驟 2}}</li>
        <li>{{方法步驟 3}}</li>
      </ol>
      <div class="formula">{{選用：關鍵公式，純文字}}</div>
    </section>

    <section id="result" class="entry">
      <h2>主要結果</h2>
      <ul>
        <li>{{結果 1，關鍵數字或結論用 <mark>螢光筆</mark> 標起來}}</li>
        <li>{{結果 2}}</li>
      </ul>
    </section>

    <section id="contribution" class="entry">
      <h2>貢獻</h2>
      <ul>
        <li>{{貢獻 1}}</li>
        <li>{{貢獻 2}}</li>
      </ul>
    </section>

    <section id="limitation" class="entry">
      <h2>限制</h2>
      <ul>
        <li>{{限制 1}}</li>
        <li>{{限制 2}}</li>
      </ul>
    </section>

    <section id="glossary" class="entry">
      <h2>名詞小辭典</h2>
      <dl class="glossary">
        <dt>{{中文名詞}}<span>{{English term}}</span></dt>
        <dd>{{白話解釋，1–2 句}}</dd>
      </dl>
    </section>

    <nav id="pager" class="pager" aria-label="上一篇與下一篇"></nav>
  </main>

  <footer class="site-footer">控制文獻實驗記錄本｜依 AGENTS.md 規則維護</footer>

  <script src="../assets/js/papers.js"></script>
  <script src="../assets/js/note.js"></script>
</body>
</html>
```

固定不動的部分：`<head>`、頁首 `site-bar`、`#paper-meta`（保持空白）、`#summary` 裡的 `<p class="one-line"></p>`（保持空白）、`#pager`、頁尾、兩個 `<script>`。

## 8. 各區塊寫作規則

### 8.1 共通規則

- 中文為主。專有名詞第一次出現寫成「中文（English）」或「中文（縮寫）」，例如「擴張狀態觀測器（ESO）」。
- 語氣像研究生寫給自己看的筆記：清楚、白話，不要寫成翻譯腔或論文腔。
- 每一點都要**根據論文內容**，不能捏造數據、實驗或結論。論文沒有給數字時，就寫文字結論，不要自己編數字。
- 書目資料（尤其 DOI、頁碼）不確定時**不要猜**，先問使用者。
- 內文不使用 emoji。

### 8.2 各區塊內容與數量

| 區塊 | `id` | 內容 | 數量 |
|---|---|---|---|
| 一句話總結 | `summary` | 不在 HTML 寫，寫在 `papers.js` 的 `summary` | 1 句 |
| 研究問題 | `problem` | 想解決什麼、為什麼現有方法不夠 | 1 個 `<p>`（1–3 句），需要時可再接 1 個 `<ol>` 或 `<ul>` |
| 方法 | `method` | 照順序寫做法 | `<ol>` 3–5 項 |
| 主要結果 | `result` | 得到什麼結果、關鍵數字 | `<ul>` 2–4 項 |
| 貢獻 | `contribution` | 對領域的意義、為什麼值得讀 | `<ul>` 2–3 項 |
| 限制 | `limitation` | 假設、缺點、後續研究補上的部分 | `<ul>` 2–3 項 |
| 名詞小辭典 | `glossary` | 讀這篇需要懂的術語 | 4–6 組 `<dt>`＋`<dd>` |

### 8.3 可以使用的元件（只能用這些）

| 元件 | 寫法 | 用在哪裡 | 限制 |
|---|---|---|---|
| 螢光筆重點 | `<mark>…</mark>` | 任何區塊的關鍵字或數字 | 每個區塊最多 2 處 |
| 粗體小標 | `<strong>…：</strong>` | `method` 的 `<li>` 開頭 | 只用在列點開頭 |
| 公式框 | `<div class="formula">…</div>` | 只能在 `method` | 最多 1 個；純文字，可用 Unicode 上下標（x̂ₖ、Kₚ），多行直接換行；用不到就整個刪掉 |
| 數據表 | `<table class="data-table">` | `method` 或 `result` | 最多 1 個；第一列用 `<th>` |
| 便利貼補充 | `<p class="note-box">…</p>` | 任何區塊 | 整頁最多 1 個，用來補充符號差異或閱讀提醒 |
| 行內程式碼 | `<code>…</code>` | 變數名稱 | — |

`.formula` 是唯一可以「刪除」的範本元素；其他區塊都必須保留並填入內容。

## 9. 修改既有內容的規則

| 想做的事 | 要改的地方 |
|---|---|
| 改閱讀狀態、標籤、一句話總結、書目資料 | 只改 `papers.js` 對應那筆 |
| 改筆記內文 | 只改 `notes/<id>.html` 的對應區塊，維持第 8 節的數量限制 |
| 刪除一篇文獻 | 刪除 `notes/<id>.html`，並刪除 `papers.js` 對應那筆 |
| 更改 id | 同時改檔名、`data-paper`、`papers.js` 的 `id` |

## 10. 絕對不可以做的事

1. 不可修改 `assets/css/style.css`、`assets/js/main.js`、`assets/js/note.js`、`templates/note-template.html`、`index.html`。只有使用者**明確要求改版**時才能動，並且要先說明會影響哪些頁面。
2. 不可在任何頁面加 `<style>`、`style="..."`、`<script>` 內嵌程式，也不可新增 CSS 或 JS 檔。
3. 不可引入 Google Fonts 以外的外部資源或函式庫（包括 MathJax、KaTeX、圖示庫）。
4. 不可在程式碼裡寫註解（HTML 的 `<!-- -->`、CSS 和 JS 的 `/* */`、`//`）。
5. 不可直接在 `index.html` 寫文獻卡片，也不可在筆記頁 HTML 寫作者、年份、DOI 等書目資料。
6. 不可刪除、調換或改名範本中的 `<section>`，也不可新增新的區塊。
7. 不可在沒有拿到使用者提供的 PDF 前製作筆記，也不可捏造 PDF 裡沒有的內容或數據。
8. 不可使用簡體中文。

## 11. 完成前的自我檢查清單

新增或修改完成後，逐項確認：

- [ ] 筆記內容和書目資料全部來自使用者提供的 PDF
- [ ] `notes/<id>.html` 的檔名、`data-paper`、`papers.js` 的 `id` 三者一致
- [ ] `<title>` 是「中文短名｜控制文獻實驗記錄本」，且中文短名和 `papers.js` 的 `short` 相同
- [ ] 檔案裡已沒有任何 `{{` 或 `}}`
- [ ] 7 個 `<section>` 都在，順序是 summary → problem → method → result → contribution → limitation → glossary
- [ ] `#paper-meta` 和 `.one-line` 保持空白
- [ ] 各區塊數量符合 8.2；`<mark>` 每區塊不超過 2 處；`.note-box` 整頁不超過 1 個
- [ ] `papers.js` 新增的那筆欄位齊全、順序正確，`status` 是三選一，`tags` 都在 5.3 標籤表裡
- [ ] `papers.js` 語法正確：每筆之間有逗號，最後一筆後面沒有多餘逗號，字串用雙引號
- [ ] 沒有改到第 10 節列出的禁止修改檔案
- [ ] 沒有任何程式碼註解、內嵌樣式或 emoji

## 12. 回覆格式

完成後用這個格式回覆使用者：

1. **新增／修改了哪些檔案**（列出路徑）
2. **檔案完整內容**：如果你不能直接寫入專案資料夾（例如在一般對話視窗），就把新的 `notes/<id>.html` 和**更新後的整份** `assets/js/papers.js` 完整貼出，讓使用者直接覆蓋
3. **自我檢查結果**：第 11 節的清單，每項打勾
4. **需要使用者確認的地方**（例如不確定的 DOI、新增的標籤）；沒有就寫「無」
