

document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
});

function initCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const formInputs = document.querySelectorAll('.calculator-form input');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSavings);
    }
    
 
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(calculateSavings, 500));
    });
    
   
    calculateSavings();
}

function calculateSavings() {
    
    const monthlyKm = parseFloat(document.getElementById('monthly-km')?.value) || 0;
    const fuelPrice = parseFloat(document.getElementById('fuel-price')?.value) || 0;
    const fuelConsumption = parseFloat(document.getElementById('fuel-consumption')?.value) || 0;
    const electricityPrice = parseFloat(document.getElementById('electricity-price')?.value) || 0;
    const electricConsumption = parseFloat(document.getElementById('electric-consumption')?.value) || 0;
    
    
    if (monthlyKm <= 0 || fuelPrice <= 0 || fuelConsumption <= 0 || electricityPrice <= 0 || electricConsumption <= 0) {
        resetResults();
        return;
    }
    
    
    const monthlyFuelCost = (monthlyKm / fuelConsumption) * fuelPrice;
    const monthlyElectricCost = (monthlyKm / 100) * electricConsumption * electricityPrice;
    const monthlySavings = monthlyFuelCost - monthlyElectricCost;
    const yearlySavings = monthlySavings * 12;
    const fiveYearSavings = yearlySavings * 5;
    
    
    const monthlyFuelLiters = monthlyKm / fuelConsumption;
    const monthlyCO2Reduction = monthlyFuelLiters * 2.3;
    const yearlyCO2Reduction = monthlyCO2Reduction * 12;
    
    
    updateResult('monthly-savings', formatCurrency(monthlySavings));
    updateResult('yearly-savings', formatCurrency(yearlySavings));
    updateResult('five-year-savings', formatCurrency(fiveYearSavings));
    updateResult('co2-reduction', formatCO2(yearlyCO2Reduction));
    
    
    addCalculationFeedback(monthlySavings, yearlySavings);
}

function updateResult(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        
        animateNumberChange(element, value);
    }
}

function animateNumberChange(element, newValue) {
    const currentValue = element.textContent;
    if (currentValue === newValue) return;
    
    
    element.classList.add('calculating');
    
    
    let startTime = null;
    const duration = 1000; 
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        
        element.textContent = newValue;
        element.style.transform = `scale(${1 + easeOut * 0.1})`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.classList.remove('calculating');
            element.style.transform = 'scale(1)';
        }
    }
    
    requestAnimationFrame(animate);
}

function addCalculationFeedback(monthlySavings, yearlySavings) {
    const resultsContainer = document.querySelector('.calculator-results');
    if (!resultsContainer) return;
    
    
    const existingFeedback = resultsContainer.querySelector('.calculation-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    
    const feedback = document.createElement('div');
    feedback.className = 'calculation-feedback';
    
    let message = '';
    let type = 'info';
    
    if (yearlySavings > 10000) {
        message = 'Excelente! Você pode economizar mais de R$ 10.000 por ano!';
        type = 'success';
    } else if (yearlySavings > 5000) {
        message = 'Ótimo! A economia anual é significativa.';
        type = 'success';
    } else if (yearlySavings > 0) {
        message = 'Boa! Você terá economia com a mobilidade elétrica.';
        type = 'info';
    } else {
        message = 'Verifique os valores inseridos.';
        type = 'warning';
    }
    
    feedback.innerHTML = `
        <div class="feedback-message feedback-${type}">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    resultsContainer.appendChild(feedback);
    
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 5000);
}

function resetResults() {
    updateResult('monthly-savings', 'R$ 0,00');
    updateResult('yearly-savings', 'R$ 0,00');
    updateResult('five-year-savings', 'R$ 0,00');
    updateResult('co2-reduction', '0 kg/ano');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatCO2(value) {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} t/ano`;
    }
    return `${Math.round(value)} kg/ano`;
}


function initAdvancedFeatures() {
    
    addScenarioComparison();
    
    
    addFuelPriceTrends();
    
    
    addVehicleRecommendations();
}

function addScenarioComparison() {
    const calculatorContainer = document.querySelector('.calculator-container');
    if (!calculatorContainer) return;
    
    const comparisonSection = document.createElement('div');
    comparisonSection.className = 'scenario-comparison';
    comparisonSection.innerHTML = `
        <h4>Comparação de Cenários</h4>
        <div class="scenario-grid">
            <div class="scenario-item">
                <h5>Conservador</h5>
                <p>Preço combustível: R$ 4,50</p>
                <p>Preço energia: R$ 0,70</p>
                <button class="btn btn-small" onclick="applyScenario('conservative')">Aplicar</button>
            </div>
            <div class="scenario-item">
                <h5>Otimista</h5>
                <p>Preço combustível: R$ 6,00</p>
                <p>Preço energia: R$ 0,50</p>
                <button class="btn btn-small" onclick="applyScenario('optimistic')">Aplicar</button>
            </div>
            <div class="scenario-item">
                <h5>Realista</h5>
                <p>Preço combustível: R$ 5,50</p>
                <p>Preço energia: R$ 0,65</p>
                <button class="btn btn-small" onclick="applyScenario('realistic')">Aplicar</button>
            </div>
        </div>
    `;
    
    calculatorContainer.appendChild(comparisonSection);
}

function applyScenario(type) {
    const scenarios = {
        conservative: {
            fuelPrice: 4.50,
            electricityPrice: 0.70
        },
        optimistic: {
            fuelPrice: 6.00,
            electricityPrice: 0.50
        },
        realistic: {
            fuelPrice: 5.50,
            electricityPrice: 0.65
        }
    };
    
    const scenario = scenarios[type];
    if (!scenario) return;
    
    document.getElementById('fuel-price').value = scenario.fuelPrice;
    document.getElementById('electricity-price').value = scenario.electricityPrice;
    
    calculateSavings();
    
    
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Cenário ${type} aplicado. Recalculando economia.`);
    }
}

function addFuelPriceTrends() {
    
    
    console.log('Fuel price trends feature would be implemented here');
}

function addVehicleRecommendations() {
    
    console.log('Vehicle recommendations feature would be implemented here');
}


window.MobilityCalculator = {
    calculateSavings,
    applyScenario,
    initAdvancedFeatures
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

