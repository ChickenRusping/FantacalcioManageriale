document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('header nav ul li a');
    const contentSections = document.querySelectorAll('.main-content > section');
    const regolamentoSidebar = document.getElementById('regolamento-sidebar');
    const squadreSidebar = document.getElementById('squadre-sidebar');
    const sidebarTitle = squadreSidebar.querySelector('h3');

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
            .catch(error => console.error('Errore nel caricamento dei dati:', error));
    }

    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const rawHeaders = lines[0].split(';').map(header => header.trim());
        const headers = rawHeaders; // Mantieni le intestazioni originali per ora

        // Opzione per normalizzare i nomi delle proprietà (consigliato per robustezza):
        /*
        const headers = rawHeaders.map(header => header.replace(/ /g, '_'));
        */

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
            // Aggiungi qui le altre squadre con i selettori corretti (.team-roster)
        };

        for (const teamId in teamSections) {
            if (teamSections.hasOwnProperty(teamId)) {
                const teamRosterDiv = teamSections[teamId];
                if (teamRosterDiv) {
                    teamRosterDiv.innerHTML = createTableHTML();
                    const tableBody = teamRosterDiv.querySelector('tbody');
                    populateTeamTable(tableBody, allPlayers, teamId); // Usa teamId direttamente per confrontare
                }
            }
        }
    }

    function displaySvincolati(allPlayers) {
        const svincolatiDiv = document.querySelector('#svincolati-content .free-agents');
        if (svincolatiDiv) {
            svincolatiDiv.innerHTML = createTableHTML();
            const tableBody = svincolatiDiv.querySelector('tbody');
            populateSvincolatiTable(tableBody, allPlayers);
        }
    }

    function createTableHTML() {
        return `
            <table>
                <thead>
                    <tr>
                        <th>Ruolo</th>
                        <th>Nome</th>
                        <th>Quotazione</th>
                        <th>Stipendio</th>
                        <th>Clausola Rescissoria</th>
                    </tr>
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
