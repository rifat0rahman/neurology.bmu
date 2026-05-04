<template>
  <div class="patient-root">

    <!-- ── SKELETON OVERLAY ────────────────────────────────────────── -->
    <transition name="fade">
      <div v-if="pageLoading" class="skeleton-overlay">
        <div class="skeleton-inner">
          <div class="skel skel-header"></div>
          <div class="skel skel-block"></div>
          <div class="skel skel-block"></div>
          <div class="skel-grid">
            <div class="skel skel-card"></div>
            <div class="skel skel-card"></div>
            <div class="skel skel-card"></div>
          </div>
          <div class="skel skel-block"></div>
          <div class="skel skel-button"></div>
        </div>
      </div>
    </transition>

    <div class="patient-wrap">

      <!-- TITLE -->
      <div class="page-title">
        <h1>{{ isEdit ? "Edit Patient" : "New Patient Entry" }}</h1>
        <p>Fill in the patient details carefully</p>
      </div>

      <!-- GRID FORM -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- BASIC INFO -->
        <div class="card-panel col-span-full">
          <div class="card-head">
            <h2>Basic Info</h2>
          </div>

          <div class="form-grid">
            <div class="field">
              <label class="field-label">Full Name (NID)</label>
              <input v-model="form.basic_info.name" class="text-input"
                :class="{ 'input--error': errors.basic_info.name }" placeholder="Full Name (NID)" />
              <span v-if="errors.basic_info.name" class="field-error">{{ errors.basic_info.name }}</span>
            </div>

            <div class="field">
              <label class="field-label">NID Number</label>
              <input v-model="form.basic_info.nid" class="text-input" :class="{ 'input--error': errors.basic_info.nid }"
                placeholder="NID Number" />
              <span v-if="errors.basic_info.nid" class="field-error">{{ errors.basic_info.nid }}</span>
            </div>

            <div class="field">
              <label class="field-label">Hospital Reg No</label>
              <input v-model="form.basic_info.reg_no" class="text-input"
                :class="{ 'input--error': errors.basic_info.reg_no }" placeholder="Hospital Reg No" />
              <span v-if="errors.basic_info.reg_no" class="field-error">{{ errors.basic_info.reg_no }}</span>
            </div>

            <div class="field">
              <label class="field-label">Sex</label>
              <select v-model="form.basic_info.sex" class="text-input select-input"
                :class="{ 'input--error': errors.basic_info.sex }">
                <option disabled value="">Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <span v-if="errors.basic_info.sex" class="field-error">{{ errors.basic_info.sex }}</span>
            </div>

            <div class="field">
              <label class="field-label">Age</label>
              <input v-model.number="form.basic_info.age" type="number" class="text-input"
                :class="{ 'input--error': errors.basic_info.age }" placeholder="Age" />
              <span v-if="errors.basic_info.age" class="field-error">{{ errors.basic_info.age }}</span>
            </div>

            <div class="field md:col-span-2">
              <label class="field-label">Mobile No</label>
              <input v-model="form.basic_info.mobile" class="text-input"
                :class="{ 'input--error': errors.basic_info.mobile }" placeholder="Mobile No" />
              <span v-if="errors.basic_info.mobile" class="field-error">{{ errors.basic_info.mobile }}</span>
            </div>

            <div class="field col-span-full">
              <label class="field-label">Address</label>
              <input v-model="form.basic_info.address" class="text-input"
                :class="{ 'input--error': errors.basic_info.address }" placeholder="Address" />
              <span v-if="errors.basic_info.address" class="field-error">{{ errors.basic_info.address }}</span>
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
              <select v-model="form.admission.unit" class="text-input select-input"
                :class="{ 'input--error': errors.admission.unit }">
                <option disabled value="">Unit</option>
                <option value="Green">Green</option>
                <option value="Red">Red</option>
                <option value="Orange">Orange</option>
                <option value="Yellow">Yellow</option>
                <option value="Blue">Blue</option>
                <option value="Violet">Violet</option>
                <option value="White">White</option>
              </select>
              <span v-if="errors.admission.unit" class="field-error">{{ errors.admission.unit }}</span>
            </div>

            <div class="field">
              <label class="field-label">Ward & Bed No</label>
              <input v-model="form.admission.ward" class="text-input" :class="{ 'input--error': errors.admission.ward }"
                placeholder="Ward & Bed No" />
              <span v-if="errors.admission.ward" class="field-error">{{ errors.admission.ward }}</span>
            </div>

            <div class="field">
              <label class="field-label">Admission Date</label>
              <input v-model="form.admission.admission_date" type="date" class="text-input"
                :class="{ 'input--error': errors.admission.admission_date }" />
              <span v-if="errors.admission.admission_date" class="field-error">
                {{ errors.admission.admission_date }}
              </span>
            </div>

            <div class="field">
              <label class="field-label">Discharge Date</label>
              <input v-model="form.admission.discharge_date" type="date" class="text-input" />
            </div>

            <div class="field col-span-full">
              <label class="field-label">Chief Complaint</label>
              <textarea v-model="form.admission.chief_complaint" class="text-area"
                placeholder="Chief Complaint"></textarea>
            </div>
          </div>
        </div>

        <!-- COMORBIDITY -->
        <div class="card-panel">
          <div class="card-head">
            <h2>Comorbidity</h2>
          </div>

          <div class="check-grid">
            <label class="check-item"><input type="checkbox" value="DM" v-model="form.comorbidity" />
              <span>DM</span></label>
            <label class="check-item"><input type="checkbox" value="HTN" v-model="form.comorbidity" />
              <span>HTN</span></label>
            <label class="check-item"><input type="checkbox" value="Dyslipidemia" v-model="form.comorbidity" />
              <span>Dyslipidemia</span></label>
            <label class="check-item"><input type="checkbox" value="CVD" v-model="form.comorbidity" />
              <span>CVD</span></label>
            <label class="check-item"><input type="checkbox" value="Stroke" v-model="form.comorbidity" />
              <span>Stroke</span></label>
            <label class="check-item"><input type="checkbox" value="Parkinson's Disease" v-model="form.comorbidity" />
              <span>Parkinson's</span></label>
            <label class="check-item"><input type="checkbox" value="Epilepsy" v-model="form.comorbidity" />
              <span>Epilepsy</span></label>
            <label class="check-item"><input type="checkbox" value="Dementia" v-model="form.comorbidity" />
              <span>Dementia</span></label>
            <label class="check-item"><input type="checkbox" value="Electrolyte Imbalance" v-model="form.comorbidity" />
              <span>Electrolyte Imbalance</span></label>
            <label class="check-item"><input type="checkbox" value="Neuropathy" v-model="form.comorbidity" />
              <span>Neuropathy</span></label>

            <input v-model="form.comorbidity_neuropathy_type" class="text-input col-span-2"
              placeholder="Neuropathy Type (if applicable)" />
            <input v-model="form.comorbidity_other" class="text-input col-span-2" placeholder="Other..." />
          </div>
        </div>

        <!-- HISTORY -->
        <div class="card-panel lg:col-span-2">
          <div class="card-head">
            <h2>History</h2>
          </div>

          <div class="space-y-3">
            <textarea v-model="form.history.past_illness" class="text-area" placeholder="Past Illness"></textarea>
            <textarea v-model="form.history.drug_history" class="text-area" placeholder="Drug History"></textarea>
            <textarea v-model="form.history.family_history" class="text-area" placeholder="Family History"></textarea>
          </div>
        </div>

        <!-- EXAMINATION -->
        <div class="card-panel lg:col-span-2">
          <div class="card-head">
            <h2>Examination</h2>
          </div>

          <div class="space-y-3">
            <textarea v-model="form.examination.general" class="text-area" placeholder="General Examination"></textarea>
            <textarea v-model="form.examination.systemic" class="text-area"
              placeholder="Systemic Examination"></textarea>
          </div>
        </div>

        <!-- NEUROLOGICAL EXAMINATION -->
        <div class="card-panel col-span-full">
          <div class="card-head">
            <h2>Neurological Examination</h2>
          </div>

          <div class="form-grid">
            <input v-model="form.neuro_exam.gcs" class="text-input" placeholder="Glasgow Coma Scale (GCS)" />
            <input v-model.number="form.neuro_exam.motor_upper" type="number" min="0" max="5" class="text-input"
              placeholder="Motor — Upper Limbs (0–5)" />
            <input v-model.number="form.neuro_exam.motor_lower" type="number" min="0" max="5" class="text-input"
              placeholder="Motor — Lower Limbs (0–5)" />
            <input v-model="form.neuro_exam.sensory" class="text-input" placeholder="Sensory" />

            <div class="col-span-full">
              <p class="field-label">Cranial Nerves</p>
              <div class="radio-row">
                <label class="radio-item"><input type="radio" value="Normal" v-model="form.neuro_exam.cranial_nerves" />
                  Normal</label>
                <label class="radio-item"><input type="radio" value="Abnormal"
                    v-model="form.neuro_exam.cranial_nerves" /> Abnormal</label>
              </div>
              <input v-if="form.neuro_exam.cranial_nerves === 'Abnormal'"
                v-model="form.neuro_exam.cranial_nerves_detail" class="text-input mt-2"
                placeholder="Specify abnormality" />
            </div>

            <div class="col-span-full">
              <p class="field-label">Reflexes</p>
              <div class="radio-row">
                <label class="radio-item"><input type="radio" value="Normal" v-model="form.neuro_exam.reflexes" />
                  Normal</label>
                <label class="radio-item"><input type="radio" value="Hyperreflexia"
                    v-model="form.neuro_exam.reflexes" /> Hyperreflexia</label>
                <label class="radio-item"><input type="radio" value="Hyporeflexia" v-model="form.neuro_exam.reflexes" />
                  Hyporeflexia</label>
              </div>
            </div>

            <input v-model="form.neuro_exam.plantar" class="text-input" placeholder="Plantar Response" />

            <div class="col-span-full">
              <p class="field-label">Coordination and Gait</p>
              <div class="check-grid">
                <label class="check-item"><input type="checkbox" value="Normal"
                    v-model="form.neuro_exam.coordination" /> Normal</label>
                <label class="check-item"><input type="checkbox" value="Ataxia"
                    v-model="form.neuro_exam.coordination" /> Ataxia</label>
                <label class="check-item"><input type="checkbox" value="Dysmetria"
                    v-model="form.neuro_exam.coordination" /> Dysmetria</label>
                <label class="check-item"><input type="checkbox" value="Dysdiadochokinesia"
                    v-model="form.neuro_exam.coordination" /> Dysdiadochokinesia</label>
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
              <div class="inline-input"><input type="checkbox" value="CT Scan (Brain)"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.ct_scan"
                  class="text-input" placeholder="CT Scan (Brain) — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="MRI"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.mri"
                  class="text-input" placeholder="MRI (Brain / Spinal Cord) — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="MRA"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.mra"
                  class="text-input" placeholder="MRA (Brain & Neck Vessels) — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="DSA"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.dsa"
                  class="text-input" placeholder="DSA — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="EEG"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.eeg"
                  class="text-input" placeholder="EEG — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="EMG"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.emg"
                  class="text-input" placeholder="EMG — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="NCS"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.ncs"
                  class="text-input" placeholder="NCS (Nerve Conduction Studies) — Findings" /></div>
              <div class="inline-input"><input type="checkbox" value="Other Imaging"
                  v-model="form.investigations.imaging_selected" /><input v-model="form.investigations.imaging_other"
                  class="text-input" placeholder="Other Imaging — Findings" /></div>
            </div>

            <div class="divider"></div>

            <p class="field-label">Laboratory Tests</p>
            <div class="form-grid">
              <div class="inline-input"><input type="checkbox" value="CBC"
                  v-model="form.investigations.lab_selected" /><input v-model="form.investigations.cbc"
                  class="text-input" placeholder="CBC — Result" /></div>
              <div class="inline-input"><input type="checkbox" value="Serum Electrolytes"
                  v-model="form.investigations.lab_selected" /><input v-model="form.investigations.electrolytes"
                  class="text-input" placeholder="Serum Electrolytes — Result" /></div>
              <div class="inline-input"><input type="checkbox" value="Blood Glucose"
                  v-model="form.investigations.lab_selected" /><input v-model="form.investigations.glucose"
                  class="text-input" placeholder="Blood Glucose — Result" /></div>
              <div class="inline-input"><input type="checkbox" value="Serum Creatinine"
                  v-model="form.investigations.lab_selected" /><input v-model="form.investigations.creatinine"
                  class="text-input" placeholder="Serum Creatinine — Result" /></div>
            </div>
          </div>
        </div>

        <!-- DIAGNOSIS -->
        <div class="card-panel">
          <div class="card-head">
            <h2>Diagnosis</h2>
          </div>

          <div class="space-y-3">
            <textarea v-model="form.diagnosis.primary" class="text-area" placeholder="Principal Diagnosis"></textarea>
            <textarea v-model="form.diagnosis.secondary" class="text-area" placeholder="Other Diagnosis"></textarea>
          </div>
        </div>

        <!-- TREATMENT -->
        <div class="card-panel lg:col-span-2">
          <div class="card-head">
            <h2>Treatment</h2>
          </div>

          <div class="space-y-3">
            <textarea v-model="form.treatment.medications" class="text-area" placeholder="Medications"></textarea>
            <textarea v-model="form.treatment.plan" class="text-area" placeholder="Treatment Plan"></textarea>
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
              <select v-model="form.outcome.status" class="text-input select-input"
                :class="{ 'input--error': errors.outcome.status }">
                <option disabled value="">Outcome</option>
                <option value="Improved and Discharged">Improved and Discharged</option>
                <option value="Deceased">Deceased</option>
                <option value="Referred">Referred</option>
              </select>
              <span v-if="errors.outcome.status" class="field-error">{{ errors.outcome.status }}</span>
            </div>

            <div class="field">
              <label class="field-label">Follow-up Date</label>
              <input v-model="form.outcome.followup_date" type="date" class="text-input" />
            </div>

            <div class="col-span-full">
              <p class="field-label">Condition at Follow-up</p>
              <div class="check-grid">
                <label class="check-item"><input type="checkbox" value="Improved"
                    v-model="form.outcome.followup_condition" /> Improved</label>
                <label class="check-item"><input type="checkbox" value="Unchanged"
                    v-model="form.outcome.followup_condition" /> Unchanged</label>
                <label class="check-item"><input type="checkbox" value="Worsened"
                    v-model="form.outcome.followup_condition" /> Worsened</label>
                <label class="check-item"><input type="checkbox" value="Recovery Pending"
                    v-model="form.outcome.followup_condition" /> Recovery Pending</label>
              </div>
            </div>

            <textarea v-model="form.outcome.resolved_issues" class="text-area col-span-full"
              placeholder="Resolved Issues"></textarea>
            <textarea v-model="form.outcome.unresolved_problems" class="text-area col-span-full"
              placeholder="Unresolved Problems"></textarea>
            <textarea v-model="form.outcome.comment" class="text-area col-span-full"
              placeholder="Comment / Plan"></textarea>
          </div>
        </div>

        <!-- FILE UPLOADS -->
        <div class="card-panel col-span-full">
          <div class="card-head">
            <h2>File Uploads</h2>
          </div>

          <div class="form-grid">
            <div class="field">
              <label class="field-label">Patient's Photo</label>
              <input type="file" accept="image/*" class="file-input"
                @change="handleSingleUpload($event, 'patient_photo')" />
              <img v-if="form.patient_photo" :src="form.patient_photo" class="thumb" />
            </div>

            <div class="field">
              <label class="field-label">Discharge Paper</label>
              <input type="file" class="file-input" @change="handleSingleUpload($event, 'discharge_paper')" />
              <img v-if="form.discharge_paper" :src="form.discharge_paper" class="thumb" />
            </div>

            <div class="field">
              <label class="field-label">Other Relevant Files</label>
              <input type="file" multiple class="file-input" @change="handleMultipleUpload" />
              <div class="thumb-grid">
                <img v-for="(f, i) in form.files" :key="i" :src="f" class="thumb" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SAVE BUTTON -->
      <div class="pt-2">
        <button class="btn-primary w-full" @click="openPreview" :disabled="loading">
          {{ loading ? "Saving..." : (isEdit ? "Update Patient" : "Save Patient Entry") }}
        </button>
      </div>
    </div>

    <Preview ref="previewDialog" :form="form" :computedComorbidity="previewComorbidity" :mergedFiles="previewFiles"
      :isEdit="isEdit" @confirm="handleConfirmSubmit" @close="closePreview" />
  </div>
</template>
<script>
import { Notify } from "@/utils/notify"
import Preview from "./preview.vue"

export default {
  name: "PatientEntry",
  components: { Preview },

  data() {
    return {
      loading: false,
      pageLoading: false,
      isEdit: false,
      patientId: null,

      previewComorbidity: [],
      previewFiles: [],

      errors: {
        basic_info: {
          name: "",
          nid: "",
          reg_no: "",
          sex: "",
          age: "",
          mobile: "",
          address: ""
        },
        admission: {
          unit: "",
          ward: "",
          admission_date: ""
        },
        outcome: {
          status: ""
        }
      },

      form: {
        basic_info: {
          name: "",
          nid: "",
          reg_no: "",
          age: null,
          sex: "",
          address: "",
          mobile: ""
        },

        admission: {
          unit: "",
          ward: "",
          admission_date: null,
          discharge_date: null,
          chief_complaint: ""
        },

        comorbidity: [],
        comorbidity_neuropathy_type: "",
        comorbidity_other: "",

        history: {
          past_illness: "",
          drug_history: "",
          family_history: ""
        },

        examination: {
          general: "",
          systemic: ""
        },

        neuro_exam: {
          gcs: "",
          motor_upper: null,
          motor_lower: null,
          sensory: "",
          cranial_nerves: "",
          cranial_nerves_detail: "",
          reflexes: "",
          plantar: "",
          coordination: []
        },

        investigations: {
          imaging_selected: [],
          ct_scan: "",
          mri: "",
          mra: "",
          dsa: "",
          eeg: "",
          emg: "",
          ncs: "",
          imaging_other: "",
          lab_selected: [],
          cbc: "",
          electrolytes: "",
          glucose: "",
          creatinine: ""
        },

        diagnosis: {
          primary: "",
          secondary: ""
        },

        treatment: {
          medications: "",
          plan: ""
        },

        outcome: {
          status: "",
          followup_date: null,
          followup_condition: [],
          resolved_issues: "",
          unresolved_problems: "",
          comment: ""
        },
        patient_photo: "",
        discharge_paper: "",
        files: [] // for multiple
      }
    }
  },

  methods: {
    clearErrors() {
      this.errors = {
        basic_info: {
          name: "",
          nid: "",
          reg_no: "",
          sex: "",
          age: "",
          mobile: "",
          address: ""
        },
        admission: {
          unit: "",
          ward: "",
          admission_date: ""
        },
        outcome: {
          status: ""
        }
      }
    },

    validateForm() {
      this.clearErrors()
      let ok = true

      if (!this.form.basic_info.name.trim()) {
        this.errors.basic_info.name = "Full name is required"
        ok = false
      }
      if (!this.form.basic_info.nid.trim()) {
        this.errors.basic_info.nid = "NID number is required"
        ok = false
      }
      if (!this.form.basic_info.reg_no.trim()) {
        this.errors.basic_info.reg_no = "Hospital reg no is required"
        ok = false
      }
      if (!this.form.basic_info.sex) {
        this.errors.basic_info.sex = "Sex is required"
        ok = false
      }
      if (!this.form.basic_info.age && this.form.basic_info.age !== 0) {
        this.errors.basic_info.age = "Age is required"
        ok = false
      }
      if (!this.form.basic_info.mobile.trim()) {
        this.errors.basic_info.mobile = "Mobile number is required"
        ok = false
      }
      if (!this.form.basic_info.address.trim()) {
        this.errors.basic_info.address = "Address is required"
        ok = false
      }
      if (!this.form.admission.unit) {
        this.errors.admission.unit = "Unit is required"
        ok = false
      }
      if (!this.form.admission.ward.trim()) {
        this.errors.admission.ward = "Ward & bed is required"
        ok = false
      }
      if (!this.form.admission.admission_date) {
        this.errors.admission.admission_date = "Admission date is required"
        ok = false
      }
      if (!this.form.outcome.status) {
        this.errors.outcome.status = "Outcome is required"
        ok = false
      }

      return ok
    },

    buildPreviewData() {
      let comorbidity = [...this.form.comorbidity]

      if (this.form.comorbidity_neuropathy_type) {
        comorbidity = comorbidity.map(c =>
          c === "Neuropathy" ? `Neuropathy (${this.form.comorbidity_neuropathy_type})` : c
        )
      }

      if (this.form.comorbidity_other) {
        comorbidity.push(this.form.comorbidity_other)
      }

      const mergedFiles = [
        this.form.patient_photo,
        this.form.discharge_paper,
        ...this.form.files
      ].filter(Boolean)

      this.previewComorbidity = comorbidity
      this.previewFiles = mergedFiles
    },

    openPreview() {
      if (!this.validateForm()) {
        Notify.error("Please fill required fields")
        return
      }
      this.buildPreviewData()
      this.$refs.previewDialog.open()
    },

    closePreview() {
      this.$refs.previewDialog.close()
    },

    async handleConfirmSubmit() {
      await this.handleSubmit()
      this.closePreview()
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        Notify.error("Please fill required fields")
        return
      }

      try {
        this.loading = true

        let comorbidity = [...this.form.comorbidity]

        if (this.form.comorbidity_neuropathy_type) {
          comorbidity = comorbidity.map(c =>
            c === "Neuropathy" ? `Neuropathy (${this.form.comorbidity_neuropathy_type})` : c
          )
        }

        if (this.form.comorbidity_other) {
          comorbidity.push(this.form.comorbidity_other)
        }

        const mergedFiles = [
          this.form.patient_photo,
          this.form.discharge_paper,
          ...this.form.files
        ].filter(Boolean)

        const payload = {
          ...this.form,
          comorbidity,
          outcome: {
            ...this.form.outcome,
            files: mergedFiles
          }
        }

        delete payload.comorbidity_neuropathy_type
        delete payload.comorbidity_other

        if (!this.isEdit) {
          await this.$api.post("/patients", payload)
          Notify.info("Patient added successfully")
        } else {
          await this.$api.patch(`/patients/${this.patientId}`, payload)
          Notify.info("Patient updated successfully")
        }

      } catch (err) {
        console.error(err)
        const msg = err.response?.data?.detail || "Failed to save patient"
        Notify.error(msg)
      } finally {
        this.loading = false
      }
    },

    async loadPatient(id) {
      try {
        this.pageLoading = true
        const res = await this.$api.get(`/patients/${id}`)
        const data = res.data

        this.form = {
          ...this.form,
          basic_info: data.basic_info || {},
          admission: data.admission || {},
          history: data.history || {},
          examination: data.examination || {},
          neuro_exam: data.neuro_exam || {},
          investigations: data.investigations || {},
          diagnosis: data.diagnosis || {},
          treatment: data.treatment || {},
          outcome: data.outcome || {},
          comorbidity: data.comorbidity || [],
          comorbidity_neuropathy_type: "",
          comorbidity_other: ""
        }

        const files = data.outcome?.files || []
        this.form.files = files
        this.form.patient_photo = files[0] || ""
        this.form.discharge_paper = files[1] || ""

      } catch {
        Notify.error("Failed to load patient")
      } finally {
        this.pageLoading = false
      }
    },

    async handleSingleUpload(e, field) {
      const file = e.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await this.$api.post("/upload", formData)
        this.form[field] = res.data.url
      } catch {
        Notify.error("Upload failed")
      }
    },

    async handleMultipleUpload(e) {
      const files = e.target.files
      for (let file of files) {
        const formData = new FormData()
        formData.append("file", file)
        try {
          const res = await this.$api.post("/upload", formData)
          this.form.files.push(res.data.url)
        } catch {
          Notify.error("Upload failed")
        }
      }
    }
  },

  mounted() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.patientId = id
      this.loadPatient(id)
    }
  }
}
</script>

<style scoped>
.patient-root {
  min-height: 100vh;
  background: #f4f7f5;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 32px 20px 60px;
}

.patient-wrap {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.page-title h1 {
  font-size: 26px;
  font-weight: 800;
  color: #1B5E35;
  margin: 0 0 4px;
  letter-spacing: -0.5px;
}

.page-title p {
  font-size: 13px;
  color: #6b7c73;
  margin: 0;
}

.card-panel {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  border: 1.5px solid #f0f5f2;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
}

.card-head {
  margin-bottom: 14px;
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
  gap: 14px;
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

.field {
  display: flex;
  flex-direction: column;
}

.text-input,
.text-area,
.select-input {
  width: 100%;
  background: #f3f7f5;
  border: 1.5px solid #dde8e3;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  color: #1a2e24;
  outline: none;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
}

.text-input:focus,
.text-area:focus,
.select-input:focus {
  background: #fff;
  border-color: #2EAA5C;
  box-shadow: 0 0 0 3px rgba(46, 170, 92, 0.12);
}

.text-area {
  min-height: 90px;
  resize: vertical;
}

.input--error {
  border-color: #f87171 !important;
  background: #fff9f9 !important;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
}

.check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1a2e24;
}

.radio-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1a2e24;
}

.inline-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-input {
  width: 100%;
  background: #f3f7f5;
  border: 1.5px solid #dde8e3;
  border-radius: 12px;
  padding: 8px 10px;
}

.thumb {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 8px;
  border: 1px solid #e5ede9;
}

.thumb-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.btn-primary {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ── Skeleton ────────────────────────────────────────────────────── */
.skeleton-overlay {
  position: fixed;
  inset: 0;
  background: #f4f7f5;
  z-index: 50;
  padding: 80px 32px 32px;
}

.skeleton-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skel {
  background: linear-gradient(90deg, #e5ede9 25%, #d4e3da 50%, #e5ede9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 16px;
}

.skel-header {
  height: 36px;
  width: 240px;
}

.skel-block {
  height: 120px;
}

.skel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.skel-card {
  height: 140px;
}

.skel-button {
  height: 52px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-leave-to {
  opacity: 0;
}
</style>