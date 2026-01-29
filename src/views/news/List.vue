<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>新闻管理</span>
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增新闻
        </el-button>
      </div>
    </template>

    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="标题">
        <el-input v-model="searchForm.title" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
          <el-option label="公司新闻" value="company" />
          <el-option label="行业资讯" value="industry" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="category" label="分类" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.category === 'company'" type="primary">公司新闻</el-tag>
          <el-tag v-else type="success">行业资讯</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.status === 'published'" type="success">已发布</el-tag>
          <el-tag v-else type="info">草稿</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      :total="pagination.total"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="loadList"
      @current-change="loadList"
      style="margin-top: 20px; justify-content: flex-end;"
    />
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { newsAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(false)
const list = ref([])

const searchForm = reactive({
  title: '',
  category: ''
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      status: '', // 获取所有状态
      ...searchForm
    }
    const res = await newsAPI.getList(params)
    // 后端API返回: { success: true, data: { news: [...], pagination: { total: ... } } }
    list.value = res.data?.news || []
    pagination.total = res.data?.pagination?.total || 0
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadList()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.category = ''
  handleSearch()
}

const handleCreate = () => {
  router.push('/news/create')
}

const handleEdit = (row) => {
  router.push(`/news/edit/${row.id}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除"${row.title}"吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await newsAPI.delete(row.id)
      ElMessage.success('删除成功')
      loadList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>
