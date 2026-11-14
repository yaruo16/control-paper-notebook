const STATUS_CLASS = { "待讀": "status-todo", "略讀": "status-skim", "精讀": "status-deep" };
const STATUS_ORDER = ["全部", "待讀", "略讀", "精讀"];

const state = { keyword: "", tag: "全部", status: "全部", sort: "year-desc" };

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function allTags() {
  const tags = [];
  PAPERS.forEach(paper => paper.tags.forEach(tag => {
    if (!tags.includes(tag)) tags.push(tag);
  }));
  return ["全部", ...tags];
}

function renderChips(containerId, values, key) {
  const box = document.getElementById(containerId);
  box.innerHTML = values
    .map(value => `<button type="button" class="chip${state[key] === value ? " is-active" : ""}" data-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`)
    .join("");
  box.querySelectorAll(".chip").forEach(button => {
    button.addEventListener("click", () => {
      state[key] = button.dataset.value;
      renderChips(containerId, values, key);
      renderPapers();
    });
  });
}

function matches(paper) {
  const keyword = state.keyword.trim().toLowerCase();
  const text = [paper.short, paper.title, paper.authors, paper.venue, paper.summary, paper.tags.join(" ")]
    .join(" ")
    .toLowerCase();
  const okKeyword = !keyword || text.includes(keyword);
  const okTag = state.tag === "全部" || paper.tags.includes(state.tag);
  const okStatus = state.status === "全部" || paper.status === state.status;
  return okKeyword && okTag && okStatus;
}

function cardHtml(paper) {
  const tags = paper.tags.map(tag => `<li class="tag">${escapeHtml(tag)}</li>`).join("");
  return `
    <a class="paper-card" href="notes/${encodeURIComponent(paper.id)}.html">
      <div class="card-top">
        <span class="card-year">${paper.year}</span>
        <span class="status ${STATUS_CLASS[paper.status] || ""}">${escapeHtml(paper.status)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(paper.short)}</h3>
      <p class="card-en">${escapeHtml(paper.title)}</p>
      <p class="card-authors">${escapeHtml(paper.authors)}</p>
      <p class="card-summary">${escapeHtml(paper.summary)}</p>
      <ul class="tag-list">${tags}</ul>
    </a>`;
}

function renderPapers() {
  const list = PAPERS.filter(matches).sort((a, b) =>
    state.sort === "year-asc" ? a.year - b.year : b.year - a.year
  );
  const grid = document.getElementById("paper-grid");
  grid.innerHTML = list.length
    ? list.map(cardHtml).join("")
    : `<p class="empty">找不到符合條件的文獻，換個關鍵字試試看～</p>`;
  document.getElementById("result-count").textContent = `顯示 ${list.length} / ${PAPERS.length} 篇`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderChips("tag-filter", allTags(), "tag");
  renderChips("status-filter", STATUS_ORDER, "status");
  document.getElementById("search").addEventListener("input", event => {
    state.keyword = event.target.value;
    renderPapers();
  });
  document.getElementById("sort").addEventListener("change", event => {
    state.sort = event.target.value;
    renderPapers();
  });
  renderPapers();
});
