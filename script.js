document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const contentSections = document.querySelectorAll('.main-content > section');
    const regolamentoSidebar = document.getElementById('regolamento-sidebar');
    const squadreSidebar = document.getElementById('squadre-sidebar');
    const sidebarTitle = squadreSidebar.querySelector('h3');

    // Funzioni di gestione della navigazione e delle sezioni
    function hideAllSections() {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
    }

    function deactivateAllLinks() {
        navLinks.forEach(link => {
            link.parentNode.classList.remove('active');
        });
    }

    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = this.getAttribute('href').substring(1); // Rimuovi l'#

                hideAllSections();
                document.getElementById(targetId).style.display = 'block';
                deactivateAllLinks();
                this.parentNode.classList.add('active');

                // Mostra la sidebar corretta
                if (targetId === 'regolamento-content') {
                    regolamentoSidebar.style.display = 'block';
                    squadreSidebar.style.display = 'none';
                } else if (targetId.endsWith('-content') && targetId !== 'svincolati-content') {
                    squadreSidebar.style.display = 'block';
                    regolamentoSidebar.style.display = 'none';
                    const squadraNome = this.textContent;
                    sidebarTitle.textContent = squadraNome;
                } else if (targetId === 'svincolati-content') {
                    regolamentoSidebar.style.display = 'none';
                    squadreSidebar.style.display = 'none';
                }
            });
        });
    }

    function setupSidebarScroll() {
        const sidebarLinks = document.querySelectorAll('.sidebar a');
        sidebarLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // Per allineare l'elemento all'inizio della vista
                    });
                }
            });
        });
    }

    // Funzioni per caricare e visualizzare i dati
    function loadAndProcessData() {
        fetch('players.csv')
            .then(response => response.text())
            .then(csvData => {
                const allPlayers = parseCSV(csvData);
                displayTeamPlayers(allPlayers);
                displaySvincolati(allPlayers); // Questa funzione è già presente, ma la modificheremo
            })
            .catch(error => console.error('Errore nel caricamento dei dati:', error));
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const players = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const player = {};
                for (let j = 0; j < headers.length; j++) {
                    player[headers[j]] = values[j].trim();
                }
                players.push(player);
            }
        }
        return players;
    }

    function displayTeamPlayers(allPlayers) {
        contentSections.forEach(section => {
            if (section.id.endsWith('-content') && section.id !== 'svincolati-content') {
                const teamContainer = section.querySelector('.team-players');
                if (teamContainer) {
                    teamContainer.innerHTML = createTableHTML();
                    const tableBody = teamContainer.querySelector('tbody');
                    populateTeamTable(tableBody, allPlayers, section.id.replace('-content', ''));
                }
            }
        });
    }

    function displaySvincolati(allPlayers) {
        const svincolatiContainer = document.getElementById('svincolati-content').querySelector('.free-agents');
        svincolatiContainer.innerHTML = createTableHTML();
        const tableBody = svincolatiContainer.querySelector('tbody');
        populateSvincolatiTable(tableBody, allPlayers);
    }

    // Funzioni di supporto per la creazione e popolazione delle tabelle
    function createTableHTML() {
        return `
            <table>
                <thead>
                    <tr>
                        <th>Ruolo</th>
                        <th>Nome</th>
                        <th>Squadra</th>
                        <th>Quotazione</th>
                        <th>Stipendio</th>
                        <th>Clausola Rescissoria</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }

    function populateTeamTable(tableBody, allPlayers, teamName) {
        allPlayers.forEach(player => {
            if (player.Squadra && player.Squadra.toLowerCase() === teamName.toLowerCase()) {
                tableBody.innerHTML += `
                    <tr>
                        <td>${player.Ruolo || ''}</td>
                        <td>${player.Nome || ''}</td>
                        <td>${player.Squadra || ''}</td>
                        <td>${formatCurrency(player.Quotazione)}</td>
                        <td>${formatCurrency(player.Stipendio)}</td>
                        <td>${formatCurrency(player.Clausola_Rescissoria)}</td>
                    </tr>
                `;
            }
        });
    }

    function populateSvincolatiTable(tableBody, allPlayers) {
        allPlayers.forEach(player => {
            if (!player.Squadra || player.Squadra.trim() === '') { // Modifica qui!
                tableBody.innerHTML += `
                    <tr>
                        <td>${player.Ruolo || ''}</td>
                        <td>${player.Nome || ''}</td>
                        <td>Svincolato</td>
                        <td>${formatCurrency(player.Quotazione)}</td>
                        <td>${formatCurrency(player.Stipendio)}</td>
                        <td>${formatCurrency(player.Clausola_Rescissoria)}</td>
                    </tr>
                `;
            }
        });
    }

    function formatCurrency(value) {
        return value ? '€ ' + parseFloat(value).toLocaleString('it-IT') : 'N/A';
    }

    // Inizializzazione
    hideAllSections();
    document.getElementById('regolamento-content').style.display = 'block';
    document.querySelector('header nav ul li:first-child').classList.add('active');
    regolamentoSidebar.style.display = 'block';
    squadreSidebar.style.display = 'none';

    setupNavigation();
    setupSidebarScroll();
    loadAndProcessData();
});
