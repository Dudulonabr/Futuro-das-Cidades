document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

function initCharts() {
    initSmartCitiesChart();
    initEmissionsChart();
    initSensorDataChart();
    initEnergySavingsChart();
}

function initSmartCitiesChart() {
    const canvas = document.getElementById('smartCitiesChart');
    if (!canvas) return;

    const labels = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    const series = [
        {
            label: 'Cidades Inteligentes no Brasil',
            data: [45, 62, 78, 95, 118, 135, 150],
            color: '#2de7ff',
            fillColor: 'rgba(45, 231, 255, 0.14)'
        },
        {
            label: 'América Latina',
            data: [120, 145, 178, 210, 245, 280, 320],
            color: '#21d6a5',
            fillColor: 'rgba(33, 214, 165, 0.10)'
        }
    ];

    drawLineChart(canvas, {
        title: 'Evolução das Cidades Inteligentes',
        xLabel: 'Ano',
        yLabel: 'Número de Cidades',
        labels,
        series
    });
}

function initEmissionsChart() {
    const canvas = document.getElementById('emissionsChart');
    if (!canvas) return;

    const labels = ['Carro a Gasolina', 'Carro Elétrico', 'Ônibus Diesel', 'Ônibus Elétrico', 'Moto Gasolina', 'Moto Elétrica'];
    const series = [
        {
            label: 'Emissões de CO₂ (kg/100km)',
            data: [12.5, 2.1, 8.9, 1.8, 6.2, 1.2],
            color: '#2de7ff'
        }
    ];

    drawBarChart(canvas, {
        title: 'Comparação de Emissões: Transporte Convencional vs Elétrico',
        xLabel: 'Tipo de Veículo',
        yLabel: 'Emissões de CO₂ (kg/100km)',
        labels,
        series
    });
}

function initSensorDataChart() {
    const canvas = document.getElementById('sensorDataChart');
    if (!canvas) return;

    drawDonutPlaceholder(canvas, 'Dados de sensores em tempo real');
}

function initEnergySavingsChart() {
    const canvas = document.getElementById('energySavingsChart');
    if (!canvas) return;

    drawDonutPlaceholder(canvas, 'Economia energética estimada');
}

function drawLineChart(canvas, config) {
    const context = prepareCanvas(canvas);
    if (!context) return;

    const { width, height, dpr } = context;
    const chart = context.ctx;
    const padding = { top: 70, right: 40, bottom: 70, left: 70 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const allValues = config.series.flatMap((item) => item.data);
    const minValue = Math.min(...allValues) * 0.9;
    const maxValue = Math.max(...allValues) * 1.08;

    clearChart(chart, width, height);
    drawBackdrop(chart, width, height);
    drawTitle(chart, config.title, width);
    drawAxes(chart, width, height, padding, config.xLabel, config.yLabel);

    config.series.forEach((item) => {
        const points = item.data.map((value, index) => {
            const x = padding.left + (index / (config.labels.length - 1)) * plotWidth;
            const y = padding.top + plotHeight - ((value - minValue) / (maxValue - minValue)) * plotHeight;
            return { x, y, value };
        });

        chart.beginPath();
        chart.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i += 1) {
            const previous = points[i - 1];
            const current = points[i];
            const controlX = (previous.x + current.x) / 2;
            chart.bezierCurveTo(controlX, previous.y, controlX, current.y, current.x, current.y);
        }
        chart.lineWidth = 4 * dpr;
        chart.strokeStyle = item.color;
        chart.shadowColor = item.color;
        chart.shadowBlur = 18 * dpr;
        chart.stroke();
        chart.shadowBlur = 0;

        chart.lineTo(points[points.length - 1].x, padding.top + plotHeight);
        chart.lineTo(points[0].x, padding.top + plotHeight);
        chart.closePath();
        chart.fillStyle = item.fillColor || 'rgba(45, 231, 255, 0.08)';
        chart.fill();

        points.forEach((point) => {
            chart.beginPath();
            chart.arc(point.x, point.y, 6 * dpr, 0, Math.PI * 2);
            chart.fillStyle = '#ffffff';
            chart.fill();
            chart.lineWidth = 4 * dpr;
            chart.strokeStyle = item.color;
            chart.stroke();
        });
    });

    drawLegend(chart, width, padding, config.series);
    drawXAxisLabels(chart, width, height, padding, config.labels);
    drawYAxisTicks(chart, width, height, padding, minValue, maxValue);
}

function drawBarChart(canvas, config) {
    const context = prepareCanvas(canvas);
    if (!context) return;

    const { width, height, dpr } = context;
    const chart = context.ctx;
    const padding = { top: 70, right: 35, bottom: 90, left: 72 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const values = config.series[0].data;
    const maxValue = Math.max(...values) * 1.15;

    clearChart(chart, width, height);
    drawBackdrop(chart, width, height);
    drawTitle(chart, config.title, width);
    drawAxes(chart, width, height, padding, config.xLabel, config.yLabel);

    const barWidth = plotWidth / values.length * 0.62;
    const gap = plotWidth / values.length * 0.38;

    values.forEach((value, index) => {
        const x = padding.left + index * (barWidth + gap) + gap / 2;
        const barHeight = (value / maxValue) * plotHeight;
        const y = padding.top + plotHeight - barHeight;

        const gradient = chart.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#4df2ff');
        gradient.addColorStop(1, '#18d7b2');

        roundRect(chart, x, y, barWidth, barHeight, 12 * dpr, gradient, 'rgba(45, 231, 255, 0.24)');
    });

    drawLegend(chart, width, padding, config.series);
    drawBarLabels(chart, width, height, padding, config.labels);
    drawYAxisTicks(chart, width, height, padding, 0, maxValue);
}

function drawDonutPlaceholder(canvas, title) {
    const context = prepareCanvas(canvas);
    if (!context) return;

    const { width, height, dpr } = context;
    const chart = context.ctx;
    const centerX = width / 2;
    const centerY = height / 2 + 18 * dpr;
    const radius = Math.min(width, height) * 0.23;

    clearChart(chart, width, height);
    drawBackdrop(chart, width, height);
    drawTitle(chart, title, width);

    const segments = [
        { value: 42, color: '#2de7ff' },
        { value: 28, color: '#21d6a5' },
        { value: 18, color: '#86f6ff' },
        { value: 12, color: '#0ab8d0' }
    ];

    let startAngle = -Math.PI / 2;
    segments.forEach((segment) => {
        const angle = (segment.value / 100) * Math.PI * 2;
        chart.beginPath();
        chart.moveTo(centerX, centerY);
        chart.arc(centerX, centerY, radius, startAngle, startAngle + angle);
        chart.closePath();
        chart.fillStyle = segment.color;
        chart.globalAlpha = 0.9;
        chart.fill();
        startAngle += angle;
    });
    chart.globalAlpha = 1;

    chart.beginPath();
    chart.arc(centerX, centerY, radius * 0.62, 0, Math.PI * 2);
    chart.fillStyle = 'rgba(5, 11, 22, 0.96)';
    chart.fill();

    chart.fillStyle = '#f7fbff';
    chart.font = `${18 * dpr}px Space Grotesk, Inter, sans-serif`;
    chart.textAlign = 'center';
    chart.fillText('Dados', centerX, centerY - 2 * dpr);
    chart.fillStyle = 'rgba(235, 246, 255, 0.72)';
    chart.font = `${12 * dpr}px Inter, sans-serif`;
    chart.fillText('visualização em tempo real', centerX, centerY + 18 * dpr);
}

function prepareCanvas(canvas) {
    const context = canvas.getContext('2d');
    if (!context) return null;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(rect.width || canvas.width || 800, 320);
    const height = Math.max(rect.height || canvas.height || 400, 260);
    const dpr = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpr, dpr);

    return {
        ctx: context,
        width,
        height,
        dpr
    };
}

function clearChart(context, width, height) {
    context.clearRect(0, 0, width, height);
}

function drawBackdrop(context, width, height) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(9, 19, 34, 0.95)');
    gradient.addColorStop(1, 'rgba(5, 11, 22, 0.96)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'rgba(110, 251, 255, 0.06)';
    context.lineWidth = 1;
    for (let x = 40; x < width; x += 40) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let y = 40; y < height; y += 40) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }
}

function drawTitle(context, title, width) {
    context.fillStyle = '#f7fbff';
    context.font = '700 18px Space Grotesk, Inter, sans-serif';
    context.textAlign = 'center';
    context.fillText(title, width / 2, 34);
}

function drawAxes(context, width, height, padding, xLabel, yLabel) {
    context.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    context.lineWidth = 1;

    context.beginPath();
    context.moveTo(padding.left, padding.top);
    context.lineTo(padding.left, height - padding.bottom);
    context.lineTo(width - padding.right, height - padding.bottom);
    context.stroke();

    context.fillStyle = 'rgba(235, 246, 255, 0.72)';
    context.font = '600 12px Inter, sans-serif';
    context.textAlign = 'center';
    context.fillText(xLabel, width / 2, height - 22);

    context.save();
    context.translate(20, height / 2);
    context.rotate(-Math.PI / 2);
    context.fillText(yLabel, 0, 0);
    context.restore();
}

function drawXAxisLabels(context, width, height, padding, labels) {
    const plotWidth = width - padding.left - padding.right;
    const y = height - padding.bottom + 20;
    context.fillStyle = 'rgba(235, 246, 255, 0.7)';
    context.font = '500 11px Inter, sans-serif';
    context.textAlign = 'center';

    labels.forEach((label, index) => {
        const x = padding.left + (index / (labels.length - 1)) * plotWidth;
        context.fillText(label, x, y);
    });
}

function drawBarLabels(context, width, height, padding, labels) {
    const plotWidth = width - padding.left - padding.right;
    const y = height - padding.bottom + 24;
    context.fillStyle = 'rgba(235, 246, 255, 0.7)';
    context.font = '500 10px Inter, sans-serif';
    context.textAlign = 'center';

    labels.forEach((label, index) => {
        const x = padding.left + (index + 0.5) * (plotWidth / labels.length);
        context.fillText(label, x, y);
    });
}

function drawYAxisTicks(context, width, height, padding, minValue, maxValue) {
    const plotHeight = height - padding.top - padding.bottom;
    const steps = 4;
    context.fillStyle = 'rgba(235, 246, 255, 0.6)';
    context.font = '500 10px Inter, sans-serif';
    context.textAlign = 'right';

    for (let i = 0; i <= steps; i += 1) {
        const value = minValue + ((maxValue - minValue) / steps) * i;
        const y = padding.top + plotHeight - (plotHeight / steps) * i;
        context.fillText(Math.round(value).toString(), padding.left - 10, y + 3);
    }
}

function drawLegend(context, width, padding, series) {
    const baseY = padding.top - 26;
    let offsetX = padding.left;

    series.forEach((item) => {
        context.fillStyle = item.color;
        context.fillRect(offsetX, baseY, 14, 4);
        context.fillStyle = 'rgba(235, 246, 255, 0.82)';
        context.font = '500 11px Inter, sans-serif';
        context.textAlign = 'left';
        context.fillText(item.label, offsetX + 20, baseY + 4);
        offsetX += Math.max(160, item.label.length * 7.5);
    });
}

function roundRect(context, x, y, width, height, radius, fillStyle, strokeStyle) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
    context.fillStyle = fillStyle;
    context.fill();
    context.strokeStyle = strokeStyle;
    context.lineWidth = 1.5;
    context.stroke();
}

function updateChartsWithRealTimeData() {
    initCharts();
}

function getLatestSmartCitiesData() {
    return [45, 62, 78, 95, 118, 135, 150];
}

function getLatestEmissionsData() {
    return [12.5, 2.1, 8.9, 1.8, 6.2, 1.2];
}
