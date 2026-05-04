<template>
    <div class="records-root">

        <!-- ── PAGE BODY ── -->
        <div class="page-body">
            <!-- SKELETON -->
            <transition name="fade" v-if="loading">
                <div v-if="loading" class="skeleton-wrap">
                    <div class="skel skel-search"></div>
                    <div class="skel skel-pills"></div>
                    <div class="skel skel-card" v-for="n in 4" :key="n"></div>
                </div>
            </transition>

            <template v-if="!loading">

                <!-- SEARCH + UNIT FILTER -->
                <div class="search-filter-row">
                    <div class="search-wrap">
                        <i class="ph ph-magnifying-glass search-icon"></i>
                        <input class="search-input" v-model="search" placeholder="Search by name, NID, or diagnosis…" />
                        <button v-if="search" class="search-clear" @click="search = ''">
                            <i class="ph ph-x"></i>
                        </button>
                    </div>

                    <div class="dropdown dropdown-end unit-filter">
                        <label tabindex="0" class="btn btn-ghost unit-btn">
                            <i class="ph ph-funnel-simple"></i>
                            {{ selectedUnit || 'All Units' }}
                        </label>
                        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a @click="selectedUnit = ''">All Units</a></li>
                            <li v-for="u in units" :key="u"><a @click="selectedUnit = u">{{ u }}</a></li>
                        </ul>
                    </div>
                </div>

                <!-- FILTER PILLS -->
                <div class="filter-row">
                    <button v-for="f in filters" :key="f.value" class="pill"
                        :class="{ active: activeFilter === f.value }" @click="activeFilter = f.value">
                        {{ f.label }}
                        <span class="pill-count">{{ countFor(f.value) }}</span>
                    </button>
                </div>

                <!-- COUNT -->
                <p class="count-label">
                    Showing <strong>{{ filteredPatients.length }}</strong> of
                    <strong>{{ patients.length }}</strong> patients
                </p>

                <!-- ── MOBILE: CARDS ── -->
                <div class="cards-list">
                    <div v-for="(p, i) in filteredPatients" :key="p.id" class="patient-card"
                        :style="{ animationDelay: i * 40 + 'ms' }">
                        <div class="card-top">
                            <div class="card-meta-head">
                                <div class="card-name">{{ p.basic_info?.name }}</div>
                                <div class="card-nid">{{ p.basic_info?.mobile }}</div>
                            </div>
                            <span class="badge" :class="outcomeBadgeClass(p.outcome?.status)">
                                {{ p.outcome?.status || 'Active' }}
                            </span>
                        </div>

                        <div class="card-meta">
                            <div class="meta-item">
                                <span class="meta-label">Age</span>
                                <span class="meta-val">{{ p.basic_info?.age }} yrs</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Sex</span>
                                <span class="meta-val">{{ p.basic_info?.sex || '—' }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Unit</span>
                                <span class="meta-val">{{ p.admission?.unit || '—' }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Diagnosis</span>
                                <span class="meta-val">{{ p.diagnosis?.primary || '—' }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Admitted</span>
                                <span class="meta-val">{{ formatDate(p.admission?.admission_date) }}</span>
                                <span class="meta-time">{{ formatTime(p.admission?.admission_date) }}</span>
                            </div>
                        </div>

                        <div class="card-actions">
                            <button class="btn-action btn-view" @click="openPreview(p)">
                                <i class="ph ph-eye"></i> View
                            </button>
                            <button class="btn-action btn-edit" @click="editPatient(p.id)">
                                <i class="ph ph-pencil"></i> Edit
                            </button>
                            <button class="btn-action btn-del" @click="confirmDelete(p)">
                                <i class="ph ph-trash"></i> Delete
                            </button>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-if="!filteredPatients.length" class="empty-state">
                        <div class="empty-icon"><i class="ph ph-clipboard-text"></i></div>
                        <h3>No records found</h3>
                        <p>Try a different search or filter</p>
                    </div>
                </div>

                <!-- ── DESKTOP: TABLE ── -->
                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Sex</th>
                                <th>Unit</th>
                                <th>Age</th>
                                <th>Diagnosis</th>
                                <th>Admitted</th>
                                <th>Outcome</th>
                                <th style="text-align:right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in filteredPatients" :key="p.id">
                                <td>
                                    <div class="td-patient">
                                        <div>
                                            <div class="td-name">{{ p.basic_info?.name }}</div>
                                            <div class="td-nid">{{ p.basic_info?.mobile }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ p.basic_info?.sex || '—' }}</td>
                                <td>{{ p.admission?.unit || '—' }}</td>
                                <td>{{ p.basic_info?.age }}</td>
                                <td>{{ p.diagnosis?.primary || '—' }}</td>
                                <td>
                                    <div>{{ formatDate(p.admission?.admission_date) }}</div>
                                    <div class="td-time">{{ formatTime(p.admission?.admission_date) }}</div>
                                </td>
                                <td>
                                    <span class="badge" :class="outcomeBadgeClass(p.outcome?.status)">
                                        {{ p.outcome?.status || 'Active' }}
                                    </span>
                                </td>
                                <td>
                                    <div class="td-actions">
                                        <button class="tbl-btn btn-view" @click="openPreview(p)">View</button>
                                        <button class="tbl-btn tbl-edit" @click="editPatient(p.id)">Edit</button>
                                        <button class="tbl-btn tbl-del" @click="confirmDelete(p)">Delete</button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="!filteredPatients.length">
                                <td colspan="8">
                                    <div class="empty-state">
                                        <div class="empty-icon"><i class="ph ph-clipboard-text"></i></div>
                                        <h3>No records found</h3>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <Preview ref="previewDialog" :form="previewForm" :computedComorbidity="previewComorbidity"
                    :mergedFiles="previewFiles" :isEdit="true" @close="closePreview" :viewOnly="true" />

            </template>
            <!-- DELETE MODAL -->
            <dialog class="modal" v-if="showModal">
                <div class="modal-box">

                    <!-- ICON -->
                    <div class="text-center mb-4">
                        <i class="ph ph-trash text-error text-4xl"></i>
                    </div>

                    <!-- TITLE -->
                    <h3 class="font-bold text-lg text-center">
                        Delete Patient Record
                    </h3>

                    <!-- BODY -->
                    <p class="py-4 text-center">
                        Are you sure you want to permanently delete the record for
                        <strong>{{ selected?.basic_info?.name }}</strong>?
                        <br />
                        <span class="text-error font-medium">This action cannot be undone.</span>
                    </p>

                    <!-- ACTIONS -->
                    <div class="modal-action justify-center gap-3">

                        <button class="btn" @click="closeModal">
                            Cancel
                        </button>

                        <button class="btn btn-error text-white" @click="deletePatient" :disabled="deleting">
                            <span v-if="!deleting">Delete</span>

                            <span v-else class="flex items-center gap-2">
                                <i class="ph ph-spinner spin"></i>
                                Deleting…
                            </span>
                        </button>

                    </div>
                </div>

                <!-- BACKDROP CLICK -->
                <form method="dialog" class="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>

    </div>
</template>

<script>
import { Notify } from '@/utils/notify'
import Preview from './preview.vue'

export default {
    name: 'Records',
    components: { Preview },

    data() {
        return {
            patients: [],
            search: '',
            activeFilter: 'all',
            selected: null,
            showModal: false,
            loading: false,
            deleting: false,
            selectedUnit: '',

            previewForm: {},
            previewComorbidity: [],
            previewFiles: [],

            filters: [
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'Active' },
                { label: 'Improved & Discharged', value: 'Improved and Discharged' },
                { label: 'Referred', value: 'Referred' },
                { label: 'Deceased', value: 'Deceased' },
            ],
            units: ['Green', 'Red', 'Orange', 'Yellow', 'Blue', 'Violet', 'White'],
            previewForm: {
                basic_info: {},
                admission: {},
                history: {},
                examination: {},
                neuro_exam: {},
                investigations: {},
                diagnosis: {},
                treatment: {},
                outcome: {},
                comorbidity: [],
                comorbidity_neuropathy_type: "",
                comorbidity_other: "",
                patient_photo: "",
                discharge_paper: "",
                files: []
            },
        }
    },

    computed: {
        filteredPatients() {
            let list = this.patients

            if (this.activeFilter !== 'all') {
                list = list.filter(p =>
                    (p.outcome?.status || 'Active') === this.activeFilter
                )
            }

            if (this.selectedUnit) {
                list = list.filter(p => (p.admission?.unit || '') === this.selectedUnit)
            }

            if (this.search.trim()) {
                const q = this.search.toLowerCase()
                list = list.filter(p =>
                    p.basic_info?.name?.toLowerCase().includes(q) ||
                    p.basic_info?.mobile?.includes(q) ||
                    p.diagnosis?.primary?.toLowerCase().includes(q)
                )
            }

            return list
        }
    },

    methods: {
        async loadPatients() {
            try {
                this.loading = true
                const res = await this.$api.get('/patients')
                this.patients = res.data
            } catch (err) {
                Notify.error('Failed to load patients')
            } finally {
                this.loading = false
            }
        },

        openPreview(p) {
            const form = {
                basic_info: p.basic_info || {},
                admission: p.admission || {},
                history: p.history || {},
                examination: p.examination || {},
                neuro_exam: p.neuro_exam || {},
                investigations: p.investigations || {},
                diagnosis: p.diagnosis || {},
                treatment: p.treatment || {},
                outcome: p.outcome || {},
                comorbidity: p.comorbidity || [],
                comorbidity_neuropathy_type: '',
                comorbidity_other: '',
                patient_photo: '',
                discharge_paper: '',
                files: []
            }

            const files = p.outcome?.files || []
            form.files = files
            form.patient_photo = files[0] || ''
            form.discharge_paper = files[1] || ''

            let comorbidity = [...(form.comorbidity || [])]

            this.previewForm = form
            this.previewComorbidity = comorbidity
            this.previewFiles = files
            this.$refs.previewDialog.open()
        },

        closePreview() {
            this.$refs.previewDialog.close()
        },

        countFor(filterValue) {
            if (filterValue === 'all') return this.patients.length
            return this.patients.filter(p =>
                (p.outcome?.status || 'Active') === filterValue
            ).length
        },

        editPatient(id) {
            this.$router.push(`/entry/${id}`)
        },

        confirmDelete(p) {
            this.selected = p
            this.showModal = true
        },

        closeModal() {
            this.showModal = false
            this.selected = null
        },

        async deletePatient() {
            try {
                this.deleting = true
                await this.$api.delete(`/patients/${this.selected.id}`)
                this.patients = this.patients.filter(p => p.id !== this.selected.id)
                Notify.info('Patient record deleted')
                this.closeModal()
            } catch (err) {
                Notify.error('Delete failed. Please try again.')
            } finally {
                this.deleting = false
            }
        },

        formatDate(date) {
            if (!date) return '—'
            return new Date(date).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            })
        },

        formatTime(date) {
            if (!date) return ''
            return new Date(date).toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit'
            })
        },

        outcomeBadgeClass(status) {
            return {
                Active: 'badge--success',
                'Improved and Discharged': 'badge--info',
                Referred: 'badge--warn',
                Deceased: 'badge--danger',
            }[status] ?? 'badge--success'
        }
    },

    mounted() {
        this.loadPatients()
    }
}
</script>

<style scoped>
/* ── Root ── */
.btn-view {
    background: rgba(0, 181, 255, .10);
    color: #0077a8;
    border: 1.5px solid rgba(0, 181, 255, .2);
}

.btn-view:hover {
    background: rgba(0, 181, 255, .18);
}

.tbl-view {
    background: rgba(0, 181, 255, .10);
    color: #0077a8;
    border: 1.5px solid rgba(0, 181, 255, .2);
}

.tbl-view:hover {
    background: rgba(0, 181, 255, .18);
}

.search-filter-row {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    align-items: center;
}

.unit-filter .unit-btn {
    height: 48px;
    border-radius: 14px;
    border: 1.5px solid #dde8e3;
    background: #fff;
    color: #1a2e24;
    font-weight: 700;
    font-size: 13px;
    display: inline-flex;
    gap: 6px;
    align-items: center;
}

.meta-time {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
    display: block;
}

.td-time {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
}

.records-root {
    min-height: 100vh;
    background: #f4f7f5;
    font-family: 'Plus Jakarta Sans', 'Inter', 'Segoe UI', sans-serif;
    display: flex;
    flex-direction: column;
}

/* ── Top bar ── */
.topbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
    border-bottom: 1px solid #dde8e3;
    height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.topbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
}

.brand-dot {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-name {
    font-size: 16px;
    font-weight: 800;
    color: #1B5E35;
}

.btn-new {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity .18s, transform .15s;
    white-space: nowrap;
}

.btn-new--sm {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 9px;
}

.btn-new:hover {
    opacity: .9;
    transform: translateY(-1px);
}

/* ── Page body ── */
.page-body {
    flex: 1;
    padding: 16px;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (min-width: 700px) {
    .page-body {
        padding: 24px 28px;
    }
}

/* ── Skeleton ── */
.skeleton-wrap {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.skel {
    background: linear-gradient(90deg, #e5ede9 25%, #d4e3da 50%, #e5ede9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 14px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0
    }

    100% {
        background-position: -200% 0
    }
}

.skel-search {
    height: 48px;
}

.skel-pills {
    height: 36px;
}

.skel-card {
    height: 130px;
}

.fade-leave-active {
    transition: opacity .3s ease;
}

.fade-leave-to {
    opacity: 0;
}

/* ── Search ── */
.search-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 14px;
    color: #8aab97;
    pointer-events: none;
    font-size: 16px;
}

.search-input {
    width: 100%;
    height: 48px;
    padding: 0 42px 0 44px;
    background: #fff;
    border: 1.5px solid #dde8e3;
    border-radius: 14px;
    font-size: 14px;
    font-family: inherit;
    color: #1a2e24;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
}

.search-input::placeholder {
    color: #8aab97;
}

.search-input:focus {
    border-color: #2EAA5C;
    box-shadow: 0 0 0 3px rgba(46, 170, 92, .12);
}

.search-clear {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    color: #8aab97;
    font-size: 14px;
    display: flex;
    align-items: center;
    transition: color .15s;
}

.search-clear:hover {
    color: #1a2e24;
}

/* ── Filter pills ── */
.filter-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
}

.filter-row::-webkit-scrollbar {
    display: none;
}

.pill {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    border: 1.5px solid #dde8e3;
    background: #fff;
    color: #6b7c73;
    cursor: pointer;
    transition: all .15s;
    white-space: nowrap;
}

.pill.active {
    background: #2EAA5C;
    color: #fff;
    border-color: #2EAA5C;
}

.pill-count {
    background: rgba(0, 0, 0, .1);
    border-radius: 10px;
    padding: 1px 7px;
    font-size: 11px;
}

.pill.active .pill-count {
    background: rgba(255, 255, 255, .25);
}

/* ── Count label ── */
.count-label {
    font-size: 12px;
    color: #8aab97;
    margin: 0;
}

.count-label strong {
    color: #1B5E35;
}

/* ── Mobile cards ── */
.cards-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

@media (min-width: 700px) {
    .cards-list {
        display: none;
    }
}

.patient-card {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #dde8e3;
    padding: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: fadeUp .25s ease both;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(8px)
    }

    to {
        opacity: 1;
        transform: none
    }
}

.card-top {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar--sm {
    width: 34px;
    height: 34px;
    font-size: 13px;
    border-radius: 10px;
}

.card-meta-head {
    flex: 1;
    min-width: 0;
}

.card-name {
    font-size: 15px;
    font-weight: 700;
    color: #1a2e24;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.card-nid {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
}

.card-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    background: #f4f7f5;
    border-radius: 12px;
    padding: 12px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.meta-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #8aab97;
}

.meta-val {
    font-size: 13px;
    font-weight: 600;
    color: #1a2e24;
}

.card-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    flex: 1;
    height: 42px;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: opacity .15s, transform .12s;
}

.btn-action:active {
    transform: scale(.97);
}

.btn-edit {
    background: rgba(46, 170, 92, .10);
    color: #1B7A3E;
    border: 1.5px solid rgba(46, 170, 92, .2);
}

.btn-edit:hover {
    background: rgba(46, 170, 92, .18);
}

.btn-del {
    background: rgba(255, 88, 97, .08);
    color: #ff5861;
    border: 1.5px solid rgba(255, 88, 97, .18);
}

.btn-del:hover {
    background: rgba(255, 88, 97, .14);
}

/* ── Desktop table ── */
.table-wrap {
    display: none;
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #dde8e3;
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}

@media (min-width: 700px) {
    .table-wrap {
        display: block;
    }
}

table {
    width: 100%;
    border-collapse: collapse;
}

thead tr {
    background: #f9fbfa;
}

thead th {
    padding: 14px 18px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .6px;
    color: #8aab97;
    text-align: left;
    border-bottom: 1.5px solid #dde8e3;
}

tbody tr {
    border-bottom: 1px solid #f0f5f2;
    transition: background .14s;
}

tbody tr:last-child {
    border-bottom: none;
}

tbody tr:hover {
    background: #f9fbfa;
}

td {
    padding: 14px 18px;
    font-size: 13px;
    vertical-align: middle;
}

.td-patient {
    display: flex;
    align-items: center;
    gap: 10px;
}

.td-name {
    font-weight: 700;
    color: #1a2e24;
}

.td-nid {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
}

.td-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.tbl-btn {
    padding: 7px 16px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s;
    border: none;
}

.tbl-edit {
    background: rgba(46, 170, 92, .10);
    color: #1B7A3E;
    border: 1.5px solid rgba(46, 170, 92, .2);
}

.tbl-edit:hover {
    background: rgba(46, 170, 92, .18);
}

.tbl-del {
    background: rgba(255, 88, 97, .08);
    color: #ff5861;
    border: 1.5px solid rgba(255, 88, 97, .18);
}

.tbl-del:hover {
    background: rgba(255, 88, 97, .14);
}

/* ── Badges ── */
.badge {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: .4px;
    white-space: nowrap;
}

.badge--success {
    background: rgba(46, 170, 92, .12);
    color: #1B7A3E;
}

.badge--info {
    background: rgba(0, 181, 255, .12);
    color: #0077a8;
}

.badge--warn {
    background: rgba(245, 158, 11, .15);
    color: #92400e;
}

.badge--danger {
    background: rgba(255, 88, 97, .12);
    color: #c0282f;
}

/* ── Empty state ── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 20px;
    gap: 10px;
    color: #8aab97;
}

.empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: rgba(46, 170, 92, .10);
    color: #2EAA5C;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
}

.empty-state h3 {
    font-size: 15px;
    font-weight: 700;
    color: #6b7c73;
}

.empty-state p {
    font-size: 13px;
}





.btn-cancel {
    flex: 1;
    height: 48px;
    border-radius: 12px;
    background: #f4f7f5;
    border: 1.5px solid #dde8e3;
    font-size: 14px;
    font-weight: 700;
    color: #6b7c73;
    cursor: pointer;
    font-family: inherit;
    transition: background .15s;
}

.btn-cancel:hover {
    background: #eaf0ed;
}

.btn-confirm-del {
    flex: 1;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ff5861, #d93030);
    border: none;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
    transition: opacity .15s, transform .12s;
}

.btn-confirm-del:hover:not(:disabled) {
    opacity: .9;
}

.btn-confirm-del:active:not(:disabled) {
    transform: scale(.97);
}

.btn-confirm-del:disabled {
    opacity: .55;
    cursor: not-allowed;
}


/* spinner */
.loading-row {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.spin {
    animation: spin .9s linear infinite;
    display: inline-block;
}
</style>