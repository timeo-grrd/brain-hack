document.addEventListener('DOMContentLoaded', function() {
    // Theme Colors
    const colors = {
        violet: '#a855f7',
        cyan: '#06b6d4',
        lime: '#84cc16',
        violetLight: 'rgba(168, 85, 247, 0.2)',
        cyanLight: 'rgba(6, 182, 212, 0.2)',
        limeLight: 'rgba(132, 204, 22, 0.2)'
    };

    let charts = {};
    let lastData = null;

    // Initialisation des graphiques avec des données vides
    initCharts();

    // Récupération des données réelles
    fetchData();

    // Event Listener Export CSV
    document.getElementById('btnExportCSV').addEventListener('click', exportToCSV);

    function initCharts() {
        // Chart 1: Bar Chart - Répartition par Niveau Scolaire
        const ctxBar = document.getElementById('chartLevelDistribution').getContext('2d');
        charts.level = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Nombre d\'élèves',
                    data: [],
                    backgroundColor: [colors.violet, colors.cyan, colors.lime, '#6366f1', '#4f46e5'],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1e1b4b' }
                },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });

        // Chart 2: Doughnut - Utilisation des Outils IA
        const ctxDoughnut = document.getElementById('chartIAUsage').getContext('2d');
        charts.usage = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [colors.violet, colors.cyan, colors.lime, '#6366f1', '#ec4899'],
                    hoverOffset: 15,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 20 } },
                    tooltip: { backgroundColor: '#1e1b4b' }
                },
                cutout: '70%'
            }
        });

        // Chart 3: Radar Chart - Compétences par Média
        const ctxRadar = document.getElementById('chartSkillsRadar').getContext('2d');
        charts.skills = new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: ['Texte', 'Image', 'Vidéo', 'Audio'],
                datasets: [{
                    label: 'Score Moyen',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    borderColor: colors.violet,
                    pointBackgroundColor: colors.violet,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: colors.violet,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' },
                        min: 0,
                        max: 100,
                        pointLabels: { font: { weight: '600' } }
                    }
                }
            }
        });

        // Chart 4: Line Chart - Évolution des scores moyens
        const ctxLine = document.getElementById('chartScoreEvolution').getContext('2d');
        charts.evolution = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Score Moyen (%)',
                    data: [],
                    borderColor: colors.cyan,
                    backgroundColor: colors.cyanLight,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: colors.cyan,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#1e1b4b' }
                },
                scales: {
                    y: { beginAtZero: false, min: 0, max: 100, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    async function fetchData() {
        try {
            const response = await fetch('../../backend/api/api_kpi.php');
            const result = await response.json();

            if (result.status === 'success') {
                lastData = result.data;
                updateDashboard(result.data);
            } else {
                console.error('Erreur API:', result.message);
            }
        } catch (error) {
            console.error('Erreur de chargement des données:', error);
        }
    }

    function updateDashboard(data) {
        // 1. Mise à jour des compteurs (Cards)
        if (data.overview) {
            document.getElementById('valUsers').textContent = data.overview.total_users;
            document.getElementById('valXP').textContent = data.overview.total_xp;
            document.getElementById('valGames').textContent = data.overview.total_games;
            document.getElementById('valAIChecks').textContent = data.overview.total_ai_checks;
            document.getElementById('valCertifications').textContent = data.overview.total_certifications;
            document.getElementById('valSuccessRate').textContent = data.overview.success_rate;
        }

        // 2. Mise à jour du Bar Chart
        if (data.charts.level_distribution) {
            charts.level.data.labels = data.charts.level_distribution.map(item => item.label);
            charts.level.data.datasets[0].data = data.charts.level_distribution.map(item => item.value);
            charts.level.update();
        }

        // 3. Mise à jour du Doughnut
        if (data.charts.usage_stats) {
            charts.usage.data.labels = data.charts.usage_stats.map(item => item.label);
            charts.usage.data.datasets[0].data = data.charts.usage_stats.map(item => item.value);
            charts.usage.update();
        }

        // 4. Mise à jour du Radar Chart
        if (data.charts.radar_skills) {
            charts.skills.data.labels = data.charts.radar_skills.map(item => item.label);
            charts.skills.data.datasets[0].data = data.charts.radar_skills.map(item => item.value);
            charts.skills.update();
        }

        // 5. Mise à jour du Line Chart
        if (data.charts.score_evolution) {
            charts.evolution.data.labels = data.charts.score_evolution.map(item => item.label);
            charts.evolution.data.datasets[0].data = data.charts.score_evolution.map(item => item.value);
            charts.evolution.update();
        }

        // 6. Mise à jour du tableau des inscriptions
        if (data.recent_users) {
            const tbody = document.getElementById('tbodyRecentUsers');
            if (tbody) {
                tbody.innerHTML = '';
                data.recent_users.forEach(user => {
                    const date = new Date(user.created_at).toLocaleDateString('fr-FR');
                    const row = `
                        <tr>
                            <td><span class="badge-id">${user.id.substring(0, 8)}</span></td>
                            <td><strong>${user.pseudo}</strong></td>
                            <td>${user.classe || 'Aucune'}</td>
                            <td>${date}</td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            }
        }
    }

    function exportToCSV() {
        if (!lastData) return;
        
        let csvContent = "data:text/csv;charset=utf-8,Category,Value\n";
        
        // Overview
        csvContent += `Total Users,${lastData.overview.total_users}\n`;
        csvContent += `Total XP,${lastData.overview.total_xp}\n`;
        csvContent += `Total Games,${lastData.overview.total_games}\n`;
        csvContent += `AI Checks,${lastData.overview.total_ai_checks}\n`;
        csvContent += `Certifications,${lastData.overview.total_certifications}\n`;
        csvContent += `Success Rate,${lastData.overview.success_rate}\n\n`;

        // Users
        csvContent += "Recent Users ID,Pseudo,Classe,Date\n";
        lastData.recent_users.forEach(u => {
            csvContent += `${u.id},${u.pseudo},${u.classe || ''},${u.created_at}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rapport_kpi_brainhack.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
