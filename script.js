document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const contentSections = document.querySelectorAll('.main-content > section');
    const regolamentoSidebar = document.getElementById('regolamento-sidebar');
    const squadreSidebar = document.getElementById('squadre-sidebar');
    const sidebarTitle = squadreSidebar.querySelector('h3');

    // Configurazione per il Google Sheet dei movimenti (STRUTTURA AGGIORNATA)
    const MOVIMENTI_SHEET_ID = '1AEmCFqKgFORg7tZBACHVy8VD4R_9MwlybtZnUl9Y_UA'; // Inserisci qui l'ID del tuo foglio Google
    const MOVIMENTI_SHEET_NAME = 'Movimenti'; // Inserisci qui il nome del foglio
    const MOVIMENTI_URL = `https://docs.google.com/spreadsheets/d/${MOVIMENTI_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(MOVIMENTI_SHEET_NAME)}`;

    function hideAllSections() {
        contentSections.forEach(section => section.style.display = 'none');
    }

    function deactivateAllLinks() {
        navLinks.forEach(link => link.parentNode.classList.remove('active'));
    }

    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = this.getAttribute('href').substring(1);

                hideAllSections();
                document.getElementById(targetId).style.display = 'block';
                deactivateAllLinks();
                this.parentNode.classList.add('active');

                if (targetId === 'regolamento-content') {
                    regolamentoSidebar.style.display = 'block';
                    squadreSidebar.style.display = 'none';
                } else if (targetId.endsWith('-content') && targetId !== 'svincolati-content') {
                    squadreSidebar.style.display = 'block';
                    regolamentoSidebar.style.display = 'none';
                    const squadraNome = this.textContent;
                    sidebarTitle.textContent = squadraNome;
                    loadTeamMovimentiFromSheet(squadraNome);
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
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    function loadAndProcessData() {
        fetch('players.csv')
            .then(response => response.text())
            .then(csvData => {
                const allPlayers = parseCSV(csvData);
                displayPlayersByTeam(allPlayers);
                displaySvincolati(allPlayers);
            })
            .catch(error => console.error('Errore nel caricamento dei dati dei giocatori:', error));

        loadAllMovimentiFromSheet();
    }

    function loadAllMovimentiFromSheet() {
        fetch(MOVIMENTI_URL)
            .then(response => response.text())
            .then(csvData => {
                const allMovimenti = parseMovimentiSheetCSV(csvData);
                displayAllMovimenti(allMovimenti);
            })
            .catch(error => console.error('Errore nel caricamento dei dati dei movimenti dal Google Sheet:', error));
    }

    function loadTeamMovimentiFromSheet(teamName) {
        fetch(MOVIMENTI_URL)
            .then(response => response.text())
            .then(csvData => {
                const allMovimenti = parseMovimentiSheetCSV(csvData);
                displayTeamMovimenti(teamName, allMovimenti);
            })
            .catch(error => console.error(`Errore nel caricamento dei movimenti per ${teamName} dal Google Sheet:`, error));
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const rawHeaders = lines[0].split(';').map(header => header.trim());
        const headers = rawHeaders;

        const players = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(';');
            if (values.length === rawHeaders.length) {
                const player = {};
                for (let j = 0; j < rawHeaders.length; j++) {
                    player[headers[j]] = values[j].trim();
                }
                players.push(player);
            }
        }
        return players;
    }

    function parseMovimentiSheetCSV(csvText) {
        const lines = csvText.split('\n').slice(1);
        if (lines.length < 1) return [];
        const headers = ['Data', 'Tipo', 'Descrizione', 'Valore', 'Squadra']; // Intestazioni AGGIORNATE
        const movimenti = [];
        for (let i = 0; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= headers.length) {
                const movimento = {};
                for (let j = 0; j < headers.length; j++) {
                    movimento[headers[j]] = values[j].trim().replace(/"/g, '');
                }
                movimenti.push(movimento);
            }
        }
        return movimenti;
    }

    function displayAllMovimenti(allMovimenti) {
        const teamMovimentiSections = {
            'alcool-campi': document.querySelector('#alcool-campi-content .tabella-movimenti'),
            'balillareal': document.querySelector('#balillareal-content .tabella-movimenti'),
            'lascopo-educativo': document.querySelector('#lascopo-educativo-content .tabella-movimenti'),
            'ac-finocchiona': document.querySelector('#ac-finocchiona-content .tabella-movimenti'),
            'as-fogliatella': document.querySelector('#as-fogliatella-content .tabella-movimenti'),
            'dandandan': document.querySelector('#dandandan-content .tabella-movimenti'),
            'as-pisciazz': document.querySelector('#as-pisciazz-content .tabella-movimenti'),
            'ac-minchia': document.querySelector('#ac-minchia-content .tabella-movimenti')
        };

        for (const teamId in teamMovimentiSections) {
            if (teamMovimentiSections.hasOwnProperty(teamId)) {
                const movimentiDiv = teamMovimentiSections[teamId];
                if (movimentiDiv) {
                    movimentiDiv.innerHTML = createMovimentiTableHTML();
                    const tableBody = movimentiDiv.querySelector('tbody');
                    populateMovimentiTable(tableBody, allMovimenti, teamId);
                }
            }
        }
    }

    function displayTeamMovimenti(teamName, allMovimenti) {
        const teamId = teamName.toLowerCase().replace(/ /g, '-');
        const movimentiDiv = document.querySelector(`#${teamId}-content .tabella-movimenti`);

        if (movimentiDiv) {
            movimentiDiv.innerHTML = createMovimentiTableHTML();
            const tableBody = movimentiDiv.querySelector('tbody');
            populateMovimentiTable(tableBody, allMovimenti, teamId);
        }
    }

    function createMovimentiTableHTML() {
        return `
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Tipo</th>
                        <th>Descrizione</th>
                        <th>Valore</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }

    function populateMovimentiTable(tableBody, allMovimenti, teamId) {
        allMovimenti.forEach(movimento => {
            const squadraCoinvolta = movimento['Squadra'];
            if (squadraCoinvolta && squadraCoinvolta.toLowerCase().replace(/ /g, '-') === teamId) {
                tableBody.innerHTML += `
                    <tr>
                        <td>${movimento.Data || ''}</td>
                        <td>${movimento.Tipo || ''}</td>
                        <td>${movimento.Descrizione || ''}</td>
                        <td>${formatCurrency(movimento.Valore)}</td>
                    </tr>
                `;
            }
        });
    }

    function displayPlayersByTeam(allPlayers) {
        const teamSections = {
            'alcool-campi': document.querySelector('#alcool-campi-content .team-roster'),
            'balillareal': document.querySelector('#balillareal-content .team-roster'),
            'lascopo-educativo': document.querySelector('#lascopo-educativo-content .team-roster'),
            'ac-finocchiona': document.querySelector('#ac-finocchiona-content .team-roster'),
            'as-fogliatella': document.querySelector('#as-fogliatella-content .team-roster'),
            'dandandan': document.querySelector('#dandandan-content .team-roster'),
            'as-pisciazz': document.querySelector('#as-pisciazz-content .team-roster'),
            'ac-minchia': document.querySelector('#ac-minchia-content .team-roster')
        };

        for (const teamId in teamSections) {
            if (teamSections.hasOwnProperty(teamId)) {
                const teamRosterDiv = teamSections[teamId];
                if (teamRosterDiv) {
                    teamRosterDiv.innerHTML = createTableHTML('Rosa');
                    const tableBody = teamRosterDiv.querySelector('tbody');
                    populateTeamTable(tableBody, allPlayers, teamId);
                }
            }
        }
    }

    function displaySvincolati(allPlayers) {
        const svincolatiDiv = document.querySelector('#svincolati-content .free-agents');
        if (svincolatiDiv) {
            svincolatiDiv.innerHTML = createTableHTML('Svincolati');
            const tableBody = svincolatiDiv.querySelector('tbody');
            populateSvincolatiTable(tableBody, allPlayers);
        }
    }

    function createTableHTML(type) {
        let headers = '';
        if (type === 'Rosa' || type === 'Svincolati') {
            headers = `
                <tr>
                    <th>Ruolo</th>
                    <th>Nome</th>
                    <th>Quotazione</th>
                    <th>Stipendio</th>
                    <th>Clausola Rescissoria</th>
                </tr>
            `;
        }
        return `
            <table>
                <thead>
                    ${headers}
                </thead>
                <tbody></tbody>
            </table>
        `;
    }

    function populateTeamTable(tableBody, allPlayers, teamId) {
        allPlayers.forEach(player => {
            if (player['Squadra Fanta'] && player['Squadra Fanta'].toLowerCase() === teamId) {
                tableBody.innerHTML += `
                    <tr>
                        <td>${player.Ruolo || ''}</td>
                        <td>${player.Nome || ''}</td>
                        <td>${formatCurrency(player.Quotazione)}</td>
                        <td>${formatCurrency(player.Stipendio)}</td>
                        <td>${formatCurrency(player['Clausola Rescissoria'])}</td>
                    </tr>
                `;
            }
        });
    }

    function populateSvincolatiTable(tableBody, allPlayers) {
        allPlayers.forEach(player => {
            if (!player['Squadra Fanta'] || player['Squadra Fanta'].trim() === '') {
                tableBody.innerHTML += `
                    <tr>
                        <td>${player.Ruolo || ''}</td>
                        <td>${player.Nome || ''}</td>
                        <td>${formatCurrency(player.Quotazione)}</td>
                        <td>${formatCurrency(player.Stipendio)}</td>
                        <td>${formatCurrency(player['Clausola Rescissoria'])}</td>
                    </tr>
                `;
            }
        });
    }

    function formatCurrency(value) {
        return value ? '€ ' + parseFloat(value).toLocaleString('it-IT') : 'N/A';
    }

    hideAllSections();
    document.getElementById('regolamento-content').style.display = 'block';
    document.querySelector('header nav ul li:first-child').classList.add('active');
    regolamentoSidebar.style.display = 'block';
    squadreSidebar.style.display = 'none';

    setupNavigation();
    setupSidebarScroll();
    loadAndProcessData();
});
