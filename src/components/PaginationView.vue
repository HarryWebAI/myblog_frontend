<template>
  <div class="pagination-container">
    <transition-group name="page-fade" tag="div" class="pagination-wrapper">
      <el-pagination key="pagination" v-model:current-page="currentPage" :total="total" :page-size="6"
        layout="prev, pager, next" @current-change="handleCurrentChange" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const currentPage = ref(1)

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  emit('update:page', val)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  overflow: hidden;
}

.pagination-wrapper {
  position: relative;
}

:deep(.el-pagination) {
  --el-pagination-button-color: #ffffff;
  --el-pagination-hover-color: #3494e6;
  --el-pagination-active-color: #3494e6;
}

:deep(.el-pagination .el-pager li) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin: 0 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-pagination .el-pager li:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

:deep(.el-pagination .el-pager li.active) {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 148, 230, 0.3);
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

:deep(.el-pagination .btn-prev:disabled),
:deep(.el-pagination .btn-next:disabled) {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.3);
}

/* 页码切换动画 */
.page-fade-move,
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.page-fade-leave-active {
  position: absolute;
}
</style>
