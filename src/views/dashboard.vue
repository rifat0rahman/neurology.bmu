<template>
    <div class="dash-root">

        <!-- ── SKELETON OVERLAY ────────────────────────────────────────── -->
        <transition name="fade">
            <div v-if="loading" class="skeleton-overlay">
                <div class="skeleton-inner">
                    <div class="skel skel-header"></div>
                    <div class="skel-kpi-row">
                        <div class="skel skel-kpi" v-for="n in 4" :key="n"></div>
                    </div>
                    <div class="skel-body">
                        <div class="skel-left">
                            <div class="skel skel-chart-sm" v-for="n in 2" :key="n"></div>
                            <div class="skel skel-chart-lg"></div>
                            <div class="skel skel-chart-lg"></div>
                        </div>
                        <div class="skel-right">
                            <div class="skel skel-mini" v-for="n in 2" :key="n"></div>
                            <div class="skel skel-recent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- ── PAGE BODY ───────────────────────────────────────────────── -->
        <main class="dash-body">

            <!-- PAGE TITLE -->
            <div class="page-title">
                <h1>Dashboard</h1>
                <p>Overview of your patients and admissions</p>
            </div>

            <!-- ── KPI CARDS ───────────────────────────────────────────── -->
            <div class="kpi-grid">

                <div class="kpi-card kpi-primary">
                    <div class="kpi-icon">
                        <i class="ph ph-users"></i>
                    </div>
                    <div class="kpi-info">
                        <span class="kpi-label">Total Patients</span>
                        <span class="kpi-value">{{ kpi.total }}</span>
                    </div>
                </div>

                <div class="kpi-card kpi-success">
                    <div class="kpi-icon">
                        <i class="ph ph-bed"></i>
                    </div>
                    <div class="kpi-info">
                        <span class="kpi-label">Active</span>
                        <span class="kpi-value">{{ kpi.active }}</span>
                    </div>
                </div>

                <div class="kpi-card kpi-info">
                    <div class="kpi-icon">
                        <i class="ph ph-check-circle"></i>
                    </div>
                    <div class="kpi-info">
                        <span class="kpi-label">Discharged</span>
                        <span class="kpi-value">{{ kpi.discharged }}</span>
                    </div>
                </div>

                <div class="kpi-card kpi-danger">
                    <div class="kpi-icon">
                        <i class="ph ph-warning"></i>
                    </div>
                    <div class="kpi-info">
                        <span class="kpi-label">Deaths</span>
                        <span class="kpi-value">{{ kpi.deaths }}</span>
                    </div>
                </div>

            </div>

            <!-- ── MAIN GRID ───────────────────────────────────────────── -->
            <div class="main-grid">

                <!-- LEFT COLUMN -->
                <div class="col-left">

                    <!-- Age + Diagnosis row -->
                    <div class="chart-pair">
                        <div class="dash-card">
                            <div class="card-head">
                                <h2>Age Distribution</h2>
                            </div>
                            <canvas ref="ageChart" height="260"></canvas>
                        </div>

                        <div class="dash-card">
                            <div class="card-head">
                                <h2>Diagnosis Distribution</h2>
                            </div>
                            <canvas ref="diagnosisChart" height="260"></canvas>
                        </div>
                    </div>

                    <!-- Trend chart -->
                    <div class="dash-card">
                        <div class="card-head">
                            <h2>Admission Trend</h2>
                            <div class="toggle-group">
                                <button v-for="r in ['Daily', 'Weekly']" :key="r" class="toggle-btn"
                                    :class="{ 'toggle-btn--active': trendRange === r }" @click="trendRange = r">
                                    {{ r }}
                                </button>
                            </div>
                        </div>
                        <canvas ref="trendChart" height="280"></canvas>
                    </div>

                    <!-- Outcome chart -->
                    <!-- Outcome -->
                    <div class="dash-card">
                        <div class="card-head">
                            <h2>Outcome Breakdown</h2>
                        </div>
                        <div style="max-width: 500px; margin: 0 auto;">
                            <canvas ref="outcomeChart" height="220"></canvas>
                        </div>
                    </div>

                </div>

                <!-- RIGHT COLUMN -->
                <div class="col-right">

                    <!-- Mini KPIs -->
                    <div class="mini-kpi-stack">
                        <div class="mini-kpi">
                            <span class="mini-label">Today's Admissions</span>
                            <span class="mini-value mini-value--warn">{{ kpi.todayAdmissions }}</span>
                        </div>
                        <div class="mini-kpi">
                            <span class="mini-label">Avg Stay</span>
                            <span class="mini-value mini-value--sec">{{ kpi.avgStay }}<small>d</small></span>
                        </div>
                    </div>

                    <!-- Recent patients -->
                    <div class="dash-card recent-card">
                        <div class="card-head">
                            <h2>Recent Patients</h2>
                            <a href="/records" class="view-all-btn">View All</a>
                        </div>

                        <div class="recent-list">
                            <div v-for="p in recentPatients" :key="p.id" class="recent-item">
                                <div class="patient-avatar">
                                    {{ p.name.charAt(0) }}
                                </div>
                                <div class="patient-info">
                                    <p class="patient-name">{{ p.name }}</p>
                                    <p class="patient-sub">{{ p.age }} · {{ p.diagnosis }}</p>
                                </div>
                                <div class="patient-right">
                                    <span class="outcome-badge" :class="outcomeBadge(p.outcome)">
                                        {{ p.outcome }}
                                    </span>
                                    <p class="patient-date">{{ p.date }}</p>
                                </div>
                            </div>

                            <!-- Empty state -->
                            <div v-if="recentPatients.length === 0" class="empty-state">
                                <i class="ph ph-clipboard-text"></i>
                                <span>No recent patients</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, getCurrentInstance } from 'vue'
import { Notify } from '@/utils/notify'
import {
    Chart,
    BarElement, BarController,
    ArcElement, DoughnutController, PieController,
    LineElement, LineController, PointElement,
    CategoryScale, LinearScale,
    Tooltip, Legend
} from 'chart.js'

Chart.register(
    BarElement, BarController,
    ArcElement, DoughnutController, PieController,
    LineElement, LineController, PointElement,
    CategoryScale, LinearScale,
    Tooltip, Legend
)

// 🔥 ACCESS GLOBAL API
const { proxy } = getCurrentInstance()

// ── REFS ──────────────────────────
const ageChart = ref(null)
const diagnosisChart = ref(null)
const outcomeChart = ref(null)
const trendChart = ref(null)
const trendRange = ref('Daily')

let trendChartInstance = null

// ── STATE ─────────────────────────
const loading = ref(false)

const kpi = ref({
    total: 0,
    active: 0,
    discharged: 0,
    deaths: 0,
    todayAdmissions: 0,
    avgStay: 0
})

const recentPatients = ref([])

const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

// ── COLORS ────────────────────────
const PALETTE = {
    primary: '#570df8',
    success: '#00a96e',
    info: '#00b5ff',
    warning: '#ffbe00',
    error: '#ff5861',
    secondary: '#f000b8',
    neutral: '#374151',
}

// ── HELPERS ───────────────────────
function outcomeBadge(outcome) {
    return {
        'Active': 'badge--success',
        'Discharged': 'badge--info',
        'Referred': 'badge--warn',
        'Dead': 'badge--danger',
    }[outcome] ?? 'badge--ghost'
}

// ── API CALL ──────────────────────
async function loadDashboard() {
    try {
        loading.value = true

        const res = await proxy.$api.get('/dashboard/summary')
        const data = res.data


        // 🔥 KPI
        kpi.value = {
            total: data.kpi.total,
            active: data.kpi.active,
            discharged: data.kpi.discharged,
            deaths: data.kpi.dead,
            todayAdmissions: data.kpi.todayAdmissions || 0,
            avgStay: data.kpi.avgStay || 0
        }

        // 🔥 RECENT
        recentPatients.value = data.recent.map(p => ({
            id: p.id,
            name: p.name,
            age: p.age,
            diagnosis: p.diagnosis,
            outcome: p.outcome || 'Active',
            date: new Date(p.date).toLocaleDateString()
        }))

        // 🔥 BUILD CHARTS
        buildAgeChart(data.age_distribution)
        buildDiagnosisChart(data.diagnosis_distribution)
        buildOutcomeChart(data.outcome_distribution)
        buildTrendChart()

    } catch (err) {
        console.error(err)
        Notify.error("Failed to load dashboard")
    } finally {
        loading.value = false
    }
}

// ── CHARTS ────────────────────────
function baseOptions(yGrid = true) {
    return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: yGrid ? {
            x: { grid: { display: false } },
            y: { grid: { color: '#e5ede9' } }
        } : undefined
    }
}

function buildAgeChart(data) {
    new Chart(ageChart.value, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    PALETTE.info,
                    PALETTE.primary,
                    PALETTE.warning,
                    PALETTE.error
                ],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: baseOptions()
    })
}

function buildDiagnosisChart(data) {
    new Chart(diagnosisChart.value, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    PALETTE.primary,
                    PALETTE.success,
                    PALETTE.warning,
                    PALETTE.info,
                    PALETTE.error
                ]
            }]
        }
    })
}

function buildOutcomeChart(data) {
    new Chart(outcomeChart.value, {
        type: 'pie',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    PALETTE.info,
                    PALETTE.success,
                    PALETTE.error,
                    PALETTE.warning
                ]
            }]
        }
    })
}

// ⚠️ TEMP TREND (backend later)
function buildTrendChart() {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const values = [5, 8, 4, 10, 6, 9, 7]

    if (trendChartInstance) trendChartInstance.destroy()

    trendChartInstance = new Chart(trendChart.value, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                borderColor: '#2EAA5C',
                backgroundColor: 'rgba(46,170,92,0.08)',
                borderWidth: 2.5,
                pointBackgroundColor: '#2EAA5C',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4,
            }]
        },
        options: baseOptions()
    })
}

// ── LIFECYCLE ─────────────────────
onMounted(() => {
    loadDashboard()
})

watch(trendRange, () => buildTrendChart())
</script>

<style scoped>
/* ── Root ──────────────────────────────────────────────────────────── */
.dash-root {
    min-height: 100vh;
    background: #f4f7f5;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
}

/* ── Skeleton overlay ──────────────────────────────────────────────── */
.skeleton-overlay {
    margin-top:80px;
    position: fixed;
    inset: 0;
    background: #f4f7f5;
    z-index: 50;
    padding: 80px 32px 32px;
    overflow: hidden;
}

.skeleton-inner {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.skel {
    background: linear-gradient(90deg, #e5ede9 25%, #d4e3da 50%, #e5ede9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 16px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

.skel-header {
    height: 48px;
    width: 260px;
}

.skel-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.skel-kpi {
    height: 96px;
}

.skel-body {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 24px;
}

.skel-left {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.skel-right {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.skel-chart-sm {
    height: 280px;
    flex: 1;
}

.skel-chart-lg {
    height: 300px;
}

.skel-mini {
    height: 88px;
}

.skel-recent {
    height: 360px;
    flex: 1;
}

/* fade transition */
.fade-leave-active {
    transition: opacity 0.35s ease;
}

.fade-leave-to {
    opacity: 0;
}



@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin 0.9s linear infinite;
    display: inline-block;
}

/* ── Page body ─────────────────────────────────────────────────────── */
.dash-body {
    flex: 1;
    padding: 32px;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
}

@media (max-width: 640px) {
    .dash-body {
        padding: 20px 16px;
        gap: 20px;
    }
}

/* ── Page title ────────────────────────────────────────────────────── */
.page-title h1 {
    font-size: 26px;
    font-weight: 800;
    color: #1B5E35;
    letter-spacing: -0.5px;
    margin: 0 0 4px;
}

.page-title p {
    font-size: 13px;
    color: #6b7c73;
    margin: 0;
}

/* ── KPI grid ──────────────────────────────────────────────────────── */
.kpi-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

@media (min-width: 768px) {
    .kpi-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.kpi-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
    border: 1.5px solid #f0f5f2;
    transition: transform 0.15s, box-shadow 0.15s;
}

.kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.09);
}

.kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
}

.kpi-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.kpi-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #8aab97;
}

.kpi-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.8px;
    line-height: 1;
}

/* KPI color variants */
.kpi-primary .kpi-icon {
    background: rgba(87, 13, 248, 0.08);
    color: #570df8;
}

.kpi-primary .kpi-value {
    color: #570df8;
}

.kpi-success .kpi-icon {
    background: rgba(46, 170, 92, 0.10);
    color: #2EAA5C;
}

.kpi-success .kpi-value {
    color: #2EAA5C;
}

.kpi-info .kpi-icon {
    background: rgba(0, 181, 255, 0.10);
    color: #00b5ff;
}

.kpi-info .kpi-value {
    color: #00b5ff;
}

.kpi-danger .kpi-icon {
    background: rgba(255, 88, 97, 0.10);
    color: #ff5861;
}

.kpi-danger .kpi-value {
    color: #ff5861;
}

/* ── Main grid ─────────────────────────────────────────────────────── */
.main-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
}

@media (min-width: 1024px) {
    .main-grid {
        grid-template-columns: 1fr 320px;
    }
}

/* ── Columns ───────────────────────────────────────────────────────── */
.col-left,
.col-right {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ── Dash cards ────────────────────────────────────────────────────── */
.dash-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 24px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
    border: 1.5px solid #f0f5f2;
}

.card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
}

.card-head h2 {
    font-size: 15px;
    font-weight: 700;
    color: #1a2e24;
    margin: 0;
    letter-spacing: -0.2px;
}

/* ── Chart pair ────────────────────────────────────────────────────── */
.chart-pair {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

@media (min-width: 640px) {
    .chart-pair {
        grid-template-columns: 1fr 1fr;
    }
}

/* ── Trend toggle ──────────────────────────────────────────────────── */
.toggle-group {
    display: flex;
    background: #f3f7f5;
    border-radius: 9px;
    padding: 3px;
    gap: 2px;
}

.toggle-btn {
    padding: 5px 14px;
    border: none;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    background: transparent;
    color: #6b7c73;
    transition: background 0.15s, color 0.15s;
}

.toggle-btn--active {
    background: #2EAA5C;
    color: #fff;
}

/* ── Mini KPIs ─────────────────────────────────────────────────────── */
.mini-kpi-stack {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

@media (min-width: 1024px) {
    .mini-kpi-stack {
        grid-template-columns: 1fr;
    }
}

.mini-kpi {
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 20px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
    border: 1.5px solid #f0f5f2;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.mini-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #8aab97;
}

.mini-value {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1;
}

.mini-value small {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    opacity: 0.7;
}

.mini-value--warn {
    color: #d97706;
}

.mini-value--sec {
    color: #1B7A3E;
}

/* ── Recent patients ───────────────────────────────────────────────── */
.recent-card {
    flex: 1;
}

.recent-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.recent-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 8px;
    border-radius: 12px;
    transition: background 0.15s;
    cursor: default;
}

.recent-item:hover {
    background: #f4f7f5;
}

.patient-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.patient-info {
    flex: 1;
    min-width: 0;
}

.patient-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a2e24;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.patient-sub {
    font-size: 11px;
    color: #8aab97;
    margin: 2px 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.patient-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    flex-shrink: 0;
}

.outcome-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.badge--success {
    background: rgba(46, 170, 92, 0.12);
    color: #1B7A3E;
}

.badge--info {
    background: rgba(0, 181, 255, 0.12);
    color: #0077a8;
}

.badge--warn {
    background: rgba(251, 146, 60, 0.15);
    color: #c2670a;
}

.badge--danger {
    background: rgba(255, 88, 97, 0.12);
    color: #c0282f;
}

.badge--ghost {
    background: #f0f5f2;
    color: #8aab97;
}

.patient-date {
    font-size: 10px;
    color: #b0c4bb;
    margin: 0;
}

/* ── View all button ───────────────────────────────────────────────── */
.view-all-btn {
    font-size: 12px;
    font-weight: 600;
    color: #2EAA5C;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
}

.view-all-btn:hover {
    color: #1B5E35;
    text-decoration: underline;
}

/* ── Empty state ───────────────────────────────────────────────────── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 32px;
    color: #b0c4bb;
    font-size: 13px;
}

.empty-state i {
    font-size: 28px;
}
</style>