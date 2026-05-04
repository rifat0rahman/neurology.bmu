<template>
    <div class="page-wrapper">

        <!-- ── SKELETON ─────────────────────────────────────────────────── -->
        <transition name="fade">
            <div v-if="loading" class="skeleton-overlay">
                <div class="skeleton-wrap">
                    <div class="skel skel-title"></div>
                    <div class="skel skel-subtitle"></div>
                    <div class="skel skel-card" v-for="n in 4" :key="n"></div>
                </div>
            </div>
        </transition>

        <div class="admin-wrap">

            <!-- Page title -->
            <div class="page-title">
                <div class="page-title-left">
                    <div>
                        <h1>Admin Control Panel</h1>
                        <p>Manage users, roles, and access</p>
                    </div>
                </div>
                <div class="user-count-badge" v-if="!loading">
                    <i class="ph ph-users"></i>
                    {{ users.length }} users
                </div>
            </div>

            <!-- ── MOBILE: CARDS ─────────────────────────────────────────── -->
            <div class="cards-list">
                <div v-for="(u, i) in users" :key="u.id" class="admin-card" :style="{ animationDelay: i * 40 + 'ms' }">

                    <div class="card-top">
                        <div class="card-meta-head">
                            <div class="card-name">{{ u.name }}</div>
                            <div class="card-email">{{ u.email }}</div>
                        </div>
                        <span class="role-badge" :class="u.role === 'admin' ? 'role-admin' : 'role-user'">
                            {{ u.role }}
                        </span>
                    </div>

                    <div class="card-meta">
                        <div class="meta-item">
                            <span class="meta-label"><i class="ph ph-buildings"></i> Department</span>
                            <span class="meta-val">{{ u.department }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label"><i class="ph ph-tag"></i> Role</span>
                            <select class="select-input" v-model="u.role" @change="changeRole(u)">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div class="card-actions">
                        <button class="btn-action btn-edit" @click="openReset(u)">
                            <i class="ph ph-key"></i> Reset Password
                        </button>
                        <button class="btn-action btn-del" @click="deleteUser(u)">
                            <i class="ph ph-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>

            <!-- ── DESKTOP: TABLE ────────────────────────────────────────── -->
            <div class="table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th class="th-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="u in users" :key="u.id">
                            <td>
                                <div class="td-user">
                                    <div>
                                        <div class="td-name">{{ u.name }}</div>
                                        <div class="td-sub">{{ u.department }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-email">{{ u.email }}</td>
                            <td>{{ u.department }}</td>
                            <td>
                                <select class="select-input" v-model="u.role" @change="changeRole(u)">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td class="td-actions">
                                <button class="btn-outline" @click="openReset(u)">
                                    <i class="ph ph-key"></i> Reset Password
                                </button>
                                <button class="btn-danger" @click="deleteUser(u)">
                                    <i class="ph ph-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Empty state -->
                <div v-if="!loading && users.length === 0" class="empty-state">
                    <i class="ph ph-users-three empty-icon"></i>
                    <p>No users found</p>
                </div>
            </div>

        </div>

        <!-- ── DAISYUI RESET PASSWORD MODAL ─────────────────────────────── -->
        <dialog ref="resetModal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box reset-modal-box">

                <!-- Modal header -->
                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="ph ph-key"></i>
                    </div>
                    <div>
                        <h3 class="modal-title">Reset Password</h3>
                        <p class="modal-sub" v-if="selected">For {{ selected.name }}</p>
                    </div>
                </div>

                <div class="modal-divider"></div>

                <!-- Password field -->
                <div class="modal-field">
                    <label class="field-label">New Password</label>
                    <div class="input-wrap">
                        <i class="ph ph-lock input-icon"></i>
                        <input v-model="newPassword" :type="showModalPassword ? 'text' : 'password'"
                            placeholder="Enter new password" class="text-input"
                            :class="{ 'input--error': errors.newPassword }" />
                        <button type="button" class="eye-btn" @click="showModalPassword = !showModalPassword"
                            tabindex="-1">
                            <i :class="showModalPassword ? 'ph ph-eye-slash' : 'ph ph-eye'"></i>
                        </button>
                    </div>
                    <p v-if="errors.newPassword" class="field-error">
                        <i class="ph ph-warning-circle"></i> {{ errors.newPassword }}
                    </p>
                </div>

                <!-- Modal actions -->
                <div class="modal-action mt-0">
                    <button class="btn-ghost" @click="closeModal">
                        <i class="ph ph-x"></i> Cancel
                    </button>
                    <button class="btn-primary-sm" @click="confirmReset">
                        <i class="ph ph-check"></i> Reset Password
                    </button>
                </div>

            </div>
            <!-- Click outside to close -->
            <form method="dialog" class="modal-backdrop">
                <button @click="closeModal">close</button>
            </form>
        </dialog>

    </div>
</template>

<script>
import { Notify } from "@/utils/notify"

export default {
    name: "Admin",

    data() {
        return {
            users: [],
            selected: null,
            newPassword: "",
            loading: false,
            showModalPassword: false,
            errors: {
                newPassword: ""
            }
        }
    },

    methods: {
        clearErrors() {
            this.errors.newPassword = ""
        },

        validateReset() {
            this.clearErrors()
            let ok = true
            if (!this.newPassword.trim()) {
                this.errors.newPassword = "Password is required"
                ok = false
            } else if (this.newPassword.length < 6) {
                this.errors.newPassword = "Minimum 6 characters"
                ok = false
            }
            return ok
        },

        async loadUsers() {
            try {
                this.loading = true
                const res = await this.$api.get("/users")
                this.users = res.data
            } catch (err) {
                Notify.error("Failed to load users")
            } finally {
                this.loading = false
            }
        },

        async changeRole(user) {
            try {
                await this.$api.patch(`/users/${user.id}/role`, null, {
                    params: { role: user.role }
                })
                Notify.info("Role updated")
            } catch (err) {
                Notify.error("Failed to update role")
            }
        },

        openReset(user) {
            this.selected = user
            this.newPassword = ""
            this.showModalPassword = false
            this.clearErrors()
            this.$refs.resetModal.showModal()
        },

        closeModal() {
            this.$refs.resetModal.close()
        },

        async confirmReset() {
            if (!this.validateReset()) {
                Notify.error("Please fix the errors")
                return
            }
            try {
                await this.$api.patch(
                    `/users/${this.selected.id}/reset-password`,
                    null,
                    { params: { password: this.newPassword } }
                )
                Notify.success("Password reset successfully")
                this.closeModal()
            } catch (err) {
                Notify.error("Reset failed")
            }
        },

        async deleteUser(user) {
            if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return
            try {
                await this.$api.delete(`/users/${user.id}`)
                this.users = this.users.filter(u => u.id !== user.id)
                Notify.info("User deleted")
            } catch (err) {
                Notify.error("Delete failed")
            }
        }
    },

    mounted() {
        this.loadUsers()
    }
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────────────────────── */
.page-wrapper {
    position: relative;
    min-height: 100vh;
    background: #f4f7f5;
    font-family: 'Inter', 'Segoe UI', sans-serif;
    padding: 32px 24px 60px;
}

.admin-wrap {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

/* ── Page title ───────────────────────────────────────────────────── */
.page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
}

.page-title-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.title-icon {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 22px;
    flex-shrink: 0;
}

.page-title h1 {
    font-size: 22px;
    font-weight: 800;
    color: #1B5E35;
    margin: 0 0 3px;
    letter-spacing: -0.4px;
}

.page-title p {
    font-size: 13px;
    color: #6b7c73;
    margin: 0;
}

.user-count-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 1.5px solid #dde8e3;
    border-radius: 99px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #1B5E35;
}

/* ── Avatar ───────────────────────────────────────────────────────── */
.avatar {
    width: 46px;
    height: 46px;
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
    width: 36px;
    height: 36px;
    font-size: 13px;
    border-radius: 10px;
}

/* ── Role badge ───────────────────────────────────────────────────── */
.role-badge {
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    flex-shrink: 0;
}

.role-admin {
    background: rgba(46, 170, 92, 0.12);
    color: #1B7A3E;
    border: 1px solid rgba(46, 170, 92, 0.25);
}

.role-user {
    background: rgba(100, 116, 139, 0.1);
    color: #475569;
    border: 1px solid rgba(100, 116, 139, 0.2);
}

/* ── Mobile cards ─────────────────────────────────────────────────── */
.cards-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

@media (min-width: 760px) {
    .cards-list {
        display: none;
    }
}

.admin-card {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #dde8e3;
    padding: 16px;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: fadeUp .25s ease both;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: none;
    }
}

.card-top {
    display: flex;
    align-items: center;
    gap: 12px;
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

.card-email {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
}

.card-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    background: #f4f7f5;
    border-radius: 12px;
    padding: 12px;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
    color: #8aab97;
    display: flex;
    align-items: center;
    gap: 4px;
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
    border: none;
}

.btn-action:active {
    transform: scale(.97);
}

.btn-edit {
    background: rgba(46, 170, 92, 0.1);
    color: #1B7A3E;
    border: 1.5px solid rgba(46, 170, 92, 0.25);
}

.btn-del {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border: 1.5px solid rgba(239, 68, 68, 0.2);
}

/* ── Desktop table ────────────────────────────────────────────────── */
.table-wrap {
    display: none;
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #dde8e3;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}

@media (min-width: 760px) {
    .table-wrap {
        display: block;
    }
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.admin-table thead th {
    text-align: left;
    color: #6b7c73;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 14px 18px;
    background: #f9fbfa;
    border-bottom: 1.5px solid #e5ede9;
    white-space: nowrap;
}

.admin-table tbody tr {
    transition: background 0.12s;
}

.admin-table tbody tr:hover {
    background: #f9fbfa;
}

.admin-table tbody td {
    padding: 13px 18px;
    border-bottom: 1px solid #eef4f1;
    color: #1a2e24;
    vertical-align: middle;
}

.admin-table tbody tr:last-child td {
    border-bottom: none;
}

.td-user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.td-name {
    font-weight: 700;
    color: #1a2e24;
}

.td-sub {
    font-size: 11px;
    color: #8aab97;
    margin-top: 2px;
}

.td-email {
    color: #6b7c73;
}

.th-right {
    text-align: right !important;
}

.td-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
}

/* Select input (shared card + table) */
.select-input {
    background: #f3f7f5;
    border: 1.5px solid #dde8e3;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 600;
    color: #1a2e24;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s;
    appearance: none;
}

.select-input:focus {
    border-color: #2EAA5C;
}

.btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 10px;
    border: 1.5px solid #dde8e3;
    background: #fff;
    color: #1B5E35;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
}

.btn-outline:hover {
    background: #f3f7f5;
    border-color: #2EAA5C;
}

.btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 10px;
    border: none;
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-danger:hover {
    background: rgba(239, 68, 68, 0.18);
}

/* ── Empty state ──────────────────────────────────────────────────── */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #8aab97;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
}

.empty-state p {
    font-size: 14px;
    font-weight: 600;
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
.skeleton-overlay {
    position: absolute;
    inset: 0;
    background: #f4f7f5;
    z-index: 50;
    padding: 32px 24px;
}

.skeleton-wrap {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.skel {
    background: linear-gradient(90deg, #e5ede9 25%, #d4e3da 50%, #e5ede9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 14px;
}

.skel-title {
    height: 28px;
    width: 260px;
}

.skel-subtitle {
    height: 16px;
    width: 180px;
}

.skel-card {
    height: 72px;
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

/* ── Modal ────────────────────────────────────────────────────────── */
.reset-modal-box {
    background: #fff;
    border-radius: 20px !important;
    padding: 28px !important;
    border: 1.5px solid #e5ede9;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.13) !important;
    max-width: 420px !important;
    width: 100%;
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
}

.modal-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    flex-shrink: 0;
}

.modal-title {
    font-size: 18px;
    font-weight: 800;
    color: #1B5E35;
    margin: 0 0 3px;
}

.modal-sub {
    font-size: 13px;
    color: #6b7c73;
    margin: 0;
}

.modal-divider {
    height: 1px;
    background: #e5ede9;
    margin-bottom: 20px;
}

.modal-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 22px;
}

.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374040;
}

.input-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 13px;
    font-size: 17px;
    color: #8aab97;
    pointer-events: none;
}

.text-input {
    width: 100%;
    height: 48px;
    padding: 0 42px 0 40px;
    background: #f3f7f5;
    border: 1.5px solid #dde8e3;
    border-radius: 12px;
    font-size: 14px;
    color: #1a2e24;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
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

.eye-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #8aab97;
    font-size: 17px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}

.eye-btn:hover {
    color: #2EAA5C;
}

.field-error {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #dc2626;
}

/* Modal action row */
.modal-action {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-radius: 11px;
    border: 1.5px solid #dde8e3;
    background: #fff;
    font-size: 13px;
    font-weight: 600;
    color: #374040;
    cursor: pointer;
    transition: background 0.15s;
}

.btn-ghost:hover {
    background: #f4f7f5;
}

.btn-primary-sm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 18px;
    border-radius: 11px;
    border: none;
    background: linear-gradient(135deg, #2EAA5C 0%, #1B7A3E 100%);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.12s;
}

.btn-primary-sm:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}
</style>