// Funzione per mostrare la tab selezionata
function showTab(tabName) {
  // Nascondi tutte le tab
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.style.display = 'none';
  });

  // Mostra la tab selezionata
  const tab = document.getElementById(tabName);
  if (tab) {
    tab.style.display = 'block';
  }

  // Se la tab è una tab di presidente, mostra il sottotab "descrizione"
  if (tabName !== 'regolamento') {
    showSubTab(tabName, 'descrizione');
  }
}

// Funzione per gestire i sottotab
function showSubTab(tabName, subTabName) {
  const subTabs = document.querySelectorAll(`#${tabName} .sub-tab-content`);
  subTabs.forEach(sub => {
    sub.style.display = 'none';
  });

  // Mostra la sottotab selezionata
  const subTab = document.getElementById(`${tabName}-${subTabName}`);
  if (subTab) {
    subTab.style.display = 'block';
  }
}

// Aggiungi contenuti per la tab di regolamento
function addRegolamentoContent() {
  const regolamentoTab = document.getElementById('regolamento');
  regolamentoTab.innerHTML = `
    <h2>Regolamento</h2>
    <div class="sub-tab-buttons">
      <button onclick="showSubTab('regolamento', 'rosa')">Rosa</button>
      <button onclick="showSubTab('regolamento', 'asta')">Asta</button>
      <button onclick="showSubTab('regolamento', 'stipendi')">Stipendi</button>
      <button onclick="showSubTab('regolamento', 'svincoli')">Svincoli</button>
      <button onclick="showSubTab('regolamento', 'acquisti')">Acquisti tra Presidenti</button>
      <button onclick="showSubTab('regolamento', 'guadagno')">Guadagno Crediti</button>
      <button onclick="showSubTab('regolamento', 'premi')">Premi Stagionali</button>
      <button onclick="showSubTab('regolamento', 'investimenti')">Investimenti</button>
      <button onclick="showSubTab('regolamento', 'spese')">Spese Fisse</button>
      <button onclick="showSubTab('regolamento', 'penalizzazioni')">Penalizzazioni</button>
      <button onclick="showSubTab('regolamento', 'regole')">Regole Partita</button>
    </div>
    <div id="regolamento-rosa" class="sub-tab-content">Contenuti per Rosa</div>
    <div id="regolamento-asta" class="sub-tab-content">Contenuti per Asta</div>
    <div id="regolamento-stipendi" class="sub-tab-content">Contenuti per Stipendi</div>
    <div id="regolamento-svincoli" class="sub-tab-content">Contenuti per Svincoli</div>
    <div id="regolamento-acquisti" class="sub-tab-content">Contenuti per Acquisti tra Presidenti</div>
    <div id="regolamento-guadagno" class="sub-tab-content">Contenuti per Guadagno Crediti</div>
    <div id="regolamento-premi" class="sub-tab-content">Contenuti per Premi Stagionali</div>
    <div id="regolamento-investimenti" class="sub-tab-content">Contenuti per Investimenti</div>
    <div id="regolamento-spese" class="sub-tab-content">Contenuti per Spese Fisse</div>
    <div id="regolamento-penalizzazioni" class="sub-tab-content">Contenuti per Penalizzazioni</div>
    <div id="regolamento-regole" class="sub-tab-content">Contenuti per Regole Partita</div>
  `;
}

// Aggiungi contenuti unici per ogni tab di presidente
function addPresidentsContent() {
  const presidentTabs = ['alcoolCampi', 'borgio', 'pippo', 'fanfa', 'maro', 'gigiEdo', 'dani', 'albe'];
  
  const presidentData = {
    'alcoolCampi': {
      'descrizione': {
        'images': ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
        'text': 'Descrizione di Alcool Campi.'
      },
    },
    'borgio': {
      'descrizione': {
        'images': ['img1_borgio.jpg', 'img2_borgio.jpg', 'img3_borgio.jpg', 'img4_borgio.jpg'],
        'text': 'Descrizione di Borgio.'
      },
    },
    'pippo': {
      'descrizione': {
        'images': ['img1_pippo.jpg', 'img2_pippo.jpg', 'img3_pippo.jpg', 'img4_pippo.jpg'],
        'text': 'Descrizione di Pippo.'
      },
    },
    'fanfa': {
      'descrizione': {
        'images': ['img1_fanfa.jpg', 'img2_fanfa.jpg', 'img3_fanfa.jpg', 'img4_fanfa.jpg'],
        'text': 'Descrizione di Fanfa.'
      },
    },
    'maro': {
      'descrizione': {
        'images': ['img1_maro.jpg', 'img2_maro.jpg', 'img3_maro.jpg', 'img4_maro.jpg'],
        'text': 'Descrizione di Maro.'
      },
    },
    'gigiEdo': {
      'descrizione': {
        'images': ['img1_gigiEdo.jpg', 'img2_gigiEdo.jpg', 'img3_gigiEdo.jpg', 'img4_gigiEdo.jpg'],
        'text': 'Descrizione di Gigi e Edo.'
      },
    },
    'dani': {
      'descrizione': {
        'images': ['img1_dani.jpg', 'img2_dani.jpg', 'img3_dani.jpg', 'img4_dani.jpg'],
        'text': 'Descrizione di Dani.'
      },
    },
    'albe': {
      'descrizione': {
        'images': ['img1_albe.jpg', 'img2_albe.jpg', 'img3_albe.jpg', 'img4_albe.jpg'],
        'text': 'Descrizione di Albe.'
      },
    },
  };
  
  presidentTabs.forEach(tabName => {
    const tabContent = document.getElementById(tabName);
    
    // Aggiungi i sottotab
    tabContent.innerHTML = `
      <h2>Descrizione</h2>
      <div class="sub-tab-buttons">
        <button onclick="showSubTab('${tabName}', 'descrizione')">Descrizione</button>
        <button onclick="showSubTab('${tabName}', 'rosa')">Rosa</button>
        <button onclick="showSubTab('${tabName}', 'bilancio')">Bilancio</button>
        <button onclick="showSubTab('${tabName}', 'movimenti')">Movimenti</button>
      </div>
      <div id="${tabName}-descrizione" class="sub-tab-content">
        <div class="image-row">
          <img src="${presidentData[tabName].descrizione.images[0]}" alt="Immagine 1" />
          <img src="${presidentData[tabName].descrizione.images[1]}" alt="Immagine 2" />
          <img src="${presidentData[tabName].descrizione.images[2]}" alt="Immagine 3" />
          <img src="${presidentData[tabName].descrizione.images[3]}" alt="Immagine 4" />
        </div>
        <p>${presidentData[tabName].descrizione.text}</p>
      </div>
    `;
  });
}

// Inizializza le funzioni
addRegolamentoContent();
addPresidentsContent();
showTab('regolamento');
