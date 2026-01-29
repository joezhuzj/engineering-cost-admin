<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#409EFF"><Document /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.newsCount }}</div>
              <div class="stat-label">新闻总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#67C23A"><FolderOpened /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.casesCount }}</div>
              <div class="stat-label">案例总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#E6A23C"><ChatLineRound /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.contactsCount }}</div>
              <div class="stat-label">咨询记录</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#F56C6C"><TrendCharts /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayVisits }}</div>
              <div class="stat-label">今日访问</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新新闻</span>
              <el-button type="primary" link @click="$router.push('/news')">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentNews" style="width: 100%" v-loading="loading">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="createdAt" label="发布时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新咨询</span>
              <el-button type="primary" link @click="$router.push('/contacts')">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentContacts" style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="phone" label="电话" width="120" />
            <el-table-column prop="createdAt" label="时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { newsAPI, caseAPI, contactAPI } from '@/api'
import dayjs from 'dayjs'

const loading = ref(false)
const stats = ref({
  newsCount: 0,
  casesCount: 0,
  contactsCount: 0,
  todayVisits: 0
})

const recentNews = ref([])
const recentContacts = ref([])

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const loadStats = async () => {
  loading.value = true
  try {
    const [newsRes, casesRes, contactsRes] = await Promise.all([
      newsAPI.getList({ page: 1, limit: 5 }),
      caseAPI.getList({ page: 1, limit: 5 }),
      contactAPI.getList({ page: 1, limit: 5 })
    ])

    // 后端API返回结构: { success: true, data: { news/cases/contacts: [...], pagination: { total: ... } } }
    stats.value = {
      newsCount: newsRes.data?.pagination?.total || 0,
      casesCount: casesRes.data?.pagination?.total || 0,
      contactsCount: contactsRes.data?.pagination?.total || 0,
      todayVisits: Math.floor(Math.random() * 1000)
    }

    recentNews.value = newsRes.data?.news || []
    recentContacts.value = contactsRes.data?.contacts || []
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
