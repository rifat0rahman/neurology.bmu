<template>
    <!-- TOP -->
    <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50 space-y-2 text-white">
        <div v-for="n in topNotifications" :key="n.id" class="alert shadow-lg" :class="alertClass(n.type)">
            <span class="text-white">{{ n.message }}</span>
        </div>
    </div>

    <!-- BOTTOM -->
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 space-y-2 text-white">
        <div v-for="n in bottomNotifications" :key="n.id" class="alert shadow-lg" :class="alertClass(n.type)">
            <span class="text-white">{{ n.message }}</span>
        </div>
    </div>
</template>

<script>
import { computed } from "vue"
import { notifications } from "@/utils/notify"

export default {
    setup() {
        const topNotifications = computed(() =>
            notifications.filter(n => n.position === "top")
        )

        const bottomNotifications = computed(() =>
            notifications.filter(n => n.position === "bottom")
        )

        const alertClass = (type) => {
            return {
                "alert-info": type === "success",
                "alert-error": type === "error",
                "alert-info": type === "info"
            }
        }

        return {
            topNotifications,
            bottomNotifications,
            alertClass
        }
    }
}
</script>