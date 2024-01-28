<template>
  <div class="w-full bg-white">
    <h2 class="mb-4 max-w-sm mx-auto text-gray-800 font-bold text-lg">Join Us</h2>

    <div
      class="text-white text-center font-bold p-4 rounded mb-4 max-w-sm mx-auto"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_msg }}
    </div>

    <vee-form
      class="max-w-sm mx-auto text-gray-800 text-base"
      @submit="register"
      :validation-schema="registerSchema"
    >
      <div class="mb-4">
        <label class="inline-block mb-2">Username</label>
        <vee-field
          type="text"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="username"
        />
        <ErrorMessage class="text-red-500" name="username" />
      </div>
      <div class="mb-4">
        <label class="inline-block mb-2">Email</label>
        <vee-field
          type="email"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="email"
        />
        <ErrorMessage class="text-red-500" name="email" />
      </div>
      <div class="mb-4">
        <label class="inline-block mb-2">Password</label>
        <vee-field
          type="password"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="password"
        />
        <ErrorMessage class="text-red-500" name="password" />
      </div>
      <div class="mb-4">
        <label class="inline-block mb-2">Confirm Password</label>
        <vee-field
          type="password"
          class="block w-full h-10 p-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
          name="confirm_password"
        />
        <ErrorMessage class="text-red-500" name="confirm_password" />
      </div>
      <div class="mb-8">
        <div class="h-10 flex items-center">
          <vee-field
            type="checkbox"
            class="w-5 h-5 mr-2 border-2 border-gray-500 focus:outline-none focus:border-black rounded"
            value="1"
            name="tos"
          />
          <label class="inline-block"
            >I accept
            <a href="#" class="hover:underline decoration-solid">Terms of Service</a></label
          >
        </div>
        <ErrorMessage class="text-red-500 block" name="tos" />
      </div>
      <button
        type="submit"
        class="mb-4 w-full h-10 text-white bg-emerald-400 rounded hover:bg-emerald-500"
        :disabled="reg_in_submission"
      >
        Sign up
      </button>
    </vee-form>
    <div class="max-w-sm mx-auto">
      <button
        class="text-gray-800 hover:underline decoration-solid"
        @click.prevent="this.$emit('tab-changed')"
      >
        Back to log in
      </button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'register',
  data() {
    return {
      registerSchema: {
        username: 'required|min:3|max:100|alpha_spaces',
        email: 'required|email||min:3|max:100',
        password: 'required|min:8|max:100',
        confirm_password: 'required|passwords_mismatch:@password',
        tos: 'required'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.'
    }
  },
  emits: ['tab-changed'],
  methods: {
    async register(user) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      try {
        const res = await axios.post('/auth/register', {
          username: user.username,
          email: user.email,
          password: user.password
        })
        this.reg_alert_msg = res.data.message
        if (res.data.status === 'success') {
          this.reg_in_submission = false
          this.reg_alert_variant = 'bg-green-500'
          setTimeout(() => {
            this.$emit('tab-changed')
          }, 2500)
        } else throw new Error()
      } catch (e) {
        this.reg_in_submission = false
        this.reg_alert_msg = e.message
        this.reg_alert_variant = 'bg-red-500'
      }
    }
  }
}
</script>
<style></style>
