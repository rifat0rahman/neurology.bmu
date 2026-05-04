<template>
    <div class="nav-root">

        <!-- ── MOBILE TOP BAR ───────────────────────────── -->
        <div class="mobile-topbar md:hidden">
            <div class="brand">
                <div class="brand-icon"><i class="ph ph-first-aid"></i></div>
                <span class="brand-name">MediRecord</span>
            </div>
            <a href="https://neurology.bmu.ac.bd/" target="_blank" class="nav-link">
                <i class="ph ph-book"></i>
                <span>About Neurology</span>
            </a>
        </div>

        <!-- ── DESKTOP NAVBAR ───────────────────────────── -->
        <div class="desktop-nav hidden md:flex">
            <div class="nav-left">
                <div class="brand">
                    <div class="brand-icon"><i class="ph ph-first-aid"></i></div>
                    <span class="brand-name">MediRecord</span>
                </div>
            </div>

            <div class="nav-center">
                <ul class="nav-menu">
                    <li>
                        <RouterLink to="/" :class="isActive('/')" class="nav-link">
                            <i class="ph ph-house"></i>
                            Dashboard
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/entry" :class="isActive('/entry')" class="nav-link">
                            <i class="ph ph-user-plus"></i>
                            Add Patient
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/records" :class="isActive('/records')" class="nav-link">
                            <i class="ph ph-list"></i>
                            Records
                        </RouterLink>
                    </li>
                    <li v-if="user?.role === 'admin'">
                        <RouterLink to="/admin" :class="isActive('/admin')" class="nav-link">
                            <i class="ph ph-gear"></i>
                            Control
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink to="/settings" :class="isActive('/settings')" class="nav-link">
                            <i class="ph ph-user"></i>
                            Settings
                        </RouterLink>
                    </li>
                    <li>
                        <a href="https://neurology.bmu.ac.bd/" target="_blank" class="nav-link">
                            <i class="ph ph-book"></i>
                            About Neurology
                        </a>
                    </li>
                </ul>
            </div>

            <div class="nav-right">
                <button class="btn-logout" @click="logout">
                    <i class="ph ph-sign-out"></i>
                    Logout
                </button>
            </div>
        </div>

        <!-- ── MOBILE DOCK ──────────────────────────────── -->
        <div class="mobile-dock md:hidden">
            <button :class="dockActive('/')" @click="$router.push('/')">
                <i class="ph ph-house"></i>
                <span>Home</span>
            </button>

            <button :class="dockActive('/entry')" @click="$router.push('/entry')">
                <i class="ph ph-user-plus"></i>
                <span>Add</span>
            </button>

            <button :class="dockActive('/records')" @click="$router.push('/records')">
                <i class="ph ph-list"></i>
                <span>Records</span>
            </button>

            <button v-if="user?.role === 'admin'" :class="dockActive('/admin')" @click="$router.push('/admin')">
                <i class="ph ph-gear"></i>
                <span>Admin</span>
            </button>

            <button :class="dockActive('/settings')" @click="$router.push('/settings')">
                <i class="ph ph-user"></i>
                <span>Settings</span>
            </button>
        </div>

    </div>
</template>

<script>
import { jwtDecode } from "jwt-decode"

export default {
    data() {
        return {
            user: null
        }
    },

    methods: {
        logout() {
            localStorage.removeItem("token")
            this.$router.push("/login")
        },

        loadUser() {
            const token = localStorage.getItem("token")

            if (!token) return

            try {
                this.user = jwtDecode(token)
            } catch {
                this.logout()
            }
        },
        isActive(path) {
            return this.$route.path === path
                ? "nav-link active"
                : "nav-link"
        },

        dockActive(path) {
            return this.$route.path === path
                ? "dock-btn active"
                : "dock-btn"
        }
    },

    mounted() {
        this.loadUser()
    }
}
</script>

<style scoped>
.nav-root {
    font-family: 'Plus Jakarta Sans', 'Inter', 'Segoe UI', sans-serif;
}
@media (min-width: 768px) {

    .mobile-topbar,
    .mobile-dock {
        display: none !important;
    }
}

@media (max-width: 767px) {
    .desktop-nav {
        display: none !important;
    }
}

/* ── MOBILE TOP BAR ── */
.mobile-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 56px;
    background: #fff;
    border-bottom: 1px solid #dde8e3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

/* ── DESKTOP NAV ── */
.desktop-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 64px;
    background: #fff;
    border-bottom: 1px solid #dde8e3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.brand-icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2EAA5C, #1B7A3E);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.brand-name {
    font-size: 16px;
    font-weight: 800;
    color: #1B5E35;
}

.nav-menu {
    display: flex;
    gap: 10px;
    align-items: center;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #6b7c73;
    transition: all .15s;
}

.nav-link i {
    font-size: 16px;
}

.nav-link:hover {
    color: #1B5E35;
    background: #f3f7f5;
}

.nav-link.active {
    color: #fff;
    background: #2EAA5C;
}

.btn-logout {
    padding: 8px 14px;
    border-radius: 10px;
    border: 1.5px solid #dde8e3;
    background: #fff;
    font-size: 12px;
    font-weight: 700;
    color: #1B5E35;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all .15s;
}

.btn-logout:hover {
    border-color: #2EAA5C;
    color: #1B7A3E;
}

/* ── MOBILE DOCK ── */
.mobile-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    height: 64px;
    background: #fff;
    border-top: 1px solid #dde8e3;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    padding: 6px 10px;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
}

.dock-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #8aab97;
    background: none;
    border: none;
    cursor: pointer;
}

.dock-btn i {
    font-size: 20px;
}

.dock-btn.active {
    color: #2EAA5C;
}

.icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1.5px solid #dde8e3;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1B5E35;
    background: #fff;
    cursor: pointer;
}
</style>