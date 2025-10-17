

document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

function initCharts() {
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não foi carregado');
        return;
    }
    
    initSmartCitiesChart();
    initEmissionsChart();
    initSensorDataChart();
    initEnergySavingsChart();
}


function initSmartCitiesChart() {
    const ctx = document.getElementById('smartCitiesChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Cidades Inteligentes no Brasil',
                data: [45, 62, 78, 95, 118, 135, 150],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'América Latina',
                data: [120, 145, 178, 210, 245, 280, 320],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Evolução das Cidades Inteligentes',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1f2937'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Ano',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Número de Cidades',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    
    window.smartCitiesChart = chart;
}


function initEmissionsChart() {
    const ctx = document.getElementById('emissionsChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Carro a Gasolina', 'Carro Elétrico', 'Ônibus Diesel', 'Ônibus Elétrico', 'Moto Gasolina', 'Moto Elétrica'],
            datasets: [{
                label: 'Emissões de CO₂ (kg/100km)',
                data: [12.5, 2.1, 8.9, 1.8, 6.2, 1.2],
                backgroundColor: [
                    '#ef4444', 
                    '#10b981', 
                    '#ef4444',
                    '#10b981',
                    '#ef4444',
                    '#10b981'
                ],
                borderColor: [
                    '#dc2626',
                    '#059669',
                    '#dc2626',
                    '#059669',
                    '#dc2626',
                    '#059669'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação de Emissões: Transporte Convencional vs Elétrico',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1f2937'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} kg CO₂/100km`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Tipo de Veículo',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Emissões de CO₂ (kg/100km)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    beginAtZero: true
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
    
    window.emissionsChart = chart;
}


function initSensorDataChart() {
    
    console.log('Sensor data chart would be implemented here');
}


function initEnergySavingsChart() {
    
    console.log('Energy savings chart would be implemented here');
}


function updateChartsWithRealTimeData() {
    
    if (window.smartCitiesChart) {
        
        const newData = getLatestSmartCitiesData();
        window.smartCitiesChart.data.datasets[0].data = newData;
        window.smartCitiesChart.update('active');
    }
    
    if (window.emissionsChart) {
        
        const newEmissionsData = getLatestEmissionsData();
        window.emissionsChart.data.datasets[0].data = newEmissionsData;
        window.emissionsChart.update('active');
    }
}


function getLatestSmartCitiesData() {
    
    return [45, 62, 78, 95, 118, 135, 150];
}

function getLatestEmissionsData() {
    
    return [12.5, 2.1, 8.9, 1.8, 6.2, 1.2];
}


function handleChartResize() {
    if (window.smartCitiesChart) {
        window.smartCitiesChart.resize();
    }
    if (window.emissionsChart) {
        window.emissionsChart.resize();
    }
}


window.addEventListener('resize', debounce(handleChartResize, 250));


function initChartAccessibility() {
    
    const charts = document.querySelectorAll('canvas');
    charts.forEach((chart, index) => {
        chart.setAttribute('role', 'img');
        chart.setAttribute('aria-label', `Gráfico ${index + 1}: Dados sobre cidades inteligentes e sustentabilidade`);
    });
}


window.ChartManager = {
    updateChartsWithRealTimeData,
    initChartAccessibility,
    handleChartResize
};


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


document.addEventListener('DOMContentLoaded', function() {
    initChartAccessibility();
});

