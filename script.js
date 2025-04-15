const standardSubTabs = ["Descrizione", "Rosa", "Bilancio", "Movimenti"];
const regolamentoSubTabs = [
  "Rosa", "Asta", "Stipendi", "Svincoli", "Acquisti tra Presidenti",
  "Guadagno Crediti", "Premi Stagionali", "Investimenti", "Spese Fisse",
  "Penalizzazioni", "Regole Partita"
];

let currentTab = null;

function showTab(tabName) {
  currentTab = tabName;
  document.getElementById("subTabs").innerHTML = "";
  document.getElementById("contentArea").innerHTML = `<p>Seleziona una sezione in <strong>${tabName}</strong>.</p>`;

  const subTabs = (tabName === "regolamento") ? regolamentoSubTabs : standardSubTabs;
  const subTabContainer = document.getElementById("subTabs");

  subTabs.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub;
    btn.onclick = () => showSubTab(tabName, sub);
    subTabContainer.appendChild(btn);
  });

  subTabContainer.style.display = "flex";
}

function showSubTab(tabName, subTabName) {
  document.getElementById("contentArea").innerHTML =
    `<h3>${tabName.toUpperCase()} → ${subTabName}</h3><p>Contenuto per la sezione <strong>${subTabName}</strong>.</p>`;
}
