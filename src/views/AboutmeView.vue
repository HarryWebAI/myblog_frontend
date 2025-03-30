<template>
  <div class="about-container">
    <!-- 页面标题 -->
    <CommonHeader title="About Me" />

    <!-- 加载遮罩层 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <el-icon class="loading-icon">
          <Loading />
        </el-icon>
        <p class="loading-text">正在加载, 请稍后...</p>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="!loading && sections.length === 0" class="loading-container">
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
      <el-skeleton :rows="3" animated />
    </div>

    <!-- 指示器按钮 -->
    <transition name="fade-up" appear>
      <div class="tab-indicators" v-if="!loading && sections.length > 0">
        <div v-for="(section, index) in sections" :key="section.id" class="indicator"
          :class="{ 'active': activeIndex === index }" @click="activeIndex = index">
          <el-tooltip :content="section.title" placement="top">
            <div class="indicator-content">
              <el-icon>
                <component :is="section.icon" />
              </el-icon>
              <span class="indicator-text">{{ section.title }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
    </transition>

    <!-- 内容区域 -->
    <transition name="fade-up" appear>
      <div class="content-wrapper" v-if="sections.length > 0">
        <transition name="tab-fade" mode="out-in">
          <div :key="activeIndex" class="tab-content">
            <div class="carousel-content" :class="sections[activeIndex].type">
              <!-- 工作经历 -->
              <div v-if="sections[activeIndex].type === 'work'" class="timeline">
                <div class="section-header">
                  <el-icon class="section-icon">
                    <component :is="sections[activeIndex].icon" />
                  </el-icon>
                  <h2>{{ sections[activeIndex].title }}</h2>
                </div>
                <div v-for="job in sections[activeIndex].content as WorkExperience[]" :key="job.id"
                  class="timeline-item">
                  <div class="timeline-connector"></div>
                  <div class="timeline-content">
                    <h3>{{ job.title }}</h3>
                    <p class="company">{{ job.company }}</p>
                    <p class="period">{{ job.period }}</p>
                    <ul class="achievements">
                      <p v-for="(achievement, index) in job.achievements" :key="index">
                        {{ achievement }}
                      </p>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- 教育背景 -->
              <div v-if="sections[activeIndex].type === 'education'" class="education-content">
                <div class="section-header">
                  <el-icon class="section-icon">
                    <component :is="sections[activeIndex].icon" />
                  </el-icon>
                  <h2>{{ sections[activeIndex].title }}</h2>
                </div>
                <div v-for="edu in sections[activeIndex].content as Education[]" :key="edu.id" class="education-item">
                  <div class="education-icon">
                    <el-icon>
                      <School />
                    </el-icon>
                  </div>
                  <div class="education-details">
                    <h3>{{ edu.major }}</h3>
                    <p class="school">{{ edu.school }}</p>
                    <p class="period">{{ edu.period }}</p>
                    <p class="degree">{{ edu.degree }}</p>
                    <p class="description">{{ edu.description }}</p>
                  </div>
                </div>
              </div>

              <!-- 项目经验 -->
              <div v-if="sections[activeIndex].type === 'projects'" class="projects-grid">
                <div class="section-header">
                  <el-icon class="section-icon">
                    <component :is="sections[activeIndex].icon" />
                  </el-icon>
                  <h2>{{ sections[activeIndex].title }}</h2>
                </div>
                <div class="projects-list">
                  <div v-for="project in sections[activeIndex].content as Project[]" :key="project.id"
                    class="project-item">
                    <div class="project-main">
                      <div class="project-header">
                        <h3>{{ project.name }}</h3>
                        <div class="tech-stack-badge">{{ project.techStack }}</div>
                      </div>
                      <ul class="project-details">
                        <p v-for="(detail, index) in project.details" :key="index">
                          {{ detail }}
                        </p>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 技能树 -->
              <div v-if="sections[activeIndex].type === 'skills'" class="skills-container">
                <div class="section-header">
                  <el-icon class="section-icon">
                    <component :is="sections[activeIndex].icon" />
                  </el-icon>
                  <h2>{{ sections[activeIndex].title }}</h2>
                </div>
                <div class="skills-grid">
                  <div v-for="category in sections[activeIndex].content as SkillCategory[]" :key="category.id"
                    class="skill-category">
                    <h3>{{ category.name }}</h3>
                    <div class="skill-items">
                      <el-tag v-for="skill in category.skills" :key="skill" effect="dark">
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { WorkExperience, Education, Project, SkillCategory } from '@/types'
import CommonHeader from '@/components/CommonHeader.vue'
import { useAboutme } from '@/hooks/useAboutme'
import { Loading } from '@element-plus/icons-vue'

// 活动索引
const activeIndex = ref(0)

// 使用 useAboutme hook
const { sections, loading, fetchAboutme } = useAboutme()

// 组件挂载时获取数据
onMounted(() => {
  fetchAboutme()
})
</script>

<style scoped>
.about-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  background-color: transparent;
}

/* 页面标题 */
.page-title {
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
}

.page-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  padding: 0;
  display: inline-block;
  position: relative;
}

.page-title h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, #3494e6, #ec6ead);
  border-radius: 3px;
}

/* 指示器样式 */
.tab-indicators {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.indicator {
  padding: 8px 16px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.indicator-content {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
}

.indicator-text {
  font-size: 0.95rem;
  white-space: nowrap;
}

.indicator i {
  font-size: 1.2rem;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.indicator.active {
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  box-shadow: 0 8px 20px rgba(236, 106, 173, 0.3);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
}

/* 内容区域包装 */
.content-wrapper {
  flex: 1;
  position: relative;
  margin: 0 auto 20px;
  width: 90%;
  background: rgba(26, 26, 26, 0.7);
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  overflow: hidden;
  height: calc(100vh - 220px);
  /* 调整高度，考虑标题和导航的高度 */
}

/* 修改transition-group样式，确保内容正确布局 */
.content-wrapper .tab-content-move {
  transition: transform 0.5s ease;
}

.content-wrapper>.tab-content-container {
  position: relative;
  height: 100%;
  width: 100%;
}

/* 标签内容部分 */
.tab-content {
  height: 100%;
  width: 100%;
}

/* 内容区域样式 */
.carousel-content {
  height: 100%;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  color: #fff;
  max-height: calc(100vh - 220px);
}

/* 滚动条样式 */
.carousel-content::-webkit-scrollbar {
  width: 6px;
}

.carousel-content::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

.carousel-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

/* 禁用滚动条箭头 */
.carousel-content::-webkit-scrollbar-button {
  display: none;
}

/* 区块标题 */
.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-icon {
  font-size: 2rem;
  color: #ec6ead;
}

/* 工作经历时间线 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 3px solid #3494e6;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.timeline-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.timeline-connector {
  position: absolute;
  left: -35px;
  top: 20px;
  width: 15px;
  height: 15px;
  background: #3494e6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(52, 148, 230, 0.5);
}

.timeline-connector::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 15px;
  height: calc(100% + 15px);
  width: 1px;
  background: rgba(52, 148, 230, 0.5);
}

.timeline-content h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 10px;
}

/* 教育背景样式 */
.education-item {
  display: flex;
  margin-bottom: 25px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: transform 0.3s;
}

.education-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.education-icon {
  flex: 0 0 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #ec6ead;
  margin-right: 20px;
}

.education-details {
  flex: 1;
}

.education-details h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 10px;
}

/* 项目经验部分 */
.projects-grid {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 32px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.section-icon {
  font-size: 2rem;
  color: #ec6ead;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 4px;
}

.project-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.project-main {
  padding: 24px;
}

.project-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(52, 148, 230, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.project-header h3 {
  color: #3494e6;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
}

.tech-stack-badge {
  background: linear-gradient(45deg, rgba(52, 148, 230, 0.2), rgba(236, 106, 173, 0.2));
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #ec6ead;
  white-space: nowrap;
}

.project-details {
  margin: 0;
  padding: 0;
}

.project-details p {
  margin-bottom: 12px;
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.project-details p:last-child {
  margin-bottom: 0;
}

.project-details p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ec6ead;
  font-size: 1.2rem;
}

/* 技能树样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.3s;
}

.skill-category:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.skill-category h3 {
  color: #3494e6;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

:deep(.el-tag) {
  padding: 0 12px;
  height: 30px;
  line-height: 30px;
  border: none;
  transition: all 0.3s;
}

:deep(.el-tag):hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .about-container {
    padding: 10px 0;
  }

  .content-wrapper {
    max-width: 95%;
    height: calc(100vh - 180px);
  }

  .carousel-content {
    padding: 20px;
    max-height: calc(100vh - 180px);
  }

  .indicator-text {
    display: none;
  }

  .indicator {
    padding: 8px;
  }

  .projects-grid {
    padding: 16px;
  }

  .project-main {
    padding: 20px;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .project-header h3 {
    font-size: 1.2rem;
  }

  .tech-stack-badge {
    padding: 4px 12px;
    font-size: 0.85rem;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .page-title h1 {
    font-size: 2rem;
  }

  .projects-list {
    padding-right: 8px;
  }

  .projects-list::-webkit-scrollbar {
    width: 4px;
  }
}

/* 列表样式 - 使用p标签替代li标签 */
.achievements p,
.project-details p {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.achievements p::before,
.project-details p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #ec6ead;
  font-size: 1.2rem;
}

/* 添加动画效果 */
.fade-down-enter-active,
.fade-up-enter-active {
  transition: all 0.8s ease;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-down-enter-to,
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 添加平滑的tab切换动画 */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.4s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 加载状态样式 */
.loading-container {
  width: 90%;
  margin: 20px auto;
  padding: 20px;
  background: rgba(26, 26, 26, 0.7);
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

:deep(.el-skeleton) {
  margin-bottom: 20px;
}

:deep(.el-skeleton__item) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.el-skeleton__p) {
  margin: 0;
  height: 16px;
}

/* 加载遮罩层样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.loading-icon {
  font-size: 48px;
  margin-bottom: 20px;
  animation: rotate 2s linear infinite;
}

.loading-text {
  font-size: 18px;
  margin: 0;
  background: linear-gradient(45deg, #3494e6, #ec6ead);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .projects-container {
    grid-template-columns: 1fr;
    padding: 0 16px 32px 16px;
  }

  .projects-container .project-item {
    margin-bottom: 32px;
  }

  .projects-container .project-item:last-child {
    margin-bottom: 0;
  }

  .projects-container .project-item:nth-last-child(2) {
    margin-bottom: 32px;
  }

  .section-header {
    padding: 16px 16px 0 16px;
  }
}

/* 项目列表滚动条样式 */
.projects-list::-webkit-scrollbar {
  width: 6px;
}

.projects-list::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.projects-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.3), rgba(236, 106, 173, 0.3));
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.projects-list::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(52, 148, 230, 0.5), rgba(236, 106, 173, 0.5));
}

/* 禁用项目列表滚动条箭头 */
.projects-list::-webkit-scrollbar-button {
  display: none;
}
</style>
