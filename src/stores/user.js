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
        this.token = res.token
        this.userInfo = res.user
        localStorage.setItem('token', res.token)
        return res
      } catch (error) {
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await authAPI.getCurrentUser()
        this.userInfo = res.user
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
