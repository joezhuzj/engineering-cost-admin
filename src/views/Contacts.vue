<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>咨询记录</span>
        <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedIds.length">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
    </template>

    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table 
      :data="list" 
      v-loading="loading" 
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="company" label="公司" width="150" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="message" label="留言内容" min-width="200" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="dialogVisible" title="咨询详情" width="600px">
      <el-descriptions :column="1" border v-if="currentRow">
        <el-descriptions-item label="姓名">{{ currentRow.name }}</el-descriptions-item>
        <el-descriptions-item label="公司">{{ currentRow.company || '-' }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ currentRow.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentRow.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="留言内容">
          <div style="white-space: pre-wrap;">{{ currentRow.message || '-' }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间">
          {{ formatDate(currentRow.createdAt) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="danger" @click="handleDeleteCurrent">删除</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { contactAPI } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const loading = ref(false)
const list = ref([])
const dialogVisible = ref(false)
const currentRow = ref(null)
const selectedIds = ref([])

const searchForm = reactive({
  name: '',
  phone: ''
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0
})

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const loadList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...searchForm
    }
    const res = await contactAPI.getList(params)
    list.value = res.data || []
    pagination.total = res.total || 0
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
  searchForm.name = ''
  searchForm.phone = ''
  handleSearch()
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleView = (row) => {
  currentRow.value = row
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条记录吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await contactAPI.delete(row.id)
      ElMessage.success('删除成功')
      loadList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleDeleteCurrent = () => {
  dialogVisible.value = false
  handleDelete(currentRow.value)
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条记录吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await Promise.all(selectedIds.value.map(id => contactAPI.delete(id)))
      ElMessage.success('批量删除成功')
      loadList()
    } catch (error) {
      ElMessage.error('批量删除失败')
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
