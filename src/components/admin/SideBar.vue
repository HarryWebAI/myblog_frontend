<template>
  <div class="sidebar">
    <div class="logo">
      <router-link to="/" class="logo-link">
        <h2 v-if="!isCollapse">HarryWebAI</h2>
        <h2 v-else>H</h2>
      </router-link>
    </div>
    <el-menu :default-active="activeMenu" class="menu" :router="true" :collapse="isCollapse" background-color="#1a1a1a"
      text-color="#e0e0e0" active-text-color="#ec6ead">
      <el-menu-item index="/admin/welcomeadmin" :route="{ name: 'welcomeadmin' }">
        <el-icon>
          <House />
        </el-icon>
        <template #title>配置欢迎页</template>
      </el-menu-item>

      <el-menu-item index="/admin/aboutmeadmin" :route="{ name: 'aboutmeadmin' }">
        <el-icon>
          <User />
        </el-icon>
        <template #title>配置关于我</template>
      </el-menu-item>

      <el-menu-item index="/admin/useradmin" :route="{ name: 'useradmin' }">
        <el-icon>
          <UserFilled />
        </el-icon>
        <template #title>注册的粉丝</template>
      </el-menu-item>

      <el-menu-item index="/admin/createblog" :route="{ name: 'createblog' }">
        <el-icon>
          <Plus />
        </el-icon>
        <template #title>新建博客</template>
      </el-menu-item>

      <el-menu-item index="/admin/settings">
        <el-icon>
          <Setting />
        </el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  isCollapse: boolean
}>()

const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #1a1a1a;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(52, 148, 230, 0.1), transparent 50%),
    radial-gradient(circle at bottom left, rgba(236, 106, 173, 0.1), transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.logo:hover::before {
  opacity: 1;
}

.logo h2 {
  margin: 0;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 1.5rem;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
}

.logo-link:hover h2 {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.menu {
  flex: 1;
  border: none;
}

:deep(.el-menu-item) {
  border-radius: 4px;
  margin: 4px 8px;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(45deg, rgba(52, 148, 230, 0.1), rgba(236, 106, 173, 0.1));
  border-right: 3px solid #ec6ead;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
}

:deep(.el-sub-menu__title) {
  border-radius: 4px;
  margin: 4px 8px;
}

:deep(.el-menu--inline) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  border-radius: 4px;
  margin: 0 8px;
}

:deep(.el-menu--inline .el-menu-item) {
  margin: 2px 0;
}

:deep(.el-icon) {
  color: #888;
}

:deep(.is-active .el-icon) {
  color: #ec6ead;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu--collapse) {
  width: 64px;
}
</style>
