<template>
  <div class="news-detail" v-loading="loading">
    <el-card class="detail-card">
      <!-- 顶部操作栏 -->
      <template #header>
        <div class="header">
          <el-button @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <div class="header-actions">
            <el-button type="primary" @click="handleEdit">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
          </div>
        </div>
      </template>

      <!-- 文章头部信息 -->
      <div class="article-header">
        <div class="meta-info">
          <el-tag v-if="news.category === 'company'" type="primary" size="small">公司新闻</el-tag>
          <el-tag v-else type="success" size="small">行业资讯</el-tag>
          <el-tag v-if="news.badge" type="warning" size="small" class="badge-tag">{{ news.badge }}</el-tag>
          <el-tag v-if="news.status === 'draft'" type="info" size="small">草稿</el-tag>
        </div>
        <h1 class="article-title">{{ news.title }}</h1>
        <div class="article-meta">
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            发布时间：{{ formatDate(news.publish_date) }}
          </span>
          <span class="meta-item">
            <el-icon><View /></el-icon>
            浏览量：{{ news.views || 0 }}
          </span>
          <span class="meta-item">
            <el-icon><Clock /></el-icon>
            创建时间：{{ formatDate(news.created_at) }}
          </span>
        </div>
      </div>

      <!-- 封面图片 -->
      <div v-if="news.cover_image" class="cover-image">
        <el-image :src="news.cover_image" fit="cover" :preview-src-list="[news.cover_image]">
          <template #error>
            <div class="image-placeholder">
              <el-icon><Picture /></el-icon>
              <span>图片加载失败</span>
            </div>
          </template>
        </el-image>
      </div>

      <!-- 摘要 -->
      <div v-if="news.excerpt" class="article-excerpt">
        <el-alert type="info" :closable="false" show-icon>
          <template #title>
            <span class="excerpt-label">摘要</span>
          </template>
          <p class="excerpt-content">{{ news.excerpt }}</p>
        </el-alert>
      </div>

      <!-- 正文内容 -->
      <div class="article-content">
        <div class="content-body" v-html="formattedContent"></div>
      </div>

      <!-- 底部信息 -->
      <div class="article-footer">
        <el-divider />
        <div class="footer-info">
          <span>最后更新：{{ formatDate(news.updated_at) }}</span>
          <span>文章ID：{{ news.id }}</span>
        </div>
      </div>
    </el-card>

    <!-- 相关操作面板 -->
    <el-card class="action-card">
      <template #header>
        <span>操作</span>
      </template>
      <div class="action-buttons">
        <el-button type="primary" @click="handleEdit" style="width: 100%">
          <el-icon><Edit /></el-icon>
          编辑文章
        </el-button>
        <el-button 
          :type="news.status === 'published' ? 'warning' : 'success'" 
          @click="handleToggleStatus"
          style="width: 100%; margin-top: 10px"
        >
          <el-icon><Switch /></el-icon>
          {{ news.status === 'published' ? '设为草稿' : '发布文章' }}
        </el-button>
        <el-button type="danger" @click="handleDelete" style="width: 100%; margin-top: 10px">
          <el-icon><Delete /></el-icon>
          删除文章
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const news = ref({})

const formatDate = (date) => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 格式化内容（将换行转换为HTML段落）
const formattedContent = computed(() => {
  if (!news.value.content) return ''
  // 如果内容已经包含HTML标签，直接返回
  if (/<[^>]+>/.test(news.value.content)) {
    return news.value.content
  }
  // 否则将换行符转换为段落
  return news.value.content
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
})

const loadDetail = async () => {
  loading.value = true
  try {
    const res = await newsAPI.getById(route.params.id)
    news.value = res.data?.news || res.data || {}
  } catch (error) {
    ElMessage.error('加载新闻详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/news/edit/${route.params.id}`)
}

const handleToggleStatus = async () => {
  const newStatus = news.value.status === 'published' ? 'draft' : 'published'
  const action = newStatus === 'published' ? '发布' : '设为草稿'
  
  try {
    await ElMessageBox.confirm(`确定要${action}这篇文章吗？`, '提示', {
      type: 'warning'
    })
    
    await newsAPI.update(route.params.id, { status: newStatus })
    ElMessage.success(`${action}成功`)
    news.value.status = newStatus
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${action}失败`)
    }
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除"${news.value.title}"吗？此操作不可恢复！`, '警告', {
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })
    
    await newsAPI.delete(route.params.id)
    ElMessage.success('删除成功')
    router.push('/news')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.news-detail {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  max-width: 1400px;
}

.detail-card {
  min-height: calc(100vh - 140px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-header {
  margin-bottom: 30px;
}

.meta-info {
  margin-bottom: 15px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.article-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: #909399;
  font-size: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cover-image {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-image .el-image {
  width: 100%;
  max-height: 400px;
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: #f5f7fa;
  color: #909399;
}

.image-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.article-excerpt {
  margin-bottom: 30px;
}

.excerpt-label {
  font-weight: 600;
}

.excerpt-content {
  margin: 10px 0 0 0;
  color: #606266;
  line-height: 1.8;
}

.article-content {
  margin-bottom: 30px;
}

.content-body {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.content-body :deep(p) {
  margin-bottom: 16px;
}

.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 16px 0;
}

.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3),
.content-body :deep(h4) {
  margin: 24px 0 16px;
  font-weight: 600;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.content-body :deep(blockquote) {
  border-left: 4px solid #409eff;
  padding-left: 16px;
  margin: 16px 0;
  color: #606266;
}

.article-footer {
  color: #909399;
  font-size: 13px;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.action-card {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.action-buttons {
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .news-detail {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    position: static;
  }
}
</style>
