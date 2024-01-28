<template>
  <div class="w-full p-8 overflow-hidden">
    <h1 class="font-roboto font-bold text-xl mb-4">Password and security</h1>
    <AlertBox
      class="my-4"
      :show="alert.show"
      :intent="alert.intent"
      :title="alert.title"
      :onDismiss="
        () => {
          alert.show = !alert.show
        }
      "
    >
      <p>{{ alert.message }}</p>
    </AlertBox>
    <vee-form class="text-sm" @submit="submit">
      <div class="flex flex-col mb-4">
        <label>Current password</label>
        <vee-field
          type="password"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="currentPassword"
          rules="required|min:8|max:100"
          v-model="currentPassword"
        />
        <ErrorMessage class="text-red-500" name="currentPassword" />
      </div>
      <div class="flex flex-col mb-4">
        <label>New password</label>
        <vee-field
          type="password"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="newPassword"
          rules="required|min:8|max:100"
          v-model="newPassword"
        />
        <ErrorMessage class="text-red-500" name="newPassword" />
      </div>
      <div class="flex flex-col mb-4">
        <label>Confirm password</label>
        <vee-field
          type="password"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="confirmPassword"
          rules="required|passwords_mismatch:@newPassword"
        />
        <ErrorMessage class="text-red-500" name="confirmPassword" />
      </div>
      <div class="flex justify-center mt-10 gap-10">
        <router-link
          class="w-24 h-9 rounded text-indigo-500 border border-indigo-500 flex items-center justify-center hover:border-2 hover:text-indigo-800"
          :to="{ name: 'account' }"
        >
          Cancel
        </router-link>
        <button class="w-24 h-9 rounded text-white bg-indigo-500 hover:bg-indigo-600">
          Update
        </button>
      </div>
    </vee-form>
  </div>
</template>
<script>
import axios from 'axios'
import { mapWritableState } from 'pinia'
import userAuthStore from '@/stores/auth'
import AlertBox from '@/components/alert-box.vue'

export default {
  name: 'Password Security',
  components: {
    AlertBox
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      alert: {
        show: false,
        intent: 'info',
        title: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapWritableState(userAuthStore, ['uid'])
  },
  methods: {
    async submit() {
      try {
        const response = await axios.put('/user/changePassword', {
          uid: this.uid,
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        })
        if (response.data.status === 'success') {
          this.alert.show = true
          this.alert.intent = 'success'
          this.alert.message = response.data.message
        }
      } catch (err) {
        this.alert.show = true
        this.alert.intent = 'danger'
        this.alert.message = err.message
      }
    }
  }
}
</script>
