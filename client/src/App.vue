<template>
  <AppHeader :profile_picture="profile_picture" />
  <router-view v-slot="{ Component }">
    <component :is="Component"></component>
  </router-view>
</template>
<script>
import axios from 'axios'
import AppHeader from '@/components/app-header.vue'
import { mapWritableState } from 'pinia'
import useAuthStoreuth from '@/stores/auth'
import useConfigStore from '@/stores/config'
export default {
  name: 'App',
  components: { AppHeader },
  data() {
    return {
      profile_picture: '../src/assets/images/circle-user-solid.svg'
    }
  },
  computed: {
    ...mapWritableState(useAuthStoreuth, ['userLoggedIn', 'uid', 'roles']),
    ...mapWritableState(useConfigStore, ['serverURL'])
  },
  watch: {
    async userLoggedIn(newValue) {
      if (!newValue) this.profile_picture = '../src/assets/images/circle-user-solid.svg'
      else {
        const response = await axios.get('/user', {
          params: {
            uid: this.uid
          }
        })

        if (response.data.status === 'success') {
          if (response.data.user.profile_picture !== null) {
            this.profile_picture = `${this.serverURL}/${response.data.user.profile_picture}`
          }
        }
      }
    }
  },
  async created() {
    try {
      const res = await axios.post('/auth/currentUser')
      if (res.status === 200) {
        this.userLoggedIn = true
        this.uid = res.data.uid
        this.roles = res.data.roles
      }
    } catch (err) {
      this.userLoggedIn = false
      this.uid = ''
      this.roles = []
      this.$router.push({ name: 'home', replace: true })
    }
  }
}
</script>
