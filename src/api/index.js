import request from '@/utils/request'

// 认证相关
export const authAPI = {
  // 登录
  login(data) {
    return request.post('/auth/login', data)
  },
  // 获取当前用户信息
  getCurrentUser() {
    return request.get('/auth/me')
  }
}

// 新闻相关
export const newsAPI = {
  // 获取新闻列表
  getList(params) {
    return request.get('/news', { params })
  },
  // 获取单条新闻
  getById(id) {
    return request.get(`/news/${id}`)
  },
  // 创建新闻
  create(data) {
    return request.post('/news', data)
  },
  // 更新新闻
  update(id, data) {
    return request.put(`/news/${id}`, data)
  },
  // 删除新闻
  delete(id) {
    return request.delete(`/news/${id}`)
  }
}

// 案例相关
export const caseAPI = {
  // 获取案例列表
  getList(params) {
    return request.get('/cases', { params })
  },
  // 获取单个案例
  getById(id) {
    return request.get(`/cases/${id}`)
  },
  // 创建案例
  create(data) {
    return request.post('/cases', data)
  },
  // 更新案例
  update(id, data) {
    return request.put(`/cases/${id}`, data)
  },
  // 删除案例
  delete(id) {
    return request.delete(`/cases/${id}`)
  }
}

// 咨询记录相关
export const contactAPI = {
  // 获取咨询记录列表
  getList(params) {
    return request.get('/contacts', { params })
  },
  // 获取单条记录
  getById(id) {
    return request.get(`/contacts/${id}`)
  },
  // 删除记录
  delete(id) {
    return request.delete(`/contacts/${id}`)
  }
}
