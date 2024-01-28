import { defineStore } from 'pinia'

export default defineStore('config', {
  state: () => ({
    serverURL: 'http://192.168.203.117:8081'
  })
})
