<template>
  <el-card>
    <template #header>
      <span>{{ isEdit ? '编辑新闻' : '新增新闻' }}</span>
    </template>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入新闻标题" />
      </el-form-item>
      
      <el-form-item label="分类" prop="category">
        <el-radio-group v-model="form.category">
          <el-radio label="company">公司新闻</el-radio>
          <el-radio label="industry">行业资讯</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="摘要" prop="excerpt">
        <el-input v-model="form.excerpt" type="textarea" :rows="2" placeholder="请输入新闻摘要" />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="10" placeholder="请输入新闻内容" />
      </el-form-item>

      <el-form-item label="标签">
        <el-input v-model="form.badge" placeholder="如：热门、推荐等（选填）" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="发布日期" prop="publish_date">
        <el-date-picker
          v-model="form.publish_date"
          type="datetime"
          placeholder="选择发布日期"
          style="width: 100%"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsAPI } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  category: 'company',
  excerpt: '',
  content: '',
  badge: '',
  status: 'published',
  publish_date: new Date()
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    const res = await newsAPI.getById(route.params.id)
    // 后端API返回: { success: true, data: { news: {...} } }
    const newsData = res.data?.news || res.data
    Object.assign(form, newsData)
    if (form.publish_date) {
      form.publish_date = new Date(form.publish_date)
    }
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      const submitData = { ...form }
      if (submitData.publish_date) {
        submitData.publish_date = new Date(submitData.publish_date).toISOString()
      }

      if (isEdit.value) {
        await newsAPI.update(route.params.id, submitData)
        ElMessage.success('更新成功')
      } else {
        await newsAPI.create(submitData)
        ElMessage.success('创建成功')
      }
      router.push('/news')
    } catch (error) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    } finally {
      loading.value = false
    }
  })
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.el-form {
  max-width: 800px;
}
</style>
