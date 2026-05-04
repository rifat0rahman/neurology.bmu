<template>
    <div class="reg-root">

        <!-- ── LEFT HERO PANEL (desktop only) ────────────────────────────── -->
        <div class="hero-panel">
            <!-- topographic SVG pattern -->
            <svg class="topo-svg" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <g fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5">
                    <path d="M-60 200 Q 80 140 200 210 Q 340 290 480 200 Q 580 140 680 200" />
                    <path d="M-60 260 Q 80 200 200 270 Q 340 350 480 260 Q 580 200 680 260" />
                    <path d="M-60 320 Q 80 260 200 330 Q 340 410 480 320 Q 580 260 680 320" />
                    <path d="M-60 380 Q 80 320 200 390 Q 340 470 480 380 Q 580 320 680 380" />
                    <path d="M-60 440 Q 80 380 200 450 Q 340 530 480 440 Q 580 380 680 440" />
                    <path d="M-60 500 Q 80 440 200 510 Q 340 590 480 500 Q 580 440 680 500" />
                    <path d="M-60 560 Q 80 500 200 570 Q 340 650 480 560 Q 580 500 680 560" />
                    <path d="M-60 620 Q 80 560 200 630 Q 340 710 480 620 Q 580 560 680 620" />
                    <path d="M-60 680 Q 80 620 200 690 Q 340 770 480 680 Q 580 620 680 680" />
                    <path d="M-60 740 Q 80 680 200 750 Q 340 830 480 740 Q 580 680 680 740" />
                    <path d="M-60 800 Q 80 740 200 810 Q 340 890 480 800 Q 580 740 680 800" />
                    <path d="M-60 140 Q 80 80  200 150 Q 340 230 480 140 Q 580 80  680 140" />
                    <path d="M-60 80  Q 80 20  200 90  Q 340 170 480 80  Q 580 20  680 80 " />
                </g>
            </svg>

            <!-- branding -->
            <div class="hero-content">
                <div class="brand-icon">
                    <i class="ph ph-first-aid"></i>
                    <span class="brand-name">MediRecord</span>
                </div>

                <div class="hero-text">
                    <h1>Doctor Portal</h1>
                    <p>Manage your patients, records and analysis from a single unified workspace.</p>
                </div>

                <div class="hero-cards">
                    <div class="hero-stat">
                        <span class="stat-num">12k+</span>
                        <span class="stat-label">Patients managed</span>
                    </div>
                    <div class="hero-stat">
                        <span class="stat-num">98%</span>
                        <span class="stat-label">Record accuracy</span>
                    </div>
                    <div class="hero-stat">
                        <span class="stat-num">50+</span>
                        <span class="stat-label">Departments</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── RIGHT FORM PANEL ──────────────────────────────────────────── -->
        <div class="form-panel">

            <!-- mobile-only header -->
            <div class="mobile-header">
                <div class="brand-icon brand-icon--dark">
                    <i class="ph ph-first-aid"></i>
                    <span class="brand-name brand-name--dark">MediRecord</span>
                </div>
            </div>

            <div class="form-card">
                <!-- header -->
                <div class="form-header">
                    <h2>Create Account</h2>
                    <p>Register as a doctor to access the portal</p>
                </div>

                <!-- error banner -->
                <div v-if="error" class="error-banner">
                    <i class="ph ph-warning-circle"></i>
                    {{ error }}
                </div>

                <!-- form grid -->
                <div class="form-body">

                    <!-- Full Name -->
                    <div class="field">
                        <label class="field-label">Full Name</label>
                        <div class="input-wrap">
                            <i class="ph ph-user input-icon"></i>
                            <input type="text" v-model="registration.name" placeholder="Enter your full name"
                                class="text-input" :class="{ 'input--error': fieldErrors.name }" />
                        </div>
                        <span v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</span>
                    </div>

                    <!-- Email -->
                    <div class="field">
                        <label class="field-label">Email Address</label>
                        <div class="input-wrap">
                            <i class="ph ph-envelope input-icon"></i>
                            <input type="email" v-model="registration.email" placeholder="doctor@hospital.com"
                                class="text-input" :class="{ 'input--error': fieldErrors.email }" />
                        </div>
                        <span v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</span>
                    </div>

                    <!-- Department -->
                    <div class="field">
                        <label class="field-label">Department</label>
                        <div class="input-wrap select-wrap">
                            <i class="ph ph-activity input-icon"></i>
                            <select class="text-input select-input" v-model="registration.department"
                                :class="{ 'input--error': fieldErrors.department }">
                                <option value="" disabled>Select a department</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Urology">Urology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Other">Other</option>
                            </select>
                            <i class="ph ph-caret-down select-chevron"></i>
                        </div>
                        <span v-if="fieldErrors.department" class="field-error">{{ fieldErrors.department }}</span>
                    </div>

                    <!-- Password + Confirm — side by side on desktop -->
                    <div class="field-row">
                        <div class="field">
                            <label class="field-label">Password</label>
                            <div class="input-wrap">
                                <i class="ph ph-lock input-icon"></i>
                                <input :type="showPassword ? 'text' : 'password'" v-model="registration.password"
                                    placeholder="Create password" class="text-input pr-input"
                                    :class="{ 'input--error': fieldErrors.password }" />
                                <button type="button" class="eye-btn" @click="showPassword = !showPassword"
                                    tabindex="-1">
                                    <i v-if="!showPassword" class="ph ph-eye"></i>
                                    <i v-else class="ph ph-eye-slash"></i>
                                </button>
                            </div>
                            <span v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</span>
                        </div>

                        <div class="field">
                            <label class="field-label">Confirm Password</label>
                            <div class="input-wrap">
                                <i class="ph ph-lock-key input-icon"></i>
                                <input :type="showConfirm ? 'text' : 'password'" v-model="registration.confirmPassword"
                                    placeholder="Confirm password" class="text-input pr-input"
                                    :class="{ 'input--error': fieldErrors.confirmPassword }" />
                                <button type="button" class="eye-btn" @click="showConfirm = !showConfirm" tabindex="-1">
                                    <i v-if="!showConfirm" class="ph ph-eye"></i>
                                    <i v-else class="ph ph-eye-slash"></i>
                                </button>
                            </div>
                            <span v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword
                            }}</span>
                        </div>
                    </div>

                    <!-- password strength -->
                    <div v-if="registration.password" class="strength-wrap">
                        <div class="strength-bar">
                            <div class="strength-fill" :style="{ width: strength.pct + '%' }"
                                :class="'strength--' + strength.level"></div>
                        </div>
                        <span class="strength-label" :class="'strength-text--' + strength.level">
                            {{ strength.label }}
                        </span>
                    </div>

                    <!-- CTA -->
                    <button class="btn-primary" @click="handleRegister" :disabled="loading">
                        <span v-if="!loading">Create Account</span>
                        <span v-else class="loading-row">
                            <i class="ph ph-spinner spin"></i>
                            Creating account…
                        </span>
                    </button>

                    <!-- divider -->
                    <div class="divider"><span>or</span></div>

                    <!-- login link -->
                    <p class="login-link">
                        Already have an account?
                        <RouterLink to="/login" class="link">Sign in</RouterLink>
                    </p>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Notify } from '@/utils/notify'

export default {
    name: 'Registration',

    data() {
        return {
            loading: false,
            error: '',
            showPassword: false,
            showConfirm: false,

            registration: {
                name: '',
                email: '',
                department: '',
                password: '',
                confirmPassword: ''
            },

            fieldErrors: {
                name: '',
                email: '',
                department: '',
                password: '',
                confirmPassword: ''
            }
        }
    },

    computed: {
        strength() {
            const p = this.registration.password
            if (!p) return { pct: 0, level: '', label: '' }
            let score = 0
            if (p.length >= 8) score++
            if (p.length >= 12) score++
            if (/[A-Z]/.test(p)) score++
            if (/[0-9]/.test(p)) score++
            if (/[^A-Za-z0-9]/.test(p)) score++
            if (score <= 1) return { pct: 25, level: 'weak', label: 'Weak' }
            if (score <= 2) return { pct: 50, level: 'fair', label: 'Fair' }
            if (score <= 3) return { pct: 75, level: 'good', label: 'Good' }
            return { pct: 100, level: 'strong', label: 'Strong' }
        }
    },

    methods: {
        clearFieldErrors() {
            this.fieldErrors = { name: '', email: '', department: '', password: '', confirmPassword: '' }
        },

        validate() {
            this.clearFieldErrors()
            let ok = true
            if (!this.registration.name.trim()) {
                this.fieldErrors.name = 'Full name is required'; ok = false
            }
            if (!this.registration.email.trim()) {
                this.fieldErrors.email = 'Email is required'; ok = false
            } else if (!/\S+@\S+\.\S+/.test(this.registration.email)) {
                this.fieldErrors.email = 'Enter a valid email'; ok = false
            }
            if (!this.registration.department) {
                this.fieldErrors.department = 'Please select a department'; ok = false
            }
            if (!this.registration.password) {
                this.fieldErrors.password = 'Password is required'; ok = false
            } else if (this.registration.password.length < 8) {
                this.fieldErrors.password = 'Minimum 8 characters'; ok = false
            }
            if (this.registration.password !== this.registration.confirmPassword) {
                this.fieldErrors.confirmPassword = 'Passwords do not match'; ok = false
            }
            return ok
        },

        async handleRegister() {
            this.error = ''
            if (!this.validate()) return

            try {
                this.loading = true

                const payload = {
                    name: this.registration.name,
                    email: this.registration.email,
                    department: this.registration.department,
                    password: this.registration.password
                }

                const res = await this.$api.post('/auth/register', payload)

                Notify.success('Registration successful')
                this.$router.push('/login')

            } catch (err) {
                console.error(err)
                this.error = err.response?.data?.detail || 'Registration failed. Please try again.'
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
/* ── Root layout ──────────────────────────────────────────────────── */
.reg-root {
    display: flex;
    min-height: 100vh;
    background: #f4f7f5;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ── Hero panel ───────────────────────────────────────────────────── */
.hero-panel {
    display: none;
    /* hidden on mobile */
    position: relative;
    width: 45%;
    flex-shrink: 0;
    background: linear-gradient(160deg, #2EAA5C 0%, #1B7A3E 60%, #155E30 100%);
    overflow: hidden;
}

@media (min-width: 900px) {
    .hero-panel {
        display: flex;
        flex-direction: column;
    }
}

.topo-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.hero-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 40px 48px;
    color: #fff;
}

.brand-icon {
    display: flex;
    align-items: center;
    gap: 10px;
}

.brand-name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.3px;
}

.brand-name--dark {
    color: #1B5E35;
}

.hero-text h1 {
    font-size: 38px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 14px;
    letter-spacing: -0.8px;
}

.hero-text p {
    font-size: 15px;
    line-height: 1.65;
    opacity: 0.82;
    max-width: 320px;
    margin: 0;
}

.hero-cards {
    display: flex;
    gap: 14px;
}

.hero-stat {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 14px;
    padding: 16px 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.stat-num {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.stat-label {
    font-size: 11px;
    opacity: 0.75;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ── Form panel ───────────────────────────────────────────────────── */
.form-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    min-height: 100vh;
}

.mobile-header {
    display: flex;
    justify-content: center;
    margin-bottom: 28px;
}

@media (min-width: 900px) {
    .mobile-header {
        display: none;
    }
}

.form-card {
    width: 100%;
    max-width: 520px;
    background: #ffffff;
    border-radius: 22px;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.08);
    padding: 40px 40px 36px;
}

@media (max-width: 500px) {
    .form-card {
        padding: 28px 22px 28px;
        border-radius: 18px;
    }
}

.form-header {
    text-align: center;
    margin-bottom: 28px;
}

.form-header h2 {
    font-size: 26px;
    font-weight: 800;
    color: #1B5E35;
    letter-spacing: -0.5px;
    margin: 0 0 6px;
}

.form-header p {
    font-size: 14px;
    color: #6b7c73;
    margin: 0;
}

/* ── Error banner ─────────────────────────────────────────────────── */
.error-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff2f2;
    border: 1px solid #fca5a5;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #dc2626;
    margin-bottom: 20px;
}

/* ── Form body ────────────────────────────────────────────────────── */
.form-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

@media (max-width: 520px) {
    .field-row {
        grid-template-columns: 1fr;
    }
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374040;
    letter-spacing: 0.1px;
}

/* ── Inputs ───────────────────────────────────────────────────────── */
.input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 13px;
    color: #8aab97;
    pointer-events: none;
    flex-shrink: 0;
}

.text-input {
    width: 100%;
    height: 46px;
    padding: 0 14px 0 40px;
    background: #f3f7f5;
    border: 1.5px solid #dde8e3;
    border-radius: 12px;
    font-size: 14px;
    color: #1a2e24;
    transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
    appearance: none;
    outline: none;
    box-sizing: border-box;
}

.text-input::placeholder {
    color: #aabcb3;
}

.text-input:focus {
    background: #fff;
    border-color: #2EAA5C;
    box-shadow: 0 0 0 3px rgba(46, 170, 92, 0.12);
}

.text-input.input--error {
    border-color: #f87171;
    background: #fff9f9;
}

/* select */
.select-wrap {
    position: relative;
}

.select-input {
    padding-right: 36px;
    cursor: pointer;
}

.select-chevron {
    position: absolute;
    right: 12px;
    color: #8aab97;
    pointer-events: none;
}

/* password eye toggle */
.pr-input {
    padding-right: 42px;
}

.eye-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #8aab97;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}

.eye-btn:hover {
    color: #2EAA5C;
}

/* field error text */
.field-error {
    font-size: 12px;
    color: #dc2626;
    margin-top: -2px;
}

/* ── Password strength ────────────────────────────────────────────── */
.strength-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: -8px;
}

.strength-bar {
    flex: 1;
    height: 4px;
    background: #e5ede9;
    border-radius: 99px;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.3s ease;
}

.strength--weak {
    background: #f87171;
}

.strength--fair {
    background: #fb923c;
}

.strength--good {
    background: #facc15;
}

.strength--strong {
    background: #2EAA5C;
}

.strength-label {
    font-size: 12px;
    font-weight: 600;
    min-width: 48px;
}

.strength-text--weak {
    color: #dc2626;
}

.strength-text--fair {
    color: #ea580c;
}

.strength-text--good {
    color: #ca8a04;
}

.strength-text--strong {
    color: #2EAA5C;
}

/* ── CTA button ───────────────────────────────────────────────────── */
.btn-primary {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    border-radius: 13px;
    cursor: pointer;
    letter-spacing: 0.2px;
    transition: opacity 0.18s, transform 0.15s;
    margin-top: 4px;
}

.btn-primary:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
    transform: translateY(0);
    opacity: 1;
}

.btn-primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

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
    animation: spin 0.9s linear infinite;
}

/* ── Divider ──────────────────────────────────────────────────────── */
.divider {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #b0c4bb;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.divider::before,
.divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5ede9;
}

/* ── Login link ───────────────────────────────────────────────────── */
.login-link {
    text-align: center;
    font-size: 14px;
    color: #6b7c73;
    margin: 0;
}

.link {
    color: #1B7A3E;
    font-weight: 700;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}
</style>