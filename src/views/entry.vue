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

      <div class="patient-layout">

        <!-- ── SIDEBAR NAV ─────────────────────────────────────────── -->
        <aside class="sidebar-nav">
          <h4>Modules</h4>
          <button v-for="m in modules" :key="m.id" class="nav-link" @click="scrollToModule(m.id)">
            <span class="nav-num">{{ m.num }}</span>
            <span>{{ m.label }}</span>
          </button>
        </aside>

        <!-- ── FORM MAIN ───────────────────────────────────────────── -->
        <div class="form-main">

          <!-- MODULE 01: PATIENT INFORMATION -->
          <section id="module-01" class="module-section">
            <div class="module-head">
              <span class="module-num">01</span>
              <h2 class="module-title">Patient Information</h2>
            </div>
            <div class="module-body">
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">Patient ID</label>
                  <input v-model="form.basic_info.patient_id" class="text-input readonly-input" readonly
                    placeholder="Auto-generated" />
                </div>

                <div class="field">
                  <label class="field-label">Full Name</label>
                  <input v-model="form.basic_info.name" class="text-input"
                    :class="{ 'input--error': errors.basic_info.name }" placeholder="Full Name" />
                  <span v-if="errors.basic_info.name" class="field-error">{{ errors.basic_info.name }}</span>
                </div>

                <div class="field">
                  <label class="field-label">NID Available?</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Available"
                        v-model="form.basic_info.nid_available" /> Available</label>
                    <label class="radio-item"><input type="radio" value="Not available"
                        v-model="form.basic_info.nid_available" /> Not available</label>
                  </div>
                </div>

                <div v-if="form.basic_info.nid_available === 'Available'" class="field">
                  <label class="field-label">NID Number</label>
                  <input v-model="form.basic_info.nid" class="text-input"
                    :class="{ 'input--error': errors.basic_info.nid }" placeholder="NID Number" />
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
                  <select v-model="form.basic_info.sex" class="select-input"
                    :class="{ 'input--error': errors.basic_info.sex }">
                    <option disabled value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <span v-if="errors.basic_info.sex" class="field-error">{{ errors.basic_info.sex }}</span>
                </div>

                <div class="field">
                  <label class="field-label">Date of Birth</label>
                  <input v-model="form.basic_info.dob" type="date" class="text-input" />
                </div>

                <div class="field">
                  <label class="field-label">Age</label>
                  <input v-model.number="form.basic_info.age" type="number" min="0" class="text-input"
                    :class="{ 'input--error': errors.basic_info.age }" placeholder="Age" />
                  <span v-if="errors.basic_info.age" class="field-error">{{ errors.basic_info.age }}</span>
                </div>

                <div class="field">
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
          </section>

          <!-- MODULE 02: ADMISSION INFORMATION -->
          <section id="module-02" class="module-section">
            <div class="module-head">
              <span class="module-num">02</span>
              <h2 class="module-title">Admission Information</h2>
            </div>
            <div class="module-body">
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">Admission No</label>
                  <input v-model="form.admission.admission_no" class="text-input" placeholder="Admission No" />
                </div>

                <div class="field">
                  <label class="field-label">Unit</label>
                  <select v-model="form.admission.unit" class="select-input"
                    :class="{ 'input--error': errors.admission.unit }">
                    <option disabled value="">Select unit</option>
                    <option v-for="u in UNITS" :key="u" :value="u">{{ u }}</option>
                  </select>
                  <span v-if="errors.admission.unit" class="field-error">{{ errors.admission.unit }}</span>
                </div>

                <div class="field">
                  <label class="field-label">Ward</label>
                  <input v-model="form.admission.ward" class="text-input"
                    :class="{ 'input--error': errors.admission.ward }" placeholder="Ward" />
                  <span v-if="errors.admission.ward" class="field-error">{{ errors.admission.ward }}</span>
                </div>

                <div class="field">
                  <label class="field-label">Bed No</label>
                  <input v-model="form.admission.bed" class="text-input" placeholder="Bed No" />
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
                  <input v-model="form.admission.discharge_date" type="date" class="text-input"
                    :class="{ 'input--error': errors.admission.discharge_date }" />
                  <span v-if="errors.admission.discharge_date" class="field-error">
                    {{ errors.admission.discharge_date }}
                  </span>
                </div>

                <div class="field">
                  <label class="field-label">Length of Stay</label>
                  <input :value="lengthOfStay" class="text-input readonly-input" readonly
                    placeholder="Auto-calculated" />
                </div>

                <div class="field">
                  <label class="field-label">Admission Type</label>
                  <select v-model="form.admission.admission_type" class="select-input">
                    <option disabled value="">Select type</option>
                    <option v-for="t in ADMISSION_TYPES" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Chief Complaint</label>
                  <textarea v-model="form.admission.chief_complaint" class="text-area"
                    placeholder="Chief Complaint"></textarea>
                </div>

                <div class="col-span-full">
                  <p class="sub-label">Presenting Complaints</p>
                  <div class="table-scroll">
                    <table class="table-clinical">
                      <thead>
                        <tr>
                          <th class="th-clinical" style="width: 70%">Complaint</th>
                          <th class="th-clinical">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(pc, i) in form.admission.presenting_complaints" :key="i">
                          <td class="td-clinical">
                            <input v-model="pc.complaint" class="cell-input" placeholder="Complaint" />
                          </td>
                          <td class="td-clinical">
                            <input v-model="pc.duration" class="cell-input" placeholder="Duration" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 03: DISEASE CATEGORY -->
          <section id="module-03" class="module-section">
            <div class="module-head">
              <span class="module-num">03</span>
              <h2 class="module-title">Disease Category</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Select all that apply</p>
              <div class="check-grid">
                <label v-for="c in DISEASE_CATEGORIES" :key="c" class="check-item">
                  <input type="checkbox" :value="c" v-model="form.disease_category.categories" />
                  <span>{{ c }}</span>
                </label>
              </div>

              <div class="form-grid" style="margin-top: 16px">
                <div class="field">
                  <label class="field-label">Primary Category</label>
                  <select v-model="form.disease_category.primary" class="select-input">
                    <option disabled value="">Select primary</option>
                    <option v-for="c in DISEASE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div class="field">
                  <label class="field-label">Secondary Category</label>
                  <select v-model="form.disease_category.secondary" class="select-input">
                    <option disabled value="">Select secondary</option>
                    <option v-for="c in DISEASE_CATEGORIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 04: COMORBIDITY & HISTORY -->
          <section id="module-04" class="module-section">
            <div class="module-head">
              <span class="module-num">04</span>
              <h2 class="module-title">Comorbidity &amp; History</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Comorbidity</p>
              <div class="check-grid">
                <label v-for="c in COMORBIDITY_OPTIONS" :key="c" class="check-item">
                  <input type="checkbox" :value="c" v-model="form.comorbidity" />
                  <span>{{ c }}</span>
                </label>
              </div>
              <div class="field" style="margin-top: 12px">
                <label class="field-label">Other Comorbidity</label>
                <input v-model="form.comorbidity_other" class="text-input" placeholder="Specify other comorbidity" />
              </div>

              <p class="sub-label">History</p>
              <div class="form-grid">
                <div class="field col-span-full">
                  <label class="field-label">Past Illness</label>
                  <textarea v-model="form.history.past_illness" class="text-area"
                    placeholder="Past Illness"></textarea>
                </div>
                <div class="field col-span-full">
                  <label class="field-label">Drug History</label>
                  <textarea v-model="form.history.drug_history" class="text-area"
                    placeholder="Drug History"></textarea>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Drug Allergy</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="No" v-model="form.history.drug_allergy" />
                      No</label>
                    <label class="radio-item"><input type="radio" value="Yes" v-model="form.history.drug_allergy" />
                      Yes</label>
                  </div>
                  <input v-if="form.history.drug_allergy === 'Yes'" v-model="form.history.drug_allergy_details"
                    class="text-input" style="margin-top: 8px" placeholder="Specify drug allergy" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Family History</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Non-contributory"
                        v-model="form.history.family_history_status" /> Non-contributory</label>
                    <label class="radio-item"><input type="radio" value="Positive"
                        v-model="form.history.family_history_status" /> Positive</label>
                  </div>
                  <input v-if="form.history.family_history_status === 'Positive'"
                    v-model="form.history.family_history" class="text-input" style="margin-top: 8px"
                    placeholder="Specify family history" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Other History</label>
                  <textarea v-model="form.history.other_history" class="text-area"
                    placeholder="Other relevant history"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 05: GENERAL & SYSTEMIC EXAM -->
          <section id="module-05" class="module-section">
            <div class="module-head">
              <span class="module-num">05</span>
              <h2 class="module-title">General &amp; Systemic Examination</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Vitals</p>
              <div class="vitals-row">
                <div class="field">
                  <label class="field-label">BP (mmHg)</label>
                  <input v-model="form.examination.vitals.bp" class="text-input" placeholder="e.g. 120/80" />
                </div>
                <div class="field">
                  <label class="field-label">Pulse (/min)</label>
                  <input v-model="form.examination.vitals.pulse" class="text-input" placeholder="Pulse" />
                </div>
                <div class="field">
                  <label class="field-label">Temp (°C)</label>
                  <input v-model="form.examination.vitals.temp" class="text-input" placeholder="Temp" />
                </div>
                <div class="field">
                  <label class="field-label">RR (/min)</label>
                  <input v-model="form.examination.vitals.rr" class="text-input" placeholder="RR" />
                </div>
                <div class="field">
                  <label class="field-label">SpO₂ (%)</label>
                  <input v-model="form.examination.vitals.spo2" class="text-input" placeholder="SpO2" />
                </div>
              </div>

              <p class="sub-label">Systemic Examination</p>
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">General Status</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.examination.general_status" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.examination.general_status" /> Abnormal</label>
                  </div>
                  <input v-if="form.examination.general_status === 'Abnormal'"
                    v-model="form.examination.general_findings" class="text-input" style="margin-top: 8px"
                    placeholder="General findings" />
                </div>

                <div class="field">
                  <label class="field-label">Cardiovascular</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.examination.cardiovascular" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.examination.cardiovascular" /> Abnormal</label>
                  </div>
                  <input v-if="form.examination.cardiovascular === 'Abnormal'"
                    v-model="form.examination.cardiovascular_findings" class="text-input" style="margin-top: 8px"
                    placeholder="Cardiovascular findings" />
                </div>

                <div class="field">
                  <label class="field-label">Respiratory</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.examination.respiratory" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.examination.respiratory" /> Abnormal</label>
                  </div>
                  <input v-if="form.examination.respiratory === 'Abnormal'"
                    v-model="form.examination.respiratory_findings" class="text-input" style="margin-top: 8px"
                    placeholder="Respiratory findings" />
                </div>

                <div class="field">
                  <label class="field-label">Abdomen</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.examination.abdomen" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.examination.abdomen" /> Abnormal</label>
                  </div>
                  <input v-if="form.examination.abdomen === 'Abnormal'" v-model="form.examination.abdomen_findings"
                    class="text-input" style="margin-top: 8px" placeholder="Abdominal findings" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Other Examination</label>
                  <textarea v-model="form.examination.other" class="text-area"
                    placeholder="Other examination findings"></textarea>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Systemic Examination Summary</label>
                  <textarea v-model="form.examination.systemic" class="text-area"
                    placeholder="Systemic examination summary"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 06: NEUROLOGICAL EXAMINATION -->
          <section id="module-06" class="module-section">
            <div class="module-head">
              <span class="module-num">06</span>
              <h2 class="module-title">Neurological Examination</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Glasgow Coma Scale (GCS)</p>
              <div class="gcs-row">
                <div class="field">
                  <label class="field-label">Eye (1–4)</label>
                  <input v-model.number="form.neuro_exam.gcs_eye" type="number" min="1" max="4" class="text-input" />
                </div>
                <div class="field">
                  <label class="field-label">Verbal (1–5)</label>
                  <input v-model.number="form.neuro_exam.gcs_verbal" type="number" min="1" max="5"
                    class="text-input" />
                </div>
                <div class="field">
                  <label class="field-label">Motor (1–6)</label>
                  <input v-model.number="form.neuro_exam.gcs_motor" type="number" min="1" max="6"
                    class="text-input" />
                </div>
                <div class="field">
                  <label class="field-label">Total GCS</label>
                  <input :value="gcsTotal" class="text-input readonly-input" readonly placeholder="—" />
                </div>
              </div>

              <p class="sub-label">Higher Cerebral Function</p>
              <div class="form-grid">
                <div class="field">
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.neuro_exam.higher_cerebral" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.neuro_exam.higher_cerebral" /> Abnormal</label>
                    <label class="radio-item"><input type="radio" value="Not assessed"
                        v-model="form.neuro_exam.higher_cerebral" /> Not assessed</label>
                  </div>
                  <input v-if="form.neuro_exam.higher_cerebral === 'Abnormal'"
                    v-model="form.neuro_exam.higher_cerebral_detail" class="text-input" style="margin-top: 8px"
                    placeholder="Specify abnormality" />
                </div>

                <div class="field">
                  <label class="field-label">Speech</label>
                  <select v-model="form.neuro_exam.speech" class="select-input">
                    <option disabled value="">Select speech</option>
                    <option value="Normal">Normal</option>
                    <option value="Dysarthria">Dysarthria</option>
                    <option value="Aphasia-Dysphasia">Aphasia / Dysphasia</option>
                    <option value="Other">Other</option>
                  </select>
                  <input v-if="form.neuro_exam.speech === 'Other'" v-model="form.neuro_exam.speech_other"
                    class="text-input" style="margin-top: 8px" placeholder="Specify speech" />
                </div>
              </div>

              <p class="sub-label">Cranial Nerves</p>
              <div class="form-grid">
                <div class="field">
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="Normal"
                        v-model="form.neuro_exam.cranial_nerves" /> Normal</label>
                    <label class="radio-item"><input type="radio" value="Abnormal"
                        v-model="form.neuro_exam.cranial_nerves" /> Abnormal</label>
                  </div>
                  <input v-if="form.neuro_exam.cranial_nerves === 'Abnormal'"
                    v-model="form.neuro_exam.cranial_nerves_detail" class="text-input" style="margin-top: 8px"
                    placeholder="Specify abnormality" />
                </div>

                <div class="field">
                  <label class="field-label">Fundus — Right</label>
                  <select v-model="form.neuro_exam.fundus_right" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Not assessed">Not assessed</option>
                  </select>
                  <input v-if="form.neuro_exam.fundus_right === 'Abnormal'"
                    v-model="form.neuro_exam.fundus_right_detail" class="text-input" style="margin-top: 8px"
                    placeholder="Specify right fundus" />
                </div>

                <div class="field">
                  <label class="field-label">Fundus — Left</label>
                  <select v-model="form.neuro_exam.fundus_left" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Not assessed">Not assessed</option>
                  </select>
                  <input v-if="form.neuro_exam.fundus_left === 'Abnormal'"
                    v-model="form.neuro_exam.fundus_left_detail" class="text-input" style="margin-top: 8px"
                    placeholder="Specify left fundus" />
                </div>
              </div>

              <p class="sub-label">Motor Examination</p>
              <div class="table-scroll">
                <table class="table-clinical">
                  <thead>
                    <tr>
                      <th class="th-clinical">Parameter</th>
                      <th class="th-clinical">RUL</th>
                      <th class="th-clinical">LUL</th>
                      <th class="th-clinical">RLL</th>
                      <th class="th-clinical">LLL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in MOTOR_ROWS" :key="row.key">
                      <td class="td-clinical td-label">{{ row.label }}</td>
                      <td v-for="limb in LIMBS" :key="limb" class="td-clinical">
                        <template v-if="row.limbs.includes(limb)">
                          <select v-if="row.type === 'select'"
                            v-model="form.neuro_exam.motor_exam[limb][row.key]" class="cell-select">
                            <option value=""></option>
                            <option v-for="opt in row.options" :key="opt" :value="opt">{{ opt }}</option>
                          </select>
                          <input v-else v-model.number="form.neuro_exam.motor_exam[limb][row.key]" type="number"
                            min="0" max="5" class="cell-input" />
                        </template>
                        <span v-else class="cell-disabled">—</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="sub-label">Sensory &amp; Coordination</p>
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">Sensory</label>
                  <select v-model="form.neuro_exam.sensory" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Not assessed">Not assessed</option>
                  </select>
                  <input v-if="form.neuro_exam.sensory === 'Abnormal'" v-model="form.neuro_exam.sensory_detail"
                    class="text-input" style="margin-top: 8px" placeholder="Specify sensory abnormality" />
                </div>

                <div class="field">
                  <label class="field-label">Cerebellar Signs</label>
                  <div class="radio-row">
                    <label class="radio-item"><input type="radio" value="No" v-model="form.neuro_exam.cerebellar" />
                      No</label>
                    <label class="radio-item"><input type="radio" value="Yes" v-model="form.neuro_exam.cerebellar" />
                      Yes</label>
                    <label class="radio-item"><input type="radio" value="Not assessed"
                        v-model="form.neuro_exam.cerebellar" /> Not assessed</label>
                  </div>
                  <template v-if="form.neuro_exam.cerebellar === 'Yes'">
                    <select v-model="form.neuro_exam.cerebellar_side" class="select-input" style="margin-top: 8px">
                      <option disabled value="">Side</option>
                      <option value="Right">Right</option>
                      <option value="Left">Left</option>
                      <option value="Bilateral">Bilateral</option>
                    </select>
                    <input v-model="form.neuro_exam.cerebellar_detail" class="text-input" style="margin-top: 8px"
                      placeholder="Specify cerebellar signs" />
                  </template>
                </div>

                <div class="field">
                  <label class="field-label">Gait</label>
                  <select v-model="form.neuro_exam.gait" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Not assessed">Not assessed</option>
                  </select>
                  <input v-if="form.neuro_exam.gait === 'Abnormal'" v-model="form.neuro_exam.gait_detail"
                    class="text-input" style="margin-top: 8px" placeholder="Specify gait abnormality" />
                </div>

                <div class="field">
                  <label class="field-label">Meningeal Signs</label>
                  <select v-model="form.neuro_exam.meningeal" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Absent">Absent</option>
                    <option value="Present">Present</option>
                    <option value="Not assessed">Not assessed</option>
                  </select>
                  <input v-if="form.neuro_exam.meningeal === 'Present'" v-model="form.neuro_exam.meningeal_detail"
                    class="text-input" style="margin-top: 8px" placeholder="Specify meningeal signs" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Special Test</label>
                  <textarea v-model="form.neuro_exam.special_test" class="text-area"
                    placeholder="Special test findings"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 07: CLINICAL SCORES -->
          <section id="module-07" class="module-section">
            <div class="module-head">
              <span class="module-num">07</span>
              <h2 class="module-title">Clinical Scores</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Select applicable scales</p>
              <div class="check-grid">
                <label v-for="s in ALL_SCALES" :key="s" class="check-item">
                  <input type="checkbox" :value="s" v-model="form.clinical_scores.selected_scales" />
                  <span>{{ s }}</span>
                  <span v-if="relevantScales.includes(s)" class="scale-relevant">relevant</span>
                </label>
              </div>
              <label class="check-item" style="margin-top: 10px">
                <input type="checkbox" v-model="form.clinical_scores.not_applicable" />
                <span>Not applicable</span>
              </label>

              <div v-if="!form.clinical_scores.not_applicable && form.clinical_scores.selected_scales.length"
                class="table-scroll" style="margin-top: 16px">
                <table class="table-clinical">
                  <thead>
                    <tr>
                      <th class="th-clinical">Scale</th>
                      <th class="th-clinical">Baseline</th>
                      <th class="th-clinical">Discharge</th>
                      <th class="th-clinical">Follow-up</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in form.clinical_scores.selected_scales" :key="s">
                      <td class="td-clinical td-label">{{ s }}</td>
                      <td class="td-clinical">
                        <input v-model="form.clinical_scores.scores[s].baseline" class="cell-input" />
                      </td>
                      <td class="td-clinical">
                        <input v-model="form.clinical_scores.scores[s].discharge" class="cell-input" />
                      </td>
                      <td class="td-clinical">
                        <input v-model="form.clinical_scores.scores[s].followup" class="cell-input" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- MODULE 08: INVESTIGATIONS -->
          <section id="module-08" class="module-section">
            <div class="module-head">
              <span class="module-num">08</span>
              <h2 class="module-title">Investigations</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Imaging</p>
              <div class="invest-row">
                <span class="invest-name">CT Brain</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done"
                      v-model="form.investigations.ct_brain_status" /> Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal"
                      v-model="form.investigations.ct_brain_status" /> Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.ct_brain_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.ct_brain_status === 'Abnormal'"
                  v-model="form.investigations.ct_brain_findings" class="text-input" placeholder="CT brain findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">MRI Brain</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done"
                      v-model="form.investigations.mri_brain_status" /> Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal"
                      v-model="form.investigations.mri_brain_status" /> Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.mri_brain_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.mri_brain_status === 'Abnormal'"
                  v-model="form.investigations.mri_brain_findings" class="text-input" placeholder="MRI brain findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">MRI Spine</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done"
                      v-model="form.investigations.mri_spine_status" /> Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal"
                      v-model="form.investigations.mri_spine_status" /> Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.mri_spine_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.mri_spine_status === 'Abnormal'"
                  v-model="form.investigations.mri_spine_findings" class="text-input" placeholder="MRI spine findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">Vessel Imaging</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done"
                      v-model="form.investigations.vessel_imaging" /> Not done</label>
                  <label class="radio-item"><input type="radio" value="CTA" v-model="form.investigations.vessel_imaging" />
                    CTA</label>
                  <label class="radio-item"><input type="radio" value="MRA" v-model="form.investigations.vessel_imaging" />
                    MRA</label>
                  <label class="radio-item"><input type="radio" value="Carotid Doppler"
                      v-model="form.investigations.vessel_imaging" /> Carotid Doppler</label>
                  <label class="radio-item"><input type="radio" value="Other"
                      v-model="form.investigations.vessel_imaging" /> Other</label>
                </div>
                <input v-if="form.investigations.vessel_imaging === 'Other'"
                  v-model="form.investigations.vessel_other" class="text-input" placeholder="Specify vessel imaging" />
                <input v-if="['CTA', 'MRA', 'Carotid Doppler', 'Other'].includes(form.investigations.vessel_imaging)"
                  v-model="form.investigations.vessel_findings" class="text-input" placeholder="Vessel imaging findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">DSA</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done" v-model="form.investigations.dsa_status" />
                    Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal" v-model="form.investigations.dsa_status" />
                    Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.dsa_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.dsa_status === 'Abnormal'" v-model="form.investigations.dsa_findings"
                  class="text-input" placeholder="DSA findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">EEG</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done" v-model="form.investigations.eeg_status" />
                    Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal" v-model="form.investigations.eeg_status" />
                    Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.eeg_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.eeg_status === 'Abnormal'" v-model="form.investigations.eeg_findings"
                  class="text-input" placeholder="EEG findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">NCS</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done" v-model="form.investigations.ncs_status" />
                    Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal" v-model="form.investigations.ncs_status" />
                    Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.ncs_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.ncs_status === 'Abnormal'" v-model="form.investigations.ncs_findings"
                  class="text-input" placeholder="NCS findings" />
              </div>

              <div class="invest-row">
                <span class="invest-name">EMG</span>
                <div class="radio-row">
                  <label class="radio-item"><input type="radio" value="Not done" v-model="form.investigations.emg_status" />
                    Not done</label>
                  <label class="radio-item"><input type="radio" value="Normal" v-model="form.investigations.emg_status" />
                    Normal</label>
                  <label class="radio-item"><input type="radio" value="Abnormal"
                      v-model="form.investigations.emg_status" /> Abnormal</label>
                </div>
                <input v-if="form.investigations.emg_status === 'Abnormal'" v-model="form.investigations.emg_findings"
                  class="text-input" placeholder="EMG findings" />
              </div>

              <p class="sub-label">Laboratory</p>
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">CBC</label>
                  <input v-model="form.investigations.cbc" class="text-input" placeholder="CBC result" />
                </div>
                <div class="field">
                  <label class="field-label">Serum Electrolytes</label>
                  <input v-model="form.investigations.electrolytes" class="text-input"
                    placeholder="Electrolytes result" />
                </div>
                <div class="field">
                  <label class="field-label">Blood Glucose</label>
                  <input v-model="form.investigations.glucose" class="text-input" placeholder="Glucose result" />
                </div>
                <div class="field">
                  <label class="field-label">Serum Creatinine</label>
                  <input v-model="form.investigations.creatinine" class="text-input" placeholder="Creatinine result" />
                </div>
                <div class="field">
                  <label class="field-label">LFT</label>
                  <input v-model="form.investigations.lft" class="text-input" placeholder="LFT result" />
                </div>
                <div class="field">
                  <label class="field-label">Lipid Profile</label>
                  <input v-model="form.investigations.lipid_profile" class="text-input"
                    placeholder="Lipid profile result" />
                </div>
                <div class="field">
                  <label class="field-label">ESR / CRP</label>
                  <input v-model="form.investigations.esr_crp" class="text-input" placeholder="ESR / CRP result" />
                </div>
                <div class="field">
                  <label class="field-label">Other Lab</label>
                  <input v-model="form.investigations.lab_other" class="text-input" placeholder="Other lab result" />
                </div>
              </div>

              <p class="sub-label">CSF Study</p>
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">CSF Status</label>
                  <select v-model="form.investigations.csf_status" class="select-input">
                    <option disabled value="">Select</option>
                    <option value="Not done">Not done</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <template v-if="form.investigations.csf_status === 'Done'">
                  <div class="field">
                    <label class="field-label">Opening Pressure</label>
                    <input v-model="form.investigations.csf.opening_pressure" class="text-input"
                      placeholder="Opening pressure" />
                  </div>
                  <div class="field">
                    <label class="field-label">Cells</label>
                    <input v-model="form.investigations.csf.cells" class="text-input" placeholder="Cells" />
                  </div>
                  <div class="field">
                    <label class="field-label">Protein</label>
                    <input v-model="form.investigations.csf.protein" class="text-input" placeholder="Protein" />
                  </div>
                  <div class="field">
                    <label class="field-label">Glucose</label>
                    <input v-model="form.investigations.csf.glucose" class="text-input" placeholder="Glucose" />
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">Microbiology</label>
                    <div class="check-grid">
                      <label class="check-item"><input type="checkbox" value="Gram stain"
                          v-model="form.investigations.csf.microbiology" /> Gram stain</label>
                      <label class="check-item"><input type="checkbox" value="Culture"
                          v-model="form.investigations.csf.microbiology" /> Culture</label>
                      <label class="check-item"><input type="checkbox" value="AFB"
                          v-model="form.investigations.csf.microbiology" /> AFB</label>
                      <label class="check-item"><input type="checkbox" value="TB-PCR"
                          v-model="form.investigations.csf.microbiology" /> TB-PCR</label>
                      <label class="check-item"><input type="checkbox" value="Viral"
                          v-model="form.investigations.csf.microbiology" /> Viral</label>
                      <label class="check-item"><input type="checkbox" value="OCB"
                          v-model="form.investigations.csf.microbiology" /> OCB</label>
                      <label class="check-item"><input type="checkbox" value="Other"
                          v-model="form.investigations.csf.microbiology" /> Other</label>
                    </div>
                    <input v-if="form.investigations.csf.microbiology.includes('Other')"
                      v-model="form.investigations.csf.other" class="text-input" style="margin-top: 8px"
                      placeholder="Specify other microbiology" />
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">CSF Interpretation</label>
                    <textarea v-model="form.investigations.csf_interpretation" class="text-area"
                      placeholder="CSF interpretation"></textarea>
                  </div>
                </template>
                <div class="field col-span-full">
                  <label class="field-label">Other Investigation</label>
                  <textarea v-model="form.investigations.other_investigation" class="text-area"
                    placeholder="Other investigation findings"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 09: DIAGNOSIS -->
          <section id="module-09" class="module-section">
            <div class="module-head">
              <span class="module-num">09</span>
              <h2 class="module-title">Diagnosis</h2>
            </div>
            <div class="module-body">
              <div class="form-grid">
                <div class="field col-span-full">
                  <label class="field-label">Primary Diagnosis</label>
                  <textarea v-model="form.diagnosis.primary" class="text-area"
                    placeholder="Primary diagnosis"></textarea>
                </div>
                <div v-for="(sd, i) in form.diagnosis.secondary_diagnoses" :key="i" class="field">
                  <label class="field-label">Secondary Diagnosis {{ i + 1 }}</label>
                  <input v-model="form.diagnosis.secondary_diagnoses[i]" class="text-input"
                    placeholder="Secondary diagnosis" />
                </div>
                <div class="field">
                  <label class="field-label">Certainty</label>
                  <select v-model="form.diagnosis.certainty" class="select-input">
                    <option disabled value="">Select certainty</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Probable">Probable</option>
                    <option value="Possible">Possible</option>
                    <option value="Differential diagnosis">Differential diagnosis</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 10: TREATMENT -->
          <section id="module-10" class="module-section">
            <div class="module-head">
              <span class="module-num">10</span>
              <h2 class="module-title">Treatment</h2>
            </div>
            <div class="module-body">
              <p class="sub-label">Medications</p>
              <div class="table-scroll med-table">
                <table class="table-clinical">
                  <thead>
                    <tr>
                      <th class="th-clinical">Medication</th>
                      <th class="th-clinical">Dose</th>
                      <th class="th-clinical">Route</th>
                      <th class="th-clinical">Frequency</th>
                      <th class="th-clinical">Start</th>
                      <th class="th-clinical">Stop</th>
                      <th class="th-clinical"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(med, i) in form.treatment.medications_list" :key="i">
                      <td class="td-clinical"><input v-model="med.medication" class="cell-input"
                          placeholder="Medication" /></td>
                      <td class="td-clinical"><input v-model="med.dose" class="cell-input" placeholder="Dose" /></td>
                      <td class="td-clinical"><input v-model="med.route" class="cell-input" placeholder="Route" /></td>
                      <td class="td-clinical"><input v-model="med.frequency" class="cell-input"
                          placeholder="Frequency" /></td>
                      <td class="td-clinical"><input v-model="med.start" type="date" class="cell-input" /></td>
                      <td class="td-clinical"><input v-model="med.stop" type="date" class="cell-input" /></td>
                      <td class="td-clinical">
                        <button class="btn-remove" @click="removeMedication(i)">×</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button class="btn-outline" style="margin-top: 10px" @click="addMedication">+ Add Medication</button>

              <p class="sub-label">Treatment Categories</p>
              <div class="check-grid">
                <label v-for="c in TREATMENT_CATEGORIES" :key="c" class="check-item">
                  <input type="checkbox" :value="c" v-model="form.treatment.categories" />
                  <span>{{ c }}</span>
                </label>
              </div>

              <div class="form-grid" style="margin-top: 16px">
                <div class="field col-span-full">
                  <label class="field-label">Treatment Plan</label>
                  <textarea v-model="form.treatment.plan" class="text-area" placeholder="Treatment plan"></textarea>
                </div>
                <div class="field col-span-full">
                  <label class="field-label">Supportive Care</label>
                  <textarea v-model="form.treatment.supportive" class="text-area"
                    placeholder="Supportive care"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 11: DISCHARGE OUTCOME -->
          <section id="module-11" class="module-section">
            <div class="module-head">
              <span class="module-num">11</span>
              <h2 class="module-title">Discharge Outcome</h2>
            </div>
            <div class="module-body">
              <div class="form-grid">
                <div class="field">
                  <label class="field-label">Outcome</label>
                  <select v-model="form.outcome.status" class="select-input"
                    :class="{ 'input--error': errors.outcome.status }">
                    <option disabled value="">Select outcome</option>
                    <option v-for="o in OUTCOME_OPTIONS" :key="o" :value="o">{{ o }}</option>
                  </select>
                  <span v-if="errors.outcome.status" class="field-error">{{ errors.outcome.status }}</span>
                </div>

                <div class="field">
                  <label class="field-label">Discharge Score — Scale</label>
                  <select v-model="form.outcome.discharge_score.scale" class="select-input">
                    <option disabled value="">Select scale</option>
                    <option v-for="s in ALL_SCALES" :key="s" :value="s">{{ s }}</option>
                  </select>
                </div>

                <div class="field">
                  <label class="field-label">Discharge Score — Value</label>
                  <input v-model="form.outcome.discharge_score.score" class="text-input" placeholder="Score" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Final Diagnosis</label>
                  <textarea v-model="form.outcome.final_diagnosis" class="text-area"
                    placeholder="Final diagnosis"></textarea>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Discharge Plan</label>
                  <textarea v-model="form.outcome.discharge_plan" class="text-area"
                    placeholder="Discharge plan"></textarea>
                </div>

                <div class="field">
                  <label class="field-label">Follow-up Date</label>
                  <input v-model="form.outcome.followup_date" type="date" class="text-input" />
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Condition at Follow-up</label>
                  <div class="check-grid">
                    <label v-for="c in FOLLOWUP_CONDITIONS" :key="c" class="check-item">
                      <input type="checkbox" :value="c" v-model="form.outcome.followup_condition" />
                      <span>{{ c }}</span>
                    </label>
                  </div>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Resolved Issues</label>
                  <textarea v-model="form.outcome.resolved_issues" class="text-area"
                    placeholder="Resolved issues"></textarea>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Unresolved Problems</label>
                  <textarea v-model="form.outcome.unresolved_problems" class="text-area"
                    placeholder="Unresolved problems"></textarea>
                </div>

                <div class="field col-span-full">
                  <label class="field-label">Comment</label>
                  <textarea v-model="form.outcome.comment" class="text-area" placeholder="Comment"></textarea>
                </div>
              </div>
            </div>
          </section>

          <!-- MODULE 12: FOLLOW-UP -->
          <section id="module-12" class="module-section">
            <div class="module-head">
              <span class="module-num">12</span>
              <h2 class="module-title">Follow-up</h2>
            </div>
            <div class="module-body">
              <div v-for="(fu, i) in form.follow_ups" :key="i" class="followup-card">
                <div class="followup-head">
                  <h4>Follow-up Visit {{ i + 1 }}</h4>
                  <button class="btn-remove" @click="removeFollowUp(i)">×</button>
                </div>
                <div class="form-grid">
                  <div class="field">
                    <label class="field-label">Date</label>
                    <input v-model="fu.date" type="date" class="text-input" />
                  </div>
                  <div class="field">
                    <label class="field-label">Condition</label>
                    <select v-model="fu.condition" class="select-input">
                      <option disabled value="">Select condition</option>
                      <option v-for="c in FOLLOWUP_CONDITIONS" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">Neurological Status</label>
                    <textarea v-model="fu.neurological_status" class="text-area"
                      placeholder="Neurological status"></textarea>
                  </div>
                  <div class="field">
                    <label class="field-label">Score — Scale</label>
                    <select v-model="fu.score.scale" class="select-input">
                      <option disabled value="">Select scale</option>
                      <option v-for="s in ALL_SCALES" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                  <div class="field">
                    <label class="field-label">Score — Value</label>
                    <input v-model="fu.score.score" class="text-input" placeholder="Score" />
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">Current Medication</label>
                    <textarea v-model="fu.current_medication" class="text-area"
                      placeholder="Current medication"></textarea>
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">Further Plan</label>
                    <textarea v-model="fu.further_plan" class="text-area" placeholder="Further plan"></textarea>
                  </div>
                  <div class="field col-span-full">
                    <label class="field-label">Notes</label>
                    <textarea v-model="fu.notes" class="text-area" placeholder="Notes"></textarea>
                  </div>
                </div>
              </div>
              <button class="btn-outline" @click="addFollowUp">+ Add Follow-up</button>
            </div>
          </section>

          <!-- MODULE 13: DOCUMENTS -->
          <section id="module-13" class="module-section">
            <div class="module-head">
              <span class="module-num">13</span>
              <h2 class="module-title">Documents</h2>
            </div>
            <div class="module-body">
              <div v-for="t in DOC_TYPES" :key="t" class="doc-row">
                <label class="field-label">{{ t }}</label>
                <input type="file" class="file-input" :accept="acceptFor(t)"
                  @change="handleDocumentUpload($event, t)" />
                <div v-for="(d, i) in documentsOfType(t)" :key="i" class="doc-chip">
                  <span>{{ d.name }}</span>
                  <button class="btn-remove" @click="removeDocument(d)">×</button>
                </div>
              </div>
            </div>
          </section>

          <!-- SAVE BUTTON -->
          <div class="save-bar">
            <button class="btn-primary" @click="openPreview" :disabled="loading">
              {{ loading ? "Saving..." : (isEdit ? "Update Patient" : "Save Patient Entry") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Preview ref="previewDialog" :form="form" :computedComorbidity="previewComorbidity" :mergedFiles="previewFiles"
      :isEdit="isEdit" @confirm="handleConfirmSubmit" @close="closePreview" />
  </div>
</template>
<script>
import { Notify } from "@/utils/notify"
import Preview from "./preview.vue"

const LIMBS = ["RUL", "LUL", "RLL", "LLL"]

const UNITS = ["Green", "Red", "Orange", "Yellow", "Blue", "Violet", "White"]

const DISEASE_CATEGORIES = [
  "Ischemic stroke",
  "Hemorrhagic stroke / ICH",
  "Subarachnoid hemorrhage",
  "CVST",
  "IIH",
  "Other cerebrovascular disorder",
  "Epilepsy",
  "Migraine / other headache",
  "Parkinson's disease",
  "Parkinson-plus syndrome",
  "Other movement disorder",
  "Ataxia",
  "Neuropathy",
  "Myopathy",
  "Motor neuron disease / Neurotopathy",
  "Neuromuscular junction disorder",
  "Demyelinating disease",
  "Myelopathy",
  "Myeloradiculopathy",
  "CNS infection",
  "CNS tuberculosis",
  "Dementia",
  "Acute confusional state / Delirium",
  "Electrolyte / metabolic disorder",
  "X-ol",
  "Other"
]

const COMORBIDITY_OPTIONS = [
  "Diabetes mellitus",
  "Hypertension",
  "Dyslipidemia",
  "Previous stroke",
  "Epilepsy",
  "Electrolyte imbalance",
  "Parkinson's disease",
  "Dementia",
  "Neuropathy",
  "Ischemic heart disease",
  "Chronic kidney disease",
  "Chronic liver disease",
  "Malignancy",
  "Thyroid disease",
  "Other",
  "No significant comorbidity"
]

const ALL_SCALES = [
  "GCS",
  "NIHSS",
  "mRS",
  "MoCA",
  "MMSE",
  "MDS-UPDRS / UPDRS",
  "Hoehn & Yahr",
  "EDSS",
  "ALSFRS-R",
  "MGFA",
  "MG-ADL",
  "MRC Sum Score",
  "Other"
]

const SCALE_MAP = {
  "Ischemic stroke": ["NIHSS", "mRS"],
  "Hemorrhagic stroke / ICH": ["NIHSS", "mRS"],
  "Subarachnoid hemorrhage": ["NIHSS", "mRS"],
  "CVST": ["NIHSS", "mRS"],
  "IIH": [],
  "Other cerebrovascular disorder": ["NIHSS", "mRS"],
  "Epilepsy": [],
  "Migraine / other headache": [],
  "Parkinson's disease": ["MDS-UPDRS / UPDRS", "Hoehn & Yahr"],
  "Parkinson-plus syndrome": ["MDS-UPDRS / UPDRS", "Hoehn & Yahr"],
  "Other movement disorder": ["MDS-UPDRS / UPDRS"],
  "Ataxia": [],
  "Neuropathy": ["MRC Sum Score"],
  "Myopathy": ["MRC Sum Score"],
  "Motor neuron disease / Neurotopathy": ["ALSFRS-R", "MRC Sum Score"],
  "Neuromuscular junction disorder": ["MGFA", "MG-ADL", "MRC Sum Score"],
  "Demyelinating disease": ["EDSS"],
  "Myelopathy": [],
  "Myeloradiculopathy": [],
  "CNS infection": [],
  "CNS tuberculosis": [],
  "Dementia": ["MoCA", "MMSE"],
  "Acute confusional state / Delirium": ["MMSE"],
  "Electrolyte / metabolic disorder": [],
  "X-ol": [],
  "Other": []
}

const TREATMENT_CATEGORIES = [
  "Antiseizure medication",
  "Antiplatelet",
  "Anticoagulant",
  "Statin",
  "Antihypertensive",
  "Steroid",
  "IVIG",
  "Plasma exchange",
  "Other immunotherapy",
  "Dopaminergic medication",
  "Anti-migraine medication",
  "Antimicrobial",
  "Procedure / intervention",
  "Other"
]

const DOC_TYPES = [
  "Patient photograph",
  "Admission paper",
  "Discharge paper",
  "CT/MRI report or images",
  "DSA report",
  "EEG report",
  "NCS/EMG report",
  "Laboratory reports",
  "CSF report",
  "Other relevant documents"
]

const OUTCOME_OPTIONS = [
  "Improved",
  "Stable",
  "Worsened",
  "Recovered",
  "Recovery pending",
  "Referred/Transferred",
  "DAMA",
  "Death",
  "Other"
]

const FOLLOWUP_CONDITIONS = [
  "Improved",
  "Stable",
  "Worsened",
  "Recovered",
  "Recovery pending",
  "Lost to follow-up"
]

const ADMISSION_TYPES = ["Emergency", "Elective", "Referral", "Transfer"]

const MOTOR_ROWS = [
  { key: "wasting", label: "Wasting", type: "select", options: ["Normal", "Yes"], limbs: ["RUL", "LUL", "RLL", "LLL"] },
  { key: "fasciculation", label: "Fasciculation", type: "select", options: ["Normal", "Yes"], limbs: ["RUL", "LUL", "RLL", "LLL"] },
  { key: "tone", label: "Tone", type: "select", options: ["Normal", "Brisk", "Reduced"], limbs: ["RUL", "LUL", "RLL", "LLL"] },
  { key: "power", label: "Power (MRC)", type: "number", options: null, limbs: ["RUL", "LUL", "RLL", "LLL"] },
  { key: "biceps", label: "Biceps", type: "select", options: ["Normal", "Brisk", "Reduced", "Absent"], limbs: ["RUL", "LUL"] },
  { key: "triceps", label: "Triceps", type: "select", options: ["Normal", "Brisk", "Reduced", "Absent"], limbs: ["RUL", "LUL"] },
  { key: "supinator", label: "Supinator", type: "select", options: ["Normal", "Brisk", "Reduced", "Absent"], limbs: ["RUL", "LUL"] },
  { key: "knee", label: "Knee", type: "select", options: ["Normal", "Brisk", "Reduced", "Absent"], limbs: ["RLL", "LLL"] },
  { key: "ankle", label: "Ankle", type: "select", options: ["Normal", "Brisk", "Reduced", "Absent"], limbs: ["RLL", "LLL"] },
  { key: "plantar", label: "Plantar", type: "select", options: ["Flexor", "Extensor"], limbs: ["RLL", "LLL"] }
]

function emptyLimb() {
  return {
    wasting: "", fasciculation: "", tone: "", power: null,
    biceps: "", triceps: "", supinator: "", knee: "", ankle: "", plantar: ""
  }
}

function emptyScores() {
  const s = {}
  ALL_SCALES.forEach(k => { s[k] = { baseline: "", discharge: "", followup: "" } })
  return s
}

function createDefaultForm() {
  return {
    basic_info: {
      patient_id: "", name: "", nid_available: "Available", nid: "",
      reg_no: "", sex: "", dob: null, age: null, mobile: "", address: ""
    },
    admission: {
      admission_no: "", unit: "", ward: "", bed: "",
      admission_date: null, discharge_date: null, length_of_stay: "",
      admission_type: "", chief_complaint: "",
      presenting_complaints: [
        { complaint: "", duration: "" },
        { complaint: "", duration: "" },
        { complaint: "", duration: "" },
        { complaint: "", duration: "" }
      ]
    },
    disease_category: { categories: [], primary: "", secondary: "" },
    comorbidity: [],
    comorbidity_other: "",
    history: {
      past_illness: "", drug_history: "", drug_allergy: "", drug_allergy_details: "",
      family_history_status: "", family_history: "", other_history: ""
    },
    examination: {
      vitals: { bp: "", pulse: "", temp: "", rr: "", spo2: "" },
      general_status: "", general_findings: "",
      cardiovascular: "", cardiovascular_findings: "",
      respiratory: "", respiratory_findings: "",
      abdomen: "", abdomen_findings: "",
      other: "", systemic: ""
    },
    neuro_exam: {
      gcs_eye: null, gcs_verbal: null, gcs_motor: null, gcs_total: null,
      higher_cerebral: "", higher_cerebral_detail: "",
      speech: "", speech_other: "",
      cranial_nerves: "", cranial_nerves_detail: "",
      fundus_right: "", fundus_right_detail: "",
      fundus_left: "", fundus_left_detail: "",
      motor_exam: { RUL: emptyLimb(), LUL: emptyLimb(), RLL: emptyLimb(), LLL: emptyLimb() },
      sensory: "", sensory_detail: "",
      cerebellar: "", cerebellar_side: "", cerebellar_detail: "",
      gait: "", gait_detail: "",
      meningeal: "", meningeal_detail: "",
      special_test: ""
    },
    clinical_scores: { selected_scales: [], scores: emptyScores(), not_applicable: false },
    investigations: {
      ct_brain_status: "", ct_brain_findings: "",
      mri_brain_status: "", mri_brain_findings: "",
      mri_spine_status: "", mri_spine_findings: "",
      vessel_imaging: "", vessel_other: "", vessel_findings: "",
      dsa_status: "", dsa_findings: "",
      eeg_status: "", eeg_findings: "",
      ncs_status: "", ncs_findings: "",
      emg_status: "", emg_findings: "",
      cbc: "", electrolytes: "", glucose: "", creatinine: "",
      lft: "", lipid_profile: "", esr_crp: "", lab_other: "",
      csf_status: "",
      csf: { opening_pressure: "", cells: "", protein: "", glucose: "", microbiology: [], other: "" },
      csf_interpretation: "", other_investigation: ""
    },
    diagnosis: { primary: "", secondary_diagnoses: ["", "", ""], certainty: "" },
    treatment: {
      medications_list: [{ medication: "", dose: "", route: "", frequency: "", start: "", stop: "" }],
      categories: [], plan: "", supportive: ""
    },
    outcome: {
      status: "", discharge_score: { scale: "", score: "" },
      final_diagnosis: "", discharge_plan: "", followup_date: null,
      followup_condition: [], resolved_issues: "", unresolved_problems: "", comment: ""
    },
    follow_ups: [],
    documents: []
  }
}

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

      LIMBS,
      UNITS,
      DISEASE_CATEGORIES,
      COMORBIDITY_OPTIONS,
      ALL_SCALES,
      TREATMENT_CATEGORIES,
      DOC_TYPES,
      OUTCOME_OPTIONS,
      FOLLOWUP_CONDITIONS,
      ADMISSION_TYPES,
      MOTOR_ROWS,

      modules: [
        { id: "module-01", num: "01", label: "Patient Information" },
        { id: "module-02", num: "02", label: "Admission Information" },
        { id: "module-03", num: "03", label: "Disease Category" },
        { id: "module-04", num: "04", label: "Comorbidity & History" },
        { id: "module-05", num: "05", label: "General & Systemic Exam" },
        { id: "module-06", num: "06", label: "Neurological Examination" },
        { id: "module-07", num: "07", label: "Clinical Scores" },
        { id: "module-08", num: "08", label: "Investigations" },
        { id: "module-09", num: "09", label: "Diagnosis" },
        { id: "module-10", num: "10", label: "Treatment" },
        { id: "module-11", num: "11", label: "Discharge Outcome" },
        { id: "module-12", num: "12", label: "Follow-up" },
        { id: "module-13", num: "13", label: "Documents" }
      ],

      errors: {
        basic_info: { name: "", nid: "", reg_no: "", sex: "", age: "", mobile: "", address: "" },
        admission: { unit: "", ward: "", admission_date: "", discharge_date: "" },
        outcome: { status: "" }
      },

      form: createDefaultForm()
    }
  },

  computed: {
    gcsTotal() {
      const e = this.form.neuro_exam.gcs_eye
      const v = this.form.neuro_exam.gcs_verbal
      const m = this.form.neuro_exam.gcs_motor
      if (e == null && v == null && m == null) return null
      return (Number(e) || 0) + (Number(v) || 0) + (Number(m) || 0)
    },

    lengthOfStay() {
      const a = this.form.admission.admission_date
      const d = this.form.admission.discharge_date
      if (!a || !d) return ""
      const start = new Date(a)
      const end = new Date(d)
      if (isNaN(start) || isNaN(end) || end < start) return ""
      const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
      return days + (days === 1 ? " day" : " days")
    },

    relevantScales() {
      const set = new Set()
      this.form.disease_category.categories.forEach(c => {
        ;(SCALE_MAP[c] || []).forEach(s => set.add(s))
      })
      return [...set]
    }
  },

  watch: {
    "form.disease_category.categories"() {
      this.relevantScales.forEach(s => {
        if (!this.form.clinical_scores.selected_scales.includes(s)) {
          this.form.clinical_scores.selected_scales.push(s)
        }
      })
    }
  },

  methods: {
    scrollToModule(id) {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    },

    clearErrors() {
      this.errors = {
        basic_info: { name: "", nid: "", reg_no: "", sex: "", age: "", mobile: "", address: "" },
        admission: { unit: "", ward: "", admission_date: "", discharge_date: "" },
        outcome: { status: "" }
      }
    },

    validateForm() {
      this.clearErrors()
      let ok = true

      if (!this.form.basic_info.name.trim()) {
        this.errors.basic_info.name = "Full name is required"
        ok = false
      }
      if (this.form.basic_info.nid_available === "Available" && !this.form.basic_info.nid.trim()) {
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
      if (!this.form.basic_info.age && this.form.basic_info.age !== 0 && !this.form.basic_info.dob) {
        this.errors.basic_info.age = "Age or date of birth is required"
        ok = false
      }
      if (!this.form.basic_info.mobile.trim()) {
        this.errors.basic_info.mobile = "Mobile number is required"
        ok = false
      } else if (!/^[0-9+\-\s()]{7,20}$/.test(this.form.basic_info.mobile.trim())) {
        this.errors.basic_info.mobile = "Enter a valid mobile number"
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
        this.errors.admission.ward = "Ward is required"
        ok = false
      }
      if (!this.form.admission.admission_date) {
        this.errors.admission.admission_date = "Admission date is required"
        ok = false
      }
      if (
        this.form.admission.admission_date &&
        this.form.admission.discharge_date &&
        new Date(this.form.admission.discharge_date) < new Date(this.form.admission.admission_date)
      ) {
        this.errors.admission.discharge_date = "Discharge date cannot be before admission date"
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
      if (this.form.comorbidity_other) comorbidity.push(this.form.comorbidity_other)
      this.previewComorbidity = comorbidity
      this.previewFiles = this.form.documents.map(d => d.url)
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

    buildPayload() {
      const f = JSON.parse(JSON.stringify(this.form))
      const toNull = v => (v === "" ? null : v)

      f.basic_info.dob = toNull(f.basic_info.dob)
      f.basic_info.age = f.basic_info.age === "" ? null : f.basic_info.age
      f.admission.admission_date = toNull(f.admission.admission_date)
      f.admission.discharge_date = toNull(f.admission.discharge_date)
      f.outcome.followup_date = toNull(f.outcome.followup_date)
      f.follow_ups.forEach(fu => { fu.date = toNull(fu.date) })

      f.neuro_exam.gcs_total = this.gcsTotal
      f.admission.length_of_stay = this.lengthOfStay

      if (this.form.comorbidity_other) {
        f.comorbidity = [...f.comorbidity, this.form.comorbidity_other]
      }
      delete f.comorbidity_other

      f.outcome.files = f.documents.map(d => d.url)

      return f
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        Notify.error("Please fill required fields")
        return
      }

      try {
        this.loading = true
        const payload = this.buildPayload()

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

    mergeWithDefaults(data) {
      const base = createDefaultForm()
      const merged = { ...base, ...data }

      merged.basic_info = { ...base.basic_info, ...(data.basic_info || {}) }
      merged.admission = { ...base.admission, ...(data.admission || {}) }
      merged.admission.presenting_complaints =
        (data.admission?.presenting_complaints && data.admission.presenting_complaints.length)
          ? data.admission.presenting_complaints
          : base.admission.presenting_complaints

      merged.disease_category = { ...base.disease_category, ...(data.disease_category || {}) }
      merged.history = { ...base.history, ...(data.history || {}) }

      merged.examination = { ...base.examination, ...(data.examination || {}) }
      merged.examination.vitals = { ...base.examination.vitals, ...(data.examination?.vitals || {}) }

      merged.neuro_exam = { ...base.neuro_exam, ...(data.neuro_exam || {}) }
      merged.neuro_exam.motor_exam = { ...base.neuro_exam.motor_exam, ...(data.neuro_exam?.motor_exam || {}) }
      LIMBS.forEach(l => {
        merged.neuro_exam.motor_exam[l] = {
          ...base.neuro_exam.motor_exam[l],
          ...(data.neuro_exam?.motor_exam?.[l] || {})
        }
      })

      merged.clinical_scores = { ...base.clinical_scores, ...(data.clinical_scores || {}) }
      merged.clinical_scores.scores = { ...base.clinical_scores.scores, ...(data.clinical_scores?.scores || {}) }

      merged.investigations = { ...base.investigations, ...(data.investigations || {}) }
      merged.investigations.csf = { ...base.investigations.csf, ...(data.investigations?.csf || {}) }

      merged.diagnosis = { ...base.diagnosis, ...(data.diagnosis || {}) }
      merged.diagnosis.secondary_diagnoses =
        (data.diagnosis?.secondary_diagnoses && data.diagnosis.secondary_diagnoses.length)
          ? data.diagnosis.secondary_diagnoses
          : base.diagnosis.secondary_diagnoses

      merged.treatment = { ...base.treatment, ...(data.treatment || {}) }
      merged.treatment.medications_list =
        (data.treatment?.medications_list && data.treatment.medications_list.length)
          ? data.treatment.medications_list
          : base.treatment.medications_list

      merged.outcome = { ...base.outcome, ...(data.outcome || {}) }
      merged.outcome.discharge_score = { ...base.outcome.discharge_score, ...(data.outcome?.discharge_score || {}) }

      merged.follow_ups = data.follow_ups || []
      merged.documents = data.documents || []
      merged.comorbidity = data.comorbidity || []
      merged.comorbidity_other = ""

      return merged
    },

    normalizeDates() {
      const toDate = v => (v ? String(v).slice(0, 10) : null)
      this.form.basic_info.dob = toDate(this.form.basic_info.dob)
      this.form.admission.admission_date = toDate(this.form.admission.admission_date)
      this.form.admission.discharge_date = toDate(this.form.admission.discharge_date)
      this.form.outcome.followup_date = toDate(this.form.outcome.followup_date)
      this.form.follow_ups.forEach(fu => { fu.date = toDate(fu.date) })
    },

    async loadPatient(id) {
      try {
        this.pageLoading = true
        const res = await this.$api.get(`/patients/${id}`)
        this.form = this.mergeWithDefaults(res.data)
        this.normalizeDates()
      } catch {
        Notify.error("Failed to load patient")
      } finally {
        this.pageLoading = false
      }
    },

    addFollowUp() {
      this.form.follow_ups.push({
        date: null, condition: "", neurological_status: "",
        score: { scale: "", score: "" },
        current_medication: "", further_plan: "", notes: ""
      })
    },

    removeFollowUp(i) {
      this.form.follow_ups.splice(i, 1)
    },

    addMedication() {
      this.form.treatment.medications_list.push({
        medication: "", dose: "", route: "", frequency: "", start: "", stop: ""
      })
    },

    removeMedication(i) {
      this.form.treatment.medications_list.splice(i, 1)
    },

    documentsOfType(type) {
      return this.form.documents.filter(d => d.type === type)
    },

    acceptFor(type) {
      return type === "Patient photograph" ? "image/*" : "image/*,application/pdf"
    },

    async handleDocumentUpload(e, type) {
      const files = e.target.files
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        try {
          const res = await this.$api.post("/upload", formData)
          this.form.documents.push({ type, name: file.name, url: res.data.url })
        } catch {
          Notify.error("Upload failed")
        }
      }
      e.target.value = ""
    },

    removeDocument(doc) {
      this.form.documents = this.form.documents.filter(x => x !== doc)
    }
  },

  mounted() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.patientId = id
      this.loadPatient(id)
    } else {
      // auto-generate a patient ID for new entries
      const stamp = Date.now().toString().slice(-6)
      this.form.basic_info.patient_id = `BMU-NEURO-${stamp}`
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
  max-width: 1440px;
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

/* ── Layout: sidebar + main ─────────────────────────────────────── */
.patient-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.sidebar-nav {
  position: sticky;
  top: 84px;
  width: 240px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1.5px solid #e6efe9;
  border-radius: 14px;
  padding: 14px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  display: none;
}

@media (min-width: 1024px) {
  .sidebar-nav {
    display: block;
  }
}

.sidebar-nav h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7c73;
  margin: 0 0 10px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #374040;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: #eef6f1;
  color: #1B5E35;
}

.nav-num {
  font-size: 11px;
  font-weight: 700;
  color: #2EAA5C;
  width: 20px;
  flex-shrink: 0;
}

.form-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Module section ─────────────────────────────────────────────── */
.module-section {
  background: #ffffff;
  border: 1.5px solid #e6efe9;
  border-radius: 14px;
  overflow: hidden;
}

.module-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f0f7f3;
  border-bottom: 1.5px solid #dcebe2;
}

.module-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 26px;
  padding: 0 8px;
  background: #1B5E35;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.module-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a2e24;
  margin: 0;
}

.module-body {
  padding: 18px 20px 22px;
}

.sub-label {
  font-size: 13px;
  font-weight: 700;
  color: #1B5E35;
  margin: 18px 0 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e6efe9;
}

.sub-label:first-child {
  margin-top: 0;
}

/* ── Form controls ──────────────────────────────────────────────── */
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
  border-radius: 10px;
  padding: 9px 12px;
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
  min-height: 80px;
  resize: vertical;
}

.readonly-input {
  background: #eef3f0;
  color: #5b6b63;
  cursor: not-allowed;
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
  gap: 8px;
}

@media (min-width: 768px) {
  .check-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1a2e24;
  cursor: pointer;
  padding: 2px 0;
}

.check-item input,
.radio-item input {
  width: 16px;
  height: 16px;
  accent-color: #2EAA5C;
  flex-shrink: 0;
}

.scale-relevant {
  font-size: 10px;
  font-weight: 700;
  color: #2EAA5C;
  background: #e7f3ec;
  border: 1px solid #d6eadf;
  border-radius: 999px;
  padding: 1px 7px;
  margin-left: 2px;
}

.radio-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #1a2e24;
  cursor: pointer;
}

/* ── Clinical tables ────────────────────────────────────────────── */
.table-scroll {
  overflow-x: auto;
  border: 1px solid #dde8e3;
  border-radius: 10px;
}

.table-clinical {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.th-clinical {
  background: #e3f0e8;
  color: #1a2e24;
  font-weight: 700;
  text-align: left;
  padding: 9px 10px;
  border: 1px solid #d3e4da;
  white-space: nowrap;
}

.td-clinical {
  padding: 6px 8px;
  border: 1px solid #e2ebe6;
  vertical-align: middle;
}

.td-label {
  font-weight: 600;
  color: #374040;
  background: #f7faf8;
  white-space: nowrap;
}

.cell-select,
.cell-input {
  width: 100%;
  min-width: 70px;
  background: #fff;
  border: 1px solid #dde8e3;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 13px;
  color: #1a2e24;
  outline: none;
}

.cell-select:focus,
.cell-input:focus {
  border-color: #2EAA5C;
}

.cell-disabled {
  display: block;
  text-align: center;
  color: #c3cfc9;
  font-size: 13px;
}

/* ── GCS row ────────────────────────────────────────────────────── */
.gcs-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .gcs-row {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

/* ── Vitals row ─────────────────────────────────────────────────── */
.vitals-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 640px) {
  .vitals-row {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* ── Investigation rows ─────────────────────────────────────────── */
.invest-row {
  padding: 10px 0;
  border-bottom: 1px solid #eef3f0;
}

.invest-row:last-child {
  border-bottom: none;
}

.invest-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374040;
  margin-bottom: 6px;
}

.invest-row .text-input {
  margin-top: 8px;
}

/* ── Medication table ───────────────────────────────────────────── */
.med-table .cell-input {
  min-width: 90px;
}

/* ── Follow-up cards ────────────────────────────────────────────── */
.followup-card {
  border: 1.5px solid #dcebe2;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
  background: #fbfdfc;
}

.followup-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.followup-head h4 {
  font-size: 14px;
  font-weight: 700;
  color: #1B5E35;
  margin: 0;
}

/* ── Document rows ──────────────────────────────────────────────── */
.doc-row {
  padding: 10px 0;
  border-bottom: 1px solid #eef3f0;
}

.doc-row:last-child {
  border-bottom: none;
}

.doc-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e7f3ec;
  color: #1a2e24;
  border: 1px solid #d6eadf;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  margin: 6px 6px 0 0;
}

.file-input {
  width: 100%;
  background: #f3f7f5;
  border: 1.5px solid #dde8e3;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
}

/* ── Buttons ────────────────────────────────────────────────────── */
.btn-primary {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
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

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1.5px solid #2EAA5C;
  color: #1B5E35;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-outline:hover {
  background: #eef6f1;
}

.btn-remove {
  background: transparent;
  border: none;
  color: #dc2626;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.btn-remove:hover {
  color: #b91c1c;
}

.save-bar {
  position: sticky;
  bottom: 16px;
  z-index: 20;
}

.save-bar .btn-primary {
  box-shadow: 0 8px 24px rgba(27, 94, 53, 0.25);
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