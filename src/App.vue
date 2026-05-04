<template>

  <!-- 🔥 SHOW NAVBAR ONLY IF NOT AUTH PAGE -->
  <navbar v-if="showNavbar" />

  <notification />

  <div :class="layoutPadding">
    <RouterView />
  </div>

</template>

<script>
import navbar from './components/navbar.vue'
import notification from './components/notification.vue'

export default {
  components: {
    navbar,
    notification
  },

  computed: {

    showNavbar() {
      return !this.$route.meta.hideNavbar
    },

    layoutPadding() {
      if (!this.showNavbar) return ""

      return "pt-12 md:pt-16 pb-20 md:pb-4"
    }

  }
}
</script>
