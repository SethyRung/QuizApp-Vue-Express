import { defineStore } from 'pinia'
export default defineStore('auth', {
  state: () => ({
    userLoggedIn: false,
    uid: '',
    roles: []
  })
})
