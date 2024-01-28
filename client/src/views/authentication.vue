<template>
  <div class="w-full min-h-full p-8 flex flex-col gap-5 text-sm">
    <div class="h-2/4">
      <img src="@/assets/images/9233873_4119037.svg" alt="Login image" />
    </div>
    <div class="w-full h-2/4 relative">
      <transition enter-active-class="animate__slideInLeft">
        <Login v-if="this.tab === 'Login'" @tab-changed="tabChange" />
      </transition>
      <transition enter-active-class="animate__slideInRight">
        <Register v-if="this.tab !== 'Login'" @tab-changed="tabChange" />
      </transition>
    </div>
  </div>
</template>
<script>
import Login from '@/components/form/login.vue'
import Register from '@/components/form/Register.vue'
export default {
  name: 'authentication',
  components: { Login, Register },
  data() {
    return {
      tab: 'Login'
    }
  },
  methods: {
    tabChange() {
      if (this.tab === 'Login') {
        this.tab = 'Register'
      } else {
        this.tab = 'Login'
      }
    }
  }
}
</script>
<style>
.animate__slideInRight,
.animate__slideOutLeft,
.animate__slideInLeft,
.animate__slideOutRight {
  animation-duration: 0.5s;
}
</style>
