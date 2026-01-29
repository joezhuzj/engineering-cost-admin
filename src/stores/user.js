import { defineStore } from 'pinia'
import { authAPI } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    // 登录
    async login(credentials) {
      try {
        const res = await authAPI.login(credentials)
        // 后端API返回: { success: true, data: { token, user } }
        const token = res.data?.token || res.token
        const user = res.data?.user || res.user
        this.token = token
        this.userInfo = user
        localStorage.setItem('token', token)
        return res
      } catch (error) {
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await authAPI.getCurrentUser()
        // 后端API返回: { success: true, data: { user } }
        this.userInfo = res.data?.user || res.user
        return res
      } catch (error) {
        throw error
      }
    },

    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
