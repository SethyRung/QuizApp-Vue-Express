<template>
  <div
    class="w-full p-8 overflow-hidden"
    style="
      background: linear-gradient(90deg, #eff8fb 0%, #fbf8f2 100%);
      min-height: calc(100vh - 56px);
    "
  >
    <h1 class="font-roboto font-bold text-xl mb-4">Account Center</h1>
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
    <div class="h-20 rounded mb-4 bg-white flex items-center">
      <img :src="user.profile_picture.fullPath" alt="" class="w-12 h-12 ml-4 mr-2" />
      <div class="text-sm">
        <h3 class="font-bold">Profile</h3>
        <p class="text-gray-700">{{ user.username }}</p>
      </div>
    </div>
    <h2 class="font-roboto font-bold text-base">Account settings</h2>
    <ul class="h-28 rounded mt-4 mb-4 bg-white flex flex-col items-center">
      <li class="w-full h-full">
        <router-link :to="{ name: 'personal-details' }">
          <div class="h-full flex items-center">
            <i class="ml-4 mr-2 fa-regular fa-address-card"></i>
            <h3>Personal details</h3>
            <i class="ml-auto mr-4 fa-solid fa-angle-right"></i>
          </div>
        </router-link>
      </li>
      <li class="w-full h-full">
        <router-link :to="{ name: 'password-security' }">
          <div class="h-full flex items-center">
            <i class="ml-4 mr-2 fa-solid fa-shield-halved"></i>
            <h3>Password and security</h3>
            <i class="ml-auto mr-4 fa-solid fa-angle-right"></i>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios'
import { mapWritableState } from 'pinia'
import useConfigStore from '@/stores/config'
import userAuthStore from '@/stores/auth'
import AlertBox from '@/components/alert-box.vue'

export default {
  name: 'Account Center',
  components: {
    AlertBox
  },
  data() {
    return {
      user: {
        profile_picture: {
          name: 'circle-user-solid.svg',
          fullPath: '../src/assets/images/circle-user-solid.svg'
        },
        username: ''
      },
      alert: {
        show: false,
        intent: 'info',
        title: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapWritableState(useConfigStore, ['serverURL']),
    ...mapWritableState(userAuthStore, ['uid'])
  },
  async created() {
    try {
      const response = await axios.get('/user', {
        params: {
          uid: this.uid
        }
      })
      if (response.data.status === 'success') {
        if (response.data.user.profile_picture !== null) {
          this.user.profile_picture.name = response.data.user.profile_picture
          this.user.profile_picture.fullPath = `${this.serverURL}/${response.data.user.profile_picture}`
        }
        this.user.username = response.data.user.username
      }
    } catch (err) {
      this.alert.show = true
      this.alert.intent = 'danger'
      this.alert.title = 'User'
      this.alert.message = err.message
    }
  }
}
</script>
