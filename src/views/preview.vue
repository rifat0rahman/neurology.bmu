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
                        <h2>Patient Information</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Patient ID</label>
                            <div class="preview-value">{{ form.basic_info?.patient_id || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Full Name</label>
                            <div class="preview-value">{{ form.basic_info?.name || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">NID</label>
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
                        <div class="field">
                            <label class="field-label">Date of Birth</label>
                            <div class="preview-value">{{ form.basic_info?.dob || "—" }}</div>
                        </div>
                        <div class="field">
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
                        <h2>Admission Information</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Admission No</label>
                            <div class="preview-value">{{ form.admission?.admission_no || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Unit</label>
                            <div class="preview-value">{{ form.admission?.unit || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Ward</label>
                            <div class="preview-value">{{ form.admission?.ward || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Bed No</label>
                            <div class="preview-value">{{ form.admission?.bed || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Admission Date</label>
                            <div class="preview-value">{{ form.admission?.admission_date || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Discharge Date</label>
                            <div class="preview-value">{{ form.admission?.discharge_date || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Length of Stay</label>
                            <div class="preview-value">{{ form.admission?.length_of_stay || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Admission Type</label>
                            <div class="preview-value">{{ form.admission?.admission_type || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Chief Complaint</label>
                            <div class="preview-value">{{ form.admission?.chief_complaint || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Presenting Complaints</label>
                            <div class="preview-list">
                                <span v-for="(pc, i) in form.admission?.presenting_complaints" :key="i"
                                    class="chip">{{ pc.complaint || "—" }}<template v-if="pc.duration"> ({{ pc.duration
                                        }})</template></span>
                                <span v-if="!form.admission?.presenting_complaints?.length" class="muted">—</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- DISEASE CATEGORY -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Disease Category</h2>
                    </div>
                    <div class="preview-list">
                        <span v-for="(c, i) in form.disease_category?.categories" :key="i" class="chip">{{ c }}</span>
                        <span v-if="!form.disease_category?.categories?.length" class="muted">—</span>
                    </div>
                    <div class="form-grid" style="margin-top: 12px">
                        <div class="field">
                            <label class="field-label">Primary</label>
                            <div class="preview-value">{{ form.disease_category?.primary || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Secondary</label>
                            <div class="preview-value">{{ form.disease_category?.secondary || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- COMORBIDITY & HISTORY -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Comorbidity &amp; History</h2>
                    </div>
                    <p class="field-label">Comorbidity</p>
                    <div class="preview-list">
                        <span v-for="(c, i) in computedComorbidity" :key="i" class="chip">{{ c }}</span>
                        <span v-if="!computedComorbidity?.length" class="muted">—</span>
                    </div>
                    <div class="form-grid" style="margin-top: 12px">
                        <div class="field col-span-full">
                            <label class="field-label">Past Illness</label>
                            <div class="preview-block">{{ form.history?.past_illness || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Drug History</label>
                            <div class="preview-block">{{ form.history?.drug_history || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Drug Allergy</label>
                            <div class="preview-value">{{ form.history?.drug_allergy || "—" }}<template
                                    v-if="form.history?.drug_allergy_details"> — {{ form.history.drug_allergy_details
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Family History</label>
                            <div class="preview-value">{{ form.history?.family_history_status || "—" }}<template
                                    v-if="form.history?.family_history"> — {{ form.history.family_history }}</template>
                            </div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Other History</label>
                            <div class="preview-block">{{ form.history?.other_history || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- GENERAL & SYSTEMIC EXAM -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>General &amp; Systemic Examination</h2>
                    </div>
                    <p class="field-label">Vitals</p>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">BP</label>
                            <div class="preview-value">{{ form.examination?.vitals?.bp || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Pulse</label>
                            <div class="preview-value">{{ form.examination?.vitals?.pulse || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Temp</label>
                            <div class="preview-value">{{ form.examination?.vitals?.temp || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">RR</label>
                            <div class="preview-value">{{ form.examination?.vitals?.rr || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">SpO₂</label>
                            <div class="preview-value">{{ form.examination?.vitals?.spo2 || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">General Status</label>
                            <div class="preview-value">{{ form.examination?.general_status || "—" }}<template
                                    v-if="form.examination?.general_findings"> — {{ form.examination.general_findings
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Cardiovascular</label>
                            <div class="preview-value">{{ form.examination?.cardiovascular || "—" }}<template
                                    v-if="form.examination?.cardiovascular_findings"> — {{
                                        form.examination.cardiovascular_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Respiratory</label>
                            <div class="preview-value">{{ form.examination?.respiratory || "—" }}<template
                                    v-if="form.examination?.respiratory_findings"> — {{
                                        form.examination.respiratory_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Abdomen</label>
                            <div class="preview-value">{{ form.examination?.abdomen || "—" }}<template
                                    v-if="form.examination?.abdomen_findings"> — {{ form.examination.abdomen_findings
                                    }}</template></div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Other Examination</label>
                            <div class="preview-block">{{ form.examination?.other || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Systemic Summary</label>
                            <div class="preview-block">{{ form.examination?.systemic || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- NEUROLOGICAL EXAMINATION -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Neurological Examination</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">GCS (E/V/M)</label>
                            <div class="preview-value">{{ form.neuro_exam?.gcs_eye ?? "—" }} / {{
                                form.neuro_exam?.gcs_verbal ?? "—" }} / {{ form.neuro_exam?.gcs_motor ?? "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">GCS Total</label>
                            <div class="preview-value">{{ form.neuro_exam?.gcs_total ?? "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Higher Cerebral</label>
                            <div class="preview-value">{{ form.neuro_exam?.higher_cerebral || "—" }}<template
                                    v-if="form.neuro_exam?.higher_cerebral_detail"> — {{
                                        form.neuro_exam.higher_cerebral_detail }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Speech</label>
                            <div class="preview-value">{{ form.neuro_exam?.speech || "—" }}<template
                                    v-if="form.neuro_exam?.speech_other"> — {{ form.neuro_exam.speech_other }}</template>
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label">Cranial Nerves</label>
                            <div class="preview-value">{{ form.neuro_exam?.cranial_nerves || "—" }}<template
                                    v-if="form.neuro_exam?.cranial_nerves_detail"> — {{
                                        form.neuro_exam.cranial_nerves_detail }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Fundus (R/L)</label>
                            <div class="preview-value">{{ form.neuro_exam?.fundus_right || "—" }} / {{
                                form.neuro_exam?.fundus_left || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Sensory</label>
                            <div class="preview-value">{{ form.neuro_exam?.sensory || "—" }}<template
                                    v-if="form.neuro_exam?.sensory_detail"> — {{ form.neuro_exam.sensory_detail
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Cerebellar</label>
                            <div class="preview-value">{{ form.neuro_exam?.cerebellar || "—" }}<template
                                    v-if="form.neuro_exam?.cerebellar_side"> — {{ form.neuro_exam.cerebellar_side
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Gait</label>
                            <div class="preview-value">{{ form.neuro_exam?.gait || "—" }}<template
                                    v-if="form.neuro_exam?.gait_detail"> — {{ form.neuro_exam.gait_detail }}</template>
                            </div>
                        </div>
                        <div class="field">
                            <label class="field-label">Meningeal Signs</label>
                            <div class="preview-value">{{ form.neuro_exam?.meningeal || "—" }}<template
                                    v-if="form.neuro_exam?.meningeal_detail"> — {{ form.neuro_exam.meningeal_detail
                                    }}</template></div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Special Test</label>
                            <div class="preview-block">{{ form.neuro_exam?.special_test || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- CLINICAL SCORES -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Clinical Scores</h2>
                    </div>
                    <div class="preview-list">
                        <span v-for="(s, i) in form.clinical_scores?.selected_scales" :key="i" class="chip">{{ s
                            }}</span>
                        <span v-if="form.clinical_scores?.not_applicable" class="chip">Not applicable</span>
                        <span v-if="!form.clinical_scores?.selected_scales?.length && !form.clinical_scores?.not_applicable"
                            class="muted">—</span>
                    </div>
                </div>

                <!-- INVESTIGATIONS -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Investigations</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">CT Brain</label>
                            <div class="preview-value">{{ form.investigations?.ct_brain_status || "—" }}<template
                                    v-if="form.investigations?.ct_brain_findings"> — {{
                                        form.investigations.ct_brain_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">MRI Brain</label>
                            <div class="preview-value">{{ form.investigations?.mri_brain_status || "—" }}<template
                                    v-if="form.investigations?.mri_brain_findings"> — {{
                                        form.investigations.mri_brain_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">MRI Spine</label>
                            <div class="preview-value">{{ form.investigations?.mri_spine_status || "—" }}<template
                                    v-if="form.investigations?.mri_spine_findings"> — {{
                                        form.investigations.mri_spine_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Vessel Imaging</label>
                            <div class="preview-value">{{ form.investigations?.vessel_imaging || "—" }}<template
                                    v-if="form.investigations?.vessel_findings"> — {{
                                        form.investigations.vessel_findings }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">DSA</label>
                            <div class="preview-value">{{ form.investigations?.dsa_status || "—" }}<template
                                    v-if="form.investigations?.dsa_findings"> — {{ form.investigations.dsa_findings
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">EEG</label>
                            <div class="preview-value">{{ form.investigations?.eeg_status || "—" }}<template
                                    v-if="form.investigations?.eeg_findings"> — {{ form.investigations.eeg_findings
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">NCS</label>
                            <div class="preview-value">{{ form.investigations?.ncs_status || "—" }}<template
                                    v-if="form.investigations?.ncs_findings"> — {{ form.investigations.ncs_findings
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">EMG</label>
                            <div class="preview-value">{{ form.investigations?.emg_status || "—" }}<template
                                    v-if="form.investigations?.emg_findings"> — {{ form.investigations.emg_findings
                                    }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">CBC</label>
                            <div class="preview-value">{{ form.investigations?.cbc || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Electrolytes</label>
                            <div class="preview-value">{{ form.investigations?.electrolytes || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Glucose</label>
                            <div class="preview-value">{{ form.investigations?.glucose || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Creatinine</label>
                            <div class="preview-value">{{ form.investigations?.creatinine || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">LFT</label>
                            <div class="preview-value">{{ form.investigations?.lft || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Lipid Profile</label>
                            <div class="preview-value">{{ form.investigations?.lipid_profile || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">ESR / CRP</label>
                            <div class="preview-value">{{ form.investigations?.esr_crp || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Other Lab</label>
                            <div class="preview-value">{{ form.investigations?.lab_other || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">CSF Status</label>
                            <div class="preview-value">{{ form.investigations?.csf_status || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">CSF Interpretation</label>
                            <div class="preview-block">{{ form.investigations?.csf_interpretation || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Other Investigation</label>
                            <div class="preview-block">{{ form.investigations?.other_investigation || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- DIAGNOSIS -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Diagnosis</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field col-span-full">
                            <label class="field-label">Primary Diagnosis</label>
                            <div class="preview-block">{{ form.diagnosis?.primary || "—" }}</div>
                        </div>
                        <div v-for="(sd, i) in form.diagnosis?.secondary_diagnoses" :key="i" class="field">
                            <label class="field-label">Secondary Diagnosis {{ i + 1 }}</label>
                            <div class="preview-value">{{ sd || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Certainty</label>
                            <div class="preview-value">{{ form.diagnosis?.certainty || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- TREATMENT -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Treatment</h2>
                    </div>
                    <p class="field-label">Medications</p>
                    <div class="preview-list">
                        <span v-for="(m, i) in form.treatment?.medications_list" :key="i" class="chip">{{ m.medication
                            || "—" }}<template v-if="m.dose"> — {{ m.dose }}</template></span>
                        <span v-if="!form.treatment?.medications_list?.length" class="muted">—</span>
                    </div>
                    <p class="field-label" style="margin-top: 12px">Categories</p>
                    <div class="preview-list">
                        <span v-for="(c, i) in form.treatment?.categories" :key="i" class="chip">{{ c }}</span>
                        <span v-if="!form.treatment?.categories?.length" class="muted">—</span>
                    </div>
                    <div class="form-grid" style="margin-top: 12px">
                        <div class="field col-span-full">
                            <label class="field-label">Treatment Plan</label>
                            <div class="preview-block">{{ form.treatment?.plan || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Supportive Care</label>
                            <div class="preview-block">{{ form.treatment?.supportive || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- OUTCOME -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Discharge Outcome</h2>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label class="field-label">Outcome</label>
                            <div class="preview-value">{{ form.outcome?.status || "—" }}</div>
                        </div>
                        <div class="field">
                            <label class="field-label">Discharge Score</label>
                            <div class="preview-value">{{ form.outcome?.discharge_score?.scale || "—" }}<template
                                    v-if="form.outcome?.discharge_score?.score"> — {{
                                        form.outcome.discharge_score.score }}</template></div>
                        </div>
                        <div class="field">
                            <label class="field-label">Follow-up Date</label>
                            <div class="preview-value">{{ form.outcome?.followup_date || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Final Diagnosis</label>
                            <div class="preview-block">{{ form.outcome?.final_diagnosis || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Discharge Plan</label>
                            <div class="preview-block">{{ form.outcome?.discharge_plan || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Condition at Follow-up</label>
                            <div class="preview-list">
                                <span v-for="(c, i) in form.outcome?.followup_condition" :key="i" class="chip">{{ c
                                    }}</span>
                                <span v-if="!form.outcome?.followup_condition?.length" class="muted">—</span>
                            </div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Resolved Issues</label>
                            <div class="preview-block">{{ form.outcome?.resolved_issues || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Unresolved Problems</label>
                            <div class="preview-block">{{ form.outcome?.unresolved_problems || "—" }}</div>
                        </div>
                        <div class="field col-span-full">
                            <label class="field-label">Comment</label>
                            <div class="preview-block">{{ form.outcome?.comment || "—" }}</div>
                        </div>
                    </div>
                </div>

                <!-- FOLLOW-UP -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Follow-up</h2>
                    </div>
                    <div v-for="(fu, i) in form.follow_ups" :key="i" class="followup-card">
                        <h4 class="followup-title">Follow-up Visit {{ i + 1 }}</h4>
                        <div class="form-grid">
                            <div class="field">
                                <label class="field-label">Date</label>
                                <div class="preview-value">{{ fu.date || "—" }}</div>
                            </div>
                            <div class="field">
                                <label class="field-label">Condition</label>
                                <div class="preview-value">{{ fu.condition || "—" }}</div>
                            </div>
                            <div class="field col-span-full">
                                <label class="field-label">Neurological Status</label>
                                <div class="preview-block">{{ fu.neurological_status || "—" }}</div>
                            </div>
                            <div class="field">
                                <label class="field-label">Score</label>
                                <div class="preview-value">{{ fu.score?.scale || "—" }}<template v-if="fu.score?.score">
                                        — {{ fu.score.score }}</template></div>
                            </div>
                            <div class="field col-span-full">
                                <label class="field-label">Current Medication</label>
                                <div class="preview-block">{{ fu.current_medication || "—" }}</div>
                            </div>
                            <div class="field col-span-full">
                                <label class="field-label">Further Plan</label>
                                <div class="preview-block">{{ fu.further_plan || "—" }}</div>
                            </div>
                            <div class="field col-span-full">
                                <label class="field-label">Notes</label>
                                <div class="preview-block">{{ fu.notes || "—" }}</div>
                            </div>
                        </div>
                    </div>
                    <span v-if="!form.follow_ups?.length" class="muted">—</span>
                </div>

                <!-- DOCUMENTS -->
                <div class="card-panel col-span-full">
                    <div class="card-head">
                        <h2>Documents</h2>
                    </div>
                    <div class="preview-list">
                        <span v-for="(d, i) in form.documents" :key="i" class="chip">{{ d.type }}: {{ d.name }}</span>
                        <span v-if="!form.documents?.length" class="muted">—</span>
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

.followup-card {
    border: 1.5px solid #dcebe2;
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 12px;
    background: #fbfdfc;
}

.followup-title {
    font-size: 14px;
    font-weight: 700;
    color: #1B5E35;
    margin: 0 0 10px;
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

