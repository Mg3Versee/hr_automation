import axios from 'axios'

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL


const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosInstance
