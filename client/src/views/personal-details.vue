<template>
  <div class="w-full p-8 overflow-hidden">
    <h1 class="font-roboto font-bold text-xl">Personal details</h1>
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
        <label for="profile_picture">
          <div class="h-20 rounded bg-white flex items-center">
            <img :src="user.profile_picture.fullPath" alt="" class="w-12 h-12 mr-2" />
            <div class="text-sm">
              <h3 class="font-bold">Profile photo</h3>
              <p class="text-gray-700">This will display in your profile</p>
            </div>
          </div>
        </label>
        <vee-field
          id="profile_picture"
          name="profile_picture"
          type="file"
          class="sr-only"
          :rules="this.iconRule"
          @change="handleUploadImage($event)"
        />
        <ErrorMessage class="text-red-500" name="icon" />
      </div>
      <div class="flex flex-col mb-4">
        <label>Username</label>
        <vee-field
          type="text"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="username"
          rules="required"
          v-model="user.username"
        />
        <ErrorMessage class="text-red-500" name="username" />
      </div>
      <div class="flex flex-col mb-4">
        <label>Email</label>
        <vee-field
          type="text"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="email"
          rules="required|email"
          v-model="user.email"
        />
        <ErrorMessage class="text-red-500" name="email" />
      </div>
      <div class="flex flex-col mb-4">
        <label>Gender</label>
        <vee-field
          as="select"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="gender"
          rules="required"
          v-model="user.gender"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </vee-field>
        <ErrorMessage class="text-red-500" name="gender" />
      </div>
      <div class="flex flex-col mb-4">
        <label>Date of Birth</label>
        <vee-field
          type="date"
          class="w-full h-9 p-2 border border-gray-500 rounded bg-white"
          name="dob"
          rules="required"
          v-model="user.dob"
        />
        <ErrorMessage class="text-red-500" name="dob" />
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
import useConfigStore from '@/stores/config'
import userAuthStore from '@/stores/auth'
import AlertBox from '@/components/alert-box.vue'

export default {
  name: 'Personal Details',
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
        username: '',
        email: '',
        gender: '',
        dob: ''
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
    ...mapWritableState(userAuthStore, ['uid']),
    iconRule() {
      if (this.user.profile_picture.name === '') return 'required|mimes:image/png,image/svg'
      else return ''
    }
  },
  methods: {
    async handleUploadImage($event) {
      let files = new DataTransfer().files
      files = $event.dataTransfer ? $event.dataTransfer.files : $event.target.files
      const file = files[0]
      if ($event.dataTransfer) {
        document.querySelector('#icon').files = files
        document.querySelector('#icon').dispatchEvent(new Event('change'))
      }

      try {
        const formData = new FormData()
        formData.append(file.name, file)

        const response = await axios.post('/upload', formData)
        if (response.data.status === 'success') {
          this.user.profile_picture.name = `${response.data.path}/${response.data.files[0]}`
          this.user.profile_picture.fullPath = `${this.serverURL}/${response.data.path}/${response.data.files[0]}`
          // this.alert.show = true
          // this.alert.intent = 'success'
          // this.alert.message = response.data.message
        }
      } catch (err) {
        this.user.profile_picture.name = ''
        this.user.profile_picture.fullPath = ''
        this.alert.show = true
        this.alert.intent = 'danger'
        this.alert.message = err.message
      }
    },
    async submit() {
      try {
        const response = await axios.put('/user', {
          uid: this.uid,
          profile_picture: this.user.profile_picture.name,
          username: this.user.username,
          email: this.user.email,
          gender: this.user.gender,
          dob: this.user.dob
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
        this.user.email = response.data.user.email
        this.user.gender = response.data.user.gender
        this.user.dob = response.data.user.dob
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
