const NOTE_STATUS_CLASS = { "待讀": "status-todo", "略讀": "status-skim", "精讀": "status-deep" };

function noteEscape(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderMeta(paper) {
  const tags = paper.tags.map(tag => `<li class="tag">${noteEscape(tag)}</li>`).join("");
  document.getElementById("paper-meta").innerHTML = `
    <h1 class="meta-short">${noteEscape(paper.short)}</h1>
    <p class="meta-title">${noteEscape(paper.title)}</p>
    <table class="meta-table">
      <tr><th>作者</th><td>${noteEscape(paper.authors)}</td></tr>
      <tr><th>年份</th><td>${paper.year}</td></tr>
      <tr><th>出處</th><td>${noteEscape(paper.venue)}</td></tr>
      <tr><th>DOI</th><td>${paper.doi ? `<a href="https://doi.org/${noteEscape(paper.doi)}" target="_blank" rel="noopener">${noteEscape(paper.doi)}</a>` : "PDF 未載明"}</td></tr>
      <tr><th>標籤</th><td><ul class="tag-list">${tags}</ul></td></tr>
      <tr><th>閱讀狀態</th><td><span class="status ${NOTE_STATUS_CLASS[paper.status] || ""}">${noteEscape(paper.status)}</span></td></tr>
    </table>`;
  const oneLine = document.querySelector("#summary .one-line");
  if (oneLine) oneLine.textContent = paper.summary;
}

function renderPager(paper) {
  const ordered = [...PAPERS].sort((a, b) => a.year - b.year);
  const index = ordered.findIndex(item => item.id === paper.id);
  const prev = ordered[index - 1];
  const next = ordered[index + 1];
  const link = (item, label, cls) =>
    `<a class="${cls}" href="${encodeURIComponent(item.id)}.html"><small>${label}</small>${noteEscape(item.short)}（${item.year}）</a>`;
  document.getElementById("pager").innerHTML =
    (prev ? link(prev, "← 上一篇", "prev") : "") + (next ? link(next, "下一篇 →", "next") : "");
}

document.addEventListener("DOMContentLoaded", () => {
  const id = document.body.dataset.paper;
  const paper = PAPERS.find(item => item.id === id);
  if (!paper) {
    document.getElementById("paper-meta").innerHTML =
      `<h1 class="meta-short">找不到這篇文獻</h1><p class="meta-title">請確認 assets/js/papers.js 裡有 id 為「${noteEscape(id)}」的資料。</p>`;
    return;
  }
  renderMeta(paper);
  renderPager(paper);
});
