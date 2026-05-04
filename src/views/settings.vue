<template>
    <div class="settings-root">
        <div class="settings-wrap">

            <h1 class="page-title">Settings</h1>

            <!-- PROFILE -->
            <div class="settings-card">
                <div class="card-head">
                    <h2>Profile</h2>
                    <p>Update your public information</p>
                </div>

                <div class="form-body">
                    <div class="field">
                        <label class="field-label">Full Name</label>
                        <div class="input-wrap">
                            <i class="ph ph-user input-icon"></i>
                            <input v-model="form.name" class="text-input" placeholder="Full Name"
                                :class="{ 'input--error': errors.name }" />
                        </div>
                        <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
                    </div>

                    <div class="field">
                        <label class="field-label">Email</label>
                        <div class="input-wrap">
                            <i class="ph ph-envelope input-icon"></i>
                            <input v-model="form.email" class="text-input" disabled />
                        </div>
                    </div>

                    <div class="field">
                        <label class="field-label">Department</label>
                        <div class="input-wrap">
                            <i class="ph ph-activity input-icon"></i>
                            <input v-model="form.department" class="text-input" placeholder="Department"
                                :class="{ 'input--error': errors.department }" />
                        </div>
                        <span v-if="errors.department" class="field-error">{{ errors.department }}</span>
                    </div>

                    <button class="btn-primary" @click="updateProfile">
                        Update Profile
                    </button>
                </div>
            </div>

            <!-- PASSWORD -->
            <div class="settings-card">
                <div class="card-head">
                    <h2>Change Password</h2>
                    <p>Use a strong and unique password</p>
                </div>

                <div class="form-body">
                    <div class="field">
                        <label class="field-label">Current Password</label>
                        <div class="input-wrap">
                            <i class="ph ph-lock input-icon"></i>
                            <input v-model="password.current" type="password" class="text-input"
                                placeholder="Current Password" :class="{ 'input--error': errors.current }" />
                        </div>
                        <span v-if="errors.current" class="field-error">{{ errors.current }}</span>
                    </div>

                    <div class="field">
                        <label class="field-label">New Password</label>
                        <div class="input-wrap">
                            <i class="ph ph-lock-key input-icon"></i>
                            <input v-model="password.new" type="password" class="text-input" placeholder="New Password"
                                :class="{ 'input--error': errors.new }" />
                        </div>
                        <span v-if="errors.new" class="field-error">{{ errors.new }}</span>
                    </div>

                    <div class="field">
                        <label class="field-label">Confirm Password</label>
                        <div class="input-wrap">
                            <i class="ph ph-lock-key input-icon"></i>
                            <input v-model="password.confirm" type="password" class="text-input"
                                placeholder="Confirm Password" :class="{ 'input--error': errors.confirm }" />
                        </div>
                        <span v-if="errors.confirm" class="field-error">{{ errors.confirm }}</span>
                    </div>

                    <button class="btn-warning" @click="changePassword">
                        Change Password
                    </button>
                </div>
            </div>

            <!-- LOGOUT -->
            <div class="settings-card">
                <div class="card-head">
                    <h2>Logout</h2>
                    <p>End your current session</p>
                </div>

                <div class="form-body">
                    <button class="btn-danger" @click="logout">
                        Logout
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { Notify } from "@/utils/notify"

export default {
    name: "Settings",

    data() {
        return {
            form: {
                name: "",
                email: "",
                department: ""
            },

            password: {
                current: "",
                new: "",
                confirm: ""
            },

            errors: {
                name: "",
                department: "",
                current: "",
                new: "",
                confirm: ""
            }
        }
    },

    methods: {
        clearErrors() {
            this.errors = {
                name: "",
                department: "",
                current: "",
                new: "",
                confirm: ""
            }
        },

        validateProfile() {
            this.clearErrors()
            let ok = true

            if (!this.form.name.trim()) {
                this.errors.name = "Full name is required"
                ok = false
            }

            if (!this.form.department.trim()) {
                this.errors.department = "Department is required"
                ok = false
            }

            return ok
        },

        validatePassword() {
            this.clearErrors()
            let ok = true

            if (!this.password.current) {
                this.errors.current = "Current password is required"
                ok = false
            }

            if (!this.password.new) {
                this.errors.new = "New password is required"
                ok = false
            } else if (this.password.new.length < 8) {
                this.errors.new = "Minimum 8 characters"
                ok = false
            }

            if (!this.password.confirm) {
                this.errors.confirm = "Please confirm the password"
                ok = false
            } else if (this.password.new !== this.password.confirm) {
                this.errors.confirm = "Passwords do not match"
                ok = false
            }

            return ok
        },

        async loadProfile() {
            try {
                const res = await this.$api.get("/users/me")
                this.form = res.data
            } catch {
                Notify.error("Failed to load profile")
            }
        },

        async updateProfile() {
            if (!this.validateProfile()) return

            try {
                await this.$api.patch("/users/me", {
                    name: this.form.name,
                    department: this.form.department
                })

                Notify.info("Profile updated")

            } catch {
                Notify.error("Update failed")
            }
        },

        async changePassword() {
            if (!this.validatePassword()) return

            if (this.password.new !== this.password.confirm) {
                Notify.error("Passwords do not match")
                return
            }

            try {
                await this.$api.patch("/users/change-password", {
                    current_password: this.password.current,
                    new_password: this.password.new
                })

                Notify.info("Password changed")

                this.password = {
                    current: "",
                    new: "",
                    confirm: ""
                }

            } catch (err) {
                Notify.error(err.response?.data?.detail || "Failed")
            }
        },

        logout() {
            localStorage.removeItem("token")
            this.$router.push("/login")
        },

    },

    mounted() {
        this.loadProfile()
    }
}
</script>

<style scoped>
/* ── Root layout ──────────────────────────────────────────────────── */
.settings-root {
    min-height: 100vh;
    background: #f4f7f5;
    padding: 32px 20px;
    font-family: 'Inter', 'Segoe UI', sans-serif;
}

.settings-wrap {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ── Title ────────────────────────────────────────────────────────── */
.page-title {
    font-size: 24px;
    font-weight: 800;
    color: #1B5E35;
    margin: 0;
    letter-spacing: -0.4px;
}

/* ── Card ─────────────────────────────────────────────────────────── */
.settings-card {
    background: #ffffff;
    border-radius: 18px;
    box-shadow: 0 4px 28px rgba(0, 0, 0, 0.08);
    padding: 26px 28px;
}

.card-head {
    margin-bottom: 16px;
}

.card-head h2 {
    margin: 0 0 4px;
    font-size: 18px;
    font-weight: 800;
    color: #1B5E35;
}

.card-head p {
    margin: 0;
    font-size: 13px;
    color: #6b7c73;
}

/* ── Form body ────────────────────────────────────────────────────── */
.form-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

.field-error {
    font-size: 12px;
    color: #dc2626;
    margin-top: -2px;
}

/* ── Buttons ──────────────────────────────────────────────────────── */
.btn-primary {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
}

.btn-primary:hover {
    opacity: 0.92;
    transform: translateY(-1px);
}

.btn-warning {
    width: 100%;
    height: 48px;
    background: #1B5E35;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
}

.btn-warning:hover {
    opacity: 0.92;
    transform: translateY(-1px);
}

.btn-danger {
    width: 100%;
    height: 48px;
    background: #ef4444;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
}

.btn-danger:hover {
    opacity: 0.9;
}
</style>