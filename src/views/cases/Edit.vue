<template>
  <el-card>
    <template #header>
      <span>{{ isEdit ? '编辑案例' : '新增案例' }}</span>
    </template>
    
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入案例标题" />
      </el-form-item>
      
      <el-form-item label="分类" prop="category">
        <el-radio-group v-model="form.category">
          <el-radio label="commercial">商业</el-radio>
          <el-radio label="residential">住宅</el-radio>
          <el-radio label="infrastructure">市政</el-radio>
          <el-radio label="industrial">工业</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="面积" prop="area">
            <el-input v-model="form.area" placeholder="如：12万㎡" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="造价" prop="cost">
            <el-input v-model="form.cost" placeholder="如：8.5亿元" />
          </el-form-item>
        </el-col>
      </el-row>
      
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入案例描述" />
      </el-form-item>

      <el-form-item label="详细介绍">
        <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入详细介绍（选填）" />
      </el-form-item>

      <el-form-item label="客户名称">
        <el-input v-model="form.client" placeholder="客户名称（选填）" />
      </el-form-item>

      <el-form-item label="服务内容">
        <el-input v-model="form.services" placeholder="提供的服务内容（选填）" />
      </el-form-item>
      
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">已发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="完成日期">
        <el-date-picker
          v-model="form.completion_date"
          type="date"
          placeholder="选择完成日期"
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
import { caseAPI } from '@/api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  category: 'commercial',
  area: '',
  cost: '',
  description: '',
  content: '',
  client: '',
  services: '',
  status: 'published',
  completion_date: new Date()
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  cost: [{ required: true, message: '请输入造价', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const loadDetail = async () => {
  if (!isEdit.value) return
  
  loading.value = true
  try {
    const res = await caseAPI.getById(route.params.id)
    // 后端API返回: { success: true, data: { case: {...} } }
    const caseData = res.data?.case || res.data
    Object.assign(form, caseData)
    if (form.completion_date) {
      form.completion_date = new Date(form.completion_date)
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
      if (submitData.completion_date) {
        submitData.completion_date = new Date(submitData.completion_date).toISOString()
      }

      if (isEdit.value) {
        await caseAPI.update(route.params.id, submitData)
        ElMessage.success('更新成功')
      } else {
        await caseAPI.create(submitData)
        ElMessage.success('创建成功')
      }
      router.push('/cases')
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
