const DATA_URL = "data/santa_datensatz.csv";
const euro = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });
let transactions = [];
let currentView = "summary";

const $ = (id) => document.getElementById(id);
const formatMoney = (value) => euro.format(value).replace("€", "€");
const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  }).map((row) => ({ ...row, amount: row.amount === "" ? null : Number(row.amount), balance: Number(row.balance), date: new Date(`${row.date}T12:00:00`) }));
};
const actualTransactions = () => transactions.filter((item) => item.amount !== null);
const filteredTransactions = () => {
  const period = $("periodFilter").value;
  const category = $("categoryFilter").value;
  return actualTransactions().filter((item) => (period === "all" || item.date.toISOString().slice(0, 7) === period) && (category === "all" || item.category === category));
};
const cheerMessages = [
  "Ho ho ho! Santa's savings are sleighing it.",
  "Even Santa checks his balance before Christmas Eve.",
  "The elves have reviewed the numbers.",
  "Keep calm and sleigh on.",
  "No chimney left unbudgeted.",
  "Jingle bells, balanced accounts!"
];
function updateCheer(message) { $("cheerMessage").textContent = message || cheerMessages[Math.floor(Math.random() * cheerMessages.length)]; }
function populateFilters() {
  const months = [...new Set(actualTransactions().map((item) => item.date.toISOString().slice(0, 7)))];
  const categories = [...new Set(actualTransactions().map((item) => item.category))].sort();
  months.forEach((month) => $("periodFilter").insertAdjacentHTML("beforeend", `<option value="${month}">${new Date(`${month}-15T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</option>`));
  categories.forEach((category) => $("categoryFilter").insertAdjacentHTML("beforeend", `<option value="${category}">${category[0].toUpperCase() + category.slice(1)}</option>`));
}
function renderMetrics(items) {
  const income = items.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const spending = items.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0);
  const isFiltered = $("periodFilter").value !== "all" || $("categoryFilter").value !== "all";
  const balance = isFiltered ? items.at(-1)?.balance ?? 0 : transactions.at(-1).balance;
  $("currentBalance").textContent = formatMoney(balance);
  $("totalIncome").textContent = `+${formatMoney(income)}`;
  $("totalSpending").textContent = formatMoney(spending);
  $("transactionCount").textContent = items.length;
  $("balanceNote").textContent = isFiltered ? "Last matching balance" : "After the latest transaction";
}
function renderTrend(items) {
  const points = items.length ? items : actualTransactions();
  const width = 620, height = 190, pad = { top: 12, right: 12, bottom: 27, left: 8 };
  const min = Math.min(...points.map((item) => item.balance)), max = Math.max(...points.map((item) => item.balance));
  const range = max - min || 1;
  const coords = points.map((item, index) => [pad.left + (index / Math.max(points.length - 1, 1)) * (width - pad.left - pad.right), pad.top + (1 - (item.balance - min) / range) * (height - pad.top - pad.bottom)]);
  const line = coords.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad.left},${height - pad.bottom} ${line} ${width - pad.right},${height - pad.bottom}`;
  const labels = [points[0], points[Math.floor((points.length - 1) / 2)], points.at(-1)].filter(Boolean);
  $("trendChart").innerHTML = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b83232" stop-opacity=".18"/><stop offset="1" stop-color="#b83232" stop-opacity="0"/></linearGradient></defs><line class="chart-grid" x1="0" y1="45" x2="${width}" y2="45"/><line class="chart-grid" x1="0" y1="105" x2="${width}" y2="105"/><polygon class="chart-area" points="${area}"/><polyline class="chart-line" points="${line}"/>${coords.filter((_, i) => i === 0 || i === coords.length - 1).map(([x, y]) => `<text class="chart-sleigh" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">🛷</text>`).join("")}${labels.map((item, i) => `<text class="chart-label" x="${i === 0 ? 0 : i === 1 ? width / 2 - 23 : width - 58}" y="${height - 5}">${item.date.toLocaleDateString("en-GB", { month: "short" })}</text>`).join("")}</svg>`;
}
function transactionMarkup(item) {
  const positive = item.amount > 0;
  return `<div class="transaction-row"><div class="transaction-info"><span class="transaction-description" title="${item.description}">${item.description}</span><span class="transaction-date">${dateFormat.format(item.date)} · ${item.category}</span></div><span class="transaction-amount ${positive ? "positive" : "negative"}">${positive ? "+" : ""}${formatMoney(item.amount)}</span></div>`;
}
function renderCategories(items) {
  const totals = {};
  items.filter((item) => item.amount < 0).forEach((item) => { totals[item.category] = (totals[item.category] || 0) + Math.abs(item.amount); });
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] || 1;
  $("categoryList").innerHTML = entries.length ? entries.slice(0, 6).map(([name, value]) => `<div class="category-row"><span class="category-name">${name}</span><div class="bar-track"><div class="bar-fill" style="width:${value / max * 100}%"></div></div><span class="category-value">${formatMoney(value)}</span></div>`).join("") : `<p class="metric-note">No spending in this view.</p>`;
}
function renderTable(items) {
  $("resultCount").textContent = `${items.length} matching ${items.length === 1 ? "entry" : "entries"}`;
  $("transactionTable").innerHTML = items.slice().reverse().map((item) => `<tr><td>${dateFormat.format(item.date)}</td><td>${item.description}</td><td><span class="category-tag">${item.category}</span></td><td class="amount-column ${item.amount > 0 ? "positive" : "negative"}">${item.amount > 0 ? "+" : ""}${formatMoney(item.amount)}</td><td class="amount-column">${formatMoney(item.balance)}</td></tr>`).join("") || `<tr><td colspan="5">No transactions match these filters.</td></tr>`;
}
function render() {
  const items = filteredTransactions();
  renderMetrics(items); renderTrend(items); renderCategories(items); renderTable(items);
  $("recentList").innerHTML = items.slice().reverse().slice(0, 6).map(transactionMarkup).join("") || `<p class="metric-note">No transactions match these filters.</p>`;
}
function switchView(view) {
  currentView = view;
  $("summaryView").classList.toggle("hidden", view !== "summary"); $("detailsView").classList.toggle("hidden", view !== "details");
  $("summaryTab").classList.toggle("active", view === "summary"); $("detailsTab").classList.toggle("active", view === "details");
  $("summaryTab").setAttribute("aria-selected", view === "summary"); $("detailsTab").setAttribute("aria-selected", view === "details");
  updateCheer(view === "details" ? "The elves have reviewed the numbers." : "");
}
async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
    transactions = parseCsv(await response.text());
    populateFilters(); render();
    $("periodFilter").addEventListener("change", () => { render(); updateCheer(); });
    $("categoryFilter").addEventListener("change", () => { render(); updateCheer(); });
    $("summaryTab").addEventListener("click", () => switchView("summary"));
    $("detailsTab").addEventListener("click", () => switchView("details"));
    $("showDetails").addEventListener("click", () => switchView("details"));
  } catch (error) {
    $("dataStatus").textContent = "Unable to load ledger"; $("cheerMessage").textContent = "The sleigh needs a quick tune-up before the ledger can open.";
    console.error(error);
  }
}
init();
