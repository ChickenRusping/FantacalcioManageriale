// Funzione per mostrare la tab selezionata
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.style.display = 'none';
  });

  // Mostra la tab corrente
  const tab = document.getElementById(tabName);
  if (tab) {
    tab.style.display = 'block';
    // Carica il sottotab "Descrizione" all'apertura della tab
    showSubTab(tabName, 'descrizione');
  }
}

// Funzione per gestire i sottotab
function showSubTab(tabName, subTabName) {
  const subTabs = document.querySelectorAll(`#${tabName} .sub-tab-content`);
  subTabs.forEach(sub => {
    sub.style.display = 'none';
  });

  const subTab = document.getElementById(`${tabName}-${subTabName}`);
  if (subTab) {
    subTab.style.display = 'block';
  }
}

// Aggiungi automaticamente i contenuti per ogni tab
function addContentForTabs() {
  const presidentTabs = ['alcoolCampi', 'borgio', 'pippo', 'fanfa', 'maro', 'gigiEdo', 'dani', 'albe'];
  const subTabNames = ['descrizione', 'rosa', 'bilancio', 'movimenti'];

  presidentTabs.forEach(tabName => {
    const tabContent = document.getElementById(tabName);

    // Crea i sottotab
    const subTabButtons = document.createElement('div');
    subTabButtons.classList.add('sub-tab-buttons');
    subTabNames.forEach(subTabName => {
      const button = document.createElement('button');
      button.textContent = subTabName.charAt(0).toUpperCase() + subTabName.slice(1);
      button.onclick = () => showSubTab(tabName, subTabName);
      subTabButtons.appendChild(button);
    });

    tabContent.appendChild(subTabButtons);

    // Aggiungi contenuti per ogni sottotab
    subTabNames.forEach(subTabName => {
      const subTabContent = document.createElement('div');
      subTabContent.classList.add('sub-tab-content');
      subTabContent.id = `${tabName}-${subTabName}`;

      if (subTabName === 'descrizione') {
        subTabContent.innerHTML = `
          <div class="image-row">
            <img src="images/img1.jpg" alt="Immagine 1" />
            <img src="images/img2.jpg" alt="Immagine 2" />
            <img src="images/img3.jpg" alt="Immagine 3" />
            <img src="images/img4.jpg" alt="Immagine 4" />
          </div>
          <p class="description-text">Descrizione del presidente ${tabName}</p>
        `;
      } else {
        subTabContent.textContent = `${subTabName.charAt(0).toUpperCase() + subTabName.slice(1)} content for ${tabName}`;
      }

      tabContent.appendChild(subTabContent);
    });
  });
}

// Chiamata per aggiungere automaticamente i contenuti quando la pagina è caricata
document.addEventListener('DOMContentLoaded', addContentForTabs);
