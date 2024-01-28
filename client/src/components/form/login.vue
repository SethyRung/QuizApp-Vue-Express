<template>
  <div class="w-full bg-white">
    <h2 class="mb-4 max-w-sm mx-auto text-gray-800 font-bold text-lg">Hi, Welcome back!</h2>
    <div
      class="text-white text-center font-bold p-4 rounded mb-8 max-w-sm mx-auto"
      v-if="log_show_alert"
      :class="log_alert_variant"
    >
      {{ log_alert_msg }}
    </div>
    <vee-form
      class="max-w-sm mx-auto text-gray-800 text-base"
      @submit="login"
      :validation-schema="loginSchema"
    >
      <div class="mb-4">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="email"
        />
        <ErrorMessage class="text-red-500" name="email" />
      </div>
      <div class="mb-8">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          type="password"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="password"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>
      <button
        type="submit"
        class="mb-4 w-full h-10 text-white bg-emerald-400 rounded hover:bg-emerald-500"
        :disabled="log_in_submission"
      >
        Login
      </button>
    </vee-form>
    <div class="max-w-sm mx-auto">
      <p class="inline text-gray-800">Don't have an account?</p>
      <button
        class="text-gray-800 hover:underline decoration-solid"
        @click.prevent="this.$emit('tab-changed')"
      >
        Sign up
      </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useAuthStore from '@/stores/auth'

export default {
  name: 'login',
  data() {
    return {
      loginSchema: {
        email: 'required|email|min:3|max:100',
        password: 'required|min:8|max:100'
      },
      log_in_submission: false,
      log_show_alert: false,
      log_alert_variant: 'bg-blue-500',
      log_alert_msg: 'Please wait! We are logging you in.'
    }
  },
  emits: ['tab-changed'],
  computed: { ...mapWritableState(useAuthStore, ['userLoggedIn', 'uid', 'roles']) },
  methods: {
    async login(user) {
      this.log_show_alert = true
      this.log_in_submission = true
      this.log_alert_variant = 'bg-blue-500'
      this.log_alert_msg = 'Please wait! We are logging you in.'
      try {
        const res = await axios.post('/auth/login', {
          email: user.email,
          password: user.password
        })

        if (200 <= res.status && res.status < 300) {
          this.log_alert_variant = 'bg-green-500'
          this.log_alert_msg = 'Success! You are now logged in.'
          this.log_in_submission = false

          this.userLoggedIn = true
          this.uid = res.data.uid
          this.roles = res.data.roles
          localStorage.setItem('token', res.data.accessToken)
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`
          this.$router.push({ name: 'home', replace: true })
        }
      } catch (e) {
        this.log_in_submission = false
        this.log_alert_msg = e.message
        this.log_alert_variant = 'bg-red-500'
      }
    }
  }
}
</script>
<style></style>
