<template>
  <table>
    <tr>
      <th>Username</th>
      <th>Email</th>
    </tr>
    <tr v-for="user in users" :key="user.id">
      <td>{{ user.username }}</td>
      <td>{{ user.email }}</td>
    </tr>
  </table>
</template>
<script>
import axios from 'axios'

export default {
  name: 'user',
  data() {
    return {
      users: []
    }
  },
  async beforeMount() {
    try {
      const response = await axios.get('/admin/user')
      this.users = response.data
    } catch (err) {
      console.log(err.response.data)
    }
  }
}
</script>
