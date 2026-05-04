<template>
    <dialog class="modal" ref="dialogRef">
        <div class="modal-box preview-box">
            <div class="page-title">
                <h1>{{ viewOnly ? "Patient Record" : (isEdit ? "Review Patient Update" : "Review Patient Entry") }}</h1>
                <p>Confirm the information below before submitting</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- BASIC INFO -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Basic Info</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Full Name (NID)</label>
                            <div class="preview-value">{{ form.basic_info?.name || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">NID Number</label>
                            <div class="preview-value">{{ form.basic_info?.nid || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Hospital Reg No</label>
                            <div class="preview-value">{{ form.basic_info?.reg_no || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Sex</label>
                            <div class="preview-value">{{ form.basic_info?.sex || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Age</label>
                            <div class="preview-value">{{ form.basic_info?.age ?? "—" }}</div>
                        </div>
                        <div class="field md:col-span-2">
                            <label class="field-label">Mobile No</label>
                            <div class="preview-value">{{ form.basic_info?.mobile || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Address</label>
                            <div class="preview-value">{{ form.basic_info?.address || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- ADMISSION -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Admission</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Unit</label>
                            <div class="preview-value">{{ form.admission?.unit || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Ward & Bed No</label>
                            <div class="preview-value">{{ form.admission?.ward || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Admission Date</label>
                            <div class="preview-value">{{ form.admission?.admission_date || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Discharge Date</label>
                            <div class="preview-value">{{ form.admission?.discharge_date || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Chief Complaint</label>
                            <div class="preview-value">{{ form.admission?.chief_complaint || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- COMORBIDITY -->
                <div class="card-panel">
                    <div class="card-head">
                        <h2>Comorbidity</h2>
                    </div>
                    <div class="preview-list">
                        <span v-for="(c, i) in computedComorbidity" :key="i" class="chip">{{ c }}</span>
                        <span v-if="!computedComorbidity?.length" class="muted">—</span>
                    </div>
                </div>

                <!-- HISTORY -->
                <div class="card-panel lg:col-span-2">
                    <div class="card-head">
                        <h2>History</h2>
                    </div>
                    <div class="space-y-3">
                        <div class="preview-block">{{ form.history?.past_illness || "—" }}</div>
                        <div class="preview-block">{{ form.history?.drug_history || "—" }}</div>
                        <div class="preview-block">{{ form.history?.family_history || "—" }}</div>
                    </div>
                </div>

                <!-- EXAMINATION -->
                <div class="card-panel lg:col-span-2">
                    <div class="card-head">
                        <h2>Examination</h2>
                    </div>
                    <div class="space-y-3">
                        <div class="preview-block">{{ form.examination?.general || "—" }}</div>
                        <div class="preview-block">{{ form.examination?.systemic || "—" }}</div>
                    </div>
                </div>

                <!-- NEUROLOGICAL EXAMINATION -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Neurological Examination</h2>
                    </div>
                    <div class="form-grid">
                        <div class="preview-value">{{ form.neuro_exam?.gcs || "—" }}</div>
                        <div class="preview-value">{{ form.neuro_exam?.motor_upper ?? "—" }}</div>
                        <div class="preview-value">{{ form.neuro_exam?.motor_lower ?? "—" }}</div>
                        <div class="preview-value">{{ form.neuro_exam?.sensory || "—" }}</div>

                        <div class="col-span-full">
                            <p class="field-label">Cranial Nerves</p>
                            <div class="preview-value">
                                {{ form.neuro_exam.cranial_nerves || "—" }}
                                <span v-if="form.neuro_exam.cranial_nerves_detail">
                                    — {{ form.neuro_exam?.cranial_nerves_detail }}
                                </span>
                            </div>
                        </div>

                        <div class="col-span-full">
                            <p class="field-label">Reflexes</p>
                            <div class="preview-value">{{ form.neuro_exam?.reflexes || "—" }}</div>
                        </div>

                        <div class="preview-value">{{ form.neuro_exam?.plantar || "—" }}</div>

                        <div class="col-span-full">
                            <p class="field-label">Coordination and Gait</p>
                            <div class="preview-list">
                                <span v-for="(c, i) in form.neuro_exam.coordination" :key="i" class="chip">{{ c
                                    }}</span>
                                <span v-if="!form.neuro_exam.coordination?.length" class="muted">—</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- INVESTIGATIONS -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Investigations</h2>
                    </div>

                    <div class="space-y-4">
                        <p class="field-label">Imaging Studies</p>
                        <div class="form-grid">
                            <div class="preview-value">CT Scan: {{ form.investigations?.ct_scan || "—" }}</div>
                            <div class="preview-value">MRI: {{ form.investigations?.mri || "—" }}</div>
                            <div class="preview-value">MRA: {{ form.investigations?.mra || "—" }}</div>
                            <div class="preview-value">DSA: {{ form.investigations?.dsa || "—" }}</div>
                            <div class="preview-value">EEG: {{ form.investigations?.eeg || "—" }}</div>
                            <div class="preview-value">EMG: {{ form.investigations?.emg || "—" }}</div>
                            <div class="preview-value">NCS: {{ form.investigations?.ncs || "—" }}</div>
                            <div class="preview-value">Other: {{ form.investigations?.imaging_other || "—" }}</div>
                        </div>

                        <div class="divider"></div>

                        <p class="field-label">Laboratory Tests</p>
                        <div class="form-grid">
                            <div class="preview-value">CBC: {{ form.investigations?.cbc || "—" }}</div>
                            <div class="preview-value">Electrolytes: {{ form.investigations?.electrolytes || "—" }}</div>
                            <div class="preview-value">Glucose: {{ form.investigations?.glucose || "—" }}</div>
                            <div class="preview-value">Creatinine: {{ form.investigations?.creatinine || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- DIAGNOSIS -->
                <div class="card-panel">
                    <div class="card-head">
                        <h2>Diagnosis</h2>
                    </div>
                    <div class="space-y-3">
                        <div class="preview-block">{{ form.diagnosis?.primary || "—" }}</div>
                        <div class="preview-block">{{ form.diagnosis?.secondary || "—" }}</div>
                    </div>
                </div>

                <!-- TREATMENT -->
                <div class="card-panel lg:col-span-2">
                    <div class="card-head">
                        <h2>Treatment</h2>
                    </div>
                    <div class="space-y-3">
                        <div class="preview-block">{{ form.treatment?.medications || "—" }}</div>
                        <div class="preview-block">{{ form.treatment?.plan || "—" }}</div>
                    </div>
                </div>

                <!-- OUTCOME -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Outcome</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Outcome</label>
                            <div class="preview-value">{{ form.outcome?.status || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Follow-up Date</label>
                            <div class="preview-value">{{ form.outcome?.followup_date || "—" }}</div>
                        </div>
                        <div class="col-span-full">
                            <p class="field-label">Condition at Follow-up</p>
                            <div class="preview-list">
                                <span v-for="(c, i) in form.outcome?.followup_condition" :key="i" class="chip">{{ c
                                    }}</span>
                                <span v-if="!form.outcome?.followup_condition?.length" class="muted">—</span>
                            </div>
                        </div>

                        <div class="preview-block col-span-full">{{ form.outcome?.resolved_issues || "—" }}</div>
                        <div class="preview-block col-span-full">{{ form.outcome?.unresolved_problems || "—" }}</div>
                        <div class="preview-block col-span-full">{{ form.outcome?.comment || "—" }}</div>
                    </div>
                </div>

                <!-- FILES -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>File Uploads</h2>
                    </div>
                    <div class="thumb-grid">
                        <img v-for="(f, i) in mergedFiles" :key="i" :src="f" class="thumb" />
                        <span v-if="!mergedFiles?.length" class="muted">—</span>
                    </div>
                </div>
            </div>

            <div class="modal-action">
                <button v-if="!viewOnly" class="btn-primary" @click="$emit('confirm')">
                    {{ isEdit ? "Confirm Update" : "Confirm Submit" }}
                </button>
                <button class="btn-ghost" @click="$emit('close')">Close</button>
            </div>
        </div>

        <form method="dialog" class="modal-backdrop">
            <button @click="$emit('close')">close</button>
        </form>
    </dialog>
</template>

<script>
export default {
    name: "PatientPreview",
    props: {
        form: { type: Object, required: true },
        computedComorbidity: { type: Array, default: () => [] },
        mergedFiles: { type: Array, default: () => [] },
        isEdit: { type: Boolean, default: false },
        viewOnly: { type: Boolean, default: false }
    },
    methods: {
        open() {
            this.$refs.dialogRef.showModal()
        },
        close() {
            this.$refs.dialogRef.close()
        }
    }
}
</script>

<style scoped>
.modal-box.preview-box {
    max-width: 1200px;
    background: #f4f7f5;
    padding: 24px;
    border-radius: 18px;
}

.page-title h1 {
    font-size: 24px;
    font-weight: 800;
    color: #1B5E35;
    margin: 0 0 4px;
}

.page-title p {
    font-size: 13px;
    color: #6b7c73;
    margin: 0 0 12px;
}

.card-panel {
    background: #ffffff;
    border-radius: 18px;
    padding: 20px;
    border: 1.5px solid #f0f5f2;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}

.card-head {
    margin-bottom: 12px;
}

.card-head h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1a2e24;
    margin: 0;
}

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374040;
    margin-bottom: 6px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 12px;
}

@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (min-width: 1024px) {
    .form-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.preview-value,
.preview-block {
    background: #f3f7f5;
    border: 1.5px solid #dde8e3;
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 14px;
    color: #1a2e24;
}

.preview-block {
    min-height: 90px;
    white-space: pre-wrap;
}

.preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip {
    background: #e7f3ec;
    color: #1a2e24;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid #d6eadf;
}

.muted {
    color: #8b9a92;
    font-size: 13px;
}

.thumb {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid #e5ede9;
}

.thumb-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.btn-primary {
    height: 48px;
    background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 14px;
    padding: 0 18px;
    cursor: pointer;
}

.btn-ghost {
    height: 48px;
    border: 1.5px solid #dde8e3;
    background: #fff;
    color: #1a2e24;
    border-radius: 14px;
    padding: 0 16px;
}
</style>

