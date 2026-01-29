<template>
  <div class="crawler-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>爬虫管理 - 浙江造价网政策文件</span>
          <el-tag type="info">自动同步行业资讯</el-tag>
        </div>
      </template>

      <el-alert
        title="爬虫说明"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      >
        <template #default>
          <p>• 数据来源：浙江造价网 (zjzj.net) 政策文件栏目</p>
          <p>• 爬取的新闻将自动添加到"行业资讯"分类，标签为"政策"</p>
          <p>• 使用 Playwright 模拟真实浏览器，包含随机延迟（3-6秒）</p>
          <p>• 连续失败3次将自动停止，避免被封禁</p>
        </template>
      </el-alert>

      <el-form :inline="true" class="control-form">
        <el-form-item label="获取天数">
          <el-input-number v-model="days" :min="1" :max="30" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePreview" :loading="previewLoading">
            <el-icon><View /></el-icon>
            预览
          </el-button>
          <el-button type="success" @click="handleSync" :loading="syncLoading">
            <el-icon><Refresh /></el-icon>
            同步入库
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览结果 -->
    <el-card v-if="previewList.length > 0" class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>预览结果 ({{ previewList.length }} 条)</span>
          <el-tag type="warning">仅预览，未入库</el-tag>
        </div>
      </template>

      <el-table :data="previewList" stripe style="width: 100%">
        <el-table-column prop="title" label="标题" min-width="300" />
        <el-table-column prop="dateText" label="发布日期" width="120" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="openUrl(row.url)">
              查看原文
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 同步结果 -->
    <el-card v-if="syncResult" class="box-card" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>同步结果</span>
          <el-tag :type="syncResult.stopped ? 'danger' : 'success'">
            {{ syncResult.stopped ? '提前停止' : '完成' }}
          </el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="总计">{{ syncResult.total }} 条</el-descriptions-item>
        <el-descriptions-item label="新增">
          <el-tag type="success">{{ syncResult.added }} 条</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="跳过">
          <el-tag type="info">{{ syncResult.skipped }} 条</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="失败">
          <el-tag type="danger">{{ syncResult.errors }} 条</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-table 
        v-if="syncResult.details && syncResult.details.length > 0" 
        :data="syncResult.details" 
        stripe 
        style="width: 100%; margin-top: 15px"
        max-height="300"
      >
        <el-table-column prop="title" label="标题" min-width="300" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="原因" width="150" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { View, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const days = ref(2)
const previewLoading = ref(false)
const syncLoading = ref(false)
const previewList = ref([])
const syncResult = ref(null)

// 预览
const handlePreview = async () => {
  previewLoading.value = true
  previewList.value = []
  syncResult.value = null
  
  try {
    const res = await request.get('/crawler/preview', {
      params: { days: days.value }
    })
    previewList.value = res.data?.news || []
    ElMessage.success(`找到 ${previewList.value.length} 条新闻`)
  } catch (error) {
    ElMessage.error('预览失败: ' + (error.response?.data?.message || error.message))
  } finally {
    previewLoading.value = false
  }
}

// 同步
const handleSync = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要同步 ${days.value} 天内的政策文件吗？这将自动添加到行业资讯。`,
      '确认同步',
      { type: 'warning' }
    )
  } catch {
    return
  }

  syncLoading.value = true
  syncResult.value = null
  previewList.value = []
  
  try {
    const res = await request.post('/crawler/sync', { days: days.value })
    syncResult.value = res.data
    ElMessage.success(res.message || '同步完成')
  } catch (error) {
    ElMessage.error('同步失败: ' + (error.response?.data?.message || error.message))
  } finally {
    syncLoading.value = false
  }
}

// 打开原文链接
const openUrl = (url) => {
  window.open(url, '_blank')
}

// 状态样式
const getStatusType = (status) => {
  const map = {
    added: 'success',
    skipped: 'info',
    error: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    added: '已添加',
    skipped: '已跳过',
    error: '失败'
  }
  return map[status] || status
}
</script>

<style scoped>
.crawler-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-form {
  margin-top: 10px;
}

.el-alert p {
  margin: 5px 0;
  font-size: 13px;
}
</style>
