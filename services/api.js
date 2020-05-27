import axios from 'axios'

const api = axios.create({
  baseURL: 'https://randomuser.me/api/',
  timeout: 3000
})

export default {
  getUsers(results, gender) {
    const params = {
      results,
      gender
    }

    return api.get('/', { params })
  }
}
