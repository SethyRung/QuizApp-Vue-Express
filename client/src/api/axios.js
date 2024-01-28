import axios from 'axios'
import useAuthStore from '@/stores/auth'
import useConfigStore from '@/stores/config'

export const configAxios = () => {
  const authStore = useAuthStore()
  const configStore = useConfigStore()

  //config axios
  axios.defaults.baseURL = configStore.serverURL
  axios.defaults.withCredentials = true
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  axios.interceptors.response.use(
    (resp) => resp,
    async (error) => {
      const prevRequest = error?.config
      if (
        error.response.status === 403 &&
        error.response.data.message === 'expired access token' &&
        !prevRequest?.send
      ) {
        prevRequest.send = true

        const { status, data } = await axios.get('/refresh', {
          withCredentials: true
        })

        if (status === 200) {
          prevRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
          localStorage.setItem('token', data.accessToken)
          return axios(prevRequest)
        }
      } else if (
        error.response.status === 403 &&
        error.response.data.message === 'expired refresh token'
      ) {
        authStore.userLoggedIn = false
        authStore.uid = ''
        authStore.roles = []
      }
      prevRequest.send = false
      throw new Error(error.response.data.message)
    }
  )
}
