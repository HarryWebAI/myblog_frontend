<template>
  <el-dialog v-model="dialogVisible" title="编辑分类" width="500px" :close-on-click-modal="false" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" class="edit-form">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { BlogCategory } from '@/types'
import useCategoryAndTag from '@/hooks/useCategoryAndTag'

const { updateCategory } = useCategoryAndTag()

const props = defineProps<{
  modelValue: boolean
  category: BlogCategory
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  name: props.category.name
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
})

// 监听 category 变化，更新表单数据
watch(() => props.category, (newCategory) => {
  form.name = newCategory.name
}, { immediate: true })

const handleClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const success = await updateCategory(props.category.id, {
      name: form.name
    })

    if (success) {
      emit('success')
      handleClose()
    }
  } catch (error) {
    console.error('编辑分类失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-form {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
