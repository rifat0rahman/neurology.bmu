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
                    <p>Access patient records, appointments and analysis with one secure login.</p>
                </div>

                <div class="hero-cards">
                    <div class="hero-stat">
                        <span class="stat-num">24/7</span>
                        <span class="stat-label">Secure access</span>
                    </div>
                    <div class="hero-stat">
                        <span class="stat-num">12k+</span>
                        <span class="stat-label">Active doctors</span>
                    </div>
                    <div class="hero-stat">
                        <span class="stat-num">98%</span>
                        <span class="stat-label">Record accuracy</span>
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
                    <h2>Welcome Back</h2>
                    <p>Login to your account</p>
                </div>

                <!-- form grid -->
                <div class="form-body">

                    <!-- Email -->
                    <div class="field">
                        <label class="field-label">Email Address</label>
                        <div class="input-wrap">
                            <i class="ph ph-envelope input-icon"></i>
                            <input type="email" v-model="login.email" placeholder="Enter your email"
                                class="text-input" />
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="field">
                        <label class="field-label">Password</label>
                        <div class="input-wrap">
                            <i class="ph ph-lock input-icon"></i>
                            <input type="password" v-model="login.password" placeholder="Enter your password"
                                class="text-input pr-input" />
                        </div>
                    </div>

                    <!-- options -->
                    <div class="login-options">
                        <a href="#" class="link">Forgot password?</a>
                    </div>

                    <!-- CTA -->
                    <button class="btn-primary" @click="handleLogin" :disabled="loading">
                        <span v-if="!loading">Login</span>
                        <span v-else class="loading-row">
                            <i class="ph ph-spinner spin"></i>
                            Logging in...
                        </span>
                    </button>

                    <!-- divider -->
                    <div class="divider"><span>or</span></div>

                    <!-- signup link -->
                    <p class="login-link">
                        Don’t have an account?
                        <RouterLink to="/registration" class="link">Signup</RouterLink>
                    </p>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: "Login",

    data() {
        return {
            loading: false,
            login: {
                email: "",
                password: ""
            }
        }
    },

    methods: {
        async handleLogin() {
            // 🔐 validation
            if (!this.login.email || !this.login.password) {
                this.$notify.error("Please fill all fields")
                return
            }

            try {
                this.loading = true

                const res = await this.$api.post("/auth/login", this.login)

                // ✅ store token
                const token = res.data.access_token
                localStorage.setItem("token", token)

                this.$notify.info("Login successful")

                // 🚀 redirect to dashboard
                this.$router.push("/")

            } catch (err) {
                console.error(err)

                const msg =
                    err.response?.data?.detail ||
                    "Login failed. Check credentials."

                this.$notify.error(msg)
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

/* ── Form body ────────────────────────────────────────────────────── */
.form-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
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

.pr-input {
    padding-right: 14px;
}

/* ── Options ──────────────────────────────────────────────────────── */
.login-options {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;
}

.link {
    color: #1B7A3E;
    font-weight: 700;
    text-decoration: none;
    font-size: 13px;
}

.link:hover {
    text-decoration: underline;
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

/* ── Signup link ──────────────────────────────────────────────────── */
.login-link {
    text-align: center;
    font-size: 14px;
    color: #6b7c73;
    margin: 0;
}
</style>